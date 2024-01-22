from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    patronymic = models.CharField(max_length=50, default="Не указано")
    sex = models.CharField(max_length=1, blank=False, null=False)
    number = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    
    polls = models.ManyToManyField("Poll", related_name="user_poll")
    joining_date = models.DateField(auto_now_add=True)


    
    def __str__(self):
        return self.name + " " + self.surname
    

class Poll(models.Model):
    author = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=50)

    created_date = models.DateField(auto_now_add=True)


    def __str__(self):
        return self.name + " " + self.author