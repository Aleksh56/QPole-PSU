from django.contrib.auth.models import User
from rest_framework import serializers

from .models import *


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



class AnswerOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerOption
        fields = '__all__'



class PollParticipantSerializer(serializers.ModelSerializer):
    answers = AnswerOptionSerializer(many=True)

    class Meta:
        model = PollParticipant
        fields = '__all__'



class PollTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollType
        fields = '__all__'



class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = '__all__'


class PollSerializer(serializers.ModelSerializer):
    poll_type = serializers.CharField(source='poll_type.name', read_only=True)
    answer_options = AnswerOptionSerializer(many=True)
    participants = PollParticipantSerializer(many=True)
    author = ProfileSerializer()

    class Meta:
        model = Poll
        fields = '__all__'
