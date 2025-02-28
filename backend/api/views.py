from django.shortcuts import render
from .models import Booking, Employee, Member,Service,DashboardSummary,update_dashboard_summary,update_top_services
from .serializers import RegisterStep1Serializer, TopServiceSerializer,BookingSerializer, EmployeeSerializer, MemberSerializers,ServiceSerializer,DashboardSummarySerializer, VerifyOTPSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.hashers import check_password
import jwt
#import datetime
from django.conf import settings
import os
from django.http import JsonResponse
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from werkzeug.utils import secure_filename
from rest_framework.exceptions import NotFound
from bson import ObjectId
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime, timedelta
from django.utils import timezone
from django.db import models
from mongoengine import Q
from django.db.models import Count
from .consumers import QueueConsumer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny  # เพิ่มเพื่อให้ public
from sib_api_v3_sdk import Configuration, ApiClient, TransactionalEmailsApi, SendSmtpEmail
from .utils import generate_otp

class SendOTPAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"message": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            member = Member.objects.get(email=email)
            otp = generate_otp()
            member.otp = otp
            member.save()

            configuration = Configuration()
            configuration.api_key['api-key'] = settings.BREVO_API_KEY
            api_instance = TransactionalEmailsApi(ApiClient(configuration))

            send_smtp_email = SendSmtpEmail(
                sender={"name": "University of Phayao", "email": settings.DEFAULT_FROM_EMAIL},
                to=[{"email": email}],
                subject="Your OTP Code",
                text_content=f"Your OTP code is {otp}. It is valid for 10 minutes."
            )

            api_instance.send_transac_email(send_smtp_email)
            return Response({"message": "OTP sent to your email"}, status=status.HTTP_200_OK)
        except Member.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": f"Failed to send OTP: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyOTPAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            member = serializer.save()
            return Response({"message": "Account verified successfully", "email": member.email}, status=status.HTTP_200_OK)
        errors = serializer.errors
        detailed_errors = {field: errors[field][0] for field in errors}
        return Response({"message": "Verification failed", "errors": detailed_errors}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET'])
def example_view(request):
    data = {"message": "Hello, this is an API response! 55555555555"}
    return Response(data)

class MemberList(APIView):
    def get(self, request):
        members = Member.objects.all()  # ดึงสมาชิกทั้งหมดจาก MongoDB
        serializer = MemberSerializers(members, many=True) 
        return Response(serializer.data)
    


class RegisterStep1APIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterStep1Serializer(data=request.data)
        if serializer.is_valid():
            member = serializer.save()
            # ส่ง OTP ไปยังอีเมล
            configuration = Configuration()
            configuration.api_key['api-key'] = settings.BREVO_API_KEY
            api_instance = TransactionalEmailsApi(ApiClient(configuration))
            send_smtp_email = SendSmtpEmail(
                sender={"name": "Barber Shop", "email": settings.DEFAULT_FROM_EMAIL},
                to=[{"email": member.email}],
                subject="รหัส OTP ของคุณ",
                text_content=f"รหัสยืนยันตัวตนของคุณคือ {member.otp}. มีอายุการใช้งาน 10 นาที."
            )
            api_instance.send_transac_email(send_smtp_email)
            return Response({"message": "OTP sent to your email"}, status=status.HTTP_200_OK)
        errors = serializer.errors
        detailed_errors = {field: errors[field][0] for field in errors}
        return Response({"message": "Validation failed", "errors": detailed_errors}, status=status.HTTP_400_BAD_REQUEST) 

# class RegisterAPIView(APIView):
#     def post(self, request):
#         serializer = MemberSerializers(data=request.data)
#         if serializer.is_valid():
#             serializer.save()  # บันทึกสมาชิกใหม่
#             return Response({"message": "Registration successful", "data": serializer.data}, status=status.HTTP_201_CREATED)

#         # เพิ่ม Error ให้หน้าบ้าน
#         errors = serializer.errors
#         detailed_errors = {field: errors[field][0] for field in errors}
#         return Response({"message": "Validation failed", "errors": detailed_errors}, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            member = Member.objects.get(email=email)  

           
            if member.check_password(password):  
                payload ={
                    'user_id':str(member.id),
                    'first_name':member.first_name,
                    'last_name':member.last_name,
                    'nick_name':member.nick_name,
                    'email':member.email,
                    'phone_number':member.phone_number,
                    'profile_image':member.profile_image,
                    'exp': datetime.utcnow() + timedelta(days=1),

                    
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

                return Response({
                    "message": "Login successful",
                    "data": {
                        "user_id":str(member.id),
                        "first_name":member.first_name,
                        "last_name":member.last_name,
                        "nick_name":member.nick_name,
                        "email":member.email,
                        "phone_number":member.phone_number,
                        "profile_image":member.profile_image,
                        "token": token 
                    }
                }, status=status.HTTP_200_OK)
            
            else:
                return Response({"message": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)
        except Member.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class LoginAdminAPIView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            member = Member.objects.get(email=email)  

            if member.role != 'admin':
                return Response({"message":"Access denined . Admins only ."},status=status.HTTP_403_FORBIDDEN)
           
            if member.check_password(password):  
                payload ={
                    'user_id':str(member.id),
                    'email':member.email,
                    'role':member.role,
                    'exp': datetime.utcnow() + timedelta(days=1),
                    
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

                return Response({
                    "message": "Login successful",
                    "data": {
                        "user_id":str(member.id),
                        "first_name":member.first_name,
                        "last_name":member.last_name,
                        "nick_name":member.nick_name,
                        "email":member.email,
                        "phone_number":member.phone_number,
                        "profile_image":member.profile_image,
                        "token": token 
                    }
                }, status=status.HTTP_200_OK)
            
            else:
                return Response({"message": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)
        except Member.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)


UPLOAD_FOLDER = os.path.join(settings.MEDIA_ROOT, 'profile_pics')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@api_view(['POST'])

def upload_profile(request):
    if 'profile_image' not in request.FILES:
        return JsonResponse({"error": "No file part"}, status=400)

    file = request.FILES['profile_image']

    if not ('.' in file.name and file.name.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg'}):
        return JsonResponse({"error": "File type not allowed"}, status=400)

    filename = secure_filename(file.name)
    save_path = os.path.join(settings.MEDIA_ROOT, 'profile_pics', filename)
    file_path = default_storage.save(save_path, ContentFile(file.read()))

    token = request.headers.get("Authorization").split(" ")[1]
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    member = Member.objects(id=payload['user_id']).first()

    if not member:
        return JsonResponse({"error": "User not found"}, status=404)

    # ลบไฟล์เก่าถ้ามี
    if member.profile_image:
        old_file_path = os.path.join(settings.MEDIA_ROOT, member.profile_image)
        if os.path.exists(old_file_path):
            os.remove(old_file_path)

    # อัปเดตข้อมูลโปรไฟล์
    member.profile_image = file_path
    member.save()

    return JsonResponse({"message": "File uploaded successfully", "path": member.profile_image}, status=200)

@api_view(['PUT'])
@permission_classes([])
def update_name(request):
    print("Update Name Headers:", request.headers)
    try:
        token = request.headers.get("Authorization").split(" ")[1]
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        member = Member.objects.get(id=payload['user_id'])
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')

        if not first_name or not last_name:
            return Response({"message": "First name and last name are required"}, status=status.HTTP_400_BAD_REQUEST)

        member.first_name = first_name
        member.last_name = last_name
        member.save()

        return Response({
            "message": "Name updated successfully",
            "data": {
                "user_id": str(member.id),
                "first_name": member.first_name,
                "last_name": member.last_name,
                "nick_name": member.nick_name,
                "email": member.email,
                "phone_number": member.phone_number,
                "profile_image": member.profile_image
            }
        }, status=status.HTTP_200_OK)
    except Member.DoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    

class ServiceListView(APIView):
    def get(self, request):
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            service = serializer.save()
            return Response(ServiceSerializer(service).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ServiceDetailView(APIView):
    def get_object(self, pk):
        try:
            return Service.objects.get(id=pk)
        except Service.DoesNotExist:
            raise NotFound("Service not found")

  
    def get(self, request, pk):
        service = self.get_object(pk)
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

   
    def put(self, request, pk):
        service = self.get_object(pk)
        serializer = ServiceSerializer(service, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    def delete(self, request, pk):
        service = self.get_object(pk)
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
# เปลี่ยนสถานะ Serice
class ToggleServiceStatusView(APIView):
    def patch(self, request, pk):
        try:
            service = Service.objects.get(id=pk)
        except Service.DoesNotExist:
            return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)

        # สลับสถานะ Active <-> Inactive
        service.status = "Inactive" if service.status == "Active" else "Active"
        service.save()

        return Response({"message": f"Service status changed to {service.status}"}, status=status.HTTP_200_OK)


class EmployeeView(APIView):
    def get(self, request):
        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmployeeDetailView(APIView):
    def get_object(self, pk):
        try:
            return Employee.objects.get(pk=pk)
        except Employee.DoesNotExist:
            raise NotFound(detail="Employee not found")

    def get(self, request, pk):
        employee = self.get_object(pk)
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)

    def put(self, request, pk):
        employee = self.get_object(pk)
        serializer = EmployeeSerializer(employee, data=request.data, partial=False)  # ใส่ False เพื่อบังคับให้ต้องกรอกทุก field
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        employee = self.get_object(pk)
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    
    def patch(self, request, pk):
        employee = self.get_object(pk)
        serializer = EmployeeSerializer(employee, data=request.data, partial=True)  # ใส่ True เพื่อให้สามารถอัปเดตแค่บาง field ได้
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)







@csrf_exempt
@api_view(['POST'])
def create_booking(request):
    if request.method == "POST":
        try:
            # แปลงข้อมูลที่ได้รับจาก body เป็น JSON
            data = json.loads(request.body)
            serializer = BookingSerializer(data=data)
            
            if serializer.is_valid():
                booking = serializer.save()

                booking_date_str = request.data.get('date')  # ได้ค่ามาเป็น string
                booking_status = 'create'

                # แปลง booking_date เป็น datetime object
                booking_date = datetime.strptime(booking_date_str, "%Y-%m-%d") 

                # เรียกใช้ฟังก์ชัน update_dashboard_summary
                update_dashboard_summary(booking_date, booking_status)

                
                # ส่งข้อมูลไปยัง WebSocket
                channel_layer = get_channel_layer()
                queue_consumer = QueueConsumer()
                queue_data = queue_consumer.get_queue_data_sync()  # ใช้ฟังก์ชัน sync
                async_to_sync(channel_layer.group_send)(
                    "queue_updates",
                    {
                        "type": "send_queue_update",
                        "data": queue_data
                    }
                )
                print("Sending update to WebSocket:", queue_data)

                return Response({"message": "Booking created successfully"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def confirm_booking(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        booking.status = "In_progress"
        booking.save()

        booking_date = booking.date
        status = booking.status

        # เรียกใช้ update_dashboard_summary และส่งอาร์กิวเมนต์ที่จำเป็น
        update_dashboard_summary(booking_date, status)

        channel_layer = get_channel_layer()
        queue_consumer = QueueConsumer()
        queue_data = queue_consumer.get_queue_data_sync()  # อัพเดทข้อมูลคิวทั้งหมด
        async_to_sync(channel_layer.group_send)(
            "queue_updates",
            {
                "type": "send_queue_update",
                "data": queue_data
            }
        )
        print("Sending update to WebSocket:", queue_data)
        return Response({"message": "Booking In_progress successfully"})
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)
    
@api_view(['POST'])
def complete_booking(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        booking.status = "completed"
        booking.save()

        
        # เปลี่ยนจาก booking.booking_date เป็น booking.date (หรือใช้ชื่อ field ที่ถูกต้อง)
        booking_date = booking.date  
        status = 'completed' 
        service = booking.service  # ดึงข้อมูล Service ที่เชื่อมโยงกับ Booking

        price = service.price if service else 0  # ดึงราคา จาก Service (ถ้ามี)

        # อัปเดตยอดเงินใน Dashboard Summary
        summary = DashboardSummary.objects.filter(summary_date=booking_date.date()).first()
        if summary:
            summary.revenue_day += price
            summary.revenue_month += price
            summary.revenue_year += price
            summary.save()

        update_dashboard_summary(booking_date, status)
        update_top_services(booking_date)
        booking.delete()
        channel_layer = get_channel_layer()
        queue_consumer = QueueConsumer()
        queue_data = queue_consumer.get_queue_data_sync()
        async_to_sync(channel_layer.group_send)(
            "queue_updates",
            {
                "type": "send_queue_update",
                "data": queue_data
            }
        )
        print("Sending update to WebSocket:", queue_data)

        return Response({"message": "คิวเสร็จสิ้นแล้ว"})
    except Booking.DoesNotExist:
        return Response({"error": "ไม่พบคิวนี้"}, status=404)


@api_view(['DELETE'])
def delete_booking(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        booking.status = "cancelled"
        booking.save()

        booking_date = booking.date
        update_dashboard_summary(booking_date, "cancelled")  # อัปเดต cancelled_count
        update_top_services(booking_date)  # อัปเดต top_services (ไม่นับ cancelled)
        booking.delete()
        
        channel_layer = get_channel_layer()
        queue_consumer = QueueConsumer()
        queue_data = queue_consumer.get_queue_data_sync()  # ใช้ฟังก์ชัน sync
        async_to_sync(channel_layer.group_send)(
            "queue_updates",
            {
                "type": "send_queue_update",
                "data": queue_data
            }
        )
        print("Sending update to WebSocket:", queue_data)

        return Response({"message": "คิวถูกยกเลิกแล้ว"})
    except Booking.DoesNotExist:
        return Response({"error": "ไม่พบคิวนี้"}, status=404)



@api_view(['GET'])
def check_availability(request):
    employee_id = request.GET.get('employeeId')
    date = request.GET.get('date')  
    time = request.GET.get('time')  
    
   
    try:
        booking_time = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
    except ValueError:
        return Response({"message": "Invalid date or time format."}, status=status.HTTP_400_BAD_REQUEST)
    
 
    bookings = Booking.objects.filter(
        employee=employee_id,
        start_time=booking_time
    )

    
    if bookings.count() > 0:  
        return Response({"message": "Time slot is already booked."}, status=status.HTTP_409_CONFLICT)
    else:
        return Response({"message": "Time slot is available."}, status=status.HTTP_200_OK)
    


@api_view(['GET'])
def get_booked_times(request, employee_id, date):
    try:
        print(f"Received employee_id: {employee_id}, date: {date}")

        
        selected_date = datetime.strptime(date, "%Y-%m-%d")

      
        all_times = [
            "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
            "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
        ]
        
        
        booked_slots = Booking.objects.filter(employee=employee_id, date=selected_date)

        
        booked_times = [time.start_time.strftime("%I:%M %p") for time in booked_slots]

        
        available_times = [time for time in all_times if time not in booked_times]

        return Response({"available_times": available_times, "booked_times": booked_times})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(['GET'])
def get_booking_queue(request):
    bookings = Booking.objects.filter(status__in=["pending", "In_progress"]).order_by("employee", "start_time")
    
    employee_queue = {}  
    queue_data = []  

    
    for booking in bookings:
        employee_id = str(booking.employee.id)
        
       
        if employee_id not in employee_queue:
            employee_queue[employee_id] = 0  

        
        queue_number = employee_queue[employee_id]
        employee_queue[employee_id] += 1

       
        queue_data.append({
            "queue_number": queue_number,
            "id": str(booking.id),
            "customer": {
                "id": str(booking.customer.id),
                "first_name": booking.customer.first_name,
                "last_name": booking.customer.last_name,
                "email": booking.customer.email,
                "profile": booking.customer.profile_image,
            },
            "employee": {
                "id": employee_id,
                "first_name": booking.employee.first_name,
                "last_name": booking.employee.last_name,
                "position": booking.employee.position,
                "profile": booking.employee.employee_image_url,
                "nickname": booking.employee.nickname,
                "gender": booking.employee.gender,
                "birthday": booking.employee.dob
            },
            "service": {
                "id": str(booking.service.id),
                "description": booking.service.description,
                "name": booking.service.name,
                "price": booking.service.price,
                "duration": booking.service.duration,
                "image_url": booking.service.image_url
            },
            "start_time": booking.start_time,
            "end_time": booking.end_time,
            "status": booking.status,
        })
    
    
    return Response(queue_data, status=status.HTTP_200_OK)


class DashboardSummaryAPIView(APIView):
    def get(self, request):
        period = request.query_params.get("period", "today")
        start_date_param = request.query_params.get("start_date")
        end_date_param = request.query_params.get("end_date")

        if start_date_param and end_date_param:
            try:
                if start_date_param.lower() == "today":
                    start_date = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
                else:
                    start_date = datetime.strptime(start_date_param, "%Y-%m-%d")
                end_date = datetime.strptime(end_date_param, "%Y-%m-%d").replace(hour=23, minute=59, second=59)
                label = f"Custom: {start_date_param} to {end_date_param}"
            except ValueError:
                return Response({"error": "Invalid date format. Use YYYY-MM-DD or 'today'"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            end_date = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
            if period == "today":
                start_date = end_date
                label = "Today"
            elif period == "last-7-days":
                start_date = end_date - timedelta(days=6)
                label = "Last 7 Days"
            elif period == "last-month":
                start_date = end_date - timedelta(days=30)
                label = "Last 1 Month"
            elif period == "last-3-months":
                start_date = end_date - timedelta(days=90)
                label = "Last 3 Months"
            else:
                return Response({"error": "Invalid period"}, status=status.HTTP_400_BAD_REQUEST)

        print(f"Query range: {start_date} to {end_date}")  # Debug
        summaries = DashboardSummary.objects.filter(
            summary_date__gte=start_date,
            summary_date__lte=end_date
        ).order_by('-summary_date')

        print(f"Summaries count: {summaries.count()}")  # Debug
        print(f"Dates: {[s.summary_date for s in summaries]}")  # Debug

        if not summaries:
            return Response({"message": f"No data available for {label}"}, status=status.HTTP_404_NOT_FOUND)

        month_start = end_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        year_start = end_date.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        month_summaries = DashboardSummary.objects.filter(
            summary_date__gte=month_start,
            summary_date__lte=end_date
        )
        year_summaries = DashboardSummary.objects.filter(
            summary_date__gte=year_start,
            summary_date__lte=end_date
        )

        aggregated_data = {
            "bookings_today": sum(s.bookings_today for s in summaries) if summaries else 0,
            "served_customers": sum(s.served_customers for s in summaries) if summaries else 0,
            "in_progress_count": sum(s.in_progress_count for s in summaries) if summaries else 0,
            "cancelled_count": sum(s.cancelled_count for s in summaries) if summaries else 0,  # เพิ่มการรวม cancelled_count
            "revenue_day": sum(s.revenue_day for s in summaries) if summaries else 0,
            "revenue_month": sum(s.revenue_day for s in month_summaries),
            "revenue_year": sum(s.revenue_day for s in year_summaries),
            "top_services": [],
            "summary_date": end_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "period": label,
            "updated_at": summaries[0].updated_at.strftime("%Y-%m-%dT%H:%M:%SZ") if summaries else timezone.now().strftime("%Y-%m-%dT%H:%M:%SZ")
        }

        top_services_dict = {}
        for summary in summaries:
            for top_service in summary.top_services or []:
                service_name_or_id = top_service.service_name
                try:
                    if len(service_name_or_id) == 24 and all(c in '0123456789abcdefABCDEF' for c in service_name_or_id):
                        service = Service.objects(id=service_name_or_id).first()
                        service_name = service.name if service else "Unknown Service"
                    else:
                        service_name = service_name_or_id
                except ValueError:
                    service_name = service_name_or_id

                top_services_dict[service_name] = top_services_dict.get(service_name, 0) + top_service.booking_count

        aggregated_data["top_services"] = [
            {"service_name": name, "booking_count": count}
            for name, count in sorted(top_services_dict.items(), key=lambda x: x[1], reverse=True)[:5]
        ]

        serializer = DashboardSummarySerializer(aggregated_data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_top_services_in_period(self, start_date, end_date):
        # ใช้ Aggregation Framework แทนการใช้ annotate
        pipeline = [
            {"$match": {"date": {"$gte": start_date, "$lt": end_date}}},  # เงื่อนไขการเลือกช่วงเวลาจอง
            {"$group": {"_id": "$service", "num_bookings": {"$sum": 1}}},  # รวมจำนวนการจองตามบริการ
            {"$sort": {"num_bookings": -1}},  # เรียงจากมากไปน้อย
            {"$limit": 5}  # เลือก 5 บริการที่มีการจองมากที่สุด
        ]
        
        top_services = list(Booking.objects.aggregate(pipeline))  # ดึงข้อมูลจาก MongoDB
        
        # แปลงข้อมูลจาก aggregation ให้เป็นบริการที่มีชื่อ
        for service in top_services:
            service_obj = Service.objects(id=service['_id']).first()  # หา Service โดยใช้ id
            service['service_name'] = service_obj.name if service_obj else 'Unknown Service'
        
        return top_services

    
    def get_revenue_current_day(self, request):
        """ดูรายได้ในวันปัจจุบัน"""
        end_date = timezone.now()
        start_date = end_date.replace(hour=0, minute=0, second=0, microsecond=0)  # เริ่มต้นตั้งแต่เที่ยงคืน

        total_revenue = self.get_revenue_in_period(start_date, end_date)
        
        return Response({"total_revenue": total_revenue, "period": "Today"})
    
    def get_revenue_current_month(self, request):
        """ดูรายได้ในเดือนปัจจุบัน"""
        end_date = timezone.now()
        start_date = end_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)  # เริ่มต้นตั้งแต่วันที่ 1 ของเดือน

        total_revenue = self.get_revenue_in_period(start_date, end_date)
        
        return Response({"total_revenue": total_revenue, "period": "Current month"})
    def get_revenue_last_7_days(self, request):
        """ดูรายได้ใน 7 วันที่ผ่านมา"""
        end_date = timezone.now()
        start_date = end_date - timedelta(days=7)
        
        total_revenue = self.get_revenue_in_period(start_date, end_date)
        
        return Response({"total_revenue": total_revenue, "period": "Last 7 days"})

    def get_revenue_last_month(self, request):
        """ดูรายได้ใน 1 เดือนที่ผ่านมา"""
        end_date = timezone.now()
        start_date = end_date - timedelta(days=30)
        
        total_revenue = self.get_revenue_in_period(start_date, end_date)
        
        return Response({"total_revenue": total_revenue, "period": "Last 1 month"})
    
    def get_revenue_last_3_months(self, request):
        """ดูรายได้ใน 3 เดือนที่ผ่านมา"""
        end_date = timezone.now()
        start_date = end_date - timedelta(days=90)
        
        total_revenue = self.get_revenue_in_period(start_date, end_date)
        
        return Response({"total_revenue": total_revenue, "period": "Last 3 months"})
