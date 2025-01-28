from django.shortcuts import render
from .models import Employee, Member,Service
from .serializers import EmployeeSerializer, MemberSerializers,ServiceSerializer
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

    # GET: ดึงข้อมูลบริการตาม ID
    def get(self, request, pk):
        service = self.get_object(pk)
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

    # PUT: อัปเดตข้อมูลบริการ
    def put(self, request, pk):
        service = self.get_object(pk)
        serializer = ServiceSerializer(service, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE: ลบบริการตาม ID
    def delete(self, request, pk):
        service = self.get_object(pk)
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



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

    def patch(self, request, pk):
        employee = self.get_object(pk)
        serializer = EmployeeSerializer(employee, data=request.data, partial=True)  # ใส่ True เพื่อให้สามารถอัปเดตแค่บาง field ได้
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)