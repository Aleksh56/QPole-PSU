from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueValidator
from .exсeptions import PollValidationException
from api.utils import check_file

from math import ceil

class BaseValidator:

    def name(value, chars=None):
        if not chars:
            if len(value) > 50:
                raise ValidationError("Название должно содержать менее 50 символов.")
        else:
            if len(value) > chars:
                raise ValidationError(f"Название должно содержать менее {chars} символов.")
        
    def info(value, chars=None):
        if value:
            if not chars:
                if len(value) > 500:
                    raise ValidationError("Описание должно содержать не более 500 символов.")
            else:
                if len(value) > chars:
                    raise ValidationError("Описание должно содержать не более 500 символов.")

    def description(value, chars=None):
        if value and not value == "":
            if value and len(value) > 1000:
                raise ValidationError("Описание должно содержать более 1000 символов.")

             
    def bolean(value):
        pass

    def image(image):    
        is_img_ok, details = check_file(image)

        if not is_img_ok:
            raise ValidationError(detail=details)
        
    def quantity(value):
        if value < 0:
            raise ValidationError("Количество должно быть положительным числом.")



class ProfileValidator(BaseValidator):

    def name(value):
        if len(value) > 50:
            raise ValidationError("Имя должно содержать менее 50 символов.")

    def surname(value):
        if len(value) > 50:
            raise ValidationError("Фимилия должна содержать менее 50 символов.")
        
    def patronymic(value):
        if len(value) > 50:
            raise ValidationError("Отчество должно содержать менее 50 символов.")
        
    def number(value):
        pass
        # if not is_number_valid(value):
        #     raise ValidationError(f"Номер телефона '{value}' введен некорректно.")
            
    def email(value):
        if not is_email_valid(value):
            raise ValidationError(f"Почта '{value}' введена некорректно.")

    def sex(value):
        if not value in ['М', 'Ж']:
            raise ValidationError(f"Пол '{value}' введен некорректно. Ожидается 'М' или 'Ж'.")

    def joining_date(value):
        from datetime import datetime
        try:
            datetime.strptime(value, '%Y-%m-%d')
        except ValueError:
            raise ValidationError(f"Дата '{value}' введена некорректно. Ожидается 'YYYY-MM-DD'.")


class PollValidator(BaseValidator):

    def name(value):
        if len(value) > 50:
            raise ValidationError("Название должно содержать менее 50 символов.")

    def duration(value):
        pass
        
    def is_in_production(value):
        if value:
            if value == False:
                raise ValidationError("Нельзя убрать опрос из продакшена, можно только удалить сам опрос.")


def is_number_valid(value):
    import re

    pattern = r'^(\+7|8)[\d]{10}$'
    if re.match(pattern, value):
        return True
    return False

def is_email_valid(value):
    import re

    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if re.match(pattern, value):
        return True
    return False


class ReleasePollValidator(PollValidator):

    @staticmethod
    def name(instance, max_len=None, min_len=None):
        value = getattr(instance, "name", None)
        
        if not value:
            raise PollValidationException(f"Заголовок текущего опроса не должен быть пустым.")
        

        if not min_len:
            if len(value) < 5:
                raise PollValidationException(f"Заголовок текущего опроса должен содержать не менее 5 символов.")
        else:
            if len(value) < min_len:
                raise PollValidationException(f"Заголовок текущего опроса должен содержать более {min_len - 1} символов.")
            
        if not max_len:
            if len(value) > 50:
                raise PollValidationException(f"Заголовок текущего опроса должен содержать менее 50 символов.")
        else:
            if len(value) > max_len:
                raise PollValidationException(f"Заголовок текущего опроса должен содержать менее {max_len} символов.")


class ReleaseQuestionValidator():

    @staticmethod
    def name(instance, max_len=None, min_len=None):
        value = getattr(instance, "name", None)

        if not value:
            raise PollValidationException(f"Текст вопроса №'{instance.order_id}' не должен быть пустым.")

        if not min_len:
            if len(value) < 5:
                raise PollValidationException(f"Текст вопроса №'{instance.order_id}' должен содержать не менее 5 символов.")
        else:
            if len(value) < min_len:
                raise PollValidationException(f"Текст вопроса №'{instance.order_id}' должен содержать более {min_len - 1} символов.")
            
        if not max_len:
            if len(value) > 50:
                raise PollValidationException(f"Текст вопроса №'{instance.order_id}' должен содержать менее 50 символов.")
        else:
            if len(value) > max_len:
                raise PollValidationException(f"Текст вопроса №'{instance.order_id}' должен содержать менее {max_len} символов.")
            

class ReleaseOptionValidator():

    @staticmethod
    def name(instance, max_len=None, min_len=None):
        value = getattr(instance, "name", None)
        is_free_response = getattr(instance, "is_free_response", False)

        if not value and not is_free_response:
            raise PollValidationException(f"Текст варианта ответа №'{instance.order_id}' вопроса №'{instance.question.order_id}' не должен быть пустым.")
        
        if not is_free_response:
            if not min_len:
                if len(value) < 1:
                    raise PollValidationException(f"Текст варианта ответа №'{instance.order_id}' вопроса №'{instance.question.order_id}' должен содержать не менее 1 символа.")
            else:
                if len(value) < min_len:
                    raise PollValidationException(f"Текст варианта ответа №'{instance.order_id}' вопроса №'{instance.question.order_id}' должен содержать более {min_len - 1} символов.")
                
            if not max_len:
                if len(value) > 50:
                    raise PollValidationException(f"Текст варианта ответа №'{instance.order_id}' вопроса №'{instance.question.order_id}' должен содержать менее 50 символов.")
            else:
                if len(value) > max_len:
                    raise PollValidationException(f"Текст варианта ответа №'{instance.order_id}' вопроса №'{instance.question.order_id}' должен содержать менее {max_len} символов.")
            
 
def is_poll_valid(poll):
    poll_validator = ReleasePollValidator()
    poll_validator.name(instance=poll, max_len=50, min_len=5)

    all_questions = poll.questions.all()
    if len(all_questions) == 0:
        raise PollValidationException(f"Текущий опрос должен содержать хотя бы 1 вопрос.")
    
    for question in all_questions:
        poll_question_validator = ReleaseQuestionValidator()
        poll_question_validator.name(instance=question, max_len=50, min_len=1)
        
        all_options = question.answer_options.all()
        if len(all_options) == 0:
            raise PollValidationException(f"Вопрос №'{question.order_id}' должен содержать хотя бы 1 вариант ответа.")
    
        if question.is_free:
            if len(all_options) > 1:
                raise PollValidationException(f"Вопрос №'{question.order_id}' является свободным и должен содержать 1 вариант ответа.")

        free_options_quantity = len([option for option in all_options if option.is_free_response == True])
        if free_options_quantity > 1:
            raise PollValidationException(f"Вопрос №'{question.order_id}' не может содержать более 1 свободного ответа.")

        for option in all_options:
            poll_option_validator = ReleaseOptionValidator()
            poll_option_validator.name(instance=option, max_len=50, min_len=1)

        if poll.poll_type.name == 'Викторина':
            has_correct_option = [option for option in all_options if option.is_correct]
            if not has_correct_option:
                raise PollValidationException(f"Вопрос №'{question.order_id}' должен содержать хотя бы 1 верный вариант ответа.")

            
    return True


