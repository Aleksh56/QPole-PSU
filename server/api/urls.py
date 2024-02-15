from django.urls import path
from .views import *

urlpatterns = [
    path('get_my_profile/', get_my_profile, name='get_my_profile'),
    path('my_profile/', my_profile, name='my_profile'),
    path('create_initial_poll/', create_initial_poll, name='create_initial_poll'),
    path('add_options_to_poll/<poll_id>', add_options_to_poll, name='add_options_to_poll'),
    path('my_poll/', my_poll, name='my_poll'),
    path('test_api/', test_api, name='test_api'),
]
