from django.contrib import admin
from .models import *


admin.site.register(UserRole)
admin.site.register(Profile)
admin.site.register(PollType)
admin.site.register(Poll)
admin.site.register(AnswerOption)
admin.site.register(PollAnswer)
admin.site.register(PollQuestion)