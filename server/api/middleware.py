# from django.utils.deprecation import MiddlewareMixin
# from .exсeptions import AccessDeniedException

# from api.models import Profile

# class BanMiddleware(MiddlewareMixin):
#     def process_request(self, request):
#         profile = Profile.objects.get(user=request.user)
#         print(profile)
#         if profile and profile.is_banned:
#             raise AccessDeniedException()
