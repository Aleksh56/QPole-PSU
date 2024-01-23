from django.urls import path
from api.views import *

urlpatterns = [
    path('get_my_profile/', get_my_profile, name='get_my_profile'),
    path('my_profile/', my_profile, name='my_profile'),
]
