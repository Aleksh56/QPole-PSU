from django.contrib.auth.models import User
from rest_framework import serializers

from api.models import Profile
from login.serializers import UserSerializer



class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    role = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    def get_role(self, obj):
        return obj.role.role if obj.role else None