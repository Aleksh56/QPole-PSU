from django.db import models
from django.db import transaction
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

import imghdr
from django.core.files.uploadedfile import InMemoryUploadedFile

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=50, blank=True, null=True)
    surname = models.CharField(max_length=50, blank=True, null=True)
    patronymic = models.CharField(max_length=50, default='Не указано', blank=True, null=True)
    sex = models.CharField(max_length=1, blank=False, null=False)
    number = models.CharField(max_length=50, blank=True, null=True) 

    joining_date = models.DateField(auto_now_add=True)

    role = models.ForeignKey('UserRole', on_delete=models.CASCADE, related_name='profiles', blank=True, null=True)


    def __str__(self):
        return self.name + ' ' + self.surname
    

class UserRole(models.Model):
    role = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.role
    

class PollType(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=50, default="", blank=True)

    def __str__(self):
        return self.name
    


class PollParticipant(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='participants_poll')
    comment = models.CharField(max_length=150, blank=True, null=True)
    voting_date = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"{self.profile.user.username} participated in poll"


class AnswerOption(models.Model):
    name = models.CharField(max_length=100, default=None, null=True)
    image = models.ImageField(verbose_name='Фото ответа', upload_to=f'images/poll_options/', blank=True, null=True, default=None)
    answers = models.ManyToManyField(PollParticipant, related_name='answeroption_participants', blank=True, null=True)

    is_correct = models.BooleanField(default=None, null=True)   # верный ли ответ
    is_text_response = models.BooleanField(default=True, null=True)    # текст ли как ответ
    is_free_response = models.BooleanField(default=False, null=True)    # свободная ли форма ответа
    is_image_response = models.BooleanField(default=False, null=True)    # фото ли как ответ

    def __str__(self):
        if self.is_free_response:
            if not self.is_image_response:
                return f"Свободный ответ: '{self.name}'"
            else:
                if self.name:
                    return f"Свободный ответ с фотографией: '{self.name}'"
                else:
                    return f"Свободный ответ: '{self.name}'"
        else:
            if self.name:
                return f"Вариант ответа '{self.name}'"
            else:
                return f"Вариант ответа №{self.id}"



class PollQuestion(models.Model):
    name = models.CharField(max_length=100, default=None, null=True)
    info = models.CharField(max_length=500, default=None, null=True, blank=True)
    image = models.ImageField(verbose_name='Фото вопроса', upload_to=f'images/poll_questions/', blank=True, null=True, default=None)
    answer_options = models.ManyToManyField(AnswerOption, related_name='pollquestion_answeroptions', blank=True, null=True)

    is_free = models.BooleanField(default=False, null=True)   # свободная ли форма ответа
    is_available = models.BooleanField(default=True, null=True)   # доступен ли вопрос
    is_text = models.BooleanField(default=True, null=True)    # текст ли как вопрос
    is_image = models.BooleanField(default=False, null=True)    # фото ли как вопрос

    def __str__(self):
        if self.name:
            return f"Вопрос '{self.name}'"
        else:
            return f"Вопрос №{self.id}"

    
    def add_answer_option(self, is_free_response=None, image=None, **kwargs):
        """
            is_free_response - свободная форма ответа
            name - наименование варианта ответа
        """
        if is_free_response is not None and not isinstance(is_free_response, bool):
            raise ValueError("'is_free_response' должен быть указан в формате bool или None")

        answer_option = None

        if is_free_response:
            if image:
                if self.__check_file(image):
                    answer_option = AnswerOption(
                        name=None,
                        is_correct=None,
                        is_text_response = False,
                        is_image_response = True,
                        is_free_response = True,
                        image = image
                    )
                else:
                    raise ValueError(f"Файл не прошел проверку!")     
            else:
                name = kwargs.get('name', None)
                if not name or len(name) == 0:
                    raise ValueError(f"Параметр 'name' не указан или пустой.")
                # проверка на то что такой вариант ответа уже есть
                if name in [option.name for option in self.answer_options.all()]:
                    raise ValueError(f"Вариант '{name}' уже имеется среди вариантов ответа.")
                
                answer_option = AnswerOption(
                    name=name,
                    is_correct=None,
                    is_text_response = True,
                    is_image_response = False,
                    is_free_response = True,
                    image = None
                )          
        else:
            is_correct = kwargs.get('is_correct', None)
            if is_correct is not None and not isinstance(is_correct, bool):
                raise ValueError("'is_correct' должен быть в формате bool или None.")

            name = kwargs.get('name', None)
            if not isinstance(name, str):
                raise ValueError(f"'name' должен быть в формате str.")
            
            if not name or len(name) == 0:
                raise ValueError(f"Параметр 'name' не указан или пустой.")
            
            # проверка на то что такой вариант ответа уже есть
            if name in [option.name for option in self.answer_options.all()]:
                raise ValueError(f"Вариант '{name}' уже имеется среди вариантов ответа.")


            answer_option = AnswerOption(
                name=name,
                is_correct=is_correct,
                is_text_response = True,
                is_image_response = False,
                is_free_response = False,
                image = None
            )          

        # сохранение если все ок при создании
        with transaction.atomic():
            answer_option.save()
            self.answer_options.add(answer_option)
            return True
        



