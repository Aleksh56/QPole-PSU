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
# from .utils import generate_random_code, send_reset_code_email, store_reset_code_in_cache, reset_password_with_code

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


@api_view(['GET', 'POST', 'DELETE', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_profile(request):
    current_user = request.user

    if request.method == 'GET':
        current_user_profile = Profile.objects.filter(user=current_user).first()
        if current_user_profile:
            serializer = ProfileSerializer(current_user_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'message': "Профиль не найден!"}, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'POST':
        current_user_profile = Profile.objects.filter(user=current_user).first()
        if current_user_profile:
            return Response({'message': "Профиль уже существует!"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = ProfileSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=current_user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':
        current_user_profile = Profile.objects.filter(user=current_user).first()
        if current_user_profile:
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
