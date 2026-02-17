"""
Core URLs for health checks and system monitoring
"""
from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health-check'),
    path('ping/', views.ping, name='ping'),
    path('status/', views.status, name='status'),
]
