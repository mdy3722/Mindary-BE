from rest_framework import serializers
from .models import User
import re

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class KakaoLoginSerializer(serializers.Serializer):
    access_code = serializers.CharField(required=True)

class KakaoRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['kakao_id', 'nickname', 'email']

class OriginalRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'nickname', 'password']

    def validate_password(self, value):
        if not re.match(r'^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[a-z\d!@#$%^&*]{8,12}$', value):
            raise serializers.ValidationError("비밀번호는 8~12 자리의 영소문자, 숫자, 특수문자 조합이어야 합니다.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class EmailVerificationSendSerializer(serializers.Serializer):
    email = serializers.EmailField()

class EmailVerificationCheckSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=4)