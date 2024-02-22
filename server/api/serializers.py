from django.contrib.auth.models import User
from rest_framework import serializers

from .models import *
from .exсeptions import *

def validate_age(value):
    if value < 14:
        raise serializers.ValidationError("Возраст должен быть 14 или более.")


class MiniUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username']
    

class ProfileSerializer(serializers.ModelSerializer):
    # user = MiniUserSerializer()
    # role = UserRoleSerializer()
    
    class Meta:
        model = Profile
        fields = '__all__'

    def is_valid(self, raise_exception=False):

        name = self.initial_data.get('name', None)
        if name:
            if len(name) > 50:
                raise InvalidFieldException(field='name', detail=f"Имя не можеть быть длинее 50 символов.")
            
        surname = self.initial_data.get('surname', None)
        if surname:
            if len(surname) > 50:
                raise InvalidFieldException(field='surname', detail=f"Фамилия не можеть быть длинее 50 символов.")
            
        patronymic = self.initial_data.get('patronymic', None)
        if patronymic:
            if len(patronymic) > 50:
                raise InvalidFieldException(field='patronymic', detail=f"Отчество не можеть быть длинее 50 символов.")
            
        role_id = self.initial_data.get('role', None)
        if role_id:
            role_exists = UserRole.objects.filter(id=role_id).exists()
            if not role_exists:
                raise ObjectNotFoundException(detail=f"Роли c id='{role_id}' не существует.")

        number = self.initial_data.get('number', None)
        if number:
            if not self.__is_number_valid(number):
                raise InvalidFieldException(field='number', detail=f"Номер телефона '{number}' введен некорректно.")
            
        email = self.initial_data.get('email', None)
        if email:
            if not self.__is_email_valid(email):
                raise InvalidFieldException(field='email', detail=f"Почта '{email}' введена некорректно.")

        sex = self.initial_data.get('sex', None)
        if sex:
            if not sex in ['М', 'Ж']:
                raise InvalidFieldException(field='sex', detail=f"Пол '{sex}' введен некорректно. Ожидается 'М' или 'Ж'.")

        joining_date = self.initial_data.get('joining_date', None)
        if joining_date:
            from datetime import datetime
            try:
                datetime.strptime(joining_date, '%Y-%m-%d')
            except ValueError:
                raise InvalidFieldException(field='joining_date', detail=f"Дата '{joining_date}' введена некорректно. Ожидается 'YYYY-MM-DD'.")
            
        valid = super().is_valid(raise_exception=raise_exception)
        if not valid:
            return False


        return True

    def create(self, validated_data):
        self.is_valid(raise_exception=True)
        
        instance = Profile.objects.create(**validated_data)
        return instance
    
    def update(self, instance, validated_data):
        self.is_valid(raise_exception=False)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
    
    def delete(self, instance):
        instance.delete()



    def __is_number_valid(self, value):
        import re

        pattern = r'^(\+7|8)[\d]{10}$'
        if re.match(pattern, value):
            return True
        return False

    def __is_email_valid(self, value):
        import re

        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if re.match(pattern, value):
            return True
        return False


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
