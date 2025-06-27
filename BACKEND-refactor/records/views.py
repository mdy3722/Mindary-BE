from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from records.models import Record
from records.serializers import RecordSerializer
from datetime import datetime, timedelta
from django.utils.timezone import make_aware

from django.views.decorators.csrf import csrf_exempt
from krwordrank.word import summarize_with_keywords
import os
from wordcloud import WordCloud
from django.conf import settings

from django.utils import timezone
from django.utils.timezone import now


"""
    < archive >
"""
# archive : 긴 글 모아보기
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])   # 로그인 유저만 권한 있음
def archive(request):
    # 쿼리 파라미터로 필터링 옵션 받기
    filter_liked    = request.GET.get('liked', None)
    order_by_date   = request.GET.get('order_by', None)
    category        = request.GET.get('category', None)
    keyword         = request.GET.get('keyword', None)

    # 레코드 쿼리셋 필터링 및 정렬
    records = Record.objects.filter(writer = request.user)
    if category == '북마크':
        records = records.filter(liked=True)
    elif category:
        records = records.filter(category=category)
    if filter_liked == 'true':   # 좋아요한 글만 필터링
        records = records.filter(liked=True)
    if keyword:
        records = records.filter(title__icontains=keyword)
    if order_by_date == 'desc':   # 최신순
        records = records.order_by('-created_at')
    else:
        records = records.order_by('created_at')

    record_serializer = RecordSerializer(records, many=True)
    return Response(record_serializer.data, status=status.HTTP_200_OK)

# archive 중 글 한 개 조회
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])   # 로그인 유저만 권한 있음
def detail_archive(request, id):
    try:
        record = Record.objects.get(id=id)
    except Record.DoesNotExist:
        return Response({"error": "기록을 찾을 수 없습니다."}, status=status.HTTP_404_NOT_FOUND)

    record_serializer = RecordSerializer(record)
    return Response(record_serializer.data, status=status.HTTP_200_OK)





