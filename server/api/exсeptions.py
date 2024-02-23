from rest_framework.exceptions import APIException

class MissingFieldException(APIException):
    status_code = 400
    default_code = 'missing_field'

    def __init__(self, field_name, detail=None):
        if detail is None:
            detail = f"Поле '{field_name}' требуется передать в запросе."
        self.detail = detail

    def __str__(self):
        return self.detail


class ObjectNotFoundException(APIException):
    status_code = 404
    default_code = 'object_not_found'

    def __init__(self, model=None, detail=None):
        if detail is None:
            detail = f"Объект модели '{model}' не найден."
        self.detail = detail

    def __str__(self):
        return self.detail
    
class ObjectAlreadyExistsException(APIException):
    status_code = 400
    default_code = 'profile_already_exists'

    def __init__(self, detail=None):
        if detail is None:
            detail = 'Объект данной модели уже существует.'
        self.detail = detail
    

class AccessDeniedException(APIException):
    status_code = 403 
    default_detail = 'У Вас нет доступа к данному ресурсу.'
    default_code = 'access_denied'



class WrongFieldTypeException(APIException):
    status_code = 400
    default_code = 'wrong_field_type'

    def __init__(self, field_name=None, expected_type=None, detail=None):
        if detail is None:
            detail = f"Поле '{field_name}' должно быть типа '{expected_type}'."
        self.detail = detail



class InvalidFieldException(APIException):
    status_code = 400
    default_code = 'invalid_field'

    def __init__(self, field=None, detail=None):
        if detail is None:
            detail = f"Поле '{field}' введено некорректно"
        self.detail = detail


class BadImageException(APIException):
    status_code = 400
    default_code = 'bad_image'

    def __init__(self, field_name, expected_type, detail=None):
        if detail is None:
            detail = f"Поле '{field_name}' должно быть типа '{expected_type}'."
        self.detail = detail



