from django.urls import path
from .views import *

urlpatterns = [
    path('my_profile/', my_profile, name='my_profile'),
    path('my_poll/', my_poll, name='my_poll'),
    path('my_poll_question/', my_poll_question, name='my_poll_question'),
    path('test_api/', test_api, name='test_api'),
]
