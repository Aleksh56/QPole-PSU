from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.db import transaction
from django.contrib.auth.models import AnonymousUser


from api.exсeptions import *
from api.serializers import PollSerializer
from api.models import *
from api.utils import *

from .serializers import ProfileSerializer

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User

from login.serializers import *

@api_view(['GET', 'POST', 'DELETE', 'PATCH'])
@permission_classes([IsAdminUser])
@transaction.atomic
def users(request):
    try:
        if request.method == 'GET':
            user_id = request.GET.get('user_id', None)

            if user_id:
                user = Profile.objects.filter(user_id=user_id).select_related('role').first()
                if not user:
                    raise ObjectNotFoundException('Profile')
                serializer = ProfileSerializer(user)
            else:
                page = int(request.GET.get('page', 1))
                page_size = int(request.GET.get('page_size', 20))  

                users = Profile.objects.all().order_by('-joining_date').select_related('role')
                paginator = PageNumberPagination()
                paginator.page_size = page_size
                paginated_result = paginator.paginate_queryset(users, request)
                paginator.page.number = page

                serializer = ProfileSerializer(paginated_result, many=True)
                return paginator.get_paginated_response(serializer.data)
    

            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'PATCH':
            user_id = request.GET.get('user_id', None)
            if not user_id:
                raise MissingParameterException(field_name='user_id')

            user = Profile.objects.filter(user_id=user_id).first()
            if not user:
                raise ObjectNotFoundException('Profile')
            
            serializer = ProfileSerializer(user, data=request.data, partial=True)
    
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
            
            user_id = request.GET.get('user_id', None)
            if not user_id:
                raise MissingParameterException(field_name='user_id')
                
            user = Profile.objects.filter(user_id=user_id).first()
            if not user:
                raise ObjectNotFoundException(model='Profile')
            
            if request_type == 'change_role':
                role_name = data.get('role_name', None)
                if not role_name:
                    raise MissingFieldException(field_name='role_name')
                
                role = UserRole.objects.filter(role=role_name).first()
                if not role:
                    raise ObjectNotFoundException(model='UserRole')
                
                user.role = role
                user.save()

                return Response(f"Роль для {user} успешно изменена на {role}",status=status.HTTP_200_OK)

            else:
                return Response("Неверный тип запроса к PUT", status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            user_id = request.GET.get('user_id', None)
            if not user_id:
                raise MissingParameterException(field_name='user_id')

            user = User.objects.filter(user_id=user_id).first()
            if not user:
                raise ObjectNotFoundException('User')
            
            user_data = user
            user.delete()
            return Response(f"Пользователь {user_data} успешно удален.", status=status.HTTP_204_NO_CONTENT)
      

    except APIException as api_exception:
        return Response({'message':f"{api_exception}"}, api_exception.status_code)
    
    except Exception as ex:
        return Response(f"Внутренняя ошибка сервера в admin users: {ex}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

@api_view(['GET', 'POST', 'DELETE', 'PATCH'])
@permission_classes([IsAdminUser])
@transaction.atomic
def polls(request):
    try:
        if request.method == 'GET':
            poll_id = request.GET.get('poll_id', None)

            if poll_id:
                poll = Poll.objects.filter(poll_id=poll_id).select_related('author', 'poll_type').first()
                if not poll:
                    raise ObjectNotFoundException('Poll')
                serializer = PollSerializer(poll)
            else:
                page = int(request.GET.get('page', 1))
                page_size = int(request.GET.get('page_size', 20))  

                polls = Poll.objects.all().order_by('-created_date').select_related('author', 'poll_type')
                paginator = PageNumberPagination()
                paginator.page_size = page_size
                paginated_result = paginator.paginate_queryset(polls, request)
                paginator.page.number = page

                serializer = PollSerializer(paginated_result, many=True)
                return paginator.get_paginated_response(serializer.data)
    

            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'PATCH':
            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingParameterException(field_name='poll_id')

            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException('Poll')
            
            serializer = ProfileSerializer(poll, data=request.data, partial=True)
    
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
                
            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')

            else:
                return Response("Неверный тип запроса к PUT", status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingParameterException(field_name='poll_id')

            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException('Poll')
            
            poll_data = poll
            poll.delete()
            return Response(f"{poll_data} успешно удален.", status=status.HTTP_204_NO_CONTENT)
      

    except APIException as api_exception:
        return Response({'message':f"{api_exception}"}, api_exception.status_code)
    
    except Exception as ex:
        return Response(f"Внутренняя ошибка сервера в admin polls: {ex}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      
# удаление опросов, юзеры, изменение роли, бан



