from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from datetime import timedelta

from .exсeptions import *

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, verbose_name='Пользователь')
    email = models.EmailField('Почта', blank=True, null=True)
    name = models.CharField('Имя', max_length=50, blank=True, null=True)
    surname = models.CharField('Фамилия', max_length=50, blank=True, null=True)
    patronymic = models.CharField('Отчество', max_length=50, default='Не указано', null=True)
    sex = models.CharField('Пол', max_length=1, blank=True, null=True)
    number = models.CharField('Номер телефона', max_length=50, blank=True, null=True) 

    joining_date = models.DateField(auto_now_add=True)
    # has_2auf = models.BooleanField(default=False)

    role = models.ForeignKey('UserRole', on_delete=models.CASCADE, related_name='profiles', verbose_name='Роль')
    
    
    is_banned = models.BooleanField('Заблокирован', default=False)
    is_email_confrimed = models.BooleanField('Почта подтверждена', default=False)


    def __str__(self):
        if self.name and self.surname:
            return self.name + ' ' + self.surname
        else: return f"Профиль {self.user.username}"
    

class UserRole(models.Model):
    role = models.CharField('Роль', max_length=50, unique=True)

    def __str__(self):
        return self.role
    

class PollType(models.Model):
    name = models.CharField('Название типа', max_length=50)
    description = models.CharField('Описание', max_length=500, default="", blank=True)

    is_text = models.BooleanField(default=True, null=True)    # текст ли как ответ
    is_free = models.BooleanField(default=False, null=True)    # свободная ли форма ответа
    is_image = models.BooleanField(default=False, null=True)    # фото ли как ответ
    has_multiple_choices = models.BooleanField(default=False) # множественный выбор
    has_correct_answer = models.BooleanField(default=False) # есть ли верные ответы или опрос
    is_anonymous = models.BooleanField(default=False) # анонимное

    def __str__(self):
        return self.name
    

class PollAnswer(models.Model):
    poll_answer_group = models.ForeignKey('PollAnswerGroup', related_name='answers', on_delete=models.CASCADE)
    poll = models.ForeignKey('Poll', related_name='all_answers', on_delete=models.CASCADE, db_index=True)
    question = models.ForeignKey('PollQuestion', on_delete=models.CASCADE)
    answer_option = models.ForeignKey('AnswerOption', on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=None, null=True)
    text = models.CharField(max_length=100, default=None, null=True, blank=True)
    image = models.ImageField(verbose_name='Фото ответа', upload_to=f'images/poll_answers/', blank=True, null=True, default=None)

    points = models.PositiveSmallIntegerField(default=None, null=True)

    def __str__(self):
        return f"Ответ на {self.question}"
    

class PollAnswerGroup(models.Model):
    profile = models.ForeignKey(Profile, related_name='answer_groups', on_delete=models.CASCADE, null=True)
    tx_hash = models.CharField(max_length=255, default=None, null=True)

    poll = models.ForeignKey('Poll', related_name='user_answers', on_delete=models.CASCADE)

    voting_date = models.DateTimeField(auto_now_add=True)

    @property
    def voting_time_left(self):
        completion_time = self.poll.poll_setts.completion_time

        poll_time_left = self.poll.end_time_left
        if poll_time_left:
            if completion_time:
                time_left = max(((self.voting_date + completion_time) - timezone.now()).total_seconds(), 0)
                return min(time_left, poll_time_left)
            else:
                return poll_time_left
            
        return 0            


    def __str__(self):
        return f"Группа ответов на {self.poll} от {self.profile}"


class PollParticipantsGroup(models.Model):
    profile = models.ForeignKey(Profile, related_name='participation_groups', on_delete=models.CASCADE, null=True)
    poll = models.ForeignKey('Poll', related_name='user_participations', on_delete=models.CASCADE)


    def __str__(self):
        return f"Группа ответов на {self.poll} от {self.profile}"
    
