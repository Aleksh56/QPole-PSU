import qrcode
import base64
from io import BytesIO
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django_otp.oath import TOTP
from django_otp.util import random_hex

def generate_qr_code(user):
    # Генерация секретного ключа (вам возможно потребуется сохранить его для пользователя)
    secret_key = bytes.fromhex(random_hex(20))  # Преобразование в байты
    # Создание экземпляра TOTP
    totp_instance = TOTP(key=secret_key, step=30)
    # Получение TOTP URI
    uri = "otpauth://totp/{issuer}:{name}?secret={secret}&issuer={issuer}".format(
        issuer="example",  # Замените "example" на ваш домен или название вашего сервиса
        name=user.email,
        secret=secret_key.hex(),  # Преобразование байтов в шестнадцатеричную строку
    )

    # Создание QR-кода
    img = qrcode.make(uri)
    buffer = BytesIO()
    img.save(buffer, format="JPEG")
    return buffer.getvalue(), secret_key


@api_view(['GET'])
def qr_code_view(request):
    qr_code_bytes, secret_key = generate_qr_code(request.user)
    qr_code_base64 = base64.b64encode(qr_code_bytes).decode('utf-8')
    return Response({'qr_code': qr_code_base64, 'secret_key': secret_key.hex()})  # Преобразование ключа обратно в строку для передачи в ответе
