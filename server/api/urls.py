from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import *
from .tests import *

urlpatterns = [
    path('my_profile/', my_profile, name='my_profile'),
    path('my_poll/', my_poll, name='my_poll'),
    path('my_poll/', my_poll, name='my_poll'),
    path('my_poll_question/', my_poll_question, name='my_poll_question'),
    path('my_poll_question_option/', my_poll_question_option, name='my_poll_question_option'),
    path('poll_voting/', poll_voting, name='poll_voting'),
    path('my_poll_votes/', my_poll_votes, name='my_poll_votes'),
    path('my_poll_stats/', my_poll_stats, name='my_poll_stats'),
    path('my_poll_user_answers/', my_poll_user_answers, name='my_poll_user_answers'),
    path('poll/', poll, name='poll'),
    path('my_support_requests/', my_support_requests, name='my_support_requests'),


    path('optimization_test/', optimization_test, name='optimization_test'),
    path('poll_voting_test/', poll_voting_test, name='poll_voting_test'),
    path('my_poll_stats_test/', my_poll_stats_test, name='my_poll_stats_test'),

]