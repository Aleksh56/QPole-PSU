from .exсeptions import *


def pollvoting(answers, poll, my_profile_id):
    seen_questions = []
    poll_questions_count = len(poll.questions.all())
    answered_questions_count = []
    unique_answers = []
    unique_answer_options = []

    for answer in answers:
        question_id = answer.get('question', None)
        answered_questions_count.append(question_id)
        if not question_id:
            raise MissingFieldException(field_name='question')
        
        answer_option_id = answer.get('answer_option', None)
        if not answer_option_id:
            raise MissingFieldException(field_name='answer_option')
        
        question = poll.questions.filter(id=question_id).first()  
        if not question:
            raise ObjectNotFoundException(model='PollQuestion')
        answer_option = question.answer_options.filter(id=answer_option_id).first()  
        if not answer_option:
            raise ObjectNotFoundException(model='AnswerOption')
        

        question_id = answer['question']
        answer_option_id = answer['answer_option']
        
        # Проверяем, был ли уже такой вопрос в списке ответов
        if not poll.has_multiple_choices:
            if question_id not in seen_questions:   
                answer['profile'] = my_profile_id
                unique_answers.append(answer)
                seen_questions.append(question_id)
                unique_answer_options.append(answer_option_id)
            else:
                raise PollAnsweringException(detail=f"Дано два ответа на один вопрос: №{answer['question']}")
        else:
            answer['profile'] = my_profile_id
            unique_answers.append(answer)
            seen_questions.append(question_id)
            unique_answer_options.append(answer_option_id)

            
    answered_questions_count = len(answered_questions_count)
    if answered_questions_count < poll_questions_count:
        raise PollAnsweringException(detail=f"Количество ответов меньше количества вопросов: {answered_questions_count} vs {poll_questions_count}")
    
    # if not unique_answer_options == list(set(unique_answer_options)):
    #     raise PollAnsweringException(detail=f"Один вариант ответа был выбран несколько раз")
    
    return unique_answers

