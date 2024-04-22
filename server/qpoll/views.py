import qrcode
import base64
from io import BytesIO
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django_otp.oath import TOTP
from django_otp.util import random_hex

from django_otp.plugins.otp_totp.models import TOTPDevice

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


def verify_user_totp(token, user):
    # Предположим, у пользователя уже настроено TOTP устройство
    device = user.totpdevice_set.first()  # Получаем TOTP устройство пользователя
    print(device)
    if device is not None:
        # Проверка OTP, отправленного пользователем
        verified = device.verify_token(token)
        if verified:
            return True
    return False

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model


User = get_user_model()

class VerifyTOTPView(APIView):
    permission_classes = [IsAuthenticated]  # Требуется аутентификация

    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        verified = verify_user_totp(token, user)
        
        if verified:
            return Response({'success': 'OTP verified successfully'})
        else:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

def create_totp_device(user, secret_key, name='default'):
    # Удалить существующие TOTP устройства для пользователя (опционально)
    TOTPDevice.objects.filter(user=user).delete()

    # Создать новое TOTP устройство для пользователя
    device = TOTPDevice.objects.create(
        user=user,
        name=name,
        key=secret_key,  # 16-40 символов в HEX
        step=30,         # Промежуток времени генерации токена (секунды)
        digits=6,        # Количество цифр в OTP
        tolerance=1,     # Допуск в количестве шагов
        drift=0,
        last_t=0,
    )
    return device


import json

from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from api.models import Poll


# from web3 import Web3
# from web3.datastructures import AttributeDict

# @api_view(['GET'])
# def test_api(request):

#     # Замените 'your-infura-project-id' на ваш Project ID от Infura
#     w3 = Web3(Web3.HTTPProvider('http://188.225.45.226:8545'))

#     # Убедитесь, что подключение установлено
#     if w3.is_connected():
#         w3.eth.contract()
#         print("Connected to Ethereum node")
#         # return Response("Connected to Ethereum node")
#     else:
#         print("Failed to connect to Ethereum node")
#         # return Response("Failed to connect to Ethereum node")

#     # Замените 'contract_abi' на ABI вашего контракта

#     contract_address = w3.to_checksum_address("0x846b142c1ac1d6a2d112a4417621b32428bf1ffd")
#     abi = '[{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"polls","outputs":[{"internalType":"string","name":"question","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"string","name":"question","type":"string"},{"internalType":"string[]","name":"options","type":"string[]"}],"name":"createPoll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"pollIndex","type":"uint256"},{"internalType":"uint256[]","name":"answerOptions","type":"uint256[]"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"pollIndex","type":"uint256"}],"name":"getPollResults","outputs":[{"internalType":"string","name":"question","type":"string"},{"internalType":"string[]","name":"options","type":"string[]"},{"internalType":"uint256[]","name":"votes","type":"uint256[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getAllPolls","outputs":[{"internalType":"string[]","name":"questions","type":"string[]"}],"stateMutability":"view","type":"function","constant":true}]'

#     contract = w3.eth.contract(address=contract_address, abi=abi)
#     question = "Какой ваш любимый цвет?"
#     options = ["Красный", "Синий", "Зеленый"]
    
#     try:
#       # Получение списка аккаунтов
#         accounts = w3.eth.accounts
#         print("Using account:", accounts[0])

#         # Выполнение транзакции через метод set
#         print("Sending set(555) transaction...")
#         # poll_index = 'b1a83779-89d1-4b02-8d24-7d61ee5da62b'
#         poll_index = 9
#         answers = [
#                 {
#                     "question": 1832,
#                     "answer_option": 10884
#                 },
#                 {
#                     "question": 1833,
#                     "answer_option": 10889,

#                 },
#                 {
#                     "question": 1834,
#                     "answer_option": 10890,

#                 }
#             ]
#         tx_hash = contract.functions.createPoll(question, options).transact({
#             'from': accounts[0],
#             'gasPrice': "20000000000",
#             'gas': "210000"
#         })
#         print(tx_hash)
#         # Получение квитанции транзакции
#         receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
#         print("Transaction receipt:", receipt)
#         tx_hash = contract.functions.getAllPolls().transact({
#             'from': accounts[0],
#             'gasPrice': "20000000000",
#             'gas': "210000"
#         })
#         print(tx_hash)

#         polls = contract.functions.getAllPolls().call()
#         print("Available Polls:", polls)

#     except Exception as e:
#         print("Error occurred:", e)


#     return Response('ok')
#     # print(contract.address)
#     # print(contract.abi)

#     # try:
#     #     stored_data = contract.functions.set(15).call()
#     #     print("Stored data from contract:", stored_data)
#     # except Exception as e:
#     #     print("Error reading from contract:", e)
        
#     # nonce = w3.eth.get_transaction_count(contract.address)
#     # print(nonce)

#     # new_value = 228
#     # transaction = contract.functions.set(new_value).build_transaction({
#     #     'gas': 200000,
#     #     'gasPrice': w3.to_wei('50', 'gwei'),
#     #     'nonce': nonce,
#     # })
#     # signed_txn = w3.eth.account.sign_transaction(transaction, private_key='cfd2f54fc3764a2e5b8248a657aeaaf9611cfe916a9daa564f7a8d9fcdcbe9e6')

#     # # Отправка транзакции в сеть Ethereum
#     # try:
#     #     tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
#     #     print("Transaction hash:", tx_hash.hex())
#     #     # Ожидание подтверждения транзакции
#     #     tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
#     #     print("Transaction receipt:", tx_receipt)
#     # except Exception as e:
#     #     print("Error sending transaction:", e)

#     # return Response('contract')
    