from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

    def validate(self, data):
        if data.get('age') and data['age'] < 18:
            raise serializers.ValidationError("Возраст должен быть 18 или более.")

        return data
    
    def create(self, validated_data):
        instance = Profile.objects.create(**validated_data)
        return instance
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
    
    def delete(self, instance):
        instance.delete()