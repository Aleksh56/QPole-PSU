from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    patronymic = models.CharField(max_length=50, default='Не указано', blank=True, null=True)
    sex = models.CharField(max_length=1, blank=False, null=False)
    number = models.CharField(max_length=50)  # Предполагая, что это строковый номер

    joining_date = models.DateField(auto_now_add=True)

    role = models.ForeignKey('UserRole', on_delete=models.CASCADE, related_name='profiles')
    # polls = models.ManyToManyField('Poll', related_name='profiles_polls', blank=True)

    def __str__(self):
        return self.name + ' ' + self.surname
    

class UserRole(models.Model):
    role = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.role
    

class PollType(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    

# Тип ответа
    # заголовок
    # голос
    # фото
    # комментарий к ответ

class Poll(models.Model):
    author = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='authored_polls')
    name = models.CharField(max_length=50)
    poll_type = models.ForeignKey(PollType, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)

    has_multiple_choices = models.BooleanField(default=False)
    has_correct_answer = models.BooleanField(default=False)
    is_anonymous = models.BooleanField(default=False)
    
    answer_options = models.ManyToManyField('AnswerOption', related_name='polls_with_answer_options')
    participants = models.ManyToManyField('PollParticipant', related_name='poll_participants')

    # описание
    # фото 
    # текст начать опрос
    # запретить повторное.
    # перемешивать варианты
    # таймер
    
    def __str__(self):
        return self.name


class AnswerOption(models.Model):
    name = models.CharField(max_length=100)
    is_correct = models.BooleanField(default=None, blank=True, null=True)

    def __str__(self):
        return f"{self.name}"


class PollParticipant(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='participants_poll')
    voting_date = models.DateTimeField(auto_now_add=True)

    answers = models.ManyToManyField(AnswerOption, related_name='participants_answers')

    def __str__(self):
        return f"{self.profile.user.username} participated in poll"
