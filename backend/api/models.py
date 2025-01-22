from mongoengine import Document, StringField, EmailField, BooleanField, IntField,DateTimeField
from mongoengine import connect
from django.contrib.auth.hashers import make_password, check_password
from datetime import datetime


class Member(Document):
    first_name = StringField(max_length=100, default="DefaultFirstName")
    last_name = StringField(max_length=100, default="DefaultLastName")
    nick_name = StringField(max_length=50, null=True, blank=True)
    email = EmailField(unique=True)
    phone_number = StringField(max_length=15, null=True, blank=True)
    password = StringField(max_length=255, default="defaultpassword")
    role = StringField(max_length=10, choices=["admin", "user"], default="user")
    profile_image = StringField(max_length=255, required=False, default="")  # เพิ่มรูปโปรไฟล์



    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    # ฟังก์ชันเพื่อเข้ารหัสรหัสผ่าน (hashed)
    def set_password(self, password):
        self.password = make_password(password)  # ทำการเข้ารหัสรหัสผ่าน

    # ฟังก์ชันเพื่อเช็คความถูกต้องของรหัสผ่าน
    def check_password(self, password):
        return check_password(password, self.password)  # เปรียบเทียบรหัสผ่านกับ hash

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super(Member, self).save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email} ({self.role})"
