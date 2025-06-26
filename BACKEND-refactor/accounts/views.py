"""         import        """
import os
import requests
import jwt
import string
import random

from django.utils import timezone
from datetime import timedelta
from django.shortcuts import render
from rest_framework import status
from dotenv import load_dotenv
load_dotenv()
from mindary.settings import EMAIL_HOST_PASSWORD

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import User, EmailVerification
from accounts.serializers import EmailVerificationSendSerializer, EmailVerificationCheckSerializer, OriginalRegistrationSerializer, KakaoRegistrationSerializer, KakaoLoginSerializer
from django.http import HttpResponse
from django.core.mail import send_mail

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from django.views.decorators.csrf import csrf_exempt

import logging
logger = logging.getLogger('django')

"""
      < Kakao Login >
"""
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def kakao_login(request):
    #print("🟡 [kakao_login] 진입")
    serializer = KakaoLoginSerializer(data=request.data)
    if not serializer.is_valid():
        print("❌ [kakao_login] 시리얼라이저 오류:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    code = serializer.validated_data['access_code']
    #print("✅ 프론트에서 받은 code:", code)  # ✅ 여기에 출력

    token_response = requests.post(
        'https://kauth.kakao.com/oauth/token',
        headers={'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'},
        data={
            'grant_type': 'authorization_code',
            'client_id': os.environ.get('KAKAO_REST_API_KEY'),
            'redirect_uri': os.environ.get('KAKAO_REDIRECT_URI'),
            'code': code,
        },
    )

    print("카카오로 access_token 요청 결과:", token_response.text)  # ✅ 여기에 출력

    if token_response.status_code != 200:
        return Response({'detail': 'Access token 요청 실패'}, status=token_response.status_code)

    access_token = token_response.json().get('access_token')

    user_info = requests.get(
        'https://kapi.kakao.com/v2/user/me',
        headers={
            'Authorization': f'Bearer {access_token}',
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        }
    ).json()

    print("user_info 전체 응답:", user_info)
    print("user_info.get('id'):", user_info.get("id"))


    kakao_id = user_info.get("id")
    kakao_email = user_info.get("kakao_account", {}).get("email")
    nickname = user_info.get("properties", {}).get("nickname", "")

    if not kakao_id:
        return Response({'error': '카카오 ID가 존재하지 않음'}, status=400)

    try:
        user = User.objects.get(kakao_id=kakao_id)
        refresh = RefreshToken.for_user(user)
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        }, status=200)

    except User.DoesNotExist:
        # 회원가입 필요
        return Response({
            'message': '회원가입이 필요합니다.',
            'kakao_id': kakao_id,
            'nickname': nickname,
            'email': kakao_email
        }, status=200)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def kakao_register(request):
    serializer = KakaoRegistrationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(kakao_id=serializer.validated_data['kakao_id']).exists():
        return Response({'detail': '이미 가입된 카카오 사용자입니다.'}, status=400)

    user = User.objects.create_user(
        email=serializer.validated_data.get('email'),
        nickname=serializer.validated_data['nickname'],
        kakao_id=serializer.validated_data['kakao_id'],
        is_social=True
    )

    refresh = RefreshToken.for_user(user)
    return Response({
        'access_token': str(refresh.access_token),
        'refresh_token': str(refresh)
    }, status=201)

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify(request):
    return Response({'datail': 'Token is verified.'}, status=200)



"""
      < Original Login >
"""
# 새 비밀번호 생성 함수
def create_new_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for i in range(length))

# 새 비밀번호 전송 함수
def send_new_password(email, new_password):
    subject = '마인더리(mindary) 새 비밀번호 안내 이메일입니다.'
    message = f'안녕하세요. 마인더리(mindary)입니다. \n 회원님의 새 비밀번호는 {new_password} 입니다.'
    email_from = 'mdy3722@gmail.com'
    recipient_list = [email,]

    send_mail(subject, message, email_from, recipient_list)

# 코드 전송 함수
def send_code(email, code):
    subject = '마인더리(mindary) 인증코드 안내 이메일입니다.'
    message = f'안녕하세요. 마인더리(mindary)입니다. \n 인증코드를 확인해주세요. \n {code} \n 인증코드는 이메일 발송 시점부터 3분동안 유효합니다.'
    email_from = EMAIL_HOST_PASSWORD
    recipient_list = [email]

    send_mail(subject, message, email_from, recipient_list)

# 인증 코드 전송하기
@api_view(['POST'])
def send_verification_code(request):
    serializer = EmailVerificationSendSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']

        # 이메일이 이미 등록된 사용자에게 속해 있는지 확인
        if User.objects.filter(email=email).exists():
            return Response({'error': '이미 존재하는 회원입니다.'}, status=status.HTTP_400_BAD_REQUEST)
        
        code = f"{random.randint(1000, 9999)}"
        expires_at = timezone.now() + timedelta(minutes=3)
        EmailVerification.objects.create(email=email, code=code, expires_at=expires_at)

        send_code(email, code)

        return Response({'message': 'Verification code sent to email.'}, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 인증 코드 확인하기
@api_view(['POST'])
def verify_code(request):
    serializer = EmailVerificationCheckSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        try:
            verification = EmailVerification.objects.get(email=email, code=code)
            if verification.is_expired():
                return Response({'error': 'Verification code expired.'},
                                status=status.HTTP_400_BAD_REQUEST)
            verification.delete()
            return Response({'message': 'Verification code is valid.'}, status=status.HTTP_200_OK)
        except EmailVerification.DoesNotExist:
            return Response({'error': 'Invalid verification code.'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 회원가입
@api_view(['POST'])
def original_register(request):
    serializer = OriginalRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': '회원가입에 성공했습니다!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 로그인
@api_view(['POST'])
def original_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email:
        return Response({'error': '이메일을 입력해 주세요'}, status=status.HTTP_400_BAD_REQUEST)
    if not password:
        return Response({'error': '비밀번호를 입력해 주세요'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': '이메일이 잘못되었습니다.'}, status=status.HTTP_401_UNAUTHORIZED)

    user = authenticate(email=email, password=password)
    
    if user is None:
        return Response({'error': '비밀번호가 잘못되었습니다.'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh_token = RefreshToken.for_user(user)
    return Response({
        'access_token': str(refresh_token.access_token),
        'refresh_token': str(refresh_token),
    }, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['POST'])
def original_logout(request):
    try:
        refresh_token = request.data.get('refresh_token')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': '로그아웃 성공!'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# 새 비밀번호 
@api_view(['POST'])
def reset_password(request):
    email = request.data.get('email')
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': '존재하지 않는 유저입니다.'}, status=status.HTTP_404_NOT_FOUND)

    new_password = create_new_password()
    user.set_password(new_password)
    user.save()
    
    send_new_password(email, new_password)

    return Response({'message': '새로운 비밀번호가 전송되었습니다.'}, status=status.HTTP_200_OK)



"""
      < 토큰 갱신 >
"""
# 토큰 갱신 -> refresh를 request로 보내면 access 토큰을 새로 발급해줌
@api_view(['POST'])
def token_refresh(request):
    refresh_token = request.data.get('refresh_token')
    
    if not refresh_token:
        return Response({'error': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)
        return Response({'access_token': access_token, 'refresh_token': str(refresh)}, status=status.HTTP_200_OK)
    except TokenError as e:
        return Response({'error': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)