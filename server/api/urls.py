from django.urls import path
from .views import *

urlpatterns = [
    path('get_my_profile/', get_my_profile, name='get_my_profile'),
    path('my_profile/', my_profile, name='my_profile'),
    path('test_api/', test_api, name='test_api'),
]
