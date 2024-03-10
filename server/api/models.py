from django.db import models
from django.db.models import Exists, OuterRef
from django.contrib.auth.models import User
from django.utils import timezone

from .exсeptions import *

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    email = models.EmailField(blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True)
    surname = models.CharField(max_length=50, blank=True, null=True)
    patronymic = models.CharField(max_length=50, default='Не указано', blank=True, null=True)
    sex = models.CharField(max_length=1, blank=True, null=True)
    number = models.CharField(max_length=50, blank=True, null=True) 

    joining_date = models.DateField(auto_now_add=True)

    role = models.ForeignKey('UserRole', on_delete=models.CASCADE, related_name='profiles', blank=True, null=True)


    def __str__(self):
        if self.name and self.surname:
            return self.name + ' ' + self.surname
        else: return f"Профиль {self.user.username}"
    

class UserRole(models.Model):
    role = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.role
    

class PollType(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=500, default="", blank=True)


    is_text = models.BooleanField(default=True, null=True)    # текст ли как ответ
    is_free = models.BooleanField(default=False, null=True)    # свободная ли форма ответа
    is_image = models.BooleanField(default=False, null=True)    # фото ли как ответ
    has_multiple_choices = models.BooleanField(default=False) # множественный выбор
    has_correct_answer = models.BooleanField(default=False) # есть ли верные ответы или опрос
    is_anonymous = models.BooleanField(default=False) # анонимное

    def __str__(self):
        return self.name
    



class PollAnswer(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    answer_option = models.ForeignKey('AnswerOption', on_delete=models.DO_NOTHING, null=True, blank=True)
    question = models.ForeignKey('PollQuestion', on_delete=models.DO_NOTHING, null=True, blank=True)
    text = models.CharField(max_length=100, default=None, null=True, blank=True)
    image = models.ImageField(verbose_name='Фото ответа', upload_to=f'images/poll_answers/', blank=True, null=True, default=None)

    is_correct = models.BooleanField(default=None, null=True)
    voting_date = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"Ответ на {self.answer_option} от {self.profile}"


class AnswerOption(models.Model):
    name = models.CharField(max_length=100, default=None, null=True, blank=True)
    image = models.ImageField(verbose_name='Фото варианта ответа', upload_to=f'images/poll_options/', blank=True, null=True, default=None)
    answers = models.ManyToManyField(PollAnswer, related_name='answeroption_pollanswers', blank=True, null=True)

    is_correct = models.BooleanField(default=None, null=True)   # верный ли ответ
    is_text_response = models.BooleanField(default=True, null=True)    # текст ли как ответ
    is_free_response = models.BooleanField(default=False, null=True)    # свободная ли форма ответа
    is_image_response = models.BooleanField(default=False, null=True)    # фото ли как ответ

    order_id = models.PositiveIntegerField(default=1, null=False, blank=False) # порядковый номер в вопросе
    
    def __str__(self):
        if self.is_free_response:
            if not self.is_image_response:
                return f"Свободный вариант ответа'"
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
    answer_options = models.ManyToManyField(AnswerOption, related_name='pollquestion_answeroptions', blank=True, null=True)

    has_correct_answer = models.BooleanField(default=None, null=True)   # есть ли верный ответ
    has_multiple_choices = models.BooleanField(default=False)   # есить ли множенственный выбор
    # points_if_correct = models.DecimalField(max_digits=10, decimal_places=2) # очки за правильный ответ
    is_free = models.BooleanField(default=False, null=True)   # свободная ли форма ответа
    is_text = models.BooleanField(default=True, null=True)    # текст ли как вопрос
    is_image = models.BooleanField(default=False, null=True)    # фото ли как вопрос

    order_id = models.PositiveIntegerField(default=1, null=False, blank=False) # порядковый номер в опросе

    def __str__(self):
        if self.name:
            return f"Вопрос '{self.name}'"
        else:
            return f"Вопрос №{self.id}"
        

    def delete(self):
        super().delete(keep_parents=False)


class Poll(models.Model):
    poll_id = models.CharField(max_length=100, unique=True) # уникальный id
    author = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='authored_polls') # автор опроса
    image = models.ImageField(verbose_name='Фото опроса', upload_to=f'images/poll_images/', blank=True, null=True) # фото 
    name = models.CharField(max_length=50, blank=True, null=True) # имя опроса
    description = models.TextField(blank=True, null=True) # текст начать опрос
    tags = models.TextField(blank=True, null=True) # тэги

    poll_type = models.ForeignKey(PollType, on_delete=models.CASCADE, blank=True, null=True) # тип опроса
    created_date = models.DateTimeField(auto_now_add=True) # дата создания
    duration = models.DurationField(blank=True, null=True) # таймер

    has_multiple_choices = models.BooleanField(default=False) # множественный выбор
    has_correct_answer = models.BooleanField(default=False) # есть ли верные ответы или опрос
    is_anonymous = models.BooleanField(default=False) # анонимное
    can_cancel_vote = models.BooleanField(default=True) # запретить повторное
    mix_questions = models.BooleanField(default=False) # перемешивать вопросы
    mix_options = models.BooleanField(default=False) # перемешивать варианты ответа
    hide_participants_quantity = models.BooleanField(default=False) # скрыть количество участников
    hide_options_percentage = models.BooleanField(default=False) # скрыть проценты ответов
    request_contact_info = models.BooleanField(default=False) # запрашивать контактные данные
    hide_options_percentage = models.BooleanField(default=False) # добавить теги

    # вопросы
    questions = models.ManyToManyField(PollQuestion, related_name='poll_questions', blank=True, null=True)
    
    is_paused = models.BooleanField(default=False) # приостановлено
    is_closed = models.BooleanField(default=False) # завершено


    def __str__(self):
        if self.name:
            return f"Опрос '{self.name}'"
        else:
            return f"Опрос №{self.id}"
    
    def delete(self):
        super().delete(keep_parents=False)
        
        
    # Проверка наличия участия пользователя в опросе
    def has_user_participated_in(self, user_profile):
        if not user_profile:
            return False
        
        return self.questions.filter(
            answer_options__answers__profile=user_profile
        ).exists()
    
    def can_user_vote(self, user_profile):
        if not (self.is_closed or self.is_paused):
            if self.questions.filter(
                answer_options__answers__profile=user_profile
            ).exists():
                if self.can_cancel_vote:
                    return False
                return True
            return True
        return False
    
    def members_quantity(self):   # число участников опроса
        return self.answer_options__answers__profile.all().distinct().count()

   
    def opened_for_voting(self):   # доступно ли для голосования по времени
        if self.duration:     
            return timezone.now() < self.created_date + self.duration
        else: return True

