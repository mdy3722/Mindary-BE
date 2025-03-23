from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email=None, nickname=None, password=None, kakao_id=None, is_social=False):
        if not email and not kakao_id:
            raise ValueError('must have user email or kakao_id')

        user = self.model(
            email=email,
            nickname=nickname,
            kakao_id=kakao_id,
            is_social=is_social
        )
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nickname, password=None):
        user = self.create_user(email=email, nickname=nickname, password=password)
        user.is_admin = True
        user.save()
        return user

class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    nickname = models.CharField(max_length=30, unique=True, null=False)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    kakao_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    is_social = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nickname']

    @property
    def is_staff(self):
        return self.is_admin

class EmailVerification(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=4)
    expires_at = models.DateTimeField()

    def is_expired(self):
        return timezone.now() > self.expires_at