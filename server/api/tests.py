from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q, Prefetch, ExpressionWrapper, FloatField, Value
from django.db.models import Count, Case, When, F, Sum, Subquery, OuterRef, Max
from django.db.models.functions import Coalesce
from django.db import transaction



from .serializers import *
from .utils import clone_poll
from .pollvoting import *




@api_view(['GET'])
@permission_classes([AllowAny])
def optimization_test(request):
    try:
        data = {
            'request_type': 'clone_poll',
            'new_poll_id': '44a958f5-5fa9-44df04564564а5',
        }

        request_type = request.GET.get('request_type', None)
        if not request_type:
            raise MissingParameterException(field_name='request_type')
        poll_id = request.GET.get('poll_id', None)
        if not poll_id:
            raise MissingParameterException(field_name='poll_id')



        if request_type == 'clone_poll':
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
            
            cloned_poll =  (
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

    except APIException as api_exception:
        return Response({'message':f"{api_exception}"}, api_exception.status_code)
    
    except Exception as ex:
        return Response({'message':f"Внутренняя ошибка сервера в optimization_test: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
@permission_classes([AllowAny])
@transaction.atomic
def poll_voting_test(request):
    # try:
        my_profile = Profile.objects.filter(user_id=1).select_related('user').first()

        if not my_profile:
            raise ObjectNotFoundException(model='Profile')

        if request.method == 'GET':
            data = {
                
                "answers": [
                    {
                        "question": 2229,
                        "answer_option": 14509
                    }
                ]
            
            }
                
    

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
                    .prefetch_related('user_participations')
                    .first()
                )
            
            if not poll:
                raise ObjectNotFoundException(model='Poll')


            if poll.has_user_participated_in(my_profile):
                if not poll.is_revote_allowed:
                    raise AccessDeniedException(detail="Вы уже принимали участие в этом опросе.")
                else:
                    to_delete = PollAnswerGroup.objects.filter(
                        Q(poll=poll) & Q(profile=my_profile)      
                    ).first()
                    if to_delete:
                        to_delete.delete()
                    to_delete = PollParticipantsGroup.objects.filter(
                        Q(poll=poll) & Q(profile=my_profile)      
                    ).first()
                    if to_delete:
                        to_delete.delete()

            
                        
            answers = data.get('answers', None)
            if not answers:
                raise MissingFieldException(field_name='answers')
            
            # валидация и парсинг ответов
            if poll.poll_type.name == 'Опрос':
                answers, _ = poll_voting_handler(answers, poll)
            elif poll.poll_type.name == 'Викторина':
                answers = quizz_voting_handler(answers, poll)
            else:
                raise MyCustomException(detail="Данного типа опроса не существует")


            poll_answer_group, answers, tx_hash = save_votes(answers, poll, my_profile, _)

        
            if tx_hash:
                poll_answer_group.tx_hash = str(tx_hash)
                poll_answer_group.save()

            my_answer = PollAnswerGroup.objects.filter(
                    Q(profile=my_profile) & Q(poll__poll_id=poll_id)
                ).select_related('profile').prefetch_related('answers').first()

            if not my_answer:
                raise ObjectNotFoundException(model='PollAnswerGroup')
            
            my_answer.poll = poll

            serializer = PollVotingResultSerializer(my_answer)
                      
            return Response({'message':"Вы успешно проголосовали", 'data':serializer.data}, status=status.HTTP_200_OK)

        elif request.method == 'GET':
            poll_id = request.GET.get('poll_id', None)

            if not poll_id:
                raise MissingParameterException(field_name='poll_id')
           
            poll = (
                Poll.objects
                    .filter(Q(author=my_profile) and Q(poll_id=poll_id))
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
    
    # except APIException as api_exception:
    #     return Response({'message':f"{api_exception}"}, api_exception.status_code)

    # except Exception as ex:
    #     return Response({'message':f"Внутренняя ошибка сервера в poll_voting: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  


@api_view(['GET'])
@transaction.atomic
def my_poll_stats_test(request):
    # try:
        current_user = request.user
        my_profile = Profile.objects.filter(user_id=1).first()

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
            poll_members_quantity = (
                PollAnswerGroup.objects.filter(poll__poll_id=poll_id).count()
            )

            poll_user_answers = (
                PollAnswer.objects
                .filter(poll_answer_group__poll=poll)
                .select_related('question', 'answer_option', 'poll_answer_group__profile')
            )

            possible_question_points_count = (
                AnswerOption.objects
                .filter(question__poll=poll)
                .values('question_id')
                .annotate(
                    correct_options_quantity=Sum(
                        Case(
                            When(is_correct=True, then=1),
                            default=0,
                            output_field=models.IntegerField()
                        )
                    )
                )
            )
  
            question_statistics = (
                poll_user_answers
                .filter(poll_answer_group__poll=poll)
                .values('poll_answer_group__profile', 'question_id')
                .annotate(
                    quantity=Count('poll_answer_group__profile', distinct=True),
                    correct_answers_quantity = Count(Case(
                        When(points=1, then=1),
                        default=0
                    )),
                    incorrect_answers_quantity=Count(Case(
                        When(points=0, then=1),
                        default=None
                    )),
                    possible_question_points_count=Subquery(
                        possible_question_points_count.filter(question_id=OuterRef('question_id'))
                                                              .values('correct_options_quantity')[:1]
                    ),
                    correct_percentage=ExpressionWrapper(
                        100 * (F('correct_answers_quantity') - F('incorrect_answers_quantity')) 
                        / F('possible_question_points_count'),
                        output_field=FloatField()
                    ),
                )
            ) 
            # print(question_statistics)

            questions_percentage = (
                question_statistics
                .values('question_id')
                .annotate(
                    answers_quantity=Count('poll_answer_group__profile', distinct=True),
                    answer_percentage=F('answers_quantity') / Value(poll_members_quantity) * 100,
                    correct_percentage=ExpressionWrapper((F('correct_percentage') / F('answers_quantity')),
                        output_field=FloatField()
                    ),
                )
            )  
            # print(questions_percentage)


            poll_statistics = (
                questions_percentage
                .aggregate(
                    total_questions=Count('question_id'),
                    total_participants=Max('answers_quantity'),
                    average_correct_percentage=Coalesce(
                        Sum('correct_percentage') / Count('question_id'),
                        Value(0),
                        output_field=FloatField()
                    ),
                )
            )
            # print(poll_statistics)

            options_answers_count = (
                poll_user_answers
                .filter(poll_answer_group__poll=poll)
                .values('answer_option')
                .annotate(
                    quantity=Count('id'),
                    # choosing_percentage=F('quantity') / OuterRef(),
                )
            )

            free_answers = (
                poll_user_answers
                .filter(
                    poll_answer_group__poll__poll_id=poll_id,
                    text__isnull=False
                )
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
                'questions_percentage': questions_percentage,
                'options_answers_count': options_answers_count,
                'free_answers': free_answers
            }


            stats = PollStatsSerializer(poll, context=context)
            return Response(stats.data)



    # except APIException as api_exception:
    #     return Response({'message': f"{api_exception}"}, api_exception.status_code)

    # except Exception as ex:
    #     return Response({'message': f"Внутренняя ошибка сервера в my_poll_stats: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
@transaction.atomic
def poll_answer_group_test(request):
    data = request.data.copy()

    my_profile = Profile.objects.filter(user__id=1).first()

    poll_id = request.GET.get('poll_id', None)
    if not poll_id:
        raise MissingParameterException(field_name='poll_id')
    
    poll = (
        Poll.objects.filter(poll_id=poll_id)
        .select_related('author', 'poll_type', 'author__user')
        .select_related('poll_setts')
        .first()
    )
    
    if not poll:
        raise ObjectNotFoundException(model='Poll')

    opened_for_voting = poll.opened_for_voting
    if not opened_for_voting[0]:
        raise AccessDeniedException(detail=f'Опрос еще не открылся для прохождения, до начала: {opened_for_voting[1]}')

    time_left = poll.time_left
    if time_left:
        time_left = time_left[1]

        if time_left == 0:
            raise AccessDeniedException(detail='Время голосования истекло.')


    my_answer = (
        PollAnswerGroup.objects
            .filter(Q(profile=my_profile) & Q(poll__poll_id=poll_id))
            .last()
    )
    if my_answer:
        if not poll.is_revote_allowed:
            if not my_answer.answers.all():
                raise ObjectAlreadyExistsException(detail='У Вас уже имеется незавершенное прохождение опроса')
        else:
            PollAnswerGroup.objects.filter(
                Q(poll=poll) & Q(profile=my_profile)      
            ).delete()
            PollParticipantsGroup.objects.filter(
                Q(poll=poll) & Q(profile=my_profile)      
            ).delete()
    
    

    data['profile'] = my_profile
    data['poll'] = poll.id
    poll_answer_group = PollAnswerGroupSerializer(data=data)
    poll_partic_group = PollParticipantsGroupSerializer(data=data)

    if poll_answer_group.is_valid():
        poll_answer_group.save()
        if poll_partic_group.is_valid():
            poll_partic_group.save()

        # return Response('ok')

        poll_answer_group = (
            PollAnswerGroup.objects.filter(Q(poll=poll) & Q(profile=my_profile))
                .prefetch_related('answers')
                .first()
        )
        poll_answer_group.poll = poll
        poll_answer_group.profile = my_profile
        poll_answer_group = PollAnswerGroupSerializer(poll_answer_group)
        return Response({'message':"Вы успешно начали голосование.", 'data':poll_answer_group.data},
                                                                            status=status.HTTP_201_CREATED)
    else:
        return Response(poll_answer_group.errors, status=status.HTTP_400_BAD_REQUEST)


# from abc import ABC, abstractmethod
# from rest_framework import generics

# class MyCustomApiView(generics.ListCreateAPIView, ABC):
#     @property
#     @abstractmethod
#     def basic_model(self):
#         pass

#     def get_basic_model(self):
#         return self.basic_model

#     @classmethod
#     def __get_base_queryset(cls, Model, **kwargs):
#         return Model.objects.filter(**kwargs)

#     def queryset(self, **kwargs):
#         model = self.get_basic_model()
#         return self.__get_base_queryset(model, **kwargs)
    
#     def get(self, request, *args, **kwargs):
#         return super().get(request, *args, **kwargs)

# class MyCustomApi(MyCustomApiView):
#     basic_model = Poll
#     serializer_class = PollSerializer
#     request = request


# @api_view(['GET'])
# @transaction.atomic
# def test(request):
#     test = MyCustomApi()
#     print(test.queryset(poll_type__name='Опрос'))
#     print(test.get(request, poll_type__name='Опрос'))

#     return Response('ok')
