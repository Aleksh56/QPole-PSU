import imghdr
from .exсeptions import MissingFieldException, ObjectNotFoundException

def check_file(file):
    file_type = imghdr.what(file)
    if not file_type:
        return False, "Неподдерживаемый формат файла."
    
    # Проверяем, является ли файл изображением
    if file_type not in ['jpeg', 'png', 'gif', 'bmp', 'pdf']:
        return False, "Неподдерживаемый формат файла."

    # Проверяем размер файла
    if file.size > 100 * 1024 * 1024: 
        return False, "Первышен допустимый размер файла."

    return True, "ОК"

from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.exceptions import APIException

def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)

    # if response is not None:
    #     if isinstance(exc, APIException):
    #         response.data['message'] = response.data.pop('detail', None)
    return response


from copy import deepcopy
from django.db import transaction

def clone_poll(poll, new_poll_id):
    cloned_poll = deepcopy(poll)
    cloned_poll.id = None
    cloned_poll.poll_id = new_poll_id
    if cloned_poll.name:
        cloned_poll.name = cloned_poll.name + " (копия)"
    cloned_poll.save()
    
    for question in poll.questions.all():
        new_question = deepcopy(question)
        new_question.id = None
        new_question.save()

        cloned_poll.questions.add(new_question)

        for answer_option in question.answer_options.all():
            new_answer_option = deepcopy(answer_option)
            new_answer_option.id = None
            new_answer_option.save()
            new_question.answer_options.add(new_answer_option)

    return cloned_poll


def clone_question(question, poll):
    cloned_question = deepcopy(question)
    cloned_question.id = None
    if cloned_question.name:
        cloned_question.name = cloned_question.name + " (копия)"
    cloned_question.save()
    

    for answer_option in question.answer_options.all():
        new_answer_option = deepcopy(answer_option)
        new_answer_option.id = None
        new_answer_option.save()
        cloned_question.answer_options.add(new_answer_option)

    poll.questions.add(cloned_question)
    return cloned_question


def process_answers(answers, poll, my_profile_id):
    seen_questions = set()
    unique_answers = []

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
        answer_option = question.answer_options.filter(id=answer_option_id).first()  
        if not answer_option:
            raise ObjectNotFoundException(model='AnswerOption')
        

        question_id = answer['question']
        
        # Проверяем, был ли уже такой вопрос в списке ответов
        if question_id not in seen_questions:
            answer['profile'] = my_profile_id
            unique_answers.append(answer)
            seen_questions.add(question_id)
        else:
            raise ValueError("Дано два ответа на один вопрос: {}".format(answer))

    return unique_answers
