from django.contrib.auth.models import User
from rest_framework import serializers
from functools import partial

from .validators import *
from .models import *
from .utils import generate_poll_qr, get_qrcode_img_bytes
from .exсeptions import *


class MiniUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username']
    

class GetProfileSerializer(serializers.ModelSerializer):
    user = MiniUserSerializer()
    role = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

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


# сериализаторы ответов
        
class PollAnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = PollAnswer
        fields = '__all__'


class PollAnswerGroupSerializer(serializers.ModelSerializer):
    answers = PollAnswerSerializer(many=True, read_only=True)
    author = serializers.SerializerMethodField()


    def get_author(self, instance):
        return MiniProfileSerializer(instance=instance.profile).data
    
        
    class Meta:
        model = PollAnswerGroup
        fields = '__all__'

class PollParticipantsGroupSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()


    def get_author(self, instance):
        return MiniProfileSerializer(instance=instance.profile).data
    
        
    class Meta:
        model = PollParticipantsGroup
        fields = '__all__'



class PollVotingResultSerializer(PollAnswerGroupSerializer):
    answers = PollAnswerSerializer(many=True, read_only=True)
    author = serializers.SerializerMethodField()


    def get_author(self, instance):
        return MiniProfileSerializer(instance=instance.profile).data
    

    def to_representation(self, instance):
        my_answers = serializers.ModelSerializer.to_representation(self, instance)
                
        poll_points = 0
        poll_gained_points = 0

        data = {
                    'questions': PollQuestionSerializer(instance.poll.questions.all(), many=True).data,
                    'result': my_answers,
                    'poll_type': instance.poll.poll_type.name,
                }

        for question in data['questions']: # проходим по всем вопросам 
            question_correct_quantity = 0
            question_gained_quantity = 0
            if question.get('is_answered') is None: # проверка чтобы не занулять вопрос на который дан ответ
                question['is_answered'] = False # если ответ уже дан, то не делаем его False
                question['points'] = 0  # изначально начисляем 0 баллов за каждый
                question['options_quantity'] = 0  # изначально считаем колво верных вариантов ответа
            for answer_option in question['answer_options']: # проходим по всем вариантам ответа 
                if answer_option.get('is_correct') is not None: # проеряем, что у нас викторина
                    if answer_option.get('is_correct') == True:
                        question_correct_quantity += 1

                if answer_option.get('is_answered') is None: # проверка на то что на вариант ответа еще не ответили
                    answer_option['is_chosen'] = False # отмечаем, что вариант ответа изначально не выбран
                    answer_option['text'] = None # отмечаем, что текст для варианта ответа изначально не указан
                    answer_option['points'] = 0 # отмечаем, сколько баллов получили за ответ

                for answer in my_answers['answers']: # проходим по всем моим ответам
                    if answer['answer_option'] == answer_option['id']: # выбираем ответ по совпавшим id
                        question['is_answered'] = True # отмечаем, что вопрос отвечен
                        answer_option['is_chosen'] = True # отмечаем, что вариант ответа был выбран
                        answer_option['text'] = answer.get('text', None) # добавляем текст ответа, если он был дан
                        answer_option['points'] = answer['points'] # начисляем очки, которые получили после проверки правильности

                        if answer_option['points'] is not None: # проверяем что очки вообще есть
                            if answer_option['points'] > 0: # если выбрали верную опцию, то добавляем балл
                                question_gained_quantity += answer_option['points']
                            else:
                                answer_option['points'] = -1 # если выбрали неверную опцию, то убавляем балл
                                question_gained_quantity += answer_option['points']
            

            if question_correct_quantity:
                question['points'] += round(question_gained_quantity / question_correct_quantity, 2) # начисляем очки, которые получили после проверки правильности
                if question['points'] < 0:
                    question['points'] = 0
                poll_gained_points += question['points']
                poll_points += 1

                results = {
                        'total': poll_points,
                        'correct': poll_gained_points,
                        'wrong': poll_points - poll_gained_points,
                        'percentage': round(float(poll_gained_points / poll_points) * 100, 2),
                    }
                
                data['results'] = results

        return data
    

    
    class Meta:
        model = PollAnswerGroup
        fields = '__all__'


class MyPollUsersAnswersSerializer(PollVotingResultSerializer):
    answers = PollAnswerSerializer(many=True, read_only=True)
    author = serializers.SerializerMethodField()


    def get_author(self, instance):
        return MiniProfileSerializer(instance=instance.profile).data
    

# сериализаторы опросов

