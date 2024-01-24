# utils.py
import random
import string
import secrets
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

def get_reset_code_from_cache(email):
    cache_key = f'reset_token:{email}'
    return cache.get(cache_key)


def reset_password_after_code_validation(email, new_password):
    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        return True
    except Exception:
        return False
    

def generate_random_token(length=32):
    characters = string.ascii_letters + string.digits

    random_token = ''.join(secrets.choice(characters) for _ in range(length))

    return random_token
