from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)  

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']

    def create(self, validated_data):
        email = validated_data.get('email')
        del(validated_data['email'])
        username = email.split('@')[0] if email else None
        user = User.objects.create(
            username=username,
            email=email,
            **validated_data  # Включаем остальные валидированные данные
        )

        password = validated_data.get('password')
        if password:
            user.set_password(password)
            user.save()

        return user
    

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

