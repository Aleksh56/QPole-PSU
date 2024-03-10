from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q, Prefetch
from django.db import transaction


from .exсeptions import *
from .serializers import *
from .models import *
from .utils import *

import logging
logger = logging.getLogger('debug') 


@api_view(['GET', 'POST', 'DELETE', 'PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@transaction.atomic
def my_profile(request):
    try:
        current_user = request.user
        current_profile = Profile.objects.get(user=current_user)

        if request.method == 'GET':
            current_user_profile = Profile.objects.filter(user=current_user).first()

            if not current_user_profile:
                raise ObjectNotFoundException('Profile')


            profile_serializer = GetProfileSerializer(current_user_profile)
            user_polls = Poll.objects.filter(author=current_profile)
            user_polls_serializer = PollSerializer(user_polls, many=True)

            response_data = {
                'profile': profile_serializer.data,
                'user_polls': user_polls_serializer.data
            }

            return Response(response_data, status=status.HTTP_200_OK)

        elif request.method == 'POST':
            current_user_profile = Profile.objects.filter(user=current_user).first()
            request.data['user'] = current_user.id
            if current_user_profile:
                return Response("Профиль данного пользователя уже существует.", status=status.HTTP_400_BAD_REQUEST)
            else:
                serializer = ProfileSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save(user=current_user)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'PATCH':
            current_user_profile = Profile.objects.filter(user=current_user).first()
            if not current_profile:
                raise ObjectNotFoundException('Profile')
            
            # request.data['user'] = current_user.id
            serializer = ProfileSerializer(current_user_profile, data=request.data, partial=True)
    
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            current_user_profile = Profile.objects.filter(user=current_user).first()
            if not current_profile:
                raise ObjectNotFoundException('Profile')
            
            current_user_profile.delete()
            return Response(f"Профиль успешно удален.", status=status.HTTP_204_NO_CONTENT)
      

    except APIException as api_exception:
        return Response({'message':f"{api_exception}"}, api_exception.status_code)
    
    except Exception as ex:
        return Response(f"Внутренняя ошибка сервера в my_profile: {ex}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


@api_view(['GET', 'POST', 'DELETE', 'PATCH', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@transaction.atomic
def my_poll(request, request_type=None):
    try:
        current_user = request.user
        my_profile = Profile.objects.get(user=current_user)
        
        if request.method == 'GET':
            poll_id = request.GET.get('poll_id', None)

            if poll_id:
                poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()
                if not poll:
                    raise ObjectNotFoundException(model='Poll')
                
                serializer = PollSerializer(poll)
                return Response(serializer.data)
            
            else:
                poll_type = request.GET.get('poll_type', None)
                name = request.GET.get('name', None)
                is_anonymous = request.GET.get('is_anonymous', None)
                is_paused = request.GET.get('is_paused', None)
                is_closed = request.GET.get('is_closed', None)

                filters = Q(author__user=current_user)
                if poll_type:
                    poll_type = PollType.objects.filter(name=poll_type).first()
                    if not poll_type:
                        raise ObjectNotFoundException(model='PollType')
                    filters &= Q(poll_type=poll_type)
                if name:
                    filters &= Q(name__istartswith=name)
                if is_anonymous:
                    filters &= Q(is_anonymous=is_anonymous)
                if is_paused:
                    filters &= Q(is_paused=is_paused)
                if is_closed:
                    filters &= Q(is_closed=is_closed)

                polls = Poll.objects.filter(filters)
                serializer = PollSerializer(polls, many=True)
                return Response(serializer.data)

        elif request.method == 'POST':
            data = request.data

            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            poll_type_name = data.get('poll_type', None)
            if not poll_type_name:
                raise MissingFieldException(field_name='poll_type')
            
            poll_type = PollType.objects.filter(name=poll_type_name).first()
            if not poll_type:
                raise ObjectNotFoundException(model='PollType')

            poll = Poll(
                poll_id=poll_id,
                author=my_profile,
                poll_type=poll_type,
            )

            poll.save()
            return Response({'message':"Опрос успешно проинициализирован"}, status=status.HTTP_201_CREATED)

        elif request.method == 'PATCH':
            data = request.data

            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            poll = Poll.objects.filter(poll_id=poll_id, author=my_profile).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')
    
            serializer = UpdatePollSerializer(instance=poll, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'PUT':
            data = request.data

            if not request_type:
                raise MissingFieldException(field_name='request_type')
            
            if request_type == 'change_order':
                objects_to_update = []

                questions_data = data['questions_data']
                for question_number, question_data in enumerate(questions_data, start=1):
                    question = PollQuestion.objects.filter(id=int(question_data['id'])).first()
                    if not question:
                        raise ObjectNotFoundException(model='AnswerOption')

                    question.order_id = question_number

                    objects_to_update.append(question)

                AnswerOption.objects.bulk_update(objects_to_update, ['order_id'])

                return Response(status=status.HTTP_200_OK)
            
            elif request_type == 'clone_poll':
                new_poll_id = data.get('new_poll_id', None)
                if not new_poll_id:
                    raise MissingFieldException(field_name='new_poll_id')
                
                poll_id = data.get('poll_id', None)
                if not poll_id:
                    raise MissingFieldException(field_name='poll_id')
                
                poll = Poll.objects.filter(poll_id=poll_id, author=my_profile).first()
                if not poll:
                    raise ObjectNotFoundException(model='Poll')
        
                poll_to_clone = Poll.objects.filter(poll_id=new_poll_id).first()
                if poll_to_clone:
                    raise InvalidFieldException(detail='Данный poll_id уже занят.')
                
                cloned_poll = clone_poll(poll, new_poll_id)

                serializer = PollSerializer(cloned_poll)
                return Response(serializer.data)

            else:
                return Response("Неверный тип запроса к PUT", status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            data = request.data
            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')
   

            poll.delete()

            current_user_profile = Profile.objects.filter(user=current_user).first()

            if not current_user_profile:
                raise ObjectNotFoundException('Profile')


            profile_serializer = GetProfileSerializer(current_user_profile)
            user_polls = Poll.objects.filter(author=current_user_profile)
            user_polls_serializer = PollSerializer(user_polls, many=True)

            response_data = {
                'profile': profile_serializer.data,
                'user_polls': user_polls_serializer.data
            }

            return Response({'message':f"Опрос успешно удален", 'data':response_data}, status=status.HTTP_204_NO_CONTENT)

    except APIException as api_exception:
        return Response({'message':f"{api_exception}"}, api_exception.status_code)
    
    except Exception as ex:
        return Response({'message':f"Внутренняя ошибка сервера в my_poll: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET', 'POST', 'DELETE', 'PATCH', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@transaction.atomic
def my_poll_question(request, request_type=None):
    try:
        current_user = request.user

        if request.method == 'GET':
            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')

            poll_question_id = request.GET.get('poll_question_id', None)
            my_poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()

            if not my_poll:
                raise ObjectNotFoundException(model='Poll') 
            
            if poll_question_id:
                my_poll_question = my_poll.questions.filter(id=poll_question_id).first()
                serializer = PollQuestionSerializer(my_poll_question)
            else:
                my_poll_questions = my_poll.questions.all()
                serializer = PollQuestionSerializer(my_poll_questions, many=True)

                
            return Response(serializer.data)

        elif request.method == 'POST':
            data = request.data

            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            my_poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()
            if not my_poll:
                raise ObjectNotFoundException(model='Poll')
            
            
            with transaction.atomic():
                poll_question = PollQuestion(
                    name="",
                    info="",
                    image=None,
                )
                poll_question.save()
                my_poll.questions.add(poll_question)

            return Response("Вопрос в опросе успешно проинициализирован", status=status.HTTP_201_CREATED)

        elif request.method == 'PATCH':
            data = request.data

            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            poll_question_id = data.get('poll_question_id', None)
            if not poll_question_id:
                raise MissingFieldException(field_name='poll_question_id')
            
            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')
            poll_question = PollQuestion.objects.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')
            
            serializer = PollQuestionSerializer(instance=poll_question, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'DELETE':
            data = request.data

            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            poll_question_id = request.GET.get('poll_question_id', None)
            if not poll_question_id:
                raise MissingFieldException(field_name='poll_question_id')
            
            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')
            poll_question = PollQuestion.objects.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')


            poll_question.delete()

            return Response({'message':"Вопрос опроса успешно удален"}, status=status.HTTP_204_NO_CONTENT)

        elif request.method == 'PUT':
            data = request.data

            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            my_poll = Poll.objects.filter(poll_id=poll_id).first()
            if not my_poll:
                raise ObjectNotFoundException(model='Poll')
            
            if not request_type:
                raise MissingFieldException(field_name='request_type')
            
            if request_type == 'change_order':
                objects_to_update = []

                questions_data = data['questions_data']
                for question_number, question_data in enumerate(questions_data, start=1):
                    question = PollQuestion.objects.filter(id=int(question_data['id'])).first()
                    if not question:
                        raise ObjectNotFoundException(model='AnswerOption')

                    question.order_id = question_number

                    objects_to_update.append(question)

                AnswerOption.objects.bulk_update(objects_to_update, ['order_id'])

                return Response(status=status.HTTP_200_OK)
            
            elif request_type == 'copy_question':
                question_id = data.get('question_id', None)
                if not question_id:
                    raise MissingFieldException('question_id')
                
                question = PollQuestion.objects.filter(id=question_id).first()
                if not question:
                    raise ObjectNotFoundException(model='PollQuestion')
                
                cloned_question = clone_question(question, my_poll)
                serializer = PollQuestionSerializer(cloned_question)
                return Response(serializer.data)



    except APIException as api_exception:
        return Response({'message':f"{api_exception}"}, api_exception.status_code)
    
    except Exception as ex:
        return Response({'message':f"Внутренняя ошибка сервера в my_poll_question: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['GET', 'POST', 'DELETE', 'PATCH', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@transaction.atomic
def my_poll_question_option(request):
    try:
        current_user = request.user

        if request.method == 'GET':
            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            poll_question_id = request.GET.get('poll_question_id', None)
            if not poll_question_id:
                raise MissingFieldException(field_name='poll_question_id')
             
            poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')

            poll_question = poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')
            

            question_option_id = request.GET.get('question_option_id', None)
            if question_option_id:
                question_option = poll_question.answer_options.filter(id=poll_question_id).first()
                serializer = PollQuestionOptionSerializer(question_option)
            else:
                question_options = poll_question.answer_options.all().order_by('order_id', 'id')
                serializer = PollQuestionOptionSerializer(question_options, many=True)
 
            
            return Response(serializer.data)

        elif request.method == 'POST':
            data = request.data

            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            poll_question_id = data.get('poll_question_id', None)
            if not poll_question_id:
                raise MissingFieldException(field_name='poll_question_id')
            

            my_poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()
            if not my_poll:
                raise ObjectNotFoundException(model='Poll')
            
            poll_question = my_poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')

            with transaction.atomic():
                question_option = AnswerOption(
                    name="",
                    image=None,
                )
                question_option.save()
                poll_question.answer_options.add(question_option)

            return Response({'message':f"Вариант ответа в вопросе успешно проинициализирован"}, status=status.HTTP_201_CREATED)

        elif request.method == 'PATCH':
            data = request.data

            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            poll_question_id = data.get('poll_question_id', None)
            if not poll_question_id:
                raise MissingFieldException(field_name='poll_question_id')
            
            question_option_id = data.get('question_option_id', None)
            if not question_option_id:
                raise MissingFieldException(field_name='question_option_id')
            
            my_poll = Poll.objects.filter(poll_id=poll_id).first()
            if not my_poll:
                raise ObjectNotFoundException(model='Poll')
            
            poll_question = my_poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')
            
            question_option = poll_question.answer_options.filter(id=question_option_id).first()
            if not question_option:
                raise ObjectNotFoundException(model='AnswerOption')
            

            serializer = PollQuestionOptionSerializer(instance=question_option, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'DELETE':
            
            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            poll_question_id = request.GET.get('poll_question_id', None)
            if not poll_question_id:
                raise MissingFieldException(field_name='poll_question_id')
            
            question_option_id = request.GET.get('question_option_id', None)
            if not question_option_id:
                raise MissingFieldException(field_name='question_option_id')
            
            my_poll = Poll.objects.filter(poll_id=poll_id).first()
            if not my_poll:
                raise ObjectNotFoundException(model='Poll')
            
            poll_question = my_poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')
            
            question_option = poll_question.answer_options.filter(id=question_option_id).first()
            if not question_option:
                raise ObjectNotFoundException(model='AnswerOption')


            question_option.delete()

            return Response({'message':"Вариант ответа успешно удален"}, status=status.HTTP_204_NO_CONTENT)

        elif request.method == 'PUT':
            data = request.data

            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            poll_question_id = data.get('poll_question_id', None)
            if not poll_question_id:
                raise MissingFieldException(field_name='poll_question_id')
            
            my_poll = Poll.objects.filter(poll_id=poll_id).first()
            if not my_poll:
                raise ObjectNotFoundException(model='Poll')
            
            poll_question = my_poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')


            objects_to_update = []

            options_data = data['options_data']
            for order_number, option_data in enumerate(options_data, start=1):
                poll_option = AnswerOption.objects.filter(id=int(option_data['id'])).first()
                if not poll_option:
                    raise ObjectNotFoundException(model='AnswerOption')

                poll_option.order_id = order_number

                objects_to_update.append(poll_option)

            # Выполняем один запрос к базе данных для обновления всех объектов
            AnswerOption.objects.bulk_update(objects_to_update, ['order_id'])

            return Response(status=status.HTTP_200_OK)
            

    except APIException as api_exception:
        return Response({'message':f"{api_exception}"}, api_exception.status_code)

    except Exception as ex:
        return Response({'message':f"Внутренняя ошибка сервера в my_poll_question_option: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    



@api_view(['GET', 'POST', 'DELETE', 'PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@transaction.atomic
def poll_voting(request):
    try:
        current_user = request.user
        my_profile = Profile.objects.filter(user=current_user).first()

        if not my_profile:
            raise ObjectNotFoundException(model='Profile')

        if request.method == 'GET':
            poll_id = request.GET.get('poll_id', None)

            if poll_id:
                poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()
                if not poll:
                    raise ObjectNotFoundException(model='Poll')
                
                serializer = PollSerializer(poll)
                return Response(serializer.data)
            
            else:
                my_answers = PollAnswer.objects.filter(profile=my_profile)
                print(my_answers)
                my_answered_polls = Poll.objects.filter(
                    questions__answer_options__answers__in=my_answers
                ).distinct()
                print(my_answered_polls)

                serializer = PollSerializer(my_answered_polls, many=True)
                return Response(serializer.data)

        elif request.method == 'POST':
            data = request.data

            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
           

            poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')

            if poll.has_user_participated_in(my_profile):
                raise AccessDeniedException(detail="Вы уже принимали участие в этом опросе.")
            
            answers = data.get('answers', None)
            if not answers:
                raise MissingFieldException(field_name='answers')
            
            try:
                answers = process_answers(answers, poll, my_profile.user_id)
            except ValueError as ex:
                return Response({'message': f"{ex}"}, status=status.HTTP_400_BAD_REQUEST)

            serializer = PollAnswerSerializer(data=answers, many=True)
            serializer.is_valid(raise_exception=True)
            
            poll_answers = serializer.save(profile=my_profile)
            serializer = PollAnswerSerializer(poll_answers, many=True)

            
            # Установка связей между вариантами ответов и ответами
            for poll_answer in poll_answers:
                poll_answer.question.answer_options.filter(id=poll_answer.answer_option_id).first().answers.add(poll_answer)


            return Response({'message':"Вы успешно проголосовали", 'data':serializer.data}, status=status.HTTP_200_OK)

        elif request.method == 'PATCH':
            data = request.data

            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
           

            poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')

            if poll.can_user_vote(my_profile):
                raise AccessDeniedException(detail="Вы уже принимали участие в этом опросе.")
            
            answers = data['answers']
            with transaction.atomic():
                for answer in answers:
                    question = poll.questions.filter(id=answer['question_id']).first()  
                    if not question:
                        raise ObjectNotFoundException(model='PollQuestion')
                    answer_option = question.answer_options.filter(id=answer['answers_option_id']).first()  
                    if not answer_option:
                        raise ObjectNotFoundException(model='AnswerOption')
                    
                    poll_answer = PollAnswer(profile=my_profile,                        
                                             answer_option=answer_option)
                    
                    poll_answer.text = answer.get('text', None)

                    poll_answer.save()
                    answer_option.answers.add(poll_answer)



            return Response({'message':"Вы успешно проголосовали повторно"}, status=status.HTTP_200_OK)

        elif request.method == 'DELETE':
            poll_id = request.GET.get('poll_id', None)

            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
           
            poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')

            if not poll.has_user_participated_in(my_profile):
                raise AccessDeniedException(detail="Вы еще не принимали участие в этом опросе.")

            if not poll.can_user_vote(my_profile):
                raise AccessDeniedException(detail="В данном опросе недоступно повторное голосование.")
            

            questions = poll.questions.filter(answer_options__answers__profile=my_profile)
            answers_to_delete = PollAnswer.objects.filter(
                Q(question__in=questions) &
                Q(profile=my_profile)
            )

            # Удаляем все найденные ответы
            answers_to_delete.delete()


            return Response({'message':f"Ваш голос в опросе успешно отменен"}, status=status.HTTP_204_NO_CONTENT)
    
    except APIException as api_exception:
        return Response({'message':f"{api_exception}"}, api_exception.status_code)

    except Exception as ex:
        return Response({'message':f"Внутренняя ошибка сервера в my_poll: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
@permission_classes([AllowAny])
def poll(request, request_type=None):
    try:
        if request.method == 'GET':
            poll_id = request.GET.get('poll_id', None)

            if poll_id:
                poll = Poll.objects.filter(Q(poll_id=poll_id)).first()
                if not poll:
                    raise ObjectNotFoundException(model='Poll')
                
                serializer = PollSerializer(poll)
                return Response(serializer.data)
            
            else:
                poll_type = request.GET.get('poll_type', None)
                name = request.GET.get('name', None)
                is_anonymous = request.GET.get('is_anonymous', None)
                is_paused = request.GET.get('is_paused', None)
                is_closed = request.GET.get('is_closed', None)

                filters = Q()
                if poll_type:
                    poll_type = PollType.objects.filter(name=poll_type).first()
                    if not poll_type:
                        raise ObjectNotFoundException(model='PollType')
                    filters &= Q(poll_type=poll_type)
                if name:
                    filters &= Q(name__istartswith=name)
                if is_anonymous:
                    filters &= Q(is_anonymous=is_anonymous)
                if is_paused:
                    filters &= Q(is_paused=is_paused)
                if is_closed:
                    filters &= Q(is_closed=is_closed)

                polls = Poll.objects.filter(filters)
                serializer = PollSerializer(polls, many=True)
                return Response(serializer.data)
            
    except APIException as api_exception:
            return Response({'message':f"{api_exception}"}, api_exception.status_code)
        
    except Exception as ex:
        return Response({'message':f"Внутренняя ошибка сервера в poll: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
