from django.shortcuts import render
from .models import Member
from .serializers import MemberSerializers
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

    member.profile_image = file_path
    member.save()

    return JsonResponse({"message": "File uploaded successfully", "path": member.profile_image}, status=200)