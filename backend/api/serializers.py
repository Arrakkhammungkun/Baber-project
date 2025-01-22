from rest_framework import serializers
from .models import Member  # ใช้ model ที่เป็น MongoEngine Document
from django.contrib.auth.hashers import make_password


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
