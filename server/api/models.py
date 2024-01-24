from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    patronymic = models.CharField(max_length=50, default="Не указано")
    sex = models.CharField(max_length=1, blank=False, null=False)
    number = models.CharField(max_length=50)

    joining_date = models.DateField(auto_now_add=True)

    role = models.ForeignKey("UserRole", on_delete=models.CASCADE)
    polls = models.ManyToManyField("Poll", related_name="profile_poll")

    def __str__(self):
        return self.name + " " + self.surname
    

class UserRole(models.Model):
    role = models.CharField(max_length=50)


    def __str__(self):
        return self.role
    

class Poll(models.Model):
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    created_date = models.DateTimeField(auto_now_add=True)

    answers = models.ManyToManyField("AnswerOptions")


    def __str__(self):
        return self.name



class AnswerOptions(models.Model):
    name = models.CharField(max_length=100)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name}"


class PollResponse(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    poll = models.ForeignKey("Poll", on_delete=models.CASCADE)
    created_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Response for {self.poll.name} by {self.author.username}"


class PollParticipant(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    poll = models.ForeignKey("Poll", on_delete=models.CASCADE)
    voting_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.profile.user.username} participated in {self.poll.name} poll"
