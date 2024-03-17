from django.contrib import admin
from django.urls import path, include
from django_otp.admin import OTPAdminSite
# from django.contrib.auth.models import User
# from django_otp.plugins.otp_totp.models import TOTPDevice
# from django_otp.plugins.otp_totp.admin import TOTPDeviceAdmin

from api.models import *
from .views import *

# class OTPAdmin(OTPAdminSite):
#     pass


# admin.site = OTPAdmin(name='OTPAdmin')
# admin.site.register(User)
# admin.site.register(TOTPDevice, TOTPDeviceAdmin)

# admin.site.register(UserRole)
# admin.site.register(Profile)
# admin.site.register(PollType)
# admin.site.register(Poll)
# admin.site.register(AnswerOption)
# admin.site.register(PollAnswer)
# admin.site.register(PollQuestion)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('qr_code_view/', qr_code_view),
    path('verify-totp/', VerifyTOTPView.as_view(), name='verify-totp'),
    path('api/', include('api.urls')),
    path('login/', include('login.urls')),
]
