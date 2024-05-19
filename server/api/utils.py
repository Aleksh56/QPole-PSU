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

from copy import deepcopy


from django.db import transaction
from .models import Poll, PollQuestion, AnswerOption


def clone_poll(poll, new_poll_id):
    with transaction.atomic():

        cloned_poll = deepcopy(poll)
        cloned_poll.id = None
        cloned_poll.image = None
        cloned_poll.poll_id = new_poll_id
        cloned_poll.is_in_production = False
        if cloned_poll.name:
            cloned_poll.name = cloned_poll.name + " (копия)"

        cloned_poll_setts = deepcopy(poll.poll_setts)
        cloned_poll_setts.id = None
        cloned_poll_setts.save()
        cloned_poll.poll_setts = cloned_poll_setts
        cloned_poll.save()
        
        new_questions = []
        for question in poll.questions.all():
            new_question = deepcopy(question)
            new_question.id = None
            new_question.image = None
            new_questions.append(new_question)

        # Bulk create новых вопросов
        cloned_poll.questions.add(*new_questions)
        new_questions = PollQuestion.objects.bulk_create(new_questions)
        
        
        cloned_poll = (
                    Poll.objects
                        .filter(poll_id=cloned_poll.poll_id)
                        .prefetch_related('questions')
                        .first()
                )   
        answer_options_to_create = []
        cloned_poll_questions = cloned_poll.questions.all()
        for i, question in enumerate(poll.questions.all(), 0):
            new_question = cloned_poll_questions[i]

            answer_options_to_add = []
            for answer_option in question.answer_options.all():
                new_answer_option = deepcopy(answer_option)
                new_answer_option.id = None
                new_answer_option.image = None
                answer_options_to_create.append(new_answer_option)
                answer_options_to_add.append(new_answer_option)

            new_question.answer_options.add(*answer_options_to_add)
            
        answer_options_to_create = AnswerOption.objects.bulk_create(answer_options_to_create)

                
    return cloned_poll



def clone_question(question):
    cloned_question = deepcopy(question)
    cloned_question.id = None
    if cloned_question.name:
        cloned_question.name = cloned_question.name + " (копия)"
    cloned_question.image = None
    cloned_question.save()
    

    new_answer_options = []
    for answer_option in question.answer_options.all():
        new_answer_option = deepcopy(answer_option)
        new_answer_option.id = None
        new_answer_option.image = None
        new_answer_options.append(new_answer_option)

    cloned_question.answer_options.add(*new_answer_options)
            
    new_answer_options = AnswerOption.objects.bulk_create(new_answer_options)
    return cloned_question


from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from qrcode import QRCode, constants
from qpoll.settings import SERVER_URL


