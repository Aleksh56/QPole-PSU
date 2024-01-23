from django.urls import path

from .views import register, login, logout, change_password, test_token, send_reset_code, reset_password

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('change_password/', change_password, name='change_password'),
    path('test_token/', test_token, name='test_token'),
    path('send_reset_code/', send_reset_code, name='send_reset_code'),
    path('reset_password/', reset_password, name='reset_password'),
]
