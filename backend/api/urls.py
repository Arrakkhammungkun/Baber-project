from django.urls import path
from . import views
from .views import MemberList


from .views import RegisterAPIView ,LoginAPIView,LoginAdminAPIView,upload_profile

urlpatterns = [
    path('example/', views.example_view, name='example'),
    path('Member/',MemberList.as_view(),name='member-list'),
    path('register/',RegisterAPIView.as_view(),name='register'),
    path('login/',LoginAPIView.as_view(),name='login'),
    path('login/admin',LoginAdminAPIView.as_view(),name='login-admin'),
    path('upload-profile/', views.upload_profile, name='upload-profile'),


] 
