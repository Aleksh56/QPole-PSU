import imghdr

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

    if response is not None:
        if isinstance(exc, APIException):
            response.data['message'] = response.data.pop('detail', None)
    return response


from copy import deepcopy
from django.db import transaction

def clone_poll(poll, new_poll_id):
    cloned_poll = deepcopy(poll)
    cloned_poll.id = None
    cloned_poll.poll_id = new_poll_id
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


def clone_question(question):
    cloned_question = deepcopy(question)
    cloned_question.id = None
    cloned_question.name = cloned_question.name + " (копия)"
    cloned_question.save()
    

    for answer_option in question.answer_options.all():
        new_answer_option = deepcopy(answer_option)
        new_answer_option.id = None
        new_answer_option.save()
        cloned_question.answer_options.add(new_answer_option)

    return cloned_question