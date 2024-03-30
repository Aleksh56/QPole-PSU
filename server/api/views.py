from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.db import transaction
from django.contrib.auth.models import AnonymousUser


from .exсeptions import *
from .serializers import *
from .models import *
from .utils import *
from .pollvoting import pollvoting

import os

import logging
logger = logging.getLogger('debug') 


@api_view(['GET', 'POST', 'DELETE', 'PATCH'])
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
            # user_polls = Poll.objects.filter(author=current_profile)
            # user_polls_serializer = MiniPollSerializer(user_polls, many=True)

            # response_data = {
            #     'profile': profile_serializer.data,
            #     'user_polls': user_polls_serializer.data
            # }

            return Response(profile_serializer.data, status=status.HTTP_200_OK)

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
@permission_classes([IsAuthenticated])
@transaction.atomic
def my_poll(request):
    try:
        current_user = request.user
        my_profile = Profile.objects.filter(user=current_user).first()
        
        if request.method == 'GET':
            poll_id = request.GET.get('poll_id', None)

            if poll_id:
                poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()
                if not poll:
                    raise ObjectNotFoundException(model='Poll')
                
                serializer = PollSerializer(poll, context={'profile': my_profile})
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
                    filters &= Q(name__icontains=name)
                if is_anonymous:
                    filters &= Q(is_anonymous=is_anonymous)
                if is_paused:
                    filters &= Q(is_paused=is_paused)
                if is_closed:
                    filters &= Q(is_closed=is_closed)

                polls = Poll.objects.filter(filters)
                serializer = MiniPollSerializer(polls, many=True, context={'profile': my_profile})
                return Response(serializer.data)

        elif request.method == 'POST':

            if not my_profile.user.is_staff:
                if len(my_profile.my_polls.all()) > 10:
                    raise TooManyInstancesException(detail=f"Вы не можете создавать более {10} опросов.")

            data = request.data.copy()
            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            data['poll_id'] = poll_id 
            
            poll_type_name = data.get('poll_type', None)
            if not poll_type_name:
                raise MissingFieldException(field_name='poll_type')
            poll_type = PollType.objects.filter(name=poll_type_name).first()
            if not poll_type:
                raise ObjectNotFoundException(model='PollType')
            
            data['poll_type'] = poll_type.id
            data['author'] = my_profile


            serializer = BasePollSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'PATCH':
            data = request.data

            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingParameterException(field_name='poll_id')
            
            poll = Poll.objects.filter(poll_id=poll_id, author=my_profile).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')
    
            serializer = PollSerializer(instance=poll, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)      

        elif request.method == 'PUT':   
            data = request.data

            request_type = request.GET.get('request_type', None)
            if not request_type:
                raise MissingParameterException(field_name='request_type')
            
            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingParameterException(field_name='poll_id')
                
            poll = Poll.objects.filter(poll_id=poll_id, author=my_profile).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')
            
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
                
                poll_to_clone = Poll.objects.filter(poll_id=new_poll_id).first()
                if poll_to_clone:
                    raise InvalidFieldException(detail='Данный poll_id уже занят.')
                
                cloned_poll = clone_poll(poll, new_poll_id)

                serializer = PollSerializer(cloned_poll)
                return Response(serializer.data)

            elif request_type == 'delete_image':
                image_path = None
                if poll.image:
                    image_path = poll.image.path
                poll.image = None
                poll.save()
                if os.path.exists(image_path):
                    os.remove(image_path)
                serializer = PollSerializer(poll)
                return Response(serializer.data, status=status.HTTP_200_OK)

            else:
                return Response("Неверный тип запроса к PUT", status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            data = request.data
            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingParameterException(field_name='poll_id')
            
            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')
   

            poll.delete()

            current_user_profile = Profile.objects.filter(user=current_user).first()

            if not current_user_profile:
                raise ObjectNotFoundException('Profile')


            profile_serializer = GetProfileSerializer(current_user_profile)
            user_polls = Poll.objects.filter(author=current_user_profile)
            user_polls_serializer = MiniPollSerializer(user_polls, many=True)

            response_data = {
                'profile': profile_serializer.data,
                'user_polls': user_polls_serializer.data
            }

            return Response({'message':f"Опрос успешно удален", 'data':response_data}, status=status.HTTP_204_NO_CONTENT)

    except APIException as api_exception:
        return Response({'message':f"{api_exception}"}, api_exception.status_code)
    
    except Exception as ex:
        return Response({'message':f"Внутренняя ошибка сервера в my_poll: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def my_poll_stats(request):
    try:
        current_user = request.user
        my_profile = Profile.objects.filter(user=current_user).first()

        if not my_profile:
            raise ObjectNotFoundException(model='Profile')

        if request.method == 'GET':
            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingParameterException(field_name='poll_id')

            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException('Poll')


            stats = PollStatsSerializer(poll)
            return Response(stats.data)

    except APIException as api_exception:
        return Response({'message': f"{api_exception}"}, api_exception.status_code)

    except Exception as ex:
        return Response({'message': f"Внутренняя ошибка сервера в my_poll_stats: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET', 'POST', 'DELETE', 'PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def my_poll_question(request):
    try:
        current_user = request.user

        if request.method == 'GET':
            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingParameterException(field_name='poll_id')

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
            data = request.data.copy()

            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            my_poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()
            if not my_poll:
                raise ObjectNotFoundException(model='Poll')
            
            if my_poll.is_in_production:
                raise AccessDeniedException(detail="Данный опрос находится в продакшене, его нельзя изменять!")

            if len(my_poll.questions.all()) > 50:
                raise TooManyInstancesException(model='PollQuestion', limit=50)

            data['poll'] = my_poll.id
            poll_question = PollQuestionSerializer(data=data)
            if poll_question.is_valid():
                poll_question = poll_question.save()
                # my_poll.questions.add(poll_question)
                return Response(f"Вопрос {poll_question} успешно проинициализирован", status=status.HTTP_201_CREATED)
            else:
                return Response(poll_question.errors, status=status.HTTP_400_BAD_REQUEST)
            
        elif request.method == 'PATCH':
            data = request.data

            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingParameterException(field_name='poll_id')
            
            poll_question_id = request.GET.get('poll_question_id', None)
            if not poll_question_id:
                raise MissingParameterException(field_name='poll_question_id')
            
            my_poll = Poll.objects.filter(poll_id=poll_id).first()
            if not my_poll:
                raise ObjectNotFoundException(model='Poll')
            poll_question = my_poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')
            
            if my_poll.is_in_production:
                raise AccessDeniedException(detail="Данный опрос находится в продакшене, его нельзя изменять!")
            
            serializer = PollQuestionSerializer(instance=poll_question, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            data = request.data

            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingParameterException(field_name='poll_id')
            
            poll_question_id = request.GET.get('poll_question_id', None)
            if not poll_question_id:
                raise MissingParameterException(field_name='poll_question_id')
            
            my_poll = Poll.objects.filter(poll_id=poll_id).first()
            if not my_poll:
                raise ObjectNotFoundException(model='Poll')
            poll_question = my_poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')

            if my_poll.is_in_production:
                raise AccessDeniedException(detail="Данный опрос находится в продакшене, его нельзя изменять!")
            
            poll_question.delete()

            return Response({'message':"Вопрос опроса успешно удален"}, status=status.HTTP_204_NO_CONTENT)

        elif request.method == 'PUT':
            data = request.data

            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingParameterException(field_name='poll_id')
            
            my_poll = Poll.objects.filter(poll_id=poll_id).first()
            if not my_poll:
                raise ObjectNotFoundException(model='Poll')
            
            poll_question_id = request.GET.get('poll_question_id', None)
            if not poll_question_id:
                raise MissingParameterException(field_name='poll_question_id')
            
            poll_question = my_poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='Question')
            
            request_type = request.GET.get('request_type', None)
            if not request_type:
                raise MissingParameterException(field_name='request_type')
            
            if my_poll.is_in_production:
                raise AccessDeniedException(detail="Данный опрос находится в продакшене, его нельзя изменять!")
            
            if request_type == 'change_order':
                objects_to_update = []

                questions_data = data['questions_data']
                for question_number, question_data in enumerate(questions_data, start=1):
                    poll_question = my_poll.questions.filter(id=int(question_data['id'])).first()
                    if not poll_question:
                        raise ObjectNotFoundException(model='PollQuestion')

                    poll_question.order_id = question_number

                    objects_to_update.append(poll_question)

                AnswerOption.objects.bulk_update(objects_to_update, ['order_id'])

                return Response(status=status.HTTP_200_OK)
            
            elif request_type == 'copy_question':
                if len(my_poll.questions.all()) > 50:
                    raise TooManyInstancesException(model='PollQuestion', limit=50)
                         
                cloned_question = clone_question(poll_question, my_poll)
                serializer = PollQuestionSerializer(cloned_question)
                return Response(serializer.data)

            elif request_type == 'delete_image':
                image_path = None
                if poll_question.image:
                    image_path = poll_question.image.path
                poll_question.image = None
                poll_question.save()
                if os.path.exists(image_path):
                    os.remove(image_path)
                serializer = PollQuestionSerializer(poll_question)
                return Response(serializer.data, status=status.HTTP_200_OK)


    except APIException as api_exception:
        return Response({'message':f"{api_exception}"}, api_exception.status_code)
    
    except Exception as ex:
        return Response({'message':f"Внутренняя ошибка сервера в my_poll_question: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['GET', 'POST', 'DELETE', 'PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def my_poll_question_option(request):
    try:
        current_user = request.user

        if request.method == 'GET':
            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingParameterException(field_name='poll_id')
            
            poll_question_id = request.GET.get('poll_question_id', None)
            if not poll_question_id:
                raise MissingParameterException(field_name='poll_question_id')
             
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
            data = request.data.copy()

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

            if my_poll.is_in_production:
                raise AccessDeniedException(detail="Данный опрос находится в продакшене, его нельзя изменять!")
            
            if len(poll_question.answer_options.all()) > 10:
                raise TooManyInstancesException(model='PollQuestion', limit=10)

            data['question'] = poll_question.id
            answer_option_serializer = AnswerOptionSerializer(data=data)
            if answer_option_serializer.is_valid():
                answer_option = answer_option_serializer.save()
                # poll_question.answer_options.add(answer_option)
                return Response(f"Вариант ответа {answer_option} успешно проинициализирован", status=status.HTTP_201_CREATED)
            else:
                return Response(answer_option_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        elif request.method == 'PATCH':
            data = request.data.copy()

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
            
            if my_poll.is_in_production:
                raise AccessDeniedException(detail="Данный опрос находится в продакшене, его нельзя изменять!")
            
            is_correct = data.get('is_correct', None)
            if is_correct:
                data['is_correct'] = bool(data.get('is_correct', None))
                all_options = poll_question.answer_options.all()
                for option in all_options:
                    if option.is_correct:
                        option.is_correct = False
                        option.save()

            serializer = PollQuestionOptionSerializer(instance=question_option, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            
            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingParameterException(field_name='poll_id')
            
            poll_question_id = request.GET.get('poll_question_id', None)
            if not poll_question_id:
                raise MissingParameterException(field_name='poll_question_id')
            
            question_option_id = request.GET.get('question_option_id', None)
            if not question_option_id:
                raise MissingParameterException(field_name='question_option_id')
            
            my_poll = Poll.objects.filter(poll_id=poll_id).first()
            if not my_poll:
                raise ObjectNotFoundException(model='Poll')
            
            poll_question = my_poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')
            
            question_option = poll_question.answer_options.filter(id=question_option_id).first()
            if not question_option:
                raise ObjectNotFoundException(model='AnswerOption')

            if my_poll.is_in_production:
                raise AccessDeniedException(detail="Данный опрос находится в продакшене, его нельзя изменять!")
            
            question_option.delete()

            return Response({'message':"Вариант ответа успешно удален"}, status=status.HTTP_204_NO_CONTENT)

        elif request.method == 'PUT':
            data = request.data

            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingParameterException(field_name='poll_id')
            
            poll_question_id = data.get('poll_question_id', None)
            if not poll_question_id:
                raise MissingFieldException(field_name='poll_question_id')
            
            my_poll = Poll.objects.filter(poll_id=poll_id).first()
            if not my_poll:
                raise ObjectNotFoundException(model='Poll')
            
            poll_question = my_poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')

            if my_poll.is_in_production:
                raise AccessDeniedException(detail="Данный опрос находится в продакшене, его нельзя изменять!")
            
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
                my_answers = PollAnswerGroup.objects.filter(
                    Q(profile=my_profile) & Q(poll__poll_id=poll_id)
                )
                serializer = PollAnswerGroupSerializer(my_answers, many=True)
                return Response(serializer.data)
            
            else:
                my_answers = PollAnswerGroup.objects.filter(profile=my_profile)
                serializer = PollAnswerGroupSerializer(my_answers, many=True)
                return Response(serializer.data)

        elif request.method == 'POST':
            data = request.data.copy()

            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingParameterException(field_name='poll_id')
           

            poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')

            if poll.has_user_participated_in(my_profile):
                raise AccessDeniedException(detail="Вы уже принимали участие в этом опросе.")
            
            answers = data.get('answers', None)
            if not answers:
                raise MissingFieldException(field_name='answers')
            
            answers = pollvoting(answers, poll, my_profile)
            previous_answer = PollAnswerGroup.objects.filter(
                Q(poll=poll) & Q(profile=my_profile)      
            ).first()

            # Удаляем все найденные ответы
            if previous_answer:
                previous_answer.delete()

            poll_answer_group_data = {
                'profile': my_profile.user_id,
                'poll': poll.id,
            }
            poll_answer_group = PollAnswerGroupSerializer(data=poll_answer_group_data)
            if poll_answer_group.is_valid():
                poll_answer_group = poll_answer_group.save()
            else:
                return Response(poll_answer_group.errors, status=status.HTTP_400_BAD_REQUEST)
            

            data = data['answers']
            for answer in data:
                answer['poll_answer_group'] = poll_answer_group.id
       

            answers = PollAnswerSerializer(data=data, many=True)
            if answers.is_valid():
                answers = answers.save()
            else:
                return Response(answers.errors, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = PollAnswerSerializer(answers, many=True)

            result = {}
            if poll.poll_type.name == 'Викторина':
                total = 0
                correct = 0
                for answer in serializer.data:
                    total += 1
                    if answer['is_correct'] == True:
                        correct += 1
                
                result = {
                    'total': total,
                    'correct': correct,
                    'wrong': total - correct,
                    'percentage': round(float(correct / total), 2) * 100,
                }
                        

            return Response({'message':"Вы успешно проголосовали", 'data':serializer.data, 'result': result}, status=status.HTTP_200_OK)

        elif request.method == 'DELETE':
            poll_id = request.GET.get('poll_id', None)

            if not poll_id:
                raise MissingParameterException(field_name='poll_id')
           
            poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')

            if not poll.has_user_participated_in(my_profile):
                raise AccessDeniedException(detail="Вы еще не принимали участие в этом опросе.")

            if not poll.can_user_vote(my_profile):
                raise AccessDeniedException(detail="В данном опросе недоступно повторное голосование.")
            

            answers_to_delete = poll.answers.all().filter(profile=my_profile)

            # Удаляем все найденные ответы
            answers_to_delete.delete()


            return Response({'message':f"Ваш голос в опросе успешно отменен"}, status=status.HTTP_204_NO_CONTENT)
    
    except APIException as api_exception:
        return Response({'message':f"{api_exception}"}, api_exception.status_code)

    except Exception as ex:
        return Response({'message':f"Внутренняя ошибка сервера в poll_voting: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  



@api_view(['GET'])
@permission_classes([AllowAny])
def poll(request):
    try:
        current_user = request.user
        if isinstance(current_user, AnonymousUser):
            my_profile = None
        else:
            my_profile = Profile.objects.filter(user=current_user).first()


        if request.method == 'GET':
            poll_id = request.GET.get('poll_id', None)

            if poll_id:
                poll = Poll.objects.filter(poll_id=poll_id).first()
                if not poll:
                    raise ObjectNotFoundException(model='Poll')
                
                serializer = PollSerializer(poll, context={'profile': my_profile})
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
                for poll in polls:
                    poll.profile = my_profile

                serializer = MiniPollSerializer(polls, many=True, context={'profile': my_profile})
                return Response(serializer.data)
            
    except APIException as api_exception:
            return Response({'message':f"{api_exception}"}, api_exception.status_code)
        
    except Exception as ex:
        return Response({'message':f"Внутренняя ошибка сервера в poll_voting: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def my_poll_votes(request):
    try:
        current_user = request.user
        my_profile = Profile.objects.filter(user=current_user).first()

        if not my_profile:
            raise ObjectNotFoundException(model='Profile')

        if request.method == 'GET':
            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingParameterException(field_name='poll_id')

            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException('Poll')

            page = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 20))  


            all_answers = poll.answers.all().order_by('-voting_date')
            paginator = PageNumberPagination()
            paginator.page_size = page_size  # Устанавливаем количество элементов на странице
            paginated_result = paginator.paginate_queryset(all_answers, request)

            # Устанавливаем номер текущей страницы в пагинаторе
            paginator.page.number = page

            serializer = PollAnswerSerializer(paginated_result, many=True)
            return paginator.get_paginated_response(serializer.data)

    except APIException as api_exception:
        return Response({'message': f"{api_exception}"}, api_exception.status_code)

    except Exception as ex:
        return Response({'message': f"Внутренняя ошибка сервера в my_poll_votes: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


