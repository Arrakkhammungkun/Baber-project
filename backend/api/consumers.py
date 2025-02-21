import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.serializers.json import DjangoJSONEncoder
from datetime import datetime
from .models import Booking  # นำเข้ารุ่น Booking

class QueueConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("queue_updates", self.channel_name)
        await self.accept()
        print("WebSocket Connected!")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("queue_updates", self.channel_name)
        print("WebSocket Disconnected!")

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")
        
        if action == "fetch_queue":
            queue_data = await self.get_queue_data()
            await self.send(text_data=json.dumps(queue_data, cls=DjangoJSONEncoder))
            
    async def update_queue_after_deletion(self, employee_id):
        """ รีเซ็ตลำดับคิวของพนักงานคนนั้นหลังจากมีการลบ """
        bookings = Booking.objects.filter(employee_id=employee_id).order_by("start_time")

        # รีเซ็ตหมายเลขคิว
        for index, b in enumerate(bookings, start=1):
            b.queue_number = index  # ตั้งค่าลำดับใหม่
            b.save(update_fields=["queue_number"])  # อัปเดตเฉพาะ field queue_number

    async def send_queue_update(self, event):
        """ อัปเดตข้อมูลจากฐานข้อมูลจริงก่อนส่งไปยัง frontend """
        queue_data = await self.get_queue_data()  # ดึงข้อมูลใหม่ล่าสุด
        print("อัปเดตคิวล่าสุด:", queue_data)

        # ส่งข้อมูลคิวใหม่ให้ทุกคนที่เชื่อมต่อ
        await self.send(text_data=json.dumps(queue_data, cls=DjangoJSONEncoder))



    async def delete_queue(self, event):
        """ ลบคิวออกจาก frontend """
        booking_id = event["booking_id"]
        await self.send(text_data=json.dumps({"delete": booking_id}))


    async def get_queue_data(self):
        """ ดึงข้อมูลคิวล่าสุดและกำหนดลำดับคิวของพนักงานแต่ละคน """
        bookings = Booking.objects.all().order_by("employee", "start_time")  # เรียงตามพนักงานและเวลาเริ่มต้น

        # จัดลำดับคิวแยกตามพนักงาน
        employee_queue = {}
        queue_data = []

        for index, b in enumerate(bookings):
            employee_id = str(b.employee.id)

            # ตรวจสอบว่าพนักงานคนนี้มีคิวแล้วหรือยัง
            if employee_id not in employee_queue:
                employee_queue[employee_id] = 0  # เริ่มจากคิวที่ 0

            queue_number = employee_queue[employee_id]  # คิวของพนักงานคนนี้
            employee_queue[employee_id] += 1  # เพิ่มลำดับคิวสำหรับคิวถัดไป

            queue_data.append({
                "queue_number": queue_number,  # เพิ่มคิวที่ถูกต้อง
                "id": str(b.id),
                "customer": {
                    "id": str(b.customer.id),
                    "first_name": b.customer.first_name,
                    "last_name": b.customer.last_name,
                    "email": b.customer.email,
                    "profile": b.customer.profile_image,
                },
                "employee": {
                    "id": employee_id,
                    "first_name": b.employee.first_name,
                    "last_name": b.employee.last_name,
                    "position": b.employee.position,
                    "profile": b.employee.employee_image_url,
                    "nickname": b.employee.nickname,
                    "gender": b.employee.gender,
                    "birthday": b.employee.dob
                },
                "service": {
                    "id": str(b.service.id),
                    "description": b.service.description,
                    "name": b.service.name,
                    "price": b.service.price,
                    "duration": b.service.duration,
                    "image_url": b.service.image_url
                },
                "start_time": b.start_time,
                "end_time": b.end_time,
                "status": b.status,
            })

        return queue_data
