from django.contrib import admin
from django.urls import path, include
from django_otp.admin import OTPAdminSite
from django.contrib.auth.models import User
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp.plugins.otp_totp.admin import TOTPDeviceAdmin

from api.models import *
from .views import *

class OTPAdmin(OTPAdminSite):
    pass


admin_site = OTPAdmin(name='OTPAdmin')
admin_site.register(User)
admin_site.register(TOTPDevice, TOTPDeviceAdmin)

admin_site.register(UserRole)
admin_site.register(Profile)
admin_site.register(PollType)
admin_site.register(Poll)
admin_site.register(AnswerOption)
admin_site.register(PollAnswer)
admin_site.register(PollQuestion)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('qr_code_view/', qr_code_view),
    path('verify-totp/', VerifyTOTPView.as_view(), name='verify-totp'),
    path('api/', include('api.urls')),
    path('login/', include('login.urls')),
]