class PollSettingsSerializer(serializers.ModelSerializer):
    completion_time = serializers.DurationField(validators=[BasePollSettingsValidator.completion_time])
    start_time = serializers.DateTimeField(validators=[BasePollSettingsValidator.start_time])
    end_time = serializers.DateTimeField(validators=[BasePollSettingsValidator.end_time])
    duration = serializers.DurationField(validators=[BasePollSettingsValidator.duration])

    max_revotes_quantity = serializers.IntegerField(validators=[partial(BasePollSettingsValidator.max_revotes_quantity, num=10)])

    # если установлена длительноть доступа к опросу, то обнулить end_time
    def set_duration(self, value):
        if value:
            if self.instance.end_time:
                self.instance.end_time = None
            
    # если установлен end_time, то обнулить duration
    def set_end_time(self, value):
        if value:
            if self.instance.duration:
                self.instance.duration = None

    def create(self, validated_data):
        for attr, value in self.initial_data.items():
            setter_name = f"set_{attr}"
            if hasattr(self, setter_name):
                getattr(self, setter_name)(value)

        return super().create(validated_data)  

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        for attr, value in self.initial_data.items():
            setter_name = f"set_{attr}"
            if hasattr(self, setter_name):
                getattr(self, setter_name)(value)
        return instance

    class Meta:
        model = PollSettings
        fields = '__all__'

class BasePollSerializer(serializers.ModelSerializer):
    name = serializers.CharField(validators=[BaseValidator.name], required=False)
    description = serializers.CharField(validators=[BaseValidator.description], required=False)
    tags = serializers.CharField(validators=[BaseValidator.description], required=False)
    image = serializers.ImageField(validators=[BaseValidator.image], required=False)
    duration = serializers.DurationField(validators=[PollValidator.duration], required=False)  
    
    is_in_production = serializers.BooleanField(validators=[PollValidator.is_in_production], required=False)    


    participants_quantity = serializers.SerializerMethodField()
    questions_quantity = serializers.SerializerMethodField()
    is_opened_for_voting = serializers.SerializerMethodField()
    has_user_participated_in = serializers.SerializerMethodField()

    def get_participants_quantity(self, instance):
        return instance.participants_quantity


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
    poll_setts = PollSettingsSerializer(required=False)
    questions = QuestionSerializer(many=True, required=False)

    qrcode_img = serializers.SerializerMethodField()


    def get_qrcode_img(self, instance):
        qrcode_path = instance.qrcode
        
        if qrcode_path:
            return get_qrcode_img_bytes(qrcode_path.path)

        return None

    def create(self, validated_data):
        instance = super().create(validated_data)
        for attr, value in self.initial_data.items():
            setter_name = f"set_{attr}"
            if hasattr(self, setter_name):
                getattr(self, setter_name)(value)
        return instance

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        for attr, value in self.initial_data.items():
            setter_name = f"set_{attr}"
            if hasattr(self, setter_name):
                getattr(self, setter_name)(value)
        return instance
    
class MiniPollSerializer(BasePollSerializer):
    poll_type = serializers.CharField(source='poll_type.name')
    author = MiniProfileSerializer()

    class Meta:
        model = Poll
        exclude = ['qrcode']



# сериализаторы воросов

class PollQuestionSerializer(serializers.ModelSerializer):
    answer_options = AnswerOptionSerializer(many=True, required=False)
    name = serializers.CharField(validators=[BaseValidator.name], required=False)

    image = serializers.ImageField(validators=[BaseValidator.image], required=False)


    # обнуляем правильность ответов при изменении has_multiple_choices или is_free
    def set_has_multiple_choices(self, value):
        options_to_update = self.instance.answer_options.all()
        new_options = []
        for option in options_to_update:
            option.is_correct = False
            new_options.append(option)
        AnswerOption.objects.bulk_update(new_options, ['is_correct'])

        # if value:
        #     if not self.instance.is_free:
        #         option_to_delete = self.instance.answer_options.filter(is_free_response=True).first()
        #         if option_to_delete:
        #             option_to_delete.delete()

    # если вопрос с открытым вариантом ответа, то создаем вариант ответа с текстом и удаляем остальные
    def set_is_free(self, value):
        if value:
            self.instance.answer_options.all().delete()
            
            if not self.instance.answer_options.filter(is_free_response=True).exists():
                free_option = AnswerOption.objects.create(
                    question=self.instance,
                    is_free_response=True,
                    is_correct=True,
                )
        else:
            if self.instance.is_free:
                free_option = self.instance.answer_options.filter(is_free_response=True).first()
                if free_option:
                    free_option.delete()


    def create(self, validated_data):
        instance = super().create(validated_data)
        for attr, value in self.initial_data.items():
            setter_name = f"set_{attr}"
            if hasattr(self, setter_name):
                getattr(self, setter_name)(value)
        return instance

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        for attr, value in self.initial_data.items():
            setter_name = f"set_{attr}"
            if hasattr(self, setter_name):
                getattr(self, setter_name)(value)
        return instance
    
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


    def set_is_correct(self, value):
        question = self.instance.question
        if value:
            # если выбран верным вариант ответа, то делаем неверным свободный вариант ответа
            free_option = question.answer_options.filter(is_free=True).first()
            if free_option and free_option.is_correct:
                free_option.is_correct = False
                free_option.save()

            # если вопрос с открытым вариантом ответа верный, то обнуляем все остальные варианты ответа
            if self.instance.is_free_response:
                options_to_update = self.instance.question.answer_options.all()
                new_options = []
                for option in options_to_update:
                    if not self.instance.id == option.id:
                        option.is_correct = False
                        new_options.append(option)
                AnswerOption.objects.bulk_update(new_options, ['is_correct'])

            # если у вопроса не множестенный выбор, то надо сделать неверными все варианты ответа
            if not question.has_multiple_choices:
                all_options = question.answer_options.all()
                new_options = []
                for option in all_options:
                    if option.is_correct:
                        option.is_correct = False
                        new_options.append(option)

                AnswerOption.objects.bulk_update(new_options, ['is_correct'])


    def create(self, validated_data):
        if validated_data.get('is_free_response'):
            if self.context.get('has_free_option', None):
                raise MyValidationError(detail="В данном вопросе уже есть свободная форма ответа")

        for attr, value in self.initial_data.items():
            setter_name = f"set_{attr}"
            if hasattr(self, setter_name):
                getattr(self, setter_name)(value)

        return super().create(validated_data)  

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        for attr, value in self.initial_data.items():
            setter_name = f"set_{attr}"
            if hasattr(self, setter_name):
                getattr(self, setter_name)(value)
        return instance

