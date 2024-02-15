from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

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
    


class PollParticipant(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='participants_poll')
    comment = models.CharField(max_length=150, blank=True, null=True)
    voting_date = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"{self.profile.user.username} participated in poll"


class AnswerOption(models.Model):
    name = models.CharField(max_length=100)
    is_correct = models.BooleanField(default=None, blank=True, null=True)
    answers = models.ManyToManyField(PollParticipant, related_name='answeroption_participants', blank=True, null=True)

    def __str__(self):
        return f"{self.name}"



class Poll(models.Model):
    poll_id = models.CharField(max_length=100, unique=True) # уникальный id
    author = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='authored_polls') # автор опроса
    image = models.ImageField(verbose_name='Фото опроса', upload_to=f'img/poll_images/', blank=True, null=True) # фото 
    name = models.CharField(max_length=50, blank=True, null=True) # имя опроса
    description = models.TextField(blank=True, null=True) # текст начать опрос

    poll_type = models.ForeignKey(PollType, on_delete=models.CASCADE) # тип опроса
    created_date = models.DateTimeField(auto_now_add=True) # дата создания
    duration = models.DurationField(blank=True, null=True) # таймер

    has_multiple_choices = models.BooleanField(default=False) # множественный выбор
    has_correct_answer = models.BooleanField(default=False) # есть ли верные ответы или опрос
    is_anonymous = models.BooleanField(default=False) # анонимное
    can_cancel_vote = models.BooleanField(default=False) # запретить повторное.

    # ответы пользователей
    answer_options = models.ManyToManyField(AnswerOption, related_name='polls_with_answer_options', blank=True, null=True)
    
    is_paused = models.BooleanField(default=False) # приостановлено
    is_closed = models.BooleanField(default=False) # завершено

    def __str__(self):
        return self.name
    
    def set_duration(self, duration:str):
        duration = list(map(int, duration.split(':')))
        duration = timedelta(days=duration[0], hours=duration[1],
                             minutes=duration[2], seconds=duration[3])
        self.duration = duration

    def add_answer_option(self, name, is_correct=False):
        answer_option = AnswerOption.objects.create(
            name=name,
            is_correct=is_correct,
        )
        self.answer_options.add(answer_option)
        return True

    def add_answer_options(self, options):
        answer_options = []
        for option in options:
            answer_option = AnswerOption.objects.create(
                name=option.name,
                is_correct=option.is_correct,
            )
        if answer_options:
            self.answer_options.add(answer_option)
            return True
        else: return False

    
    @property   
    def members_quantity(self):   # число участников опроса
        profiles = set()   
        for answer_option in self.answer_options.all():   
            for participant in answer_option.answers.all():   
                profiles.add(participant.profile)   
   
        return len(profiles)   
   
    @property
    def opened_for_voting(self):    # доступно ли для голосования по времени
        return timezone.now() < self.created_date + self.duration