class AnswerOption(models.Model):
    name = models.CharField(max_length=100, default=None, null=True, blank=True)
    image = models.ImageField(verbose_name='Фото варианта ответа', upload_to=f'images/poll_options/', blank=True, null=True, default=None)
    question = models.ForeignKey('PollQuestion', related_name='answer_options', on_delete=models.CASCADE) # связь с вариантом вопросом

    is_correct = models.BooleanField(default=None, null=True)   # верный ли ответ
    is_text_response = models.BooleanField(default=False, null=True)    # текст ли как ответ
    is_free_response = models.BooleanField(default=False, null=True)    # свободная ли форма ответа
    is_image_response = models.BooleanField(default=False, null=True)    # фото ли как ответ

    order_id = models.PositiveIntegerField(default=1, null=False, blank=False) # порядковый номер в вопросе
    
    def __str__(self):
        if self.is_free_response:
            if not self.is_image_response:
                return f"Свободный вариант ответа '{self.name}'"
            else:
                return f"Свободный вариант ответа с фотографией"
        else:
            if self.name:
                return f"Вариант ответа '{self.name}'"
            else:
                return f"Вариант ответа №{self.id}"


    def delete(self):
        super().delete(keep_parents=False)


class PollQuestion(models.Model):
    name = models.CharField(max_length=100, default=None, null=True, blank=True)
    info = models.CharField(max_length=500, default=None, null=True, blank=True)
    image = models.ImageField(verbose_name='Фото вопроса', upload_to=f'images/poll_questions/', blank=True, null=True, default=None)
    poll = models.ForeignKey('Poll', related_name='questions', on_delete=models.CASCADE) # связь с опросом

    has_correct_answer = models.BooleanField(default=None, null=True)   # есть ли верный ответ
    has_multiple_choices = models.BooleanField(default=False)   # есть ли множенственный выбор
    is_free = models.BooleanField(default=False)   # свободная форма ответа, всего 1 вариант ответа
    is_text = models.BooleanField(default=True)   # текст как ответ
    is_image = models.BooleanField(default=False)   # фото как ответ

    order_id = models.PositiveIntegerField(default=1, null=False, blank=False) # порядковый номер в опросе

    is_required = models.BooleanField(default=True)    # обязателен ли ответ


    def __str__(self):
        if self.name:
            return f"Вопрос №{self.id} '{self.name}'"
        else:
            return f"Вопрос №{self.id}"

    def __repr__(self):
        if self.name:
            return f"Вопрос №{self.id} '{self.name}'"
        else:
            return f"Вопрос №{self.id}"


