from django.forms import DateField
from mongoengine import Document, StringField, EmailField, BooleanField, IntField,DateTimeField,FileField,ListField, ReferenceField
from mongoengine import connect
from django.contrib.auth.hashers import make_password, check_password
from datetime import datetime, timedelta


class Member(Document):
    first_name = StringField(max_length=100, default="DefaultFirstName")
    last_name = StringField(max_length=100, default="DefaultLastName")
    nick_name = StringField(max_length=50, null=True, blank=True)
    email = EmailField(unique=True)
    phone_number = StringField(max_length=15, null=True, blank=True)
    password = StringField(max_length=255, default="defaultpassword")
    role = StringField(max_length=10, choices=["admin", "user"], default="user")
    profile_image = StringField(max_length=255, null=True, blank=True)



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

class Service(Document):
    name = StringField(max_length=100, required=True)  # ชื่อบริการ
    description = StringField(max_length=255, null=True, blank=True)  # รายละเอียด
    price = IntField(required=True, min_value=0)  # ราคา
    duration = IntField(required=True, min_value=0)  # ระยะเวลาในหน่วยนาที
    image_url = StringField(required=False, null=True, blank=True)  # เปลี่ยนจาก FileField เป็น StringField
    created_at = DateTimeField(default=datetime.utcnow)  # เวลาสร้าง
    updated_at = DateTimeField(default=datetime.utcnow)  # เวลาแก้ไขล่าสุด

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super(Service, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.price} Baht ({self.duration} mins)"


class Employee(Document):
    first_name = StringField(max_length=100)
    last_name = StringField(max_length=100)
    nickname = StringField(max_length=50, blank=True)
    gender = StringField(max_length=10, choices=['Male', 'Female', 'Other'])
    dob = DateTimeField()  # วันเกิด
    position = StringField(max_length=100)  # ตำแหน่ง
    status = StringField(max_length=50)  # สถานะพนักงาน
    employee_image_url = StringField(max_length=500, blank=True)  # ลิงก์ภาพพนักงาน
    
    created_at = DateTimeField(default=datetime.utcnow)  # เวลาสร้าง
    updated_at = DateTimeField(default=datetime.utcnow)  # เวลาที่อัปเดตข้อมูลล่าสุด

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super(Employee, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.position})"
    
class Booking(Document):
    customer = ReferenceField(Member, required=True)  # อ้างอิงถึงลูกค้า
    employee = ReferenceField(Employee, required=True)  # อ้างอิงถึงช่างที่เลือก
    service = ReferenceField(Service, required=True)  # อ้างอิงถึงบริการที่เลือก
    date = DateTimeField(required=True)  # วันที่จอง
    start_time = DateTimeField(required=True)  # เวลาเริ่มต้น
    end_time = DateTimeField(required=True)  # เวลาสิ้นสุด (คำนวณจาก duration)
    status = StringField(choices=["pending", "confirmed", "cancelled","In_progress","completed"], default="pending")  # สถานะการจอง
    created_at = DateTimeField(default=datetime.utcnow)

    def save(self, *args, **kwargs):
        self.end_time = self.start_time + timedelta(minutes=self.service.duration)  # คำนวณเวลาสิ้นสุด
        return super(Booking, self).save(*args, **kwargs)
