from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login as auth_login, logout as auth_logout, authenticate
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.core.cache import cache
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from .serializers import UserSerializer, PasswordChangeSerializer
from .utils import *
from api.models import *



@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data
    email = data['email']
    check_email = User.objects.filter(email=email).exists()

    if not check_email:
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            with transaction.atomic():
                user = serializer.save()
                auth_login(request, user)
                user_profile = Profile.objects.create(
                    user=user, 
                    name=data['first_name'],
                    surname=data['last_name'],
                    patronymic=data['patronymic'],
                    sex=data['sex'],
                    number=data['phone'], 
                    role=UserRole.objects.get(role=data['role'])
                )
                token, created = Token.objects.get_or_create(user=user)
                return Response({'auth_token': token.key, 'user_data': serializer.data})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message': "Данная почта уже занята"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    user = get_object_or_404(User, email=request.data['email'])
    if not user.check_password(request.data['password']):
        return Response("Пользователь не найден!", status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)

    auth_login(request, user)

    return Response({'auth_token': token.key, 'user_data': serializer.data})


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    user = request.user
    token, created = Token.objects.get_or_create(user=user)
    token.delete()

    auth_logout(request)

    return Response({'message':"Вы были успешно разлогинены"})


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    serializer = PasswordChangeSerializer(data=request.data)

    if serializer.is_valid():
        old_password = serializer.data.get("old_password")
        new_password = serializer.data.get("new_password")

        if not user.check_password(old_password):
            return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        auth_login(request, user)

        return Response({"Пароль успешно изменен."}, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def send_reset_code(request):
    if request.method == 'POST':
        email = request.data.get('email')
        user_exists = User.objects.filter(email=email).exists()

        if user_exists:
            reset_code = generate_random_code()
            send_reset_code_email(email, reset_code)
            store_reset_code_in_cache(email, reset_code)
            return Response({'message': 'Код восстановления отправлен на почту.'})
        else:
            return Response({'error': 'Пользователь не найден.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Недостимый метод запроса.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def check_reset_code(request):
    try:
        if request.method == 'POST':
            email = request.data.get('email')
            reset_code = request.data.get('reset_code')

            if not email or not reset_code:
                return Response({'error': 'Пожалуйста, предоставьте электронную почту и код сброса пароля.'},
                                 status=status.HTTP_400_BAD_REQUEST)

            user_exists = User.objects.filter(email=email).exists()

            if user_exists:
                cache_key = f'reset_code:{email}'
                stored_code = cache.get(cache_key)

                if stored_code and int(stored_code) == int(reset_code):
                    reset_token_key = f'reset_token:{email}'
                    reset_token = generate_random_token()
                    cache.set(reset_token_key, reset_token, timeout=300)
                    return Response({'message': 'Код верный, введите новый пароль.',
                                     'reset_token': reset_token})
                else:
                    return Response({'error': 'Неверный код, повторите попытку.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Пользователь не найден.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Недостимый метод запроса.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    if request.method == 'POST':
        reset_token = request.data.get('reset_token')
        email = request.data.get('email')
        new_password = request.data.get('new_password')

        if reset_token == get_reset_code_from_cache(email):
            if reset_password_after_code_validation(email, new_password):
                user = get_object_or_404(User, email=email)
                auth_login(request, user)
                token, created = Token.objects.get_or_create(user=user)
                return Response({'message': 'Пароль успешно сменен и произведен вход в аккаунт.',
                                    'auth_token': token.key})
            else: 
                return Response({'error': 'Произошла ошибка при смене пароля.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else: 
            return Response({'error': 'Неверный токен смены пароля.'}, status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response({'error': 'Недопустимый метод запроса.'}, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("Тест на вход пройден!")