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

    async def send_queue_update(self, event):
        """ ส่งข้อมูลคิวแบบเรียลไทม์ไปยัง frontend """
        queue_data = event["data"]
        await self.send(text_data=json.dumps(queue_data, cls=DjangoJSONEncoder))

    async def delete_queue(self, event):
        """ ลบคิวออกจาก frontend """
        booking_id = event["booking_id"]
        await self.send(text_data=json.dumps({"delete": booking_id}))


    async def get_queue_data(self):
        """ ดึงข้อมูลคิวล่าสุด """
        bookings = Booking.objects.all().order_by("start_time")
        queue_data = [
            {
                "id": str(b.id),
                "customer": {
                    "id": str(b.customer.id),
                    "first_name": b.customer.first_name,
                    "last_name": b.customer.last_name,
                    "email": b.customer.email,
                    "Proflie": b.customer.profile_image,
                },
                "employee": {
                    "id": str(b.employee.id),
                    "first_name": b.employee.first_name,
                    "last_name": b.employee.last_name,
                    "position": b.employee.position,
                    "Proflie":b.employee.employee_image_url,
                    "nickname":b.employee.nickname,
                    "gender":b.employee.gender,
                    "Birthday":b.employee.dob
                },
                "service": {
                    "id": str(b.service.id),
                    "description":b.service.description,
                    "name": b.service.name,
                    "price": b.service.price,
                    "duration": b.service.duration,
                    "image_url":b.service.image_url
                },
                "start_time": b.start_time,
                "end_time": b.end_time,
                "status": b.status,
            }
            for b in bookings
        ]
        return queue_data