"""
      < 주의 >
      긴글모드에서 진행!!! 모아보기랑 관련 없음!!!
"""
# 긴글 수정 및 삭제
@csrf_exempt
@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])   # 로그인 유저만 권한 있음
def modify_record(request, id):
    date_query_param = request.GET.get('date', None)
    mode = request.GET.get('mode', None)
    if not date_query_param:
        return Response({"error": "쿼리 파라미터가 없습니다."}, status=status.HTTP_400_BAD_REQUEST)
    if mode != 'record':
        return Response({"error": "긴글 모드를 이용해주세요!"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        record = Record.objects.get(id=id)
    except Record.DoesNotExist:
        return Response({"error": "작성한 글이 없습니다!"}, status=status.HTTP_404_NOT_FOUND)
    
    match request.method:
        case 'PATCH':   
            data = request.data
            if not any(field in data for field in ['title', 'content', 'liked']):
                return Response({"error": "수정된 것이 없습니다."}, status=status.HTTP_400_BAD_REQUEST)
            
            if 'title' in data:
                record.title = data['title']
            if 'content' in data:
                record.content = data['content']
            if 'liked' in data:
                record.liked = data['liked']
            
            record.edited_at = datetime.now()
            record.save()

            record_serializer = RecordSerializer(record)
            return Response(record_serializer.data, status=status.HTTP_200_OK)

        case 'DELETE':
            record.delete()
            return Response({"message": "삭제 성공!"}, status=status.HTTP_200_OK)
        

"""
    < WordCloud >
"""
# 워드 클라우드 생성 함수 : texts 받고 image 반환
def generate_wordcloud(texts):
    # const
    font_path = os.path.join(settings.BASE_DIR, 'DungGeunMo.woff')
    stopwords = { # 불용어
        '너무', '정말', '아주', '매우', '굉장히', '상당히', '무척', '엄청', '몹시', '너무나', '대단히', '정말로', '실로', '진짜', '참으로', 
        '물론', '다소', '약간', '조금', '많이', '그야말로', '대단히', '일부', '더욱', '특히',
        '을', '를', '에', '의', '이', '가', '은', '는', '도', '로', '와', '과', '제', '한', '그', '저', '이', '각', '것', '수', '듯', '바',
        '그리고', '그러고', '그러나', '그래서', '그러면', '그러나', '그렇지만',
        '것을', '것이', '있는', '싶다', '나니', '때문', '이런', '저런', '그런', '어떤', '모든', '아무', '통해', '다시', '마치',
        '어제', '내일', '모레', '지금', '그때', '언제', '항상', '자주', '가끔', '때때로', '이번', '다음',
        '이렇게', '것을', '같다.', '되었다.', '남았다.', '.', '같은', '있었', '했어.', 
        # '오늘', 
        } 
    
    # NLP
    keywords = summarize_with_keywords(
        texts, min_count=1, max_length=10, 
        beta=0.85, max_iter=10, stopwords=stopwords, verbose=True )

    # 워드 클라우드 생성
    frequencies = {key: val for key, val in keywords.items()}
    wordcloud = WordCloud(
        width=800, height=400, 
        background_color='white', 
        stopwords=stopwords,
        font_path=font_path
    ).generate_from_frequencies(frequencies)
    
    return wordcloud.to_image()

'''
저장 파일명을 5월 내용에 대한 워드클라우드면 그대로 '5월'을 명시하는 것으로 수정함
'''
# 리팩토링 - 메소드 추출 (워드클라우드 정적 파일 저장 및 반환환)
def save_wordcloud_image(user, records, filename):
    texts = [record.content for record in records]

    if not texts:
        return Response(status=204)

    wordcloud_image = generate_wordcloud(texts)

    image_path = os.path.join(settings.MEDIA_ROOT, filename)
    wordcloud_image.save(image_path)

    image_url = settings.MEDIA_URL + filename
    return Response({"image_url": image_url})

# 워드 클라우드 최초 생성 - get_wordcloud()에서 기존 이미지 없을 경우 호출됨
# 주간 결산
def make_week_wordcloud(request):
    now = timezone.now()
    this_monday = now - timedelta(days=now.weekday())
    this_monday = this_monday.replace(hour=0, minute=0, second=0, microsecond=0)

    last_monday = this_monday - timedelta(days=7)
    last_sunday = this_monday - timedelta(seconds=1)

    records = Record.objects.filter(
        writer=request.user,
        created_at__range=[last_monday, last_sunday]
    )

    filename = last_monday.strftime("%Y%m%d") + f"_week_{request.user.id}.png"
    return save_wordcloud_image(request.user, records, filename)

# 월간 결산
def make_month_wordcloud(request):
    now = timezone.now()
    this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    last_month_end = this_month_start - timedelta(seconds=1)
    last_month_start = last_month_end.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    records = Record.objects.filter(
        writer=request.user,
        created_at__range=[last_month_start, last_month_end]
    )

    filename = last_month_start.strftime("%Y%m") + f"_month_{request.user.id}.png"
    return save_wordcloud_image(request.user, records, filename)

# 워드 클라우드 조회 함수
# 캘린더 페이지에서 조회
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wordcloud(request):
    date_query_param = request.GET.get('date', None)
    ver = request.GET.get('wordcloud', 'week')

    if not date_query_param:
        return Response({"error": "날짜가 필요합니다."}, status=400)

    try:
        date_obj = datetime.strptime(date_query_param, '%Y-%m-%d')
    except ValueError:
        return Response({"error": "날짜 형식이 잘못되었습니다."}, status=400)

    if ver == 'month': # 지난 달 파일을 주기 - 파일명도 지난달
        last_month = date_obj.replace(day=1) - timedelta(days=1)
        image_name = last_month.strftime('%Y%m') + f"_month_{request.user.id}.png"
        
    else: # 지난 주 파일을 주기 - 파일명도 지난주 월요일 날짜
        weekday = date_obj.weekday()  
        last_monday = (date_obj - timedelta(days=weekday + 7)).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        image_name = last_monday.strftime('%Y%m%d') + f"_week_{request.user.id}.png"


    image_path = os.path.join(settings.MEDIA_ROOT, image_name)

    # 파일이 없으면 생성
    if not os.path.exists(image_path):
        if ver == 'month':
            return make_month_wordcloud(request)
        else:
            return make_week_wordcloud(request)


    image_url = settings.MEDIA_URL + image_name
  
    return Response({"image_url": image_url})

# 아카이브 페이지에서 조회
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wordcloud_archive(request):
    date_query_param = request.GET.get('date', None)
    date_obj = datetime.strptime(date_query_param + '01', '%Y%m%d')
    
    last_month_date = date_obj.replace(day=1) - timedelta(days=1)
    image_name = last_month_date.strftime('%Y%m') + f"_month_{request.user.id}.png"

    image_path = os.path.join(settings.MEDIA_ROOT, image_name)

    if not os.path.exists(image_path):
        return Response({"message": "이미지가 존재하지 않습니다."}, status=404)

    image_url = settings.MEDIA_URL + image_name
    return Response({"image_url": image_url})