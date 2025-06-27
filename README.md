# Mindary - 감정/일상 기록 기반 웹서비스 (Backend) 멋쟁이사자처럼대학 12기 중앙 해커톤

**Mindary**는 현대인의 정신 건강 문제에 주목해, 감정을 부담 없이 기록할 수 있도록 돕는 웹 기반 감정 다이어리 서비스입니다.  
일상 속 스트레스를 해소하고, 기록 습관을 통해 자기 성찰의 기회를 제공하는 것이 주요 목적입니다.

서비스의 UI는 **엑셀 형태를 차용**하여 직장 환경에서도 부담 없이 사용할 수 있는 감정 기록 공간을 제공합니다.  
스트레스를 받는 순간엔 마치 **카카오톡 ‘나와의 채팅’**처럼 **욕설이나 혼잣말을 자유롭게 적어 감정을 해소**할 수 있고,  
또는 퇴근길에 해야 할 일이나 기억해둘 메모를 남기는 용도로도 활용할 수 있습니다.

긴 글 모드에선 자유로운 카테고리(일상/영화/독서 등)로 글을 작성하고, 캘린더를 통해 일별 기록을 직관적으로 확인할 수 있습니다.  
또한, 주간/월간 결산 워드클라우드를 통해 **자주 언급된 단어들을 시각적으로 확인**하며, 최근의 감정 흐름이나 관심사를 돌아볼 수 있습니다.

---

## 🙋‍♂️ 나의 역할
- 시스템 아키텍처 및 ERD 설계
- API 명세서 작성
- Django 기반 REST API 전반 구현 (총 기여도 약 60%)
- JWT 인증 시스템 구축 (SimpleJWT 활용)  
- Gmail SMTP 연동을 통한 이메일 인증/임시 비밀번호 발송 로직 구현  
- 긴 글 CRUD 구현
- `krwordrank` + `WordCloud` 기반 키워드 추출 및 시각화 로직 구현  
  → 워드클라우드에 새겨질 키워드를 감정 키워드가 아닌 **일상 속 빈도수 높게 기록한 단어** 중심으로 기획 의도 조정
- `django-cron`을 활용해 주간/월간 워드클라우드 자동 생성 스케줄링 설정
- EC2 기반 서버 배포 및 Gunicorn + Nginx 운영 환경 구성
- AWS RDS(MySQL) 연동 및 ORM/마이그레이션 설정 구성

---

## 🛠️ 기술 스택

| 구분 | 기술 |
|------|------|
| Backend | Django REST Framework (Python 3) |
| Auth | JWT (SimpleJWT), Gmail SMTP |
| Database | MySQL (AWS RDS) |
| 배포 환경 | AWS EC2, Gunicorn, Nginx |

---

## 🖥 서비스 UI 예시

📸 **UI 화면 (엑셀 기반 감정 기록)**  
> `docs/ui-record-daily.png`  
![ui-record-daily](./docs/ui-record-daily.png)

📸 **카테고리 기반 긴 글 작성 & 캘린더 연동**  
> `docs/ui-record-categorized.png`  
![ui-record-categorized](./docs/ui-record-categorized.png)

📸 **기록 검색 및 결산 확인 (Archive 탭)**  
> `docs/ui-archive.png`  
![ui-archive](./docs/ui-archive.png)

---

## 🗂 ERD

> `docs/mindary-erd.png` ← 직접 추가 필요

_(모델 예: User, EmotionRecord, WordCloudLog 등)_

---

## 🏗 시스템 아키텍처

> `docs/mindary-architecture.png` ← 직접 추가 필요

- 클라이언트(React) → Nginx → Gunicorn → Django
- Django → RDS(MySQL), SMTP(Gmail)
- django-cron → 주기적 워드클라우드 생성 및 저장

---

## ⚙️ 실행 방법

```bash
git clone https://github.com/mdy3722/Mindary-Refactoring.git
cd Mindary-Refactoring

python -m venv venv
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
