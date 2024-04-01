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


def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)

    # if response is not None:
    #     if isinstance(exc, APIException):
    #         response.data['message'] = response.data.pop('detail', None)
    return response


from copy import deepcopy


def clone_poll(poll, new_poll_id):
    cloned_poll = deepcopy(poll)
    cloned_poll.id = None
    cloned_poll.image = None
    cloned_poll.poll_id = new_poll_id
    if cloned_poll.name:
        cloned_poll.name = cloned_poll.name + " (копия)"
    cloned_poll.save()
    
    for question in poll.questions.all():
        new_question = deepcopy(question)
        new_question.id = None
        new_question.image = None
        new_question.save()

        cloned_poll.questions.add(new_question)

        for answer_option in question.answer_options.all():
            new_answer_option = deepcopy(answer_option)
            new_answer_option.id = None
            new_answer_option.image = None
            new_answer_option.save()
            new_question.answer_options.add(new_answer_option)

    return cloned_poll


def clone_question(question, poll):
    cloned_question = deepcopy(question)
    cloned_question.id = None
    if cloned_question.name:
        cloned_question.name = cloned_question.name + " (копия)"
    cloned_question.image = None
    cloned_question.save()
    

    for answer_option in question.answer_options.all():
        new_answer_option = deepcopy(answer_option)
        new_answer_option.id = None
        new_answer_option.image = None
        new_answer_option.save()
        cloned_question.answer_options.add(new_answer_option)

    poll.questions.add(cloned_question)
    return cloned_question


def validation_error_wrapper(errors):
    error_messages = [str(error[0]) for error in errors.values()]
    error_messages = dict(enumerate(error_messages, 1))

    return error_messages

from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import qrcode
from qpoll.settings import SERVER_URL


def generate_poll_qr(poll):
    # Генерация QR-кода на основе poll_id
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(SERVER_URL + str(poll.poll_id))
        qr.make(fit=True)
        
        # Создание изображения QR-кода
        qr_image = qr.make_image(fill_color="black", back_color="white")
        
        # Сохранение изображения в памяти
        qr_image_buffer = BytesIO()
        qr_image.save(qr_image_buffer, format="PNG")
        
        # Создание объекта InMemoryUploadedFile для изображения QR-кода
        qr_image_file = InMemoryUploadedFile(
            qr_image_buffer,
            None,
            f'qrcode_poll_{poll.poll_id}.png',
            'image/png',
            qr_image.tell,
            None
        )
        
        # Сохранение изображения QR-кода в поле qrcode
        poll.qrcode.save(f'qrcode_poll_{poll.poll_id}.png', qr_image_file)
        
        return poll


import base64

def get_qrcode_img_bytes(qrcode_path):
    with open(qrcode_path, 'rb') as f:
        qr_image_bytes = f.read()
        
        qr_image_base64 = base64.b64encode(qr_image_bytes).decode()
        return qr_image_base64


