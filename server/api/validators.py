from rest_framework.exceptions import ValidationError
from api.utils import check_file

from math import ceil

class BaseValidator:

    def name(value):
        if len(value) > 50:
            raise ValidationError("Название должно содержать не более 50 символов.")
        
    def info(value):
        if value:
            if len(value) > 500:
                raise ValidationError("Описание должно содержать не более 500 символов.")

    def description(value):
        if value:
            if len(value) > 1000:
                raise ValidationError("Описание должно содержать не более 500 символов.")
             
    def bolean(value):
        if not isinstance(value, bool):
            raise ValidationError("Характеристика должна быть переменной логического типа.")

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
        if not is_number_valid(value):
            raise ValidationError(f"Номер телефона '{value}' введен некорректно.")
            
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
        # hours = value.hour
        # days = ceil(hours // 24)
        # if days > 365:
        #     raise ValidationError("Нельзя сделать опрос открытым более чем на год")




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
