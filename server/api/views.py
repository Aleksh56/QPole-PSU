from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q


from .exсeptions import *
from .serializers import *
from .models import *

import logging
logger = logging.getLogger('debug') 


@api_view(['GET', 'POST', 'DELETE', 'PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
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
      

    except MissingFieldException as msg:
        return Response({'message':f"{msg}"}, status=status.HTTP_400_BAD_REQUEST)
    
    except InvalidFieldException as msg:
        return Response({'message':f"{msg}"}, status=status.HTTP_400_BAD_REQUEST)
    
    except ObjectNotFoundException as msg:
        return Response({'message':f"{msg}"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as ex:
        return Response(f"Внутренняя ошибка сервера в my_profile: {ex}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


@api_view(['GET', 'POST', 'DELETE', 'PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_poll(request):
    try:
        current_user = request.user

        if request.method == 'GET':
            poll_id = request.GET.get('poll_id', None)
            if poll_id:
                poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()
                serializer = PollSerializer(poll)
                return Response(serializer.data)
            else:
                polls = Poll.objects.filter(author__user=current_user)
                serializer = PollSerializer(polls, many=True)
                return Response(serializer.data)

        elif request.method == 'POST':
            author_profile = Profile.objects.get(user=current_user)
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
                author=author_profile,
                poll_type=poll_type,
            )

            poll.save()
            return Response({'message':"Опрос успешно проинициализирован"}, status=status.HTTP_201_CREATED)

        elif request.method == 'PATCH':
            data = request.data

            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')
    
            serializer = UpdatePollSerializer(instance=poll, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'DELETE':
            data = request.data
            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')
   

            poll.delete()

            return Response({'message':f"Опрос успешно удален"}, status=status.HTTP_204_NO_CONTENT)

    except InvalidFieldException as ex:
        return Response({'message':f"{ex}"}, status=status.HTTP_400_BAD_REQUEST)
    
    except WrongFieldTypeException as ex:
        return Response({'message':f"{ex}"}, status=status.HTTP_400_BAD_REQUEST)

    except MissingFieldException as ex:
        return Response({'message':f"{ex}"}, status=status.HTTP_400_BAD_REQUEST)
      
    except ObjectNotFoundException as ex:
        return Response({'message':f"{ex}"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as ex:
        return Response({'message':f"Внутренняя ошибка сервера в my_poll: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET', 'POST', 'DELETE', 'PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_poll_question(request):
    try:
        current_user = request.user

        if request.method == 'GET':
            poll_id = request.GET.get('poll_id', None)
            if poll_id:
                poll_question_id = request.GET.get('poll_question_id', None)
                my_poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()

                if poll_question_id:
                    my_poll_question = my_poll.questions.filter(id=poll_question_id).first()
                    serializer = PollQuestionSerializer(my_poll_question)
                else:
                    my_poll_questions = my_poll.questions.all()
                    serializer = PollQuestionSerializer(my_poll_questions, many=True)

                
                return Response(serializer.data)
            else:
                return Response("В запросе не указан poll_id", status=status.HTTP_400_BAD_REQUEST)

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

    except InvalidFieldException as ex:
        return Response({'message':f"{ex}"}, status=status.HTTP_400_BAD_REQUEST)
    
    except WrongFieldTypeException as ex:
        return Response({'message':f"{ex}"}, status=status.HTTP_400_BAD_REQUEST)

    except MissingFieldException as ex:
        return Response({'message':f"{ex}"}, status=status.HTTP_400_BAD_REQUEST)
      
    except ObjectNotFoundException as ex:
        return Response({'message':f"{ex}"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as ex:
        return Response({'message':f"Внутренняя ошибка сервера в my_poll_question: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['GET', 'POST', 'DELETE', 'PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
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

            question_option_id = request.GET.get('question_option_id', None)
        
            poll_question = poll.questions.filter(id=poll_question_id).first()

            if question_option_id:
                question_option = poll_question.answer_options.filter(id=poll_question_id).first()
                serializer = PollQuestionOptionSerializer(question_option)
            else:
                question_options = poll_question.answer_options.all()
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


            question_option.delete()

            return Response({'message':"Вариант ответа успешно удален"}, status=status.HTTP_204_NO_CONTENT)

    except InvalidFieldException as ex:
        return Response({'message':f"{ex}"}, status=status.HTTP_400_BAD_REQUEST)
    
    except WrongFieldTypeException as ex:
        return Response({'message':f"{ex}"}, status=status.HTTP_400_BAD_REQUEST)

    except MissingFieldException as ex:
        return Response({'message':f"{ex}"}, status=status.HTTP_400_BAD_REQUEST)
      
    except ObjectNotFoundException as ex:
        return Response({'message':f"{ex}"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as ex:
        return Response({'message':f"Внутренняя ошибка сервера в my_poll_question_option: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    

@api_view(['GET'])
def test_api(request):
    # Получение опроса по имени (замените 'example_poll' на фактическое имя)
    poll = Poll.objects.get(name='Чи или не чи')

    # # Получение всех AnswerOption для этого опроса
    # answer_options_for_poll = poll.answer_options.all()

    # # Создайте список для хранения всех участников
    # all_participants = []

    # # Пройдите по всем AnswerOption
    # for answer_option in answer_options_for_poll:
    #     # Получение всех PollParticipant, которые проголосовали за этот AnswerOption
    #     participants_for_option = PollParticipant.objects.filter(answers=answer_option)

    #     # Добавление участников в общий список
    #     all_participants.extend(participants_for_option)

    # # Получение всех пользователей, проголосовавших за все AnswerOption
    # users_voted_for_all_options = [participant.profile.user for participant in all_participants]

    # # Теперь у вас есть список пользователей, проголосовавших за все AnswerOption
    # print(users_voted_for_all_options)

    poll_serializer = PollSerializer(poll)
    return Response(poll_serializer.data)

