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

    results = serializers.SerializerMethodField()

    def get_author(self, instance):
        return MiniProfileSerializer(instance=instance.profile).data
    
    def get_results(self, instance):
        if instance.poll.poll_type.name == 'Викторина':
            total = 0
            correct = 0
            answers = instance.answers.all()
            for answer in answers:
                total += 1
                if answer.answer_option.is_correct == True:
                    answer.is_correct = True
                    correct += 1
                else:
                    answer.is_correct = False
            
            results = {
                'total': total,
                'correct': correct,
                'wrong': total - correct,
                'percentage': round(float(correct / total), 2) * 100,
                # 'answers': PollAnswerSerializer(answers, many=True).data
            }
        
            return results
    
    def to_representation(self, instance):
        my_answers = super().to_representation(instance)
        data = {
                    'questions': PollQuestionSerializer(instance.poll.questions.all(), many=True).data,
                    'result': my_answers
                }
        
        for answer in my_answers['answers']:
            question_id = answer['question']
            answer_option_id = answer['answer_option']

            for question in data['questions']:
                for answer_option in question['answer_options']:
                    if answer_option['question'] == question_id and answer_option['id'] == answer_option_id:
                        answer_option['is_chosen'] = True
                        answer_option['text'] = answer['text']
                    else:
                        answer_option['is_chosen'] = False

        return data
    

    
    class Meta:
        model = PollAnswerGroup
        fields = '__all__'


# сериализаторы опросов

class BasePollSerializer(serializers.ModelSerializer):
    name = serializers.CharField(validators=[BaseValidator.name], required=False)
    description = serializers.CharField(validators=[BaseValidator.description], required=False)
    tags = serializers.CharField(validators=[BaseValidator.description], required=False)
    image = serializers.ImageField(validators=[BaseValidator.image], required=False)
    duration = serializers.DurationField(validators=[PollValidator.duration], required=False)
    # has_correct_answer = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    # has_multiple_choices = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    # is_anonymous = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    # can_cancel_vote = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    # mix_questions = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    # mix_options = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    # hide_participants_quantity = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    # hide_options_percentage = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    # is_paused = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)
    # is_closed = serializers.BooleanField(validators=[BaseValidator.bolean], required=False)    
    
    is_in_production = serializers.BooleanField(validators=[PollValidator.is_in_production], required=False)    


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
    # user_answers = PollAnswerGroupSerializer(many=True, required=False)

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
        exclude = ['qrcode']


# сериализаторы воросов

class PollQuestionSerializer(serializers.ModelSerializer):
    answer_options = AnswerOptionSerializer(many=True, required=False)
    name = serializers.CharField(validators=[BaseValidator.name], required=False)

    image = serializers.ImageField(validators=[BaseValidator.image], required=False)

    # если вопрос с открытым вариантом ответа, то создаем вариант ответа с текстом
    def set_is_free(self, value):
        if not self.instance.answer_options.filter(is_free_response=True).exists():
            free_option = AnswerOption.objects.create(
                question=self.instance,
                is_free_response=True,
            )
        options_to_update = self.instance.answer_options.all()
        new_options = []
        for option in options_to_update:
            option.is_correct = False
            new_options.append(option)
        AnswerOption.objects.bulk_update(new_options, ['is_correct'])

    # обнуляем правильность ответов при изменении has_multiple_choices или is_free
    def set_has_multiple_choices(self, value):
        options_to_update = self.instance.answer_options.all()
        new_options = []
        for option in options_to_update:
            option.is_correct = False
            new_options.append(option)
        AnswerOption.objects.bulk_update(new_options, ['is_correct'])


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

    def create(self, validated_data):
        if validated_data.get('is_free_response'):
            if self.context.get('has_free_option', None):
                raise MyValidationError(detail="В данном вопросе уже есть свободная форма ответа")

        
        return super().create(validated_data)  



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
            free_answers = {}
            question_id = instance.question.id
            user_answers = self.context.get('free_answers', [])
            for item in user_answers:
                if item['question_id'] == question_id:
                    free_answers[item['profile_name'] + ' ' + item['profile_surname']] = item['text']
                    # free_answers[item['user_id']] = item['text']
            return free_answers
             
    class Meta:
        model = AnswerOption
        fields = ['id', 'name', 'votes_quantity', 'is_free_response', 'free_answers'] 
            

class PollQuestionStatsSerializer(serializers.ModelSerializer):
    answer_options = AnswerOptionStatsSerializer(many=True)

    votes_quantity = serializers.SerializerMethodField()
    correct_answer_percentage = serializers.SerializerMethodField()

    def get_votes_quantity(self, instance):
        question_id = instance.id
        question_statistics = self.context.get('question_statistics', {})

        for item in question_statistics:
            if item['question_id'] == question_id:
                return item['quantity']
        return 0

    def get_correct_answer_percentage(self, instance):
        question_id = instance.id
        question_statistics = self.context.get('question_statistics', {})

        for item in question_statistics:
            if item['question_id'] == question_id:
                return item['correct_percentage']
        return 0
    
    class Meta:
        model = PollQuestion
        fields = ['id', 'answer_options', 'name', 'votes_quantity', 'has_multiple_choices',
                  'correct_answer_percentage']



class PollStatsSerializer(serializers.ModelSerializer):
    members_quantity = serializers.SerializerMethodField()
    questions_quantity = serializers.SerializerMethodField()
    correct_answer_percentage = serializers.SerializerMethodField()

    questions = PollQuestionStatsSerializer(many=True)

    def get_members_quantity(self, instance):
        return instance.members_quantity


    def get_questions_quantity(self, instance):
        return instance.questions_quantity

    def get_correct_answer_percentage(self, instance):
        poll_statistics = self.context.get('poll_statistics', None)

        if poll_statistics:
            return poll_statistics[0].get('correct_percentage', None)
            
        return None
    
    class Meta:
        model = Poll
        fields = ['members_quantity', 'questions_quantity', 'questions', 'correct_answer_percentage']




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