class Poll(models.Model):
    poll_id = models.CharField(max_length=100, unique=True) # уникальный id
    author = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='my_polls') # автор опроса
    image = models.ImageField(verbose_name='Фото опроса', upload_to=f'images/poll_images/', blank=True, null=True) # фото 
    name = models.CharField(max_length=50, blank=True, null=True) # имя опроса
    description = models.TextField(blank=True, null=True) # текст начать опрос
    tags = models.TextField(blank=True, null=True) # тэги

    poll_type = models.ForeignKey(PollType, related_name='poll', on_delete=models.CASCADE, null=True) # тип опроса
    poll_setts = models.OneToOneField('PollSettings', on_delete=models.CASCADE, null=True, related_name='poll') # настройки опроса

    created_date = models.DateTimeField(auto_now_add=True) # дата создания

    is_anonymous = models.BooleanField(default=False) # анонимное

    is_revote_allowed = models.BooleanField(default=False) # разрешить повторное
    mix_questions = models.BooleanField(default=False) # перемешивать вопросы
    mix_options = models.BooleanField(default=False) # перемешивать варианты ответа
    hide_participants_quantity = models.BooleanField(default=False) # скрыть количество участников
    hide_options_percentage = models.BooleanField(default=False) # скрыть проценты ответов
    request_contact_info = models.BooleanField(default=False) # запрашивать контактные данные
    hide_options_percentage = models.BooleanField(default=False) # добавить теги

    is_paused = models.BooleanField(default=False) # приостановлено
    is_closed = models.BooleanField(default=False) # завершено

    is_in_production = models.BooleanField(default=False) # готов к прохождению

    # qr код ссылки на опрос
    qrcode = models.ImageField(verbose_name='Qrcode опроса', upload_to=f'images/poll_qrcodes/', blank=True, null=True) 

    def __str__(self):
        if self.name:
            return f"Опрос '{self.name}'"
        else:
            return f"Опрос №{self.id}"
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.poll_setts:
            self.poll_setts = PollSettings.objects.create()
        
        if self.poll_type.name == 'Быстрый':
            self.poll_setts.completion_time = timedelta(hours=1, minutes=30)
            self.poll_setts.start_time = timezone.now()
            self.poll_setts.end_time = self.poll_setts.start_time + timedelta(days=1)
            self.is_anonymous = True
            
    # Проверка наличия участия пользователя в опросе
    def has_user_participated_in(self, user_profile):
        if not user_profile:
            return None
        
        return self.user_participations.filter(
            profile=user_profile
        ).exists()
    
    def can_user_vote(self, user_profile):
        if not (self.is_closed or self.is_paused):
            if self.user_answers.filter(
                profile=user_profile
            ).exists():
                if self.is_revote_allowed:
                    return True
                return False
            return True
        return False
    
    @property
    def participants_quantity(self):   # число участников опроса
        return self.user_participations.count()

    @property
    def questions_quantity(self):   # число вопросов опроса
        return self.questions.count()

    @property
    def opened_for_voting(self):
        if self.poll_setts:
            start_time = self.poll_setts.start_time
            duration = self.poll_setts.duration
            end_time = self.poll_setts.end_time

            if start_time and duration:
                if timezone.now() > start_time and timezone.now() < start_time + duration:
                    return True
                else: 
                    return False
                 
            elif start_time and end_time:    
                if end_time > timezone.now() > start_time:
                    return True
                else: 
                    return False
                
            elif start_time and not duration:
                if timezone.now() > start_time:
                    return True
                else:
                    return False
            else:
                return True
        else:
            return True

    @property
    def start_time_left(self):
        if self.poll_setts:
            start_time = self.poll_setts.start_time
            
            if start_time:
                time_left = max((self.poll_setts.start_time - timezone.now()).total_seconds(), 0)
                return time_left

    @property
    def end_time_left(self):
        if self.poll_setts:
            start_time = self.poll_setts.start_time
            duration = self.poll_setts.duration
            end_time = self.poll_setts.end_time

            if end_time:
                time_left = max((end_time - timezone.now()).total_seconds(), 0)
                return time_left
            
            elif start_time and duration:
                time_left = max((start_time + duration - timezone.now()).total_seconds(), 0)
                return time_left
            
            else: return None    
        else: return None
            


class PollSettings(models.Model):

    max_revotes_quantity = models.PositiveSmallIntegerField(default=2)

    # настройки времени
    completion_time = models.DurationField(null=True) # время на прохождение
    duration = models.DurationField(null=True) # время с момента start_time в течение которого доступен опрос
    start_time = models.DateTimeField(null=True)
    end_time = models.DateTimeField(null=True)

    def __str__(self):
        if self.poll:
            return f"Настройки {self.poll}"


class SupportRequestType(models.Model):
    type = models.CharField(max_length=100)

    def __str__(self):
        return f"Тип обращения {self.type}"


class SupportRequest(models.Model):
    text = models.CharField(max_length=1000)
    type = models.ForeignKey(SupportRequestType, related_name='tickets', on_delete=models.CASCADE) 
    author = models.ForeignKey(Profile, related_name='tickets', on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)

    is_seen = models.BooleanField(default=False)
    is_closed = models.BooleanField(default=False)
    is_closed_date = models.DateTimeField(default=None, null=True)

    
    def __str__(self):
        return f"Обращение типа {self.type.type} от {self.author} от {self.created_date}"

