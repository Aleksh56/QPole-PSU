from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login as auth_login, logout as auth_logout, authenticate
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


from .exсeptions import *
from .serializers import *
from .models import *

import logging
logger = logging.getLogger('debug') 


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_my_profile(request):
    current_user = request.user

    if current_user:
        current_user_profile = Profile.objects.get(user=current_user)
        serializer = ProfileSerializer(current_user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    else:
        return Response({'message':"Пользователь не найден!"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST', 'DELETE', 'PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_profile(request):
    current_user = request.user
    current_profile = Profile.objects.get(user=current_user)
    if request.method == 'GET':
        current_user_profile = Profile.objects.filter(user=current_user).first()

        if current_user_profile:
            profile_serializer = ProfileSerializer(current_user_profile)
            user_polls = Poll.objects.filter(author=current_profile)
            user_polls_serializer = PollSerializer(user_polls, many=True)

            response_data = {
                'profile': profile_serializer.data,
                'user_polls': user_polls_serializer.data
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'message': "Профиль не найден!"}, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'POST':
        current_user_profile = Profile.objects.filter(user=current_user).first()
        request.data['user'] = current_user.id
        if current_user_profile:
            return Response({'message': "Профиль уже существует!"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = ProfileSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=current_user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PATCH':
        current_user_profile = Profile.objects.filter(user=current_user).first()
        if current_user_profile:
            request.data['user'] = current_user.id
            serializer = ProfileSerializer(current_user_profile, data=request.data)
    
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': "Профиль не найден!"}, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'DELETE':
        current_user_profile = Profile.objects.filter(user=current_user).first()
        if current_user_profile:
            current_user_profile.delete()
            return Response({'message': "Профиль успешно удален!"}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'message': "Профиль не найден!"}, status=status.HTTP_404_NOT_FOUND)

    else:
        return Response({'message': "Неподдерживаемый метод запроса!"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'POST', 'DELETE', 'PATCH', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_poll(request):
    try:
        current_user = request.user

        if request.method == 'GET':
            poll_id = request.GET.get('poll_id', None)
            if poll_id:
                poll = get_object_or_404(Poll.objects.filter(author__user=current_user), poll_id=poll_id)
                serializer = PollSerializer(poll)
                return Response(serializer.data)
            else:
                polls = Poll.objects.filter(author__user=current_user)
                serializer = PollSerializer(polls, many=True)
                return Response(serializer.data)

        elif request.method == 'POST':
            current_user = request.user
            author_profile = Profile.objects.get(user=current_user)
            data = request.data

            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            poll_type_name = data.get('poll_type', None)
            if not poll_type_name:
                raise MissingFieldException(field_name='poll_type')
            
            poll_type = PollType.objects.filter(name=poll_type_name)
            if not poll_type:
                raise ObjectNotFoundException(model='PollType')

            poll = Poll(
                poll_id=poll_id,
                author=author_profile,
                poll_type=poll_type,
            )

            poll.save()
            return Response("Опрос успешно проинициализирован", status=status.HTTP_201_CREATED)

        elif request.method == 'PATCH':
            data = request.data

            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')


            for key, value in data.items():
                if key == 'duration':
                    try:
                        poll.set_duration(data['duration'])
                    except ValueError as ve:
                        return Response(f"{ve}", status=status.HTTP_400_BAD_REQUEST)
                else:
                    setattr(poll, key, value)

            poll.save()
            return Response("Опрос успешно изменен", status=status.HTTP_200_OK)

        elif request.method == 'PUT':
            data = request.data
            poll_id = data.get('poll_id', None)
            is_free_response = data.get('is_free_response', False)
            name = data.get('name', None)
            is_correct = data.get('is_correct', None)
            
            image = request.FILES.get('image')

            poll = None
            if poll_id:
                poll = Poll.objects.filter(poll_id=poll_id).first()
                if not poll:
                    return Response("Не удалось найти опрос по данному poll_id", status=status.HTTP_404_NOT_FOUND)
            else:
                return Response("В запросе не указан poll_id", status=status.HTTP_400_BAD_REQUEST)

            try:
                if poll.add_answer_option(is_free_response=True, image=image, name='name2'):
                    return Response("Вариант ответа успешно добавлен.", status=status.HTTP_200_OK)
                else:
                    return Response(f"Не удалось добавить вариант ответа.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except ValueError as ve:
                return Response(f"{ve}", status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            data = request.data
            poll_id = data.get('poll_id', None)

            poll = None
            if poll_id:
                poll = Poll.objects.filter(poll_id=poll_id).first()
                if not poll:
                    return Response("Не удалось найти опрос по данному id", status=status.HTTP_404_NOT_FOUND)
            else:
                return Response("В запросе не указан poll_id", status=status.HTTP_400_BAD_REQUEST)

            poll.delete()

            return Response("Опрос успешно удален", status=status.HTTP_204_NO_CONTENT)

        else:
            return Response(f"Неподдерживаемый тип запроса", status=status.HTTP_400_BAD_REQUEST)
        
    except MissingFieldException as ex:
        return Response(f"{ex}", status=status.HTTP_404_NOT_FOUND)
      
    except ObjectNotFoundException as ex:
        return Response(f"{ex}", status=status.HTTP_404_NOT_FOUND)

    except Exception as ex:
        return Response(f"Внутренняя ошибка сервера: {ex}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def poll_question(request):
    try:
        current_user = request.user

        if request.method == 'POST':
            data = request.data

            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            author = Profile.objects.get(user=current_user)
            poll = Poll.objects.filter(author=author, poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')


            question = PollQuestion(
                name = ""
            )

            question.save()
            poll.add_question(question)
            
            return Response("Опрос успешно проинициализирован", status=status.HTTP_201_CREATED)

        elif request.method == 'PATCH':
            data = request.data
            poll_id = data.get('poll_id', None)
            
            poll = None
            if poll_id:
                poll = Poll.objects.filter(poll_id=poll_id).first()
                if not poll:
                    return Response("Не удалось найти опрос по данному poll_id", status=status.HTTP_404_NOT_FOUND)
            else:
                return Response("В запросе не указан poll_id", status=status.HTTP_400_BAD_REQUEST)

            for key, value in data.items():
                if key == 'duration':
                    try:
                        poll.set_duration(data['duration'])
                    except ValueError as ve:
                        return Response(f"{ve}", status=status.HTTP_400_BAD_REQUEST)
                else:
                    setattr(poll, key, value)

            poll.save()
            return Response("Опрос успешно изменен", status=status.HTTP_200_OK)

        elif request.method == 'PUT':
            data = request.data
            poll_id = data.get('poll_id', None)
            is_free_response = data.get('is_free_response', False)
            name = data.get('name', None)
            is_correct = data.get('is_correct', None)
            
            image = request.FILES.get('image')

            poll = None
            if poll_id:
                poll = Poll.objects.filter(poll_id=poll_id).first()
                if not poll:
                    return Response("Не удалось найти опрос по данному poll_id", status=status.HTTP_404_NOT_FOUND)
            else:
                return Response("В запросе не указан poll_id", status=status.HTTP_400_BAD_REQUEST)

            try:
                if poll.add_answer_option(is_free_response=True, image=image, name='name2'):
                    return Response("Вариант ответа успешно добавлен.", status=status.HTTP_200_OK)
                else:
                    return Response(f"Не удалось добавить вариант ответа.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except ValueError as ve:
                return Response(f"{ve}", status=status.HTTP_400_BAD_REQUEST)

    except MissingFieldException as ex:
        logger.error(f"Отсутствует необходимый аргумент: {ex}")
        return Response(f"Отсутствует необходимый аргумент: {ex}", status=status.HTTP_400_BAD_REQUEST)
    
    except ObjectNotFoundException as ex:
        logger.error(f"Ошибка нахождения объекта модели: {ex=}")
        return Response(f"Ошибка нахождения объекта модели: {ex}", status=status.HTTP_404_NOT_FOUND)
        
    except Exception as ex:
        logger.error(f"Ошибка при добавлении вопроса в опрос: {ex}")
        return Response(f"Внутренняя ошибка сервера: {ex}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def close_my_poll(request, poll_id):
    current_user = request.user

    poll = get_object_or_404(Poll.objects.filter(author__user=current_user), pk=poll_id)
    poll.is_closed = True
    if poll.save():
        return Response(f"Опрос №{poll_id} успешно закрыт", status=status.HTTP_200_OK)
    else: 
        return Response(f"Опрос №{poll_id} не был успешно закрыт", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def pause_my_poll(request, poll_id):
    current_user = request.user

    poll = get_object_or_404(Poll.objects.filter(author__user=current_user), pk=poll_id)
    poll.is_paused = True
    if poll.save():
        return Response(f"Опрос №{poll_id} успешно приостановлен", status=status.HTTP_200_OK)
    else: 
        return Response(f"Опрос №{poll_id} не был успешно приостановлен", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_options_to_poll(request, poll_id):
    # try:
        data = request.data
        poll = Poll.objects.filter(id=poll_id).first()
        for option_data in data['options']:
            poll.add_answer_option(option_data['name'], option_data['is_correct'])

        return Response("Варианты ответа успешно добавлены", status=status.HTTP_201_CREATED)


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