# сериализаторы статистики опросов

class AnswerOptionStatsSerializer(serializers.ModelSerializer):
    votes_quantity = serializers.SerializerMethodField()
    free_answers = serializers.SerializerMethodField()


    def get_votes_quantity(self, instance):
        option_id = instance.id
        options_answers_count = self.context.get('options_answers_count', [])
        for item in options_answers_count:
            if item['answer_option'] == option_id:
                return item['quantity']
        return 0


    def get_free_answers(self, instance):
        if instance.is_free_response:
            free_answers = []
            question_id = instance.question.id
            user_answers = self.context.get('free_answers', [])
            for item in user_answers:
                if item['question_id'] == question_id:
                    answer = {
                        'name': (item.get('profile_name') or '') + ' ' + (item.get('profile_surname', '') or ''),
                        'text': item['text']
                    }
                    free_answers.append(answer)
            return free_answers
             
    class Meta:
        model = AnswerOption
        fields = ['id', 'name', 'votes_quantity', 'is_free_response', 'free_answers'] 
            

class PollQuestionStatsSerializer(serializers.ModelSerializer):
    answer_options = AnswerOptionStatsSerializer(many=True)

    votes_quantity = serializers.SerializerMethodField()
    answer_percentage = serializers.SerializerMethodField()
    average_correctness_percentage = serializers.SerializerMethodField()

    def get_votes_quantity(self, instance):
        question_id = instance.id
        question_statistics = self.context.get('question_statistics', {})

        for item in question_statistics:
            if item['question_id'] == question_id:
                return item['quantity']
        return 0
 
    def get_average_correctness_percentage(self, instance):
        question_id = instance.id
        questions_percentage = self.context.get('questions_percentage', {})

        for item in questions_percentage:
            if item['question_id'] == question_id:
                return item['correct_percentage']
        return 0
    
    def get_answer_percentage(self, instance):
        question_id = instance.id
        question_statistics = self.context.get('questions_percentage', {})
        for question in question_statistics:
            if question['question_id'] == question_id:
                return question['answer_percentage']
        return None
    
    
    class Meta:
        model = PollQuestion
        fields = ['id', 'answer_options', 'name', 'votes_quantity', 'has_multiple_choices',
                  'average_correctness_percentage', 'answer_percentage']



class PollStatsSerializer(serializers.ModelSerializer):
    participants_quantity = serializers.SerializerMethodField()
    questions_quantity = serializers.SerializerMethodField()
    correct_answer_percentage = serializers.SerializerMethodField()

    questions = PollQuestionStatsSerializer(many=True)

    def get_participants_quantity(self, instance):
        return instance.participants_quantity


    def get_questions_quantity(self, instance):
        return instance.questions_quantity

    def get_correct_answer_percentage(self, instance):
        poll_statistics = self.context.get('poll_statistics', None)

        if poll_statistics:
            average_correct_percentage = poll_statistics.get('average_correct_percentage', None)
            if average_correct_percentage:
                return round(average_correct_percentage, 2)
            
        return None
    
    class Meta:
        model = Poll
        fields = ['participants_quantity', 'questions_quantity', 'questions', 'correct_answer_percentage']




class SupportRequestTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportRequestType
        fields = '__all__'

    

class SupportRequestBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportRequest
        fields = '__all__'


class SupportRequestSerializer(SupportRequestBaseSerializer):
    author = GetProfileSerializer()
    type = SupportRequestTypeSerializer()

