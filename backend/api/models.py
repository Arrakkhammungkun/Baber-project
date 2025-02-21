from django.forms import DateField
from mongoengine import Document, StringField, EmailField, BooleanField, IntField,DateTimeField,FileField,ListField, ReferenceField
from mongoengine import connect,DoesNotExist
from django.contrib.auth.hashers import make_password, check_password
from datetime import datetime, timedelta

from django.utils import timezone
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
        return f"{self.first_name} {self.last_name}"

class Service(Document):
    name = StringField(max_length=100, required=True)  
    description = StringField(max_length=255, null=True, blank=True)  
    price = IntField(required=True, min_value=0)  
    duration = IntField(required=True, min_value=0)  
    image_url = StringField(required=False, null=True, blank=True)  
    status = StringField(choices=["Active", "Inactive"], default="Active")
    created_at = DateTimeField(default=datetime.utcnow)  
    updated_at = DateTimeField(default=datetime.utcnow)  

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super(Service, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}"


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
        return f"{self.first_name} {self.last_name}"
    
class Booking(Document):
    customer = ReferenceField(Member, required=True)  
    employee = ReferenceField(Employee, required=True)  
    service = ReferenceField(Service, required=True)  
    date = DateTimeField(required=True)  
    start_time = DateTimeField(required=True)  # เวลาเริ่มต้น
    end_time = DateTimeField(required=True)  # เวลาสิ้นสุด (คำนวณจาก duration)
    status = StringField(choices=["pending", "confirmed", "cancelled","In_progress","completed"], default="pending")  # สถานะการจอง
    queue_position = IntField(default=0)  # คิวลำดับของช่างในวันนั้น
    created_at = DateTimeField(default=datetime.utcnow)
    
    def save(self, *args, **kwargs):
        """ คำนวณคิวของช่าง """
        existing_bookings = Booking.objects.filter(
            employee=self.employee,
            date=self.date
        ).order_by("start_time")
        
        self.queue_position = existing_bookings.count() + 1  # กำหนดลำดับคิวให้เป็นลำดับถัดไป

        self.end_time = self.start_time + timedelta(minutes=self.service.duration)  # คำนวณเวลาสิ้นสุด
        return super(Booking, self).save(*args, **kwargs)
    
class DashboardSummary(Document):
    # วันที่สรุป (อาจใช้เป็นวันที่ของข้อมูล)
    summary_date = DateTimeField()  # ใช้ DateTimeField ของ mongoengine

    # จำนวนลูกค้าที่จองคิววันนี้
    bookings_today = IntField(default=0)
    # จำนวนลูกค้าที่รับบริการแล้ว (เช่น status = "completed")
    served_customers = IntField(default=0)
    # คิวที่กำลังดำเนินการ (status = "In_progress")
    in_progress_count = IntField(default=0)
    # รายได้รวมของวัน
    revenue_day = IntField(default=0)
    # รายได้รวมของเดือน
    revenue_month = IntField(default=0)
    # รายได้รวมของปี
    revenue_year = IntField(default=0)
            
    # เวลาที่อัปเดตล่าสุด
    updated_at = DateTimeField(default=datetime.utcnow)
    
    def __str__(self):
        return f"Dashboard Summary for {self.summary_date.strftime('%Y-%m-%d')}"
    
def update_dashboard_summary( booking_date, status):
    """ อัปเดต Dashboard Summary ตามสถานะการจอง """
    today = booking_date.date()  # ดึงวันที่จากการจอง
    print(f"Updating summary for {today} with status: {status}")  # log status และ date สำหรับตรวจสอบ

    # ค้นหาข้อมูลใน DashboardSummary ตามวันที่
    summary = DashboardSummary.objects.filter(summary_date=today).first()

    if not summary:
        # ถ้าไม่มีข้อมูลสรุปของวันที่นี้ให้สร้างใหม่
        summary = DashboardSummary.objects.create(
            summary_date=today,
            bookings_today=0,
            served_customers=0,
            in_progress_count=0,
            revenue_day=0,
            revenue_month=0,
            revenue_year=0,
            updated_at=booking_date
        )

    # ตรวจสอบสถานะของการจองและอัปเดตค่าต่างๆ
    if status == 'create':
        summary.bookings_today += 1  # เพิ่มจำนวนการจองวันนี้
        print(f"Bookings today increased: {summary.bookings_today}")  # log เพิ่มการจอง
    elif status == 'cancelled':
        summary.bookings_today -= 1  # ลดจำนวนการจองวันนี้
        summary.in_progress_count -= 1  # ลดจำนวนคิวที่กำลังดำเนินการ
        print(f"Booking cancelled, bookings today: {summary.bookings_today}, in progress: {summary.in_progress_count}")
    elif status == 'In_progress':
        summary.in_progress_count += 1  # เพิ่มจำนวนคิวที่กำลังดำเนินการ
        print(f"In progress, in progress count: {summary.in_progress_count}")
    elif status == 'completed':
        summary.in_progress_count -= 1
        summary.served_customers += 1  # เพิ่มจำนวนลูกค้าที่รับบริการแล้ว
        print(f"Booking confirmed, served customers: {summary.served_customers}")

    summary.save()  # บันทึกการเปลี่ยนแปลงใน Dashboard Summary
    print("Summary updated successfully.")  # log การอัปเดตเสร็จสิ้น
