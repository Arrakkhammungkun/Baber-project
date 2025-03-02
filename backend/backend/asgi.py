"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import api.routing  # นำเข้า routing จาก app api

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
print(f"PORT from environment: {os.getenv('PORT')}")
print(f"All environment variables: {os.environ}")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # จัดการ HTTP requests
    "websocket": AuthMiddlewareStack(  # จัดการ WebSocket requests
        URLRouter(
            api.routing.websocket_urlpatterns  # ใช้ WebSocket routes จาก api/routing.py
        )
    ),
})