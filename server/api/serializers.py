from django.contrib.auth.models import User
from rest_framework import serializers
from django.core.files.uploadedfile import InMemoryUploadedFile
from datetime import timedelta

from django.db.models import Count


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

    # number = serializers.CharField(validators=[validate_number], required=False)

    class Meta:
        model = Profile
        fields = '__all__'

    def is_valid(self, raise_exception=False):

        value = self.initial_data.get('value', None)
        if value:
            if len(value) > 50:
                raise InvalidFieldException(field='value', detail=f"Имя не можеть быть длинее 50 символов.")
            
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

class PollSerializer(serializers.ModelSerializer):
    poll_type = PollTypeSerializer()
    author = ProfileSerializer()
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



class UpdatePollSerializer(serializers.ModelSerializer):

    def set_has_multiple_choices(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='has_multiple_choices', expected_type='bool или None')
        
        self.has_multiple_choices = value

    def set_has_correct_answer(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='has_correct_answer', expected_type='bool или None')
        
        self.has_correct_answer = value

    def set_is_anonymous(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='is_anonymous', expected_type='bool или None')
        
        self.is_anonymous = value

    def set_can_cancel_vote(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='can_cancel_vote', expected_type='bool или None')
        
        self.can_cancel_vote = value

    def set_is_closed(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='is_closed', expected_type='bool или None')
        
        self.is_closed = value
    
    def set_is_paused(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='is_paused', expected_type='bool или None')
        
        self.is_paused = value

    def set_duration(self, duration:str):
        try:
            days, time = duration.split(' ')
            duration_parts = time.split(':')
        except ValueError:
            raise WrongFieldTypeException(detail="Неверный формат времени. Ожидается дни часы:минуты:секунды")
        try:
            days = int(days)
            if days < 0:
                raise InvalidFieldException(detail="Количество дней должно быть неотрицательным")
            hours = int(duration_parts[0])
            if not 0 <= hours < 24:
                raise InvalidFieldException(detail="Количество часов должно быть от 0 до 23")
            minutes = int(duration_parts[1])
            if not 0 <= minutes < 60:
                raise InvalidFieldException(detail="Количество минут должно быть от 0 до 59")
            seconds = int(duration_parts[2])
            if not 0 <= seconds < 60:
                raise InvalidFieldException(detail="Количество секунд должно быть от 0 до 59")
        except ValueError as e:
            raise WrongFieldTypeException(detail="Неверный формат времени. Ожидается целое число для каждой части") from e

        duration = timedelta(days=days, hours=hours, minutes=minutes, seconds=seconds)
        self.duration = duration

    def set_hide_participants_quantity(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='hide_participants_quantity', expected_type='bool или None')
        
        self.hide_participants_quantity = value
    
    def set_mix_questions(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='mix_questions', expected_type='bool или None')
        
        self.mix_questions = value

    def set_mix_options(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='mix_options', expected_type='bool или None')
        
        self.mix_options = value

    def set_hide_options_percentage(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='hide_options_percentage', expected_type='bool или None')
        
        self.hide_options_percentage = value


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
        model = Poll
        fields = '__all__'



class UpdatePollQuestionSerializer(serializers.ModelSerializer):
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
        model = PollQuestion
        fields = '__all__'



class PollQuestionSerializer(serializers.ModelSerializer):
    answer_options = AnswerOptionSerializer(many=True)

    def set_has_multiple_choices(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='has_multiple_choices', expected_type='bool или None')
        
        self.has_multiple_choices = value
        
    def set_name(self, value):
        if value is not None and not isinstance(value, str):
            raise WrongFieldTypeException(field_name='name', expected_type='str или None')
        
        if len(value) > 100:
            raise InvalidFieldException(detail="Поле 'name' не может быть длинее 100 символов.")

        self.name = value
    
    def set_info(self, value):
        if value is not None and not isinstance(value, str):
            raise WrongFieldTypeException(field_name='info', expected_type='str или None')
        
        if len(value) > 500:
            raise InvalidFieldException(detail="Поле 'info' не может быть длинее 500 символов.")

        self.name = value

    def set_is_available(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='is_available', expected_type='bool или None')
  
        self.is_available = value

    def set_is_text(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='is_text', expected_type='bool или None')
  
        self.is_text = value

    def set_is_image(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='is_image', expected_type='bool или None')
  
        self.is_image = value

    def set_is_free(self, value):
        if value is not None and not isinstance(value, bool):
            raise WrongFieldTypeException(field_name='is_free', expected_type='bool или None')
  
        self.is_free = value


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
                

            print(validated_data)


        return super().create(validated_data)

    # correct_answers_quantity = serializers.SerializerMethodField()

    # def get_correct_answers_quantity(self, obj):
    #     print(obj)
    #     # is_correct = obj.is_correct
    #     # correct_answers = PollAnswer.objects.filter(is_correct=True).count()
    #     return None


    class Meta:
        model = PollAnswer
        fields = '__all__'  