class Poll(models.Model):
    poll_id = models.CharField(max_length=100, unique=True) # уникальный id
    author = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='authored_polls') # автор опроса
    image = models.ImageField(verbose_name='Фото опроса', upload_to=f'images/poll_images/', blank=True, null=True) # фото 
    name = models.CharField(max_length=50, blank=True, null=True) # имя опроса
    description = models.TextField(blank=True, null=True) # текст начать опрос

    poll_type = models.ForeignKey(PollType, on_delete=models.CASCADE) # тип опроса
    created_date = models.DateTimeField(auto_now_add=True) # дата создания
    duration = models.DurationField(blank=True, null=True) # таймер

    has_multiple_choices = models.BooleanField(default=False) # множественный выбор
    has_correct_answer = models.BooleanField(default=False) # есть ли верные ответы или опрос
    is_anonymous = models.BooleanField(default=False) # анонимное
    can_cancel_vote = models.BooleanField(default=False) # запретить повторное.

    # вопросы
    questions = models.ManyToManyField(PollQuestion, related_name='poll_questions', blank=True, null=True)
    
    is_paused = models.BooleanField(default=False) # приостановлено
    is_closed = models.BooleanField(default=False) # завершено


    def __str__(self):
        if self.name:
            return f"Опрос '{self.name}'"
        else:
            return f"Опрос №{self.id}"
    
    def delete(self):
        self.__delete_related_questions()
        super().delete(keep_parents=False)

    # удаление связанных с вопросом ваританов ответа
    def __delete_related_questions(self): 
        questions = self.questions.all()
        for question in questions:
            for answer in question.answer_options.all():
                answer.delete()
            question.delete()

    def set_duration(self, duration:str):
        duration_parts = duration.split(':')

        if len(duration_parts) != 4:
            raise ValueError("Неверный формат времени. Ожидается дни:часы:минуты:секунды")

        try:
            days = int(duration_parts[0])
            if days < 0:
                raise ValueError("Количество дней должно быть неотрицательным")
            hours = int(duration_parts[1])
            if not 0 <= hours < 24:
                raise ValueError("Количество часов должно быть от 0 до 23")
            minutes = int(duration_parts[2])
            if not 0 <= minutes < 60:
                raise ValueError("Количество минут должно быть от 0 до 59")
            seconds = int(duration_parts[3])
            if not 0 <= seconds < 60:
                raise ValueError("Количество секунд должно быть от 0 до 59")
        except ValueError as e:
            raise ValueError("Неверный формат времени. Ожидается целое число для каждой части") from e


        duration = timedelta(days=days, hours=hours, minutes=minutes, seconds=seconds)
        self.duration = duration


    def add_question(self, is_free=None, image=None, **kwargs):
        """
            is_free_response - свободная форма вопроса;
            name - наименование вопроса;
            image - фото к вопросу;
        """
        if is_free is not None and not isinstance(is_free, bool):
            raise ValueError("'is_free_response' должен быть указан в формате bool или None")

        question = None

        if is_free:
            if image:
                if self.__check_file(image):
                    question = PollQuestion(
                        name=None,
                        is_text = False,
                        is_image = True,
                        is_free= True,
                        image = image
                    )
                else:
                    raise ValueError(f"Файл не прошел проверку!")     
            else:
                name = kwargs.get('name', None)
                if not name or len(name) == 0:
                    raise ValueError(f"Параметр 'name' не указан или пустой.")
                info = kwargs.get('info', None)
                if len(info) > 500:
                    raise ValueError(f"Описание не может быть больше 500 символов в длину.")
                
                question = PollQuestion(
                    name=name,
                    is_text = True,
                    is_image = False,
                    is_free = True,
                    image = None
                )          
        else:
            is_correct = kwargs.get('is_correct', None)
            if is_correct is not None and not isinstance(is_correct, bool):
                raise ValueError("'is_correct' должен быть в формате bool или None.")

            name = kwargs.get('name', None)
            if not isinstance(name, str):
                raise ValueError(f"'name' должен быть в формате str.")
            
            if not name or len(name) == 0:
                raise ValueError(f"Параметр 'name' не указан или пустой.")
        

            question = PollQuestion(
                name=name,
                is_correct=is_correct,
                is_text_response = True,
                is_image_response = False,
                is_free_response = False,
                image = None
            )          

        # сохранение если все ок при создании
        with transaction.atomic():
            question.save()
            self.questions.add(question)
            return True

    
    @property   
    def members_quantity(self):   # число участников опроса
        profiles = set()   
        for question in self.questions.all():   
            for answer_option in question.answer_options.all():   
                for participant in answer_option.answers.all():   
                    profiles.add(participant.profile)   
   
        return len(profiles)   
   
    @property
    def opened_for_voting(self):   # доступно ли для голосования по времени
        if self.duration:     
            return timezone.now() < self.created_date + self.duration
        else: return True




    def __check_file(self, file):
        # Проверяем тип файла с помощью imghdr
        file_type = imghdr.what(file)
        if not file_type:
            return False
        
        # Проверяем, является ли файл изображением
        if file_type not in ['jpeg', 'png', 'gif', 'bmp', 'pdf']:
            return False

        # Проверяем размер файла
        if file.size > 100 * 1024 * 1024: 
            return False

        return True
