from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login as auth_login, logout as auth_logout, authenticate
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from .serializers import UserSerializer, PasswordChangeSerializer
from .utils import generate_random_code, send_reset_code_email, store_reset_code_in_cache, reset_password_with_code

@api_view(['POST'])
def register(request):
    email = request.data['email']
    check_email = User.objects.filter(email=email).exists()

    if not check_email:
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            auth_login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'auth_token': token.key, 'user_data': serializer.data})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message':"Данная почта уже занята"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, email=request.data['email'])
    if not user.check_password(request.data['password']):
        return Response("Пользователь не найден!", status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)

    auth_login(request, user)

    return Response({'auth_token': token.key, 'user_data': serializer.data})


@api_view(['POST'])
def logout(request):
    user = get_object_or_404(User, email=request.data['email'])
    if not user.check_password(request.data['password']):
        return Response("Пользователь не найден!", status=status.HTTP_404_NOT_FOUND)
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
            return Response({'message': 'Reset code sent successfully.'})
        else:
            return Response({'error': 'User not found.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid request method.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    if request.method == 'POST':
        email = request.data.get('email')
        code = request.data.get('code')
        new_password = request.data.get('new_password')

        success = reset_password_with_code(email, code, new_password)

        if success:
            user = get_object_or_404(User, email=email)
            auth_login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'message': 'Password reset successful and user logged in.',
                             'auth_token': token.key})
        else:
            return Response({'error': 'Invalid reset code.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid request method.'}, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("Тест на вход пройден!")