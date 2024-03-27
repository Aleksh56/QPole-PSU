from django.contrib.auth.models import User
from rest_framework import serializers
from functools import partial

from .validators import *
from .models import *
from .utils import *
from .exсeptions import *

class MiniUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username']
    

class GetProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    def get_user(self, obj):
        return obj.user.username if obj.user else None

    def get_role(self, obj):
        return obj.role.role if obj.role else None


class ProfileSerializer(serializers.ModelSerializer):  

    name = serializers.CharField(validators=[ProfileValidator.name], required=False)
    surname = serializers.CharField(validators=[ProfileValidator.surname], required=False)
    patronymic = serializers.CharField(validators=[ProfileValidator.patronymic], required=False)
    number = serializers.CharField(validators=[ProfileValidator.number], required=False)
    email = serializers.CharField(validators=[ProfileValidator.email], required=True)
    sex = serializers.CharField(validators=[ProfileValidator.sex], required=False)
    joining_date = serializers.DateField(validators=[ProfileValidator.joining_date], required=False)

    class Meta:
        model = Profile
        fields = '__all__'




class MiniProfileSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Profile
        fields = ('name','surname', 'user')


class MiniPollAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollAnswer
        fields = '__all__'

    profile = MiniProfileSerializer()


class AnswerOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerOption
        fields = '__all__'

    answers = MiniPollAnswerSerializer(many=True)


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


class MyProfileSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Profile
        fields = '__all__'


# сериализаторы опросов

class BasePollSerializer(serializers.ModelSerializer):
    name = serializers.CharField(validators=[BaseValidator.name], required=False)
    description = serializers.CharField(validators=[BaseValidator.description], required=False)
    tags = serializers.CharField(validators=[BaseValidator.description], required=False)
    image = serializers.ImageField(validators=[BaseValidator.image], required=False)
    duration = serializers.DurationField(validators=[PollValidator.duration], required=False)
    has_correct_answer = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    has_multiple_choices = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    is_anonymous = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    can_cancel_vote = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    mix_questions = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    mix_options = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    hide_participants_quantity = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    hide_options_percentage = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    is_paused = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    is_closed = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)    


    members_quantity = serializers.SerializerMethodField()
    questions_quantity = serializers.SerializerMethodField()
    is_opened_for_voting = serializers.SerializerMethodField()
    has_user_participated_in = serializers.SerializerMethodField()

    def get_members_quantity(self, instance):
        return instance.members_quantity


    def get_questions_quantity(self, instance):
        return instance.questions_quantity

    
    def get_is_opened_for_voting(self, instance):   
        return instance.opened_for_voting


    def get_has_user_participated_in(self, instance):
        profile = self.context.get('profile')
        return instance.has_user_participated_in(user_profile=profile)


    class Meta:
        model = Poll
        fields = '__all__'

    def create(self, validated_data):
        poll = super().create(validated_data)
        poll = generate_poll_qr(poll)

        return poll

class PollSerializer(BasePollSerializer):
    poll_type = PollTypeSerializer(required=True)
    author = MyProfileSerializer(required=True)
    questions = QuestionSerializer(many=True, required=False)

    
    qrcode_img = serializers.SerializerMethodField()

    def get_qrcode_img(self, instance):
        qrcode_path = instance.qrcode
        
        if qrcode_path:
            return get_qrcode_img_bytes(qrcode_path.path)

        return None

class MiniPollSerializer(BasePollSerializer):
    poll_type = serializers.CharField(source='poll_type.name')
    author = MiniProfileSerializer()

    class Meta:
        model = Poll
        exclude = ['qrcode', 'questions']


# сериализаторы воросов

class PollQuestionSerializer(serializers.ModelSerializer):
    answer_options = AnswerOptionSerializer(many=True)
    name = serializers.CharField(validators=[BaseValidator.name], required=False)

    has_correct_answer = serializers.CharField(validators=[BaseValidator.bolean], required=False)
    has_multiple_choices = serializers.CharField(validators=[BaseValidator.bolean], required=False)
    is_available = serializers.CharField(validators=[BaseValidator.bolean], required=False)
    is_text = serializers.CharField(validators=[BaseValidator.bolean], required=False)
    is_image = serializers.CharField(validators=[BaseValidator.bolean], required=False)
    is_free = serializers.CharField(validators=[BaseValidator.bolean], required=False)

    image = serializers.ImageField(validators=[BaseValidator.image], required=False)


    
    class Meta:
        model = PollQuestion
        fields = '__all__'


# сериализаторы вариантов ответа
        
class PollQuestionOptionSerializer(serializers.ModelSerializer):
    name = serializers.CharField(validators=[partial(BaseValidator.name, chars=100)], required=False)
    info = serializers.CharField(validators=[partial(BaseValidator.info, chars=500)], required=False)
    image = serializers.ImageField(validators=[BaseValidator.image], required=False)

    class Meta:
        model = AnswerOption
        fields = '__all__'  


# сериализаторы ответов
        
class PollAnswerSerializer(serializers.ModelSerializer):

    def create(self, validated_data):

        poll = self.context.get('poll')

        if poll.poll_type.name == 'Викторина':
            answer_option = validated_data['answer_option']
            if not answer_option.is_correct == None:
                if answer_option.is_correct:
                    validated_data['is_correct'] = True
                else:
                    validated_data['is_correct'] = False
                



        return super().create(validated_data)


    class Meta:
        model = PollAnswer
        fields = '__all__'  
