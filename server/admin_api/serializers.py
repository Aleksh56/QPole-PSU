from django.contrib.auth.models import User
from rest_framework import serializers

from api.models import Profile, SupportRequest, SupportRequestType


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    role = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    def get_role(self, obj):
        return obj.role.role if obj.role else None
    

class SupportRequestTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportRequestType
        fields = '__all__'

    

class SupportRequestSerializer(serializers.ModelSerializer):
    type = SupportRequestTypeSerializer()

    class Meta:
        model = SupportRequest
        fields = '__all__'
