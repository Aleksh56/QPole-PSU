from django.core.cache import cache
from django.shortcuts import render
from django.utils.deprecation import MiddlewareMixin
from admin_api.models import Settings

class MaintenanceMiddleware(MiddlewareMixin):
    def process_request(self, request):
        is_under_maintenance = cache.get('is_under_maintenance', None)

        if is_under_maintenance is None:
            settings = Settings.objects.first()
            is_under_maintenance = settings.is_under_maintenance if settings else False
            cache.set('is_under_maintenance', is_under_maintenance, 60 * 60 * 24)

        if is_under_maintenance:
            return render(request, 'maintenance.html', status=503)
