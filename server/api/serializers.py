from django.contrib.auth.models import User
from rest_framework import serializers
from django.core.files.uploadedfile import InMemoryUploadedFile
from datetime import timedelta

from .validators import *
from .models import *
from .exсeptions import *
from .utils import check_file

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

class PollTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollType
        fields = '__all__'  

class PollForAllSerializer(serializers.ModelSerializer):
    poll_type = PollTypeSerializer()
    author = MiniProfileSerializer()
    questions = QuestionSerializer(many=True)

    members_quantity = serializers.SerializerMethodField()
    is_opened_for_voting = serializers.SerializerMethodField()
    
    has_user_participated_in = serializers.SerializerMethodField()

    def get_members_quantity(self, instance):
        profiles = set()   
        for question in instance.questions.all():   
            for answer_option in question.answer_options.all():   
                for participant in answer_option.answers.all():   
                    profiles.add(participant.profile)   
   
        return len(profiles)   

    def get_is_opened_for_voting(self, instance):   # доступно ли для голосования по времени
        if instance.duration:     
            return timezone.now() < instance.created_date + instance.duration
        else: return True

    def get_has_user_participated_in(self, instance):
        profile = self.context.get('profile')
        return instance.has_user_participated_in(user_profile=profile)

    class Meta:
        model = Poll
        fields = '__all__'  

class MyProfileSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Profile
        fields = '__all__'


class PollSerializer(serializers.ModelSerializer):
    poll_type = PollTypeSerializer(required=True)
    author = MyProfileSerializer(required=True)
    questions = QuestionSerializer(many=True, required=False)

    members_quantity = serializers.SerializerMethodField()
    is_opened_for_voting = serializers.SerializerMethodField()
    has_user_participated_in = serializers.SerializerMethodField()
    
    name = serializers.CharField(validators=[BaseValidator.name], required=False)
    description = serializers.CharField(validators=[BaseValidator.description], required=False)
    tags = serializers.CharField(validators=[BaseValidator.description], required=False)
    image = serializers.ImageField(validators=[BaseValidator.image], required=False)
    duration = serializers.TimeField(validators=[PollValidator.duration], required=False)
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

    def get_members_quantity(self, instance):
        profiles = set()   
        for question in instance.questions.all():   
            for answer_option in question.answer_options.all():   
                for participant in answer_option.answers.all():   
                    profiles.add(participant.profile)   
   
        return len(profiles)   

    def get_is_opened_for_voting(self, instance):   # доступно ли для голосования по времени
        if instance.duration:     
            return timezone.now() < instance.created_date + instance.duration
        else: return True

    def get_has_user_participated_in(self, instance):
        profile = self.context.get('profile')
        return instance.has_user_participated_in(user_profile=profile)

    
    class Meta:
        model = Poll
        fields = '__all__'

class CreatePollSerializer(serializers.ModelSerializer):   
    name = serializers.CharField(validators=[BaseValidator.name], required=False)
    description = serializers.CharField(validators=[BaseValidator.description], required=False)
    tags = serializers.CharField(validators=[BaseValidator.description], required=False)
    image = serializers.ImageField(validators=[BaseValidator.image], required=False)
    duration = serializers.TimeField(validators=[PollValidator.duration], required=False)
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


    class Meta:
        model = Poll
        fields = '__all__'



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


class PollQuestionOptionSerializer(serializers.ModelSerializer):
    

    def set_name(self, value):
        if value is not None and not isinstance(value, str):
            raise WrongFieldTypeException(field_name='name', expected_type='str или None')
        
        if len(value) > 100:
            raise InvalidFieldException(detail="Поле 'name' не может быть длинее 100 символов.")

        self.name = value
    
    def set_is_correct(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='is_correct', expected_type='bool или None')
  
        self.is_correct = value

    def set_is_free_response(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='is_free_response', expected_type='bool или None')
  
        self.is_free_response = value

    def set_is_text_response(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='is_text_response', expected_type='bool или None')
  
        self.is_text_response = value

    def set_is_image_response(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='is_image_response', expected_type='bool или None')
  
        self.is_image_response = value


    def set_image(self, image):
        if image == '' or image is None:
            self.image = None
            return
        
        if not isinstance(image, (InMemoryUploadedFile)):
            raise WrongFieldTypeException(field_name='image', expected_type='InMemoryUploadedFile')
        is_img_ok, details = check_file(image)
        if is_img_ok:
            self.image = image
        else:
            raise InvalidFieldException(detail=f"Файл не прошел проверку: {details}") 
        

    def is_valid(self, raise_exception=False):
        for attr, value in self.initial_data.items():
            setter_name = f"set_{attr}"
            if hasattr(self, setter_name):
                getattr(self, setter_name)(value)

        return super().is_valid(raise_exception=raise_exception)
    
    class Meta:
        model = AnswerOption
        fields = '__all__'  


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
