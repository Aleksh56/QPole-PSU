from django.contrib.auth.models import User
from rest_framework import serializers

from api.models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    def get_user(self, obj):
        return obj.user.username if obj.user else None

    def get_role(self, obj):
        return obj.role.role if obj.role else None