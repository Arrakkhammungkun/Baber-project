"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 5.1.3.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""
from decouple import config
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DJANGO_DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
     "daphne",  
    'django.contrib.staticfiles',
    'api',
    'rest_framework',
    'corsheaders',
    "channels",  
 
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # อยู่ในลำดับแรก
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

# from mongoengine import connect
# connect(
#     config('DB_NAME'),
#     host=config('DB_HOST'),
#     port=config('DB_PORT', cast=int)  # แก้ไขตรงนี้เพื่อแปลงเป็น integer
# )
from mongoengine import connect
from decouple import config  # สมมติว่าคุณใช้ decouple ในการอ่าน config

try:
    # เชื่อมต่อกับ MongoDB Atlas
    connect(
        db=config('DB_NAME'),
        host=config('DB_URI'),
    )
    print("Connected to MongoDB Atlas successfully!")
except Exception as e:
    print("Failed to connect to MongoDB Atlas:", str(e))


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # ระบุ domain ที่ frontend ใช้
]
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',  # คงไว้เหมือนเดิม
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',  # ยังคงต้องมีเพื่อให้ token ทำงาน
    ]
    # ลบ 'DEFAULT_PERMISSION_CLASSES' ออก เพื่อไม่ให้บังคับทุก API ต้องมี token
}



import os

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')  # ดึงค่าจาก .env
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')  # ดึงค่าจาก .env

# เปิดโหมดแสดงข้อผิดพลาดในช่วงพัฒนา
if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'



MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'




ASGI_APPLICATION = "api.asgi.application"  # ชื่อโปรเจค
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",  # ใช้ in-memory สำหรับทดสอบ
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],  # ตั้งค่า Redis 
        },
    },
}

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5173',
    'https://localhost:5173', 
]
# settings.py
BREVO_API_KEY = os.getenv("BREVO_API_KEY")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL")