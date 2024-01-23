# utils.py
import random
import string
from django.core.mail import send_mail
from django.core.cache import cache
from django.contrib.auth.models import User

from qpoll.settings import DEFAULT_FROM_EMAIL

def generate_random_code():
    return ''.join(random.choices(string.digits, k=6))


def send_reset_code_email(email, code):
    subject = 'Код для восстановления пароля'
    message = f'Ваш код восстановления: {code}'
    from_email = DEFAULT_FROM_EMAIL 
    recipient_list = [email]

    send_mail(subject, message, from_email, recipient_list)


def store_reset_code_in_cache(email, code):
    cache_key = f'reset_code:{email}'
    cache.set(cache_key, code, timeout=300)  # Код действителен в течение 5 минут (300 секунд)


def reset_password_with_code(email, code:int, new_password):
    cache_key = f'reset_code:{email}'
    stored_code = int(cache.get(cache_key))

    if stored_code and stored_code == code:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        return True
    else:
        return False
