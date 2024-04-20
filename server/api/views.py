from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q, Prefetch, ExpressionWrapper, FloatField
from django.db.models import Count, Case, When, F
from django.db import transaction
from django.contrib.auth.models import AnonymousUser


from .exсeptions import *
from .serializers import *
from .models import *
from .utils import *
from .pollvoting import *

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
            current_user_profile = Profile.objects.filter(user=current_user).select_related('role').first()

            if not current_user_profile:
                raise ObjectNotFoundException('Profile')


            profile_serializer = GetProfileSerializer(current_user_profile)

            return Response(profile_serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'POST':
            current_user_profile = Profile.objects.filter(user=current_user).select_related('role').first()
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
        return Response({'message':f"{api_exception.detail}"}, api_exception.status_code)
    
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
                poll = (
                    Poll.objects.filter(
                        Q(author__user=current_user) & Q(poll_id=poll_id))
                        .select_related('author', 'poll_type')
                        .prefetch_related(
                        Prefetch('questions', queryset=PollQuestion.objects.prefetch_related(
                                'answer_options'
                        ).all()))
                        .first()
                    )
                if not poll:
                    raise ObjectNotFoundException(model='Poll')
                
                serializer = PollSerializer(poll, context={'profile': my_profile})
                return Response(serializer.data)
            
            else:
                poll_type = request.GET.get('poll_type', None)
                name = request.GET.get('name', None)
                is_anonymous = request.GET.get('is_anonymous', None)
                is_paused = request.GET.get('is_paused', False)
                is_closed = request.GET.get('is_closed', False)

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

                filters &= Q(is_paused=is_paused)
                filters &= Q(is_closed=is_closed)

                page = int(request.GET.get('page', 1))
                page_size = int(request.GET.get('page_size', 20))  

                polls = Poll.objects.filter(filters).select_related('author', 'poll_type').order_by('-created_date')
                
                page = int(request.GET.get('page', 1))
                page_size = int(request.GET.get('page_size', 3))  

                paginator = PageNumberPagination()
                paginator.page_size = page_size 
                paginated_result = paginator.paginate_queryset(polls, request)
                paginator.page.number = page
                total_items = polls.count()
                total_pages = paginator.page.paginator.num_pages
                serializer = MiniPollSerializer(paginated_result, many=True)
                pagination_data = {
                    'total_items': total_items,
                    'total_pages': total_pages,
                    'results': serializer.data 
                }
                return Response(pagination_data)

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
                
            
            if request_type == 'change_questions_order':
                poll = Poll.objects.filter(poll_id=poll_id, author=my_profile).first()
                if not poll:
                    raise ObjectNotFoundException(model='Poll')
            
                new_questions = []
                questions_data = data['questions_data']
                question_ids = list(questions_data.keys())
                questions = PollQuestion.objects.filter(id__in=map(int, question_ids))
                for question_number, question in enumerate(questions.all(), start=1):
                    if not question:
                        raise ObjectNotFoundException(model='AnswerOption')

                    question.order_id = question_number
                    new_questions.append(question)

                PollQuestion.objects.bulk_update(new_questions, ['order_id'])

                serializer = PollQuestionSerializer(new_questions, many=True)

                return Response(serializer.data, status=status.HTTP_200_OK)
            
            elif request_type == 'clone_poll':
                new_poll_id = data.get('new_poll_id', None)
                if not new_poll_id:
                    raise MissingFieldException(field_name='new_poll_id')
                
                poll = Poll.objects.filter(poll_id=new_poll_id).exists()
                if poll:
                    raise InvalidFieldException(detail='Данный poll_id уже занят.')
                
                poll_to_clone = Poll.objects.filter(poll_id=poll_id).prefetch_related(
                                Prefetch('questions', queryset=PollQuestion.objects.prefetch_related(
                                    'answer_options'
                                ).all())
                            ).first()
                if not poll_to_clone:
                    raise ObjectNotFoundException(model='Poll')

                cloned_poll = clone_poll(poll_to_clone, new_poll_id)
                cloned_poll = (
                        Poll.objects
                            .filter(poll_id=cloned_poll.poll_id)
                            .select_related('author', 'poll_type')
                            .prefetch_related(
                            Prefetch('questions', queryset=PollQuestion.objects.prefetch_related(
                                    'answer_options'
                            ).all()))
                            .first()
                    )
                
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

            if request_type == 'deploy_to_production':
                poll = (
                    Poll.objects.filter(
                        Q(author=my_profile) and Q(poll_id=poll_id))
                        .select_related('author', 'poll_type')
                        .prefetch_related(
                        Prefetch('questions', queryset=PollQuestion.objects.prefetch_related(
                                'answer_options'
                        ).all()))
                        .first()
                    )

                if not poll:
                    raise ObjectNotFoundException(model='Poll')
                
                if is_poll_valid(poll):
                    poll.is_in_production = True
                    poll.save()

                    return Response({'message':f"Опрос успешно опубликован", 'severity': 'success'}, status=status.HTTP_200_OK)
            
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

    except PollValidationException as exception:
        return Response(exception.detail, exception.status_code)
    
    except APIException as api_exception:
        return Response({'message':f"{api_exception.detail}"}, api_exception.status_code)
    
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

            poll = Poll.objects.filter(poll_id=poll_id).prefetch_related(
                Prefetch('questions', queryset=PollQuestion.objects.prefetch_related(
                    'answer_options'
                ).all())
            ).first()
            if not poll:
                raise ObjectNotFoundException('Poll')

            poll_statistics = (
                PollAnswer.objects
                .filter(poll_answer_group__poll=poll)
                .values('poll_answer_group__poll__poll_id')
                .annotate(
                    total_answers=Count('id'),
                    correct_answers=Count(Case(When(points=1, then=1))),
                    correct_percentage=ExpressionWrapper(
                        100 * F('correct_answers') / F('total_answers'),
                        output_field=FloatField()
                    )
                )
            )

            question_statistics = (
                PollAnswer.objects
                .filter(poll_answer_group__poll=poll)
                .values('question_id', 'poll_answer_group__profile')
                .distinct()
                .annotate(
                    quantity=Count('id'),
                    correct_quantity=Count(Case(
                        When(points=1, then=1),
                        default=0
                    )),
                    correct_percentage=ExpressionWrapper(
                        100 * F('correct_quantity') / F('quantity'),
                        output_field=FloatField()
                    )
                )
            ) 
            
            options_answers_count = (
                PollAnswer.objects
                .filter(poll_answer_group__poll=poll)
                .values('answer_option')
                .annotate(quantity=Count('id'))
            )

            free_answers = (
                PollAnswer.objects
                .filter(
                    poll_answer_group__poll__poll_id=poll_id,
                    text__isnull=False
                )
                # .select_related('poll_answer_group__profile')
                .values(
                    'text',
                    'question_id',
                    user_id=F('poll_answer_group__profile__user_id'),
                    profile_name=F('poll_answer_group__profile__name'),
                    profile_surname=F('poll_answer_group__profile__surname')
                )
            )

            context = {
                'poll_statistics': poll_statistics,
                'question_statistics': question_statistics,
                'options_answers_count': options_answers_count,
                'free_answers': free_answers
            }


            stats = PollStatsSerializer(poll, context=context)
            return Response(stats.data)


    except APIException as api_exception:
        return Response({'message': f"{api_exception.detail}"}, api_exception.status_code)

    except Exception as ex:
        return Response({'message': f"Внутренняя ошибка сервера в my_poll_stats: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def my_poll_user_answers(request):
    try:
        current_user = request.user
        my_profile = Profile.objects.filter(user=current_user).first()

        if not my_profile:
            raise ObjectNotFoundException(model='Profile')

        poll_id = request.GET.get('poll_id', None)
        if not poll_id:
            raise MissingParameterException(field_name='poll_id')
        
        if request.method == 'GET':

            user_id = request.GET.get('user_id', None)

            if user_id:
                answer = (
                    PollAnswerGroup.objects.filter(Q(poll__poll_id=poll_id) & Q(profile__user_id=user_id))
                    .prefetch_related(
                            'answers'
                        ).all()
                    .first()
                )
                if not answer:
                    raise MyCustomException(detail="Данный юзер еще не принял участие в опросе")
        
                answer = PollAnswerGroupSerializer(answer)
                return Response(answer.data)

            else:
                answers = (
                    PollAnswerGroup.objects
                    .filter(poll__poll_id=poll_id)
                    .prefetch_related('answers')
                    .order_by('-voting_date')
                )

                page = int(request.GET.get('page', 1))
                page_size = int(request.GET.get('page_size', 10))  

                paginator = PageNumberPagination()
                paginator.page_size = page_size 
                paginated_result = paginator.paginate_queryset(answers, request)
                paginator.page.number = page
                total_items = answers.count()
                total_pages = paginator.page.paginator.num_pages

                answers = PollAnswerGroupSerializer(paginated_result, many=True)

                pagination_data = {
                    'total_items': total_items,
                    'total_pages': total_pages,
                    'results': answers.data 
                }
                return Response(pagination_data)



    except APIException as api_exception:
        return Response({'message': f"{api_exception.detail}"}, api_exception.status_code)

    except Exception as ex:
        return Response({'message': f"Внутренняя ошибка сервера в my_poll_answers: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()

            if not poll:
                raise ObjectNotFoundException(model='Poll') 
            
            if poll_question_id:
                my_poll_question = (
                    poll.questions.filter(id=poll_question_id)
                        .prefetch_related('answer_options')
                        .first()
                )
                serializer = PollQuestionSerializer(my_poll_question)
            else:
                my_poll_questions = poll.questions.all().prefetch_related('answer_options')
                serializer = PollQuestionSerializer(my_poll_questions, many=True)

                
            return Response(serializer.data)

        elif request.method == 'POST':
            data = request.data.copy()

            poll_id = data.get('poll_id', None)
            if not poll_id:
                raise MissingFieldException(field_name='poll_id')
            
            poll = Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id)).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')
            
            if poll.is_in_production:
                raise AccessDeniedException(detail="Данный опрос находится в продакшене, его нельзя изменять!")

            if len(poll.questions.all()) > 50:
                raise TooManyInstancesException(model='PollQuestion', limit=50)

            data['poll'] = poll.id
            last_question = poll.questions.order_by('order_id', 'id').last()
            if last_question:
                data['order_id'] = last_question.order_id + 1

            poll_question = PollQuestionSerializer(data=data)
            if poll_question.is_valid():
                poll_question = poll_question.save()
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
            
            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')
            poll_question = poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')
            
            if poll.is_in_production:
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
            
            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')
            poll_question = poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')

            if poll.is_in_production:
                raise AccessDeniedException(detail="Данный опрос находится в продакшене, его нельзя изменять!")
            
            poll_question.delete()

            return Response({'message':"Вопрос опроса успешно удален"}, status=status.HTTP_204_NO_CONTENT)

        elif request.method == 'PUT':
            data = request.data

            poll_id = request.GET.get('poll_id', None)
            if not poll_id:
                raise MissingParameterException(field_name='poll_id')
            
            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')
            
            poll_question_id = request.GET.get('poll_question_id', None)
            if not poll_question_id:
                raise MissingParameterException(field_name='poll_question_id')
            
            poll_question = poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='Question')
            
            request_type = request.GET.get('request_type', None)
            if not request_type:
                raise MissingParameterException(field_name='request_type')
            
            if poll.is_in_production:
                raise AccessDeniedException(detail="Данный опрос находится в продакшене, его нельзя изменять!")
            
            if request_type == 'change_options_order':
                new_options = []
                options_data = data['options_data']
                options_ids = list(options_data.keys())
                options = AnswerOption.objects.filter(id__in=map(int, options_ids))
                for option_number, option in enumerate(options.all(), start=1):
                    if not option:
                        raise ObjectNotFoundException(model='AnswerOption')

                    option.order_id = option_number
                    new_options.append(option)

                AnswerOption.objects.bulk_update(new_options, ['order_id'])

                serializer = AnswerOptionSerializer(new_options, many=True)

                return Response(serializer.data, status=status.HTTP_200_OK)
            
            elif request_type == 'copy_question':
                if len(poll.questions.all()) > 50:
                    raise TooManyInstancesException(model='PollQuestion', limit=50)
                         
                cloned_question = clone_question(poll_question)
                cloned_question =  (
                    PollQuestion.objects
                        .filter(id=cloned_question.id)
                        .prefetch_related('answer_options')
                        .first()
                )
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
        return Response({'message':f"{api_exception.detail}"}, api_exception.status_code)
    
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
             
            poll = (
                Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id))
                    .prefetch_related(
                    Prefetch('questions', queryset=PollQuestion.objects.prefetch_related(
                        'answer_options'
                    ).all())
                ).first()
            )
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
            

            poll = (
                Poll.objects.filter(Q(author__user=current_user) and Q(poll_id=poll_id))
                    .prefetch_related(
                    Prefetch('questions', queryset=PollQuestion.objects.prefetch_related(
                        'answer_options'
                    ).all())
                ).first()
            )
            if not poll:
                raise ObjectNotFoundException(model='Poll')
            
            poll_question = poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')

            if poll.is_in_production:
                raise AccessDeniedException(detail="Данный опрос находится в продакшене, его нельзя изменять!")
            
            if len(poll_question.answer_options.all()) > 10:
                raise TooManyInstancesException(model='PollQuestion', limit=10)

            data['question'] = poll_question.id

            last_option = poll_question.answer_options.filter(is_free_response=False).order_by('order_id', 'id').last()
            if last_option:
                data['order_id'] = last_option.order_id + 1

            # если свободная форма ответа, то добавляем в самый конец списка опций
            data['is_free_response'] = data.get('is_free_response', False)  
            if data['is_free_response']:
                data['order_id'] = 16

            has_free_option = poll_question.answer_options.filter(is_free_response=True).exists()
            answer_option_serializer = PollQuestionOptionSerializer(data=data, context={'has_free_option': has_free_option})
            if answer_option_serializer.is_valid():
                answer_option = answer_option_serializer.save()
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
            
            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')
            
            poll_question = poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')
            
            question_option = poll_question.answer_options.filter(id=question_option_id).first()
            if not question_option:
                raise ObjectNotFoundException(model='AnswerOption')
            
            if poll.is_in_production:
                raise AccessDeniedException(detail="Данный опрос находится в продакшене, его нельзя изменять!")
            
            is_correct = data.get('is_correct', None)
            if poll_question.has_multiple_choices == False:
                if is_correct:
                    data['is_correct'] = bool(data.get('is_correct', None))
                    all_options = poll_question.answer_options.all()
                    new_options = []
                    for option in all_options:
                        if option.is_correct:
                            option.is_correct = False
                            new_options.append(option)


                    AnswerOption.objects.bulk_update(new_options, ['is_correct'])

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
            
            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')
            
            poll_question = poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')
            
            question_option = poll_question.answer_options.filter(id=question_option_id).first()
            if not question_option:
                raise ObjectNotFoundException(model='AnswerOption')

            if poll.is_in_production:
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
            
            poll = Poll.objects.filter(poll_id=poll_id).first()
            if not poll:
                raise ObjectNotFoundException(model='Poll')
            
            poll_question = poll.questions.filter(id=poll_question_id).first()
            if not poll_question:
                raise ObjectNotFoundException(model='PollQuestion')

            if poll.is_in_production:
                raise AccessDeniedException(detail="Данный опрос находится в продакшене, его нельзя изменять!")
            
            objects_to_update = []

            options_data = data['options_data']
            for order_number, option_data in enumerate(options_data, start=1):
                poll_option = AnswerOption.objects.filter(id=int(option_data['id'])).first()
                if not poll_option:
                    raise ObjectNotFoundException(model='AnswerOption')

                if poll_option.is_free_response:
                    poll_option.order_id = 16
                else:
                    poll_option.order_id = order_number

                objects_to_update.append(poll_option)

            # Выполняем один запрос к базе данных для обновления всех объектов
            AnswerOption.objects.bulk_update(objects_to_update, ['order_id'])

            return Response(status=status.HTTP_200_OK)
            

    except APIException as api_exception:
        return Response({'message':f"{api_exception.detail}"}, api_exception.status_code)

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
                my_answer = PollAnswerGroup.objects.filter(
                    Q(profile=my_profile) & Q(poll__poll_id=poll_id)
                ).select_related('poll').prefetch_related('answers').first()

                poll = Poll.objects.filter(
                    Q(author__user=current_user) & Q(poll_id=poll_id)
                ).select_related('author', 'poll_type').prefetch_related(
                    Prefetch('questions', queryset=PollQuestion.objects.prefetch_related('answer_options').all())
                ).first()

                if not my_answer:
                    raise ObjectNotFoundException(model='PollAnswerGroup')
                
                my_answer.poll = poll

                serializer = PollAnswerGroupSerializer(my_answer)
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
           
            poll = (
                    Poll.objects.filter(poll_id=poll_id)
                    .select_related('author', 'poll_type', 'author__user')
                    .prefetch_related(
                        Prefetch('questions', queryset=PollQuestion.objects.prefetch_related(
                            'answer_options'
                        ).all()))
                    .prefetch_related(
                        Prefetch('user_answers', queryset=PollAnswerGroup.objects.prefetch_related(
                            'answers'
                        ).all()))
                    .first()
                )
            
            if not poll:
                raise ObjectNotFoundException(model='Poll')


            if poll.has_user_participated_in(my_profile):
                if not poll.is_revote_allowed:
                    raise AccessDeniedException(detail="Вы уже принимали участие в этом опросе")
                else:
                    PollAnswerGroup.objects.filter(
                        Q(poll=poll) & Q(profile=my_profile)      
                    ).first().delete()

                        
            answers = data.get('answers', None)
            if not answers:
                raise MissingFieldException(field_name='answers')
            
            # валидация и парсинг ответов
            if poll.poll_type.name == 'Опрос':
                answers = poll_voting_handler(answers, poll)
            elif poll.poll_type.name == 'Викторина':
                answers = quizz_voting_handler(answers, poll)
            else:
                raise MyCustomException(detail="Данного типа опроса не существует")

            poll_answer_group, answers = save_votes(answers, poll, my_profile)
            serializer = PollAnswerGroupSerializer(poll_answer_group)
        

            return Response({'message':"Вы успешно проголосовали", 'data':serializer.data,}, status=status.HTTP_200_OK)
    
        elif request.method == 'DELETE':
            poll_id = request.GET.get('poll_id', None)

            if not poll_id:
                raise MissingParameterException(field_name='poll_id')
           
            poll = (
                Poll.objects
                    .filter(Q(author__user=current_user) and Q(poll_id=poll_id))
                    .prefetch_related('user_answers')
                ).first()

            if not poll:
                raise ObjectNotFoundException(model='Poll')

            if not poll.has_user_participated_in(my_profile):
                raise AccessDeniedException(detail="Вы еще не принимали участие в этом опросе.")

            if not poll.can_user_vote(my_profile):
                raise AccessDeniedException(detail="В данном опросе недоступно повторное голосование.")
            

            answers_to_delete = poll.user_answers.filter(profile=my_profile).first()

            # Удаляем все найденные ответы
            if answers_to_delete:
                answers_to_delete.delete()


            return Response({'message':f"Ваш голос в опросе успешно отменен"}, status=status.HTTP_204_NO_CONTENT)
    
    except APIException as api_exception:
        return Response({'message':f"{api_exception.detail}"}, api_exception.status_code)

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
                poll = (
                    Poll.objects
                        .filter(Q(poll_id=poll_id) & Q(is_in_production=True))
                        .select_related('author', 'poll_type')
                        .prefetch_related(
                        Prefetch('questions', queryset=PollQuestion.objects.prefetch_related(
                                'answer_options'
                        ).all()))
                        .first()
                )
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

                filters = Q(is_in_production=True)
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


                polls = (
                    Poll.objects
                    .select_related('author', 'poll_type', 'author__user')
                    .prefetch_related('questions')
                    .prefetch_related(
                        Prefetch('user_answers', queryset=PollAnswerGroup.objects.prefetch_related(
                            'answers'
                        ).all()))
                    .filter(filters)  
                )


                page = int(request.GET.get('page', 1))
                page_size = int(request.GET.get('page_size', 3))  

                paginator = PageNumberPagination()
                paginator.page_size = page_size 
                paginated_result = paginator.paginate_queryset(polls, request)
                paginator.page.number = page
                total_items = polls.count()
                total_pages = paginator.page.paginator.num_pages

                context = {
                    'profile': my_profile
                }
                serializer = MiniPollSerializer(paginated_result, context=context, many=True)
                pagination_data = {
                    'total_items': total_items,
                    'total_pages': total_pages,
                    'results': serializer.data 
                }
                return Response(pagination_data)

            
    except APIException as api_exception:
            return Response({'message':f"{api_exception.detail}"}, api_exception.status_code)
        
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


            all_answers = poll.user_answers.all().order_by('-voting_date')
            paginator = PageNumberPagination()
            paginator.page_size = page_size  # Устанавливаем количество элементов на странице
            paginated_result = paginator.paginate_queryset(all_answers, request)

            # Устанавливаем номер текущей страницы в пагинаторе
            paginator.page.number = page

            serializer = PollAnswerGroupSerializer(paginated_result, many=True)
            return paginator.get_paginated_response(serializer.data)

    except APIException as api_exception:
        return Response({'message': f"{api_exception.detail}"}, api_exception.status_code)

    except Exception as ex:
        return Response({'message': f"Внутренняя ошибка сервера в my_poll_votes: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def my_support_requests(request):
    current_user = request.user
    my_profile = Profile.objects.filter(user=current_user).first()

    if not my_profile:
        raise ObjectNotFoundException(model='Profile')
    
    try:
        if request.method == 'GET':
            ticket_id = request.GET.get('ticket_id', None)

            if ticket_id:
                ticket = (
                    SupportRequest.objects
                        .filter(Q(id=ticket_id) & Q(author=my_profile))
                        .select_related('author', 'type')
                        .first()
                    )
                if not ticket:
                    raise ObjectNotFoundException(model='SupportRequest')
                
                serializer = SupportRequestSerializer(ticket)
                return Response(serializer.data)
            
            else:
                ticket_type = request.GET.get('ticket_type', None)
                name = request.GET.get('name', None)
                is_seen = request.GET.get('is_seen', None)
                is_closed = request.GET.get('is_closed', None)
                author_id = request.GET.get('author_id', None)

                filters = Q(author=my_profile)
                if ticket_type:
                    ticket_type = SupportRequestType.objects.filter(type=ticket_type).first()
                    if not ticket_type:
                        raise ObjectNotFoundException(model='SupportRequestType')
                    filters &= Q(type=ticket_type)
                if name:
                    filters &= Q(name__icontains=name)
                if is_seen:
                    filters &= Q(is_seen=is_seen)
                if is_closed:
                    filters &= Q(is_closed=is_closed)
                if author_id:
                    filters &= Q(author__user_id=author_id)

                all_tickets = (
                    SupportRequest.objects
                        .filter(filters)
                        .select_related('author', 'type')
                        .order_by('-created_date')
                )
                all_tickets = get_paginated_response(request, all_tickets, SupportRequestSerializer)
                return Response(all_tickets)

        elif request.method == 'POST':
            data = request.data.copy()

            ticket_type = data.get('ticket_type', None)
            if not ticket_type:
                raise MissingFieldException(field_name='ticket_type')
            
            ticket_type = SupportRequestType.objects.filter(type=ticket_type).first()
            if not ticket_type:
                raise ObjectNotFoundException(model='SupportRequestType')
            data['type'] = ticket_type.id
            data['author'] = my_profile.user_id
            
            ticket_exists = (
                    SupportRequest.objects
                        .filter(Q(author=my_profile))
                        .exists()
                    )
            if ticket_exists:
                raise AccessDeniedException(detail='У Вас есть еще не рассмотренное обращение, ожидайте ответа')
    
            serializer = SupportRequestBaseSerializer(data=data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)     
      
        elif request.method == 'DELETE':
            ticket_id = request.GET.get('ticket_id', None)

            if not ticket_id:
                raise MissingParameterException(field_name='ticket_id')
           
            ticket = (
                SupportRequest.objects
                    .filter(Q(id=ticket_id) & Q(author=my_profile))
                ).first()

            if not ticket:
                raise ObjectNotFoundException(model='SupportRequest')

            ticket.delete()

            return Response({'message':f"{ticket} успешно отменена"}, status=status.HTTP_204_NO_CONTENT)
    
    except APIException as api_exception:
        return Response({'message':f"{api_exception.detail}"}, api_exception.status_code)

    except Exception as ex:
        return Response({'message':f"Внутренняя ошибка сервера в support_request: {ex}"},
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)  

