from .exсeptions import *


def poll_voting_handler(answers, poll):
    required_questions = {question for question in poll.questions.all() if question.is_required}
    answered_questions = set()

    parsed_answers = []
    
    questions_with_answer_options = poll.questions.prefetch_related('answer_options')
    
    for answer in answers:
        question_id = answer.get('question', None)
        if not question_id:
            raise MissingFieldException(field_name='question')
        
        answer_option_id = answer.get('answer_option', None)
        if not answer_option_id:
            raise MissingFieldException(field_name='answer_option')

        question = next((q for q in questions_with_answer_options if q.id == question_id), None)
        
        if not question:
            raise ObjectNotFoundException(model='PollQuestion')
              
        if isinstance(answer_option_id, list):
            answer_option_ids = answer_option_id
            
            if not question.has_multiple_choices:
                raise PollAnsweringException(detail=f"{question} не поддерживает множественный выбор ответов")
            else:
                answer_options = [option for option in question.answer_options.all() if option.id in answer_option_ids]
                if len(answer_options) != len(answer_option_ids):
                    raise ObjectNotFoundException(model='AnswerOption')
                    
                for answer_option in answer_options:
                    parsed_answers.append({'question': question_id, 'answer_option': answer_option.id})
                answered_questions.add(question)
        else:
            answer_option = next((option for option in question.answer_options.all() if option.id == answer_option_id), None)
            if not answer_option:
                raise ObjectNotFoundException(model='AnswerOption')
            
            if answer_option.is_free_response:
                text = answer.get('text', None)
                if not text:
                    raise PollAnsweringException(detail=f"Поле со свободным ответом должно содержать текст ответа")
                parsed_answers.append({'question': question_id, 'answer_option': answer_option_id, 'text': text})
            else:
                parsed_answers.append({'question': question_id, 'answer_option': answer_option_id})
        
            answered_questions.add(question)

    if not required_questions.issubset(answered_questions):
        difference = list(required_questions.difference(answered_questions))
        raise PollAnsweringException(detail=f"Вы ответили не на все обязательные вопросы: {difference}")

    return parsed_answers


def quizz_voting_handler(answers, poll):
    required_questions = {question for question in poll.questions.all() if question.is_required}
    answered_questions = set()

    parsed_answers = []
    
    questions_with_answer_options = poll.questions.prefetch_related('answer_options')
    
    for answer in answers:
        question_id = answer.get('question', None)
        if not question_id:
            raise MissingFieldException(field_name='question')
        
        answer_option_id = answer.get('answer_option', None)
        if not answer_option_id:
            raise MissingFieldException(field_name='answer_option')

        question = next((q for q in questions_with_answer_options if q.id == question_id), None)
        
        if not question:
            raise ObjectNotFoundException(model='PollQuestion')
              
        if isinstance(answer_option_id, list):
            answer_option_ids = answer_option_id
            
            if not question.has_multiple_choices:
                raise PollAnsweringException(detail=f"{question} не поддерживает множественный выбор ответов")
            else:
                answer_options = [option for option in question.answer_options.all() if option.id in answer_option_ids]
                if len(answer_options) != len(answer_option_ids):
                    raise ObjectNotFoundException(model='AnswerOption')
                    
                for answer_option in answer_options:
                    parsed_answers.append({'question': question_id, 'answer_option': answer_option.id})
                answered_questions.add(question)
        else:
            answer_option = next((option for option in question.answer_options.all() if option.id == answer_option_id), None)
            if not answer_option:
                raise ObjectNotFoundException(model='AnswerOption')

            parsed_answers.append({'question': question_id, 'answer_option': answer_option_id})
        
            answered_questions.add(question)

    if not required_questions.issubset(answered_questions):
        difference = list(required_questions.difference(answered_questions))
        raise PollAnsweringException(detail=f"Вы ответили не на все обязательные вопросы: {difference}")

    return parsed_answers
