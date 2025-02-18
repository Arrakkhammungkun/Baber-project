from datetime import timedelta
from rest_framework import serializers
from .models import Booking, Employee, Member,Service  # ใช้ model ที่เป็น MongoEngine Document
from django.contrib.auth.hashers import make_password
from django.conf import settings
from bson import ObjectId
from django.shortcuts import get_object_or_404


class MemberSerializers(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    nick_name = serializers.CharField(max_length=50, required=False, allow_blank=True)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=15, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(default="user", read_only=True)  # ไม่ให้แก้ไขผ่าน API
    profile_image = serializers.CharField(required=False, allow_blank=True)

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        return value

    def create(self, validated_data):
        # ตัดรหัสผ่านออกจาก validated_data ก่อน
        password = validated_data.pop('password')

        # สร้างสมาชิกใหม่และเข้ารหัสรหัสผ่าน
        member = Member(**validated_data)
        member.set_password(password)  # ใช้ฟังก์ชัน set_password ของ MongoEngine Document
        member.save()

        return member

class ServiceSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)  # ID จาก MongoDB
    name = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=255, required=False, allow_blank=True)
    price = serializers.IntegerField()
    duration = serializers.IntegerField()  # ระยะเวลาในหน่วยนาที
    image_url = serializers.CharField(required=False, allow_blank=True)  # เปลี่ยนจาก SerializerMethodField เป็น CharField
    status = serializers.ChoiceField(choices=["Active", "Inactive"], default="Active")  # เพิ่มสถานะบริการ


    def create(self, validated_data):
        image_url = validated_data.pop('image_url', None)  # ดึงลิงก์ของภาพออกมาจาก validated_data
        service = Service(**validated_data)

        if image_url:
            service.image_url = image_url  # ตั้งค่าลิงก์ของภาพ
        service.save()
        return service

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.price = validated_data.get('price', instance.price)
        instance.duration = validated_data.get('duration', instance.duration)
        image_url = validated_data.get('image_url', None)
        instance.status = validated_data.get('status', instance.status)
        
        if image_url:
            instance.image_url = image_url  # อัปเดตลิงก์ของภาพ
        instance.save()
        return instance
    

class EmployeeSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    nickname = serializers.CharField(max_length=50, required=False, allow_blank=True)
    gender = serializers.CharField(max_length=10)
    dob = serializers.DateTimeField()
    position = serializers.CharField(max_length=100)
    status = serializers.CharField(max_length=50)
    employee_image_url = serializers.CharField(max_length=500, required=False, allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return Employee.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.nickname = validated_data.get('nickname', instance.nickname)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.dob = validated_data.get('dob', instance.dob)
        instance.position = validated_data.get('position', instance.position)
        instance.status = validated_data.get('status', instance.status)
        instance.employee_image_url = validated_data.get('employee_image_url', instance.employee_image_url)
        instance.save()
        return instance



class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        return ObjectId(data)  # ใช้ ObjectId() เพื่อแปลงกลับ



class BookingSerializer(serializers.Serializer):
    id = ObjectIdField(read_only=True)
    customer = ObjectIdField()
    employee = ObjectIdField()
    service = ObjectIdField()
    date = serializers.DateTimeField()
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField(read_only=True)
    status = serializers.ChoiceField(choices=["pending", "confirmed", "cancelled"], default="pending")

    def validate(self, data):
        """ ตรวจสอบว่าช่างมีคิวว่างในเวลาที่เลือก """
        print("Received data:", data)
        employee = data["employee"]
        start_time = data["start_time"]

        # ดึงข้อมูลของบริการที่ถูกเลือกจาก ObjectId
        service = Service.objects.get(id=data["service"])

        # คำนวณเวลาสิ้นสุดจาก duration ของบริการ
        end_time = start_time + timedelta(minutes=service.duration)

        # ตรวจสอบว่ามีการจองซ้ำในช่วงเวลาดังกล่าวหรือไม่
        existing_booking = Booking.objects.filter(
            employee=employee,
            start_time__lt=end_time,
            end_time__gt=start_time
        ).first()  # ตรวจสอบว่ามีการจองทับซ้อนหรือไม่


        if existing_booking:
            raise serializers.ValidationError("ช่างคนนี้ไม่ว่างในช่วงเวลาที่เลือก")

        data['end_time'] = end_time  # เพิ่ม end_time ที่คำนวณได้

        return data

    def create(self, validated_data):
        booking = Booking(**validated_data)
        booking.save()
        return booking