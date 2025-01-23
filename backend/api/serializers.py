from rest_framework import serializers
from .models import Member,Service  # ใช้ model ที่เป็น MongoEngine Document
from django.contrib.auth.hashers import make_password
from django.conf import settings


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

        if image_url:
            instance.image_url = image_url  # อัปเดตลิงก์ของภาพ
        instance.save()
        return instance
