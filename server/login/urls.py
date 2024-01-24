from django.urls import path

from .views import *

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('change_password/', change_password, name='change_password'),
    path('test_token/', test_token, name='test_token'),
    path('send_reset_code/', send_reset_code, name='send_reset_code'),
    path('check_reset_code/', check_reset_code, name='check_reset_code'),
    path('reset_password/', reset_password, name='reset_password'),
]
