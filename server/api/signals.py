# Сигналы Django
from django.db.models.signals import m2m_changed, post_delete, pre_delete
from django.dispatch import receiver

from .models import Poll, PollQuestion, AnswerOption


@receiver(pre_delete, sender=Poll)
def poll_post_delete_handler(sender, instance, **kwargs):
    questions = instance.questions.all()
    instance.questions.all().delete()
    questions.delete()
    


@receiver(pre_delete, sender=PollQuestion)
def poll_questions_post_delete_handler(sender, instance, **kwargs):
    answer_options = instance.answer_options.all()
    instance.answer_options.all().delete()
    answer_options.delete()
    


@receiver(pre_delete, sender=AnswerOption)
def options_anwsers_post_delete_handler(sender, instance, **kwargs):
    answers = instance.answers.all()
    instance.answers.all().delete()
    print(answers)
    answers.delete()
    