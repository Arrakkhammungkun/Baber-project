from django.urls import path
from . import views
from .views import EmployeeDetailView, MemberList


from .views import get_booked_times,check_availability,delete_booking,complete_booking,confirm_booking,create_booking,RegisterAPIView ,LoginAPIView,LoginAdminAPIView,upload_profile,ServiceListView,ServiceDetailView,EmployeeView

urlpatterns = [
    path('example/', views.example_view, name='example'),
    path('Member/',MemberList.as_view(),name='member-list'),
    path('register/',RegisterAPIView.as_view(),name='register'),
    path('login/',LoginAPIView.as_view(),name='login'),
    path('login/admin',LoginAdminAPIView.as_view(),name='login-admin'),
    path('upload-profile/', views.upload_profile, name='upload-profile'),
    path('services/', ServiceListView.as_view(), name='service-list'),
    path('services/<str:pk>/', ServiceDetailView.as_view(), name='service-detail'),  
    path('employee/', EmployeeView.as_view(), name='employee-list'),
    path('employee/<str:pk>/', EmployeeDetailView.as_view(), name='employee-detail'),
    path("bookings/", create_booking, name="create_booking"),  # เพิ่มเส้นทางสำหรับการแก้ไ
    path('bookings/<str:booking_id>/confirm/', confirm_booking, name='confirm_booking'),
    path('bookings/<str:booking_id>/complete/', complete_booking, name='complete_booking'),
    path('bookings/<str:booking_id>/delete/', delete_booking, name='delete_booking'),
    path('check-availability/', views.check_availability, name='check-availability'),
    path('bookings/<str:employee_id>/<str:date>/', get_booked_times, name='get_booked_times'),



] 
