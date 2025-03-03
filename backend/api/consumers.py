import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.serializers.json import DjangoJSONEncoder
from .models import Booking

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
        data = event["data"]
        print("Sending updated queue:", data)
        await self.send(text_data=json.dumps(data, cls=DjangoJSONEncoder))

    async def delete_queue(self, event):
        booking_id = event["booking_id"]
        await self.send(text_data=json.dumps({"delete": booking_id}))

    async def get_queue_data(self):
        bookings = Booking.objects.filter(status__in=["pending", "In_progress"]).order_by("employee", "start_time")
        employee_queue = {}
        queue_data = []

        for b in bookings:
            employee_id = str(b.employee.id)
            if employee_id not in employee_queue:
                employee_queue[employee_id] = 0
            queue_number = employee_queue[employee_id]
            employee_queue[employee_id] += 1

            # แปลง birthday เป็น string ถ้ามีค่า
            birthday = b.employee.dob.isoformat() if b.employee.dob else None

            queue_data.append({
                "queue_number": queue_number,
                "id": str(b.id),
                "customer": {
                    "id": str(b.customer.id),
                    "first_name": b.customer.first_name,
                    "last_name": b.customer.last_name,
                    "email": b.customer.email,
                    "profile": b.customer.profile_image,
                    "phone_number": b.customer.phone_number,
                },
                "employee": {
                    "id": employee_id,
                    "first_name": b.employee.first_name,
                    "last_name": b.employee.last_name,
                    "position": b.employee.position,
                    "profile": b.employee.employee_image_url,
                    "nickname": b.employee.nickname,
                    "gender": b.employee.gender,
                    "birthday": birthday,  # แปลงเป็น string
                },
                "service": {
                    "id": str(b.service.id),
                    "description": b.service.description,
                    "name": b.service.name,
                    "price": b.service.price,
                    "duration": b.service.duration,
                    "image_url": b.service.image_url
                },
                "start_time": b.start_time.isoformat(),
                "end_time": b.end_time.isoformat(),
                "status": b.status,
            })

        return queue_data

    def get_queue_data_sync(self):
        bookings = Booking.objects.filter(status__in=["pending", "In_progress"]).order_by("employee", "start_time")
        employee_queue = {}
        queue_data = []

        for b in bookings:
            employee_id = str(b.employee.id)
            if employee_id not in employee_queue:
                employee_queue[employee_id] = 0
            queue_number = employee_queue[employee_id]
            employee_queue[employee_id] += 1

            # แปลง birthday เป็น string ถ้ามีค่า
            birthday = b.employee.dob.isoformat() if b.employee.dob else None

            queue_data.append({
                "queue_number": queue_number,
                "id": str(b.id),
                "customer": {
                    "id": str(b.customer.id),
                    "first_name": b.customer.first_name,
                    "last_name": b.customer.last_name,
                    "email": b.customer.email,
                    "profile": b.customer.profile_image,
                    "phone_number": b.customer.phone_number,
                },
                "employee": {
                    "id": employee_id,
                    "first_name": b.employee.first_name,
                    "last_name": b.employee.last_name,
                    "position": b.employee.position,
                    "profile": b.employee.employee_image_url,
                    "nickname": b.employee.nickname,
                    "gender": b.employee.gender,
                    "birthday": birthday,  # แปลงเป็น string
                },
                "service": {
                    "id": str(b.service.id),
                    "description": b.service.description,
                    "name": b.service.name,
                    "price": b.service.price,
                    "duration": b.service.duration,
                    "image_url": b.service.image_url
                },
                "start_time": b.start_time.isoformat(),
                "end_time": b.end_time.isoformat(),
                "status": b.status,
            })

        return queue_data