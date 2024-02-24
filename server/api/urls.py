from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import *

urlpatterns = [
    path('my_profile/', my_profile, name='my_profile'),
    path('my_poll/', my_poll, name='my_poll'),
    path('my_poll_question/', my_poll_question, name='my_poll_question'),
    path('my_poll_question_option/', my_poll_question_option, name='my_poll_question_option'),
    path('test_api/', test_api, name='test_api'),
]

# Добавляем URL-шаблоны для медиа-файлов и статических файлов
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