def generate_poll_qr(poll):
    # Генерация QR-кода на основе poll_id
        qr = QRCode(
            version=1,
            error_correction=constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        if poll.poll_type.name in ['Опрос', 'Викторина', 'Анонимный']:
            qr.add_data(SERVER_URL + 'conduct-poll/'+ str(poll.poll_id))
        elif poll.poll_type.name in ['Быстрый']:
            qr.add_data(SERVER_URL + 'quick-conduct-poll/'+ str(poll.poll_id))

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


from base64 import b64encode

def get_qrcode_img_bytes(qrcode_path):
    with open(qrcode_path, 'rb') as f:
        qr_image_bytes = f.read()
        
        qr_image_base64 = b64encode(qr_image_bytes).decode()
        return qr_image_base64


from rest_framework.pagination import PageNumberPagination

def get_paginated_response(request, objects, serializer, context=None):
    paginator = PageNumberPagination()
    paginator.page_size = int(request.GET.get('page_size', 10))
    page = int(request.GET.get('page', 1))
    objects = paginator.paginate_queryset(objects, request)
    paginator.page.number = page
    total_items = paginator.page.paginator.count
    total_pages = paginator.page.paginator.num_pages

    if not context:
        serializer = serializer(objects, many=True)
    else:
        serializer = serializer(objects, many=True, context=context)

    pagination_data = {
        'total_items': total_items,
        'total_pages': total_pages,
        'results': serializer.data 
    }
    return pagination_data


def is_web3_connected(w3):
    if w3.is_connected():
        w3.eth.contract()
        return True
    else:
        return False



def createPoll(w3, contract, poll_data):
    try:
        accounts = w3.eth.accounts

        poll_id = poll_data['poll_id']
        poll_type = poll_data['poll_type']

        contract.functions.createPoll(poll_id, poll_type).transact({
                'from': accounts[0],
                'gasPrice': "20000000000",
                'gas': "210000"
            })
        
        # polls = contract.functions.getAllPolls().call()
        # print("Available Polls:", polls)

        return True
    
    except Exception as ex:
        print(ex)
        return False


def addQuestionToPoll(w3, contract, poll_data):
    try:
        accounts = w3.eth.accounts

        poll_id = poll_data['poll_id']
        question_id = int(poll_data['question_id'])

        contract.functions.addQuestionToPoll(poll_id, question_id).transact({
                'from': accounts[0],
                'gasPrice': "20000000000",
                'gas': "210000"
            })
        
        polls = contract.functions.getAllPolls().call()
        print("Available Polls:", polls)

        return True
    
    except Exception as ex:
        print(ex)
        return False
    

def addAnswerToQuestion(w3, contract, poll_data):
    try:
        accounts = w3.eth.accounts

        poll_id = poll_data['poll_id']
        question_id = int(poll_data['question_id'])
        option_id = int(poll_data['option_id'])


        contract.functions.addAnswerToQuestion(poll_id, question_id, option_id).transact({
                'from': accounts[0],
                'gasPrice': "20000000000",
                'gas': "210000"
            })
        
        # polls = contract.functions.getAllPolls().call()
        # print("Available Polls:", polls)

        return True
    
    except Exception as ex:
        return False
    

def PollVoting(w3, contract, poll_data):
    try:
        accounts = w3.eth.accounts

        poll_id = poll_data['poll_id']
        answers = poll_data['answers']

        tx_hash = contract.functions.vote(poll_id, answers).transact({
                'from': accounts[0],
                'gasPrice': "20000000000",
                'gas': "210000"
            })
        
        # receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

        # tx_hash_str = tx_hash.hex()

        # polls = contract.functions.getAllPolls().call()

        return tx_hash
    
    except Exception as ex:
        return False



def serializer_errors_wrapper(errors):
    try:
        all_errors = errors.items()
        if isinstance(all_errors, list):
            data = []
            for error in list(all_errors):
                data.append({
                    'field': error[0],
                    'error': error[1][0],
                })
            return data
        else:
            all_errors =  list(all_errors)
            data = {
                'field': all_errors[0][0],
                'error': all_errors[0][1][0]
            }
            return data
        
    except Exception:
        return errors
    
from .exсeptions import MissingFieldException, MissingParameterException, ObjectNotFoundException, AccessDeniedException

def get_data_or_400(data, data_field_name):
    data_field = data.get(data_field_name, None)
    if not data_field:
        raise MissingFieldException(data_field_name)
    
    return data_field

def get_parameter_or_400(request_get, parameter_field_name):
    parameter_field = request_get.get(parameter_field_name, None)
    if not parameter_field:
        raise MissingParameterException(parameter_field_name)
    
    return parameter_field


def get_object_or_404(model, **kwargs):
    object = model.objects.filter(**kwargs).first()
    if not object:
        raise ObjectNotFoundException(model.__name__)
    
    return object
    

def get_object_from_object_or_404(main_object, **kwargs):
    object = main_object.filter(**kwargs).first()
    if not object:
        raise ObjectNotFoundException(detail=f"Связанный объект из объекта '{main_object}' не найден.")
    
    return object

def get_profile_to_context(my_profile=None):
    if my_profile:
        context = {'profile': my_profile}
    else:
        context = None

    return context

def is_serializer_valid(serializer):
    if serializer.is_valid():
        serializer.save()
        return True, serializer.data
    else:
        data = serializer_errors_wrapper(serializer.errors)
        return False, data

from django.db.models import Q
from .models import PollAnswerGroup, PollParticipantsGroup

def unmake_last_answer_latest(poll, my_profile):
    to_ummake_latest = PollAnswerGroup.objects.filter(
                        Q(poll=poll) & Q(profile=my_profile) & Q(is_latest=True)
                    ).first()
    if to_ummake_latest:
        to_ummake_latest.is_latest = False
        to_ummake_latest.save()
    to_ummake_latest = PollParticipantsGroup.objects.filter(
        Q(poll=poll) & Q(profile=my_profile) & Q(is_latest=True) 
    ).first()
    if to_ummake_latest:
        to_ummake_latest.is_latest = False
        to_ummake_latest.save()

def has_user_participated_in_poll_too_many_times(poll, my_profile):
    poll_max_revotes_quantity = poll.poll_setts.max_revotes_quantity
    if not poll_max_revotes_quantity == 0:
        return poll.user_participations.filter(profile=my_profile).count() >= poll_max_revotes_quantity
    elif poll_max_revotes_quantity == None:
        return False
    else:
        return True


        
        
def check_if_user_is_allowed_to_vote(poll, user_profile):
    if not poll.opened_for_voting:
        raise AccessDeniedException(detail='Голосование еще не началось или уже завершилось')

    if poll.is_registration_demanded and not poll.is_user_registrated(user_profile):
        raise AccessDeniedException(detail='Вы еще не зарегистрировались на опрос')

    allowed_groups = poll.allowed_groups.all()
    if allowed_groups:
        if not user_profile.group in allowed_groups:
            raise AccessDeniedException(detail='Вы не принадлежите группе, которая может проходить данный опрос.')

    if poll.has_user_participated_in(user_profile):
        if not poll.is_revote_allowed:
            raise AccessDeniedException(detail="Вы уже принимали участие в этом опросе.")
        if has_user_participated_in_poll_too_many_times(poll, user_profile):
            raise AccessDeniedException(detail="Вы достигли предела максимального количества прохождений опроса.")
        
    return True


from .models import PollAuthFieldAnswer, PollAuthField
from .exсeptions import MyCustomException

def validate_auth_data(auth_data, poll, quick_voting_form):
    new_auth_fields = []
    required_auth_fields = set(auth_field.id for auth_field in poll.auth_fields.all() if auth_field.is_required)

    for auth_field_data in auth_data:
        auth_field_data['poll'] = poll
        auth_field_data['quick_voting_form'] = quick_voting_form
        auth_field_id = auth_field_data.get('auth_field')
        auth_field_instance = next((auth_field for auth_field in poll.auth_fields.all() if auth_field.id == auth_field_id), None)
        
        auth_field_data['auth_field'] = auth_field_instance
        new_auth_field = PollAuthFieldAnswer(**auth_field_data)
        new_auth_fields.append(new_auth_field)

    new_auth_field_ids = set(auth_field.auth_field.id for auth_field in new_auth_fields if not auth_field.answer == None)
    if not required_auth_fields.issubset(new_auth_field_ids):
        difference = list(required_auth_fields.difference(new_auth_field_ids))
        raise MyCustomException(detail=f'Были переданы не все обяательные поля индентификации: {difference}')

    
    return new_auth_fields


