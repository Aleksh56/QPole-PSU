from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login as auth_login, logout as auth_logout, authenticate
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

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
            serializer = ProfileSerializer(current_user_profile)
            user_polls = Poll.objects.filter(author=current_profile)
            if user_polls:
                serializer.data['polls'] = user_polls
            else:
                serializer.data['polls'] = []

            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
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



@api_view(['GET', 'POST', 'DELETE', 'PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_poll(request, poll_id=None):
    current_user = request.user

    if request.method == 'GET':
        if poll_id:
            poll = get_object_or_404(Poll.objects.filter(author__user=current_user), pk=poll_id)
            serializer = PollSerializer(poll)
            return Response(serializer.data)
        else:
            polls = Poll.objects.filter(author__user=current_user)
            serializer = PollSerializer(polls, many=True)
            return Response(serializer.data)

    elif request.method == 'POST':
        current_user = request.user
        data = request.data

        poll_id = data.get('poll_id', None)
        author_profile = Profile.objects.get(user=current_user)
        poll_type, _ = PollType.objects.get_or_create(name=data['poll_type'])

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
        
        poll = None
        if poll_id:
            poll = Poll.objects.get(id=poll_id)
        else:
            return Response("Не удалось найти опрос по данному id", status=status.HTTP_404_NOT_FOUND)

        for key, value in data.items():
            if key == 'duration':
                poll.set_duration(data['duration'])
            else:
                setattr(poll, key, value)

        poll.save()
        return Response("Опрос успешно изменен", status=status.HTTP_200_OK)


    elif request.method == 'DELETE':
        data = request.data
        poll_id = data.get('poll_id', None)

        poll = None
        if poll_id:
            poll = Poll.objects.get(id=poll_id)
        else:
            return Response("Не удалось найти опрос по данному id", status=status.HTTP_404_NOT_FOUND)

        poll.delete()

        return Response("Опрос успешно удален", status=status.HTTP_204_NO_CONTENT)

    else:
        return Response({'message': "Unsupported request method!"}, status=status.HTTP_400_BAD_REQUEST)

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
def create_initial_poll(request):
    # try:
        current_user = request.user
        data = request.data

        poll_id = data.get('poll_id', None)
        author_profile = Profile.objects.get(user=current_user)
        poll_type, _ = PollType.objects.get_or_create(name=data['poll_type'])

        poll = Poll(
            id=poll_id,
            author=author_profile,
            poll_type=poll_type,
            # name=data['name'],
            # description=data['description'],
            # has_multiple_choices=data['has_multiple_choices'],
            # has_correct_answer=data['has_correct_answer'],
            # is_anonymous=data['is_anonymous'],
            # can_cancel_vote=data['can_cancel_vote']
        )
        # poll.set_duration(data['duration'])

        # if 'image' in request.FILES:
        #     poll.image = request.FILES['image']

        poll.save()
        return Response("Опрос успешно проинициализирован", status=status.HTTP_201_CREATED)
    
    # except Exception as e:
    #     logger.error(f"Произошла ошибка при создании опроса: {e}")
    #     return Response(f"Произошла ошибка при создании опроса: {e}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edit_poll(request):
    data = request.data
    poll_id = data.pop('poll_id')
    
    poll = None
    if poll_id:
        poll = Poll.objects.get(id=poll_id)
    else:
        return Response("Не удалось найти опрос по данному id", status=status.HTTP_404_NOT_FOUND)

    for key, value in data.items():
        if key == 'duration':
            poll.set_duration(data['duration'])
        else:
            setattr(poll, key, value)

    poll.save()
    return Response("Опрос успешно изменен", status=status.HTTP_200_OK)




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

