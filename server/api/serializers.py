from django.contrib.auth.models import User
from rest_framework import serializers

from .models import *

def validate_age(value):
    if value < 14:
        raise serializers.ValidationError("Возраст должен быть 14 или более.")


class MiniUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username']
    

class ProfileSerializer(serializers.ModelSerializer):
    user = MiniUserSerializer()
    
    class Meta:
        model = Profile
        fields = '__all__'

    # age = serializers.IntegerField(validators=[validate_age])
    
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



class MiniProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('name', 'surname', 'user')


class PollAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollAnswer
        fields = '__all__'

    profile = MiniProfileSerializer()


class AnswerOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerOption
        fields = '__all__'

    answers = PollAnswerSerializer(many=True)


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollQuestion
        fields = '__all__'

    answer_options = AnswerOptionSerializer(many=True)


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
    author = ProfileSerializer()
    questions = QuestionSerializer(many=True)

    members_quantity = serializers.IntegerField()
    opened_for_voting = serializers.BooleanField()

    class Meta:
        model = Poll
        fields = '__all__'  
