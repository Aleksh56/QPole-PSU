from django.urls import path
from .views import *
from .tests import *

urlpatterns = [
    path('my_profile/', my_profile, name='my_profile'),
    path('my_poll/', my_poll, name='my_poll'),
    path('study_group/', study_group, name='study_group'),
    path('my_poll_settings/', my_poll_settings, name='my_poll_settings'),
    path('my_poll_question/', my_poll_question, name='my_poll_question'),
    path('my_poll_question_option/', my_poll_question_option, name='my_poll_question_option'),
    path('my_poll_users_votes/', my_poll_users_votes, name='my_poll_users_votes'),
    path('my_poll_stats/', my_poll_stats, name='my_poll_stats'),
    path('my_poll_user_answers/', my_poll_user_answers, name='my_poll_user_answers'),
    path('poll_answer_group/', poll_answer_group, name='poll_answer_group'),
    path('poll/', poll, name='poll'),
    path('poll_voting/', poll_voting, name='poll_voting'),
    path('poll_voting_started/', poll_voting_started, name='poll_voting_started'),
    path('poll_voting_ended/', poll_voting_ended, name='poll_voting_ended'),
    path('poll_registration/', poll_registration, name='poll_registration'),
    path('quick_poll_voting/', quick_poll_voting, name='quick_poll_voting'),
    path('my_support_requests/', my_support_requests, name='my_support_requests'),


    path('optimization_test/', optimization_test, name='optimization_test'),
    path('poll_voting_test/', poll_voting_test, name='poll_voting_test'),
    path('my_poll_stats_test/', my_poll_stats_test, name='my_poll_stats_test'),
    path('poll_answer_group_test/', poll_answer_group_test, name='poll_answer_group_test'),
    # path('test/', test, name='test'),

]