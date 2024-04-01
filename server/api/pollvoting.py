from .exсeptions import *


def basic_poll_voting(answers, poll):
    asked_questions = {question for question in poll.questions.all() if question.is_required}
    answered_questions = set()

    parsed_answers = []
    for answer in answers:
        question_id = answer.get('question', None)
        if not question_id:
            raise MissingFieldException(field_name='question')
        
        answer_option_id = answer.get('answer_option', None)
        if not answer_option_id:
            raise MissingFieldException(field_name='answer_option')

        question = poll.questions.filter(id=question_id).first()  
        if not question:
            raise ObjectNotFoundException(model='PollQuestion')
              
        # проверка на то, что предоставлен ответ с множестенным выбором ответа    
        if isinstance(answer_option_id, list):
            answer_option_ids = answer_option_id
            # проверка на поддерку множестенного выбора ответа
            if not question.has_multiple_choices:
                raise PollAnsweringException(detail=f"{question} не поддерживает множественный выбор ответов")
            else:
                # проверка наличия таких вариантов ответа
                answer_options = question.answer_options.filter(id__in=answer_option_ids)
                for answer_option in answer_options:
                    if not answer_option:
                        raise ObjectNotFoundException(model='AnswerOption')
                    
                # разделение множественного выбора на отдельные ответы
                for answer_option_id in answer_option_ids:
                    parsed_answers.append({'question':question_id, 'answer_option':answer_option_id})

                # добавление ответа с набор отвеченных вопросов
                answered_questions.add(question)
        else: # если нет, то проверяем наличие такого варианта ответа
            answer_option = question.answer_options.filter(id=answer_option_id).first()  
            if not answer_option:
                raise ObjectNotFoundException(model='AnswerOption')
            
            if answer_option.is_free_response:
                text = answer.get('text', None)
                if not text:
                    raise PollAnsweringException(detail=f"Поле со свободным ответом должно содержать текст ответа")
                parsed_answers.append({'question':question_id, 'answer_option':answer_option_id, 'text':text})
            else:
                parsed_answers.append({'question':question_id, 'answer_option':answer_option_id})
        
            # добавление ответа с набор отвеченных вопросов
            answered_questions.add(question)

    # проверка на то, что на все обязательнык вопросы были даны ответы
    if not asked_questions.issubset(answered_questions):
        difference = list(asked_questions.difference(answered_questions))
        raise PollAnsweringException(detail=f"Вы ответили не на все обязятельные вопросы: {difference}")

    return parsed_answers

