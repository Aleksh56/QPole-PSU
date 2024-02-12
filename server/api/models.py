from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=50, blank=True, null=True)
    surname = models.CharField(max_length=50, blank=True, null=True)
    patronymic = models.CharField(max_length=50, default='Не указано', blank=True, null=True)
    sex = models.CharField(max_length=1, blank=False, null=False)
    number = models.CharField(max_length=50, blank=True, null=True) 

    joining_date = models.DateField(auto_now_add=True)

    role = models.ForeignKey('UserRole', on_delete=models.CASCADE, related_name='profiles', blank=True, null=True)


    def __str__(self):
        return self.name + ' ' + self.surname
    

class UserRole(models.Model):
    role = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.role
    

class PollType(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=50, default="", blank=True)

    def __str__(self):
        return self.name
    

# Тип ответа
    # заголовок
    # голос
    # фото
    # комментарий к ответ

class Poll(models.Model):
    author = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='authored_polls')
    image = models.ImageField(verbose_name='Фото опроса', upload_to=f'img/poll_images/', blank=True, null=True)    # фото 
    name = models.CharField(max_length=50, blank=True, null=True) 
    description = models.TextField(blank=True, null=True)   # текст начать опрос

    poll_type = models.ForeignKey(PollType, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)
    duration = models.DurationField(blank=True, null=True)    # таймер

    has_multiple_choices = models.BooleanField(default=False)
    has_correct_answer = models.BooleanField(default=False)
    is_anonymous = models.BooleanField(default=False)
    can_cancel_vote = models.BooleanField(default=False)    # запретить повторное.

    answer_options = models.ManyToManyField('AnswerOption', related_name='polls_with_answer_options', blank=True, null=True)
    # participants = models.ManyToManyField('PollParticipant', related_name='poll_participants', blank=True, null=True)

    # перемешивать варианты
    
    
    def __str__(self):
        return self.name


class AnswerOption(models.Model):
    name = models.CharField(max_length=100)
    is_correct = models.BooleanField(default=None, blank=True, null=True)
    answers = models.ManyToManyField('PollParticipant', related_name='answeroption_participants', blank=True, null=True)

    def __str__(self):
        return f"{self.name}"


class PollParticipant(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='participants_poll')
    comment = models.CharField(max_length=150, blank=True, null=True)
    voting_date = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"{self.profile.user.username} participated in poll"
