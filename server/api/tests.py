from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q, Prefetch
from django.db.models import Count, Case, When, F, ExpressionWrapper, FloatField
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
        my_profile = Profile.objects.filter(user_id=1).first()

        if not my_profile:
            raise ObjectNotFoundException(model='Profile')

        if request.method == '5555':
            data = {
                    "answers": [
                        {
                            "question":1700,
                            "answer_option": 10584
                        },
                        {
                            "question":1701,
                            "answer_option": 10586

                        },
                        {
                            "question":1702,
                            "answer_option": 10588

                        },
                        {
                            "question":1703,
                            "answer_option": 10590

                        },
                        {
                            "question":1704,
                            "answer_option": 10592

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
                    .first()
                )
            
            if not poll:
                raise ObjectNotFoundException(model='Poll')


            if poll.has_user_participated_in(my_profile):
                if not poll.is_revote_allowed:
                    raise AccessDeniedException(detail="Вы уже принимали участие в этом опросе.")
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

            poll_answer_group_data = {
                'profile': my_profile.user_id,
                'poll': poll.id,
            }

            poll_answer_group = PollAnswerGroupSerializer(data=poll_answer_group_data)
            if poll_answer_group.is_valid():
                poll_answer_group = poll_answer_group.save()
            else:
                return Response(poll_answer_group.errors, status=status.HTTP_400_BAD_REQUEST)
            

            data = answers
            # Получите все вопросы в один запрос
            questions_dict = {question.id: question for question in poll.questions.all()}

            # Получите все варианты ответов в один запрос
            answer_options_dict = {
                question.id: {answer_option.id: answer_option for answer_option in question.answer_options.all()}
                for question in poll.questions.all()
            }

            for answer in data:
                answer['poll_answer_group'] = poll_answer_group
                question_id = answer['question']
                question = questions_dict.get(question_id)
                if question:
                    answer['question'] = question
                    answer_option_id = answer['answer_option']
                    answer_option = answer_options_dict.get(question_id, {}).get(answer_option_id)

                    if poll.poll_type.name == 'Викторина':
                        if not answer_option.is_correct == None:
                            if answer_option.is_correct:
                                answer['is_correct'] = True
                            else:
                                answer['is_correct'] = False

                    answer['answer_option'] = answer_option

            poll_answers = PollAnswer.objects.bulk_create([
                PollAnswer(**item) for item in data
            ])
            serializer = PollAnswerGroupSerializer(poll_answer_group)
        
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

            poll_statistics = (
                PollAnswer.objects
                .filter(poll_answer_group__poll=poll)
                .values('poll_answer_group__poll__poll_id')
                .annotate(
                    total_answers=Count('id'),
                    correct_answers=Count(Case(When(is_correct=True, then=1))),
                    correct_percentage=ExpressionWrapper(
                        100 * F('correct_answers') / F('total_answers'),
                        output_field=FloatField()
                    )
                )
            )

            question_statistics = (
                PollAnswer.objects
                .filter(poll_answer_group__poll=poll)
                .values('question_id')
                .annotate(
                    quantity=Count('id'),
                    correct_quantity=Count(Case(When(is_correct=True, then=1))),
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

            free_answers = PollAnswer.objects.filter(
                poll_answer_group__poll__poll_id=poll_id,
                text__isnull=False
            ).values('text', 'question_id')


            context = {
                'poll_statistics': poll_statistics,
                'question_statistics': question_statistics,
                'options_answers_count': options_answers_count,
                'free_answers': free_answers
            }


            stats = PollStatsSerializer(poll, context=context)
            return Response(stats.data)



    # except APIException as api_exception:
    #     return Response({'message': f"{api_exception}"}, api_exception.status_code)

    # except Exception as ex:
    #     return Response({'message': f"Внутренняя ошибка сервера в my_poll_stats: {ex}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

