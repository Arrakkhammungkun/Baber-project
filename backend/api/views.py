from django.shortcuts import render
from .models import Booking, Employee, Member,Service
from .serializers import BookingSerializer, EmployeeSerializer, MemberSerializers,ServiceSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.hashers import check_password
import jwt
import datetime
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
@api_view(['GET'])
def example_view(request):
    data = {"message": "Hello, this is an API response! 55555555555"}
    return Response(data)

class MemberList(APIView):
    def get(self, request):
        members = Member.objects.all()  # ดึงสมาชิกทั้งหมดจาก MongoDB
        serializer = MemberSerializers(members, many=True) 
        return Response(serializer.data)

class RegisterAPIView(APIView):
    def post(self, request):
        serializer = MemberSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()  # บันทึกสมาชิกใหม่
            return Response({"message": "Registration successful", "data": serializer.data}, status=status.HTTP_201_CREATED)

        # เพิ่ม Error ให้หน้าบ้าน
        errors = serializer.errors
        detailed_errors = {field: errors[field][0] for field in errors}
        return Response({"message": "Validation failed", "errors": detailed_errors}, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
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
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
                    
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
                
                # ส่งข้อมูลไปยัง WebSocket
                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    "queue_updates",
                    {
                        "type": "send_queue_update",
                        "data": BookingSerializer(booking).data,
                    },
                )

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

        # ส่งข้อมูลไปยัง WebSocket เพื่ออัปเดตสถานะคิว
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "queue_updates", 
            {
                "type": "send_queue_update",
                "data": BookingSerializer(booking).data
            }
        )

        return Response({"message": "Booking In_progress successfully"})
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)
    
@api_view(['POST'])
def complete_booking(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        booking.status = "completed"
        booking.save()

        # ส่งข้อมูลไปยัง WebSocket เพื่อแจ้งว่าเสร็จสิ้น
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "queue_updates",
            {
                "type": "send_queue_update",
                "data": BookingSerializer(booking).data
            }
        )

        return Response({"message": "คิวเสร็จสิ้นแล้ว"})
    except Booking.DoesNotExist:
        return Response({"error": "ไม่พบคิวนี้"}, status=404)


@api_view(['DELETE'])
def delete_booking(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        booking.delete()

        # แจ้ง WebSocket ให้ UI อัปเดต
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "queue_updates", {"type": "delete_queue", "booking_id": booking_id}
        )

        return Response({"message": "คิวถูกลบแล้ว"})
    except Booking.DoesNotExist:
        return Response({"error": "ไม่พบคิวนี้"}, status=404)



@api_view(['GET'])
def check_availability(request):
    employee_id = request.GET.get('employeeId')
    date = request.GET.get('date')  # รูปแบบเช่น "YYYY-MM-DD"
    time = request.GET.get('time')  # รูปแบบเช่น "HH:MM"
    
    # แปลงเวลาจาก string เป็น datetime object
    try:
        booking_time = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
    except ValueError:
        return Response({"message": "Invalid date or time format."}, status=status.HTTP_400_BAD_REQUEST)
    
    # ตรวจสอบว่ามีการจองในเวลานั้นหรือไม่
    bookings = Booking.objects.filter(
        employee=employee_id,
        start_time=booking_time
    )

    
    if bookings.count() > 0:  # ใช้ count() เพื่อตรวจสอบว่า QuerySet มีข้อมูลหรือไม่
        return Response({"message": "Time slot is already booked."}, status=status.HTTP_409_CONFLICT)
    else:
        return Response({"message": "Time slot is available."}, status=status.HTTP_200_OK)
    


@api_view(['GET'])
def get_booked_times(request, employee_id, date):
    try:
        print(f"Received employee_id: {employee_id}, date: {date}")

        # แปลงวันที่ที่ส่งมาให้เป็น datetime object
        selected_date = datetime.strptime(date, "%Y-%m-%d")

        # เวลาทั้งหมดที่มีให้เลือก
        all_times = [
            "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
            "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
        ]
        
        # ดึงเวลาที่ถูกจองไปแล้วสำหรับพนักงานที่เลือก
        booked_slots = Booking.objects.filter(employee=employee_id, date=selected_date)

        # แปลง start_time เป็น string เวลา
        booked_times = [time.start_time.strftime("%I:%M %p") for time in booked_slots]

        # หาว่าเวลาไหนยังไม่ได้ถูกจอง
        available_times = [time for time in all_times if time not in booked_times]

        return Response({"available_times": available_times, "booked_times": booked_times})
    except Exception as e:
        return Response({"error": str(e)}, status=400)




