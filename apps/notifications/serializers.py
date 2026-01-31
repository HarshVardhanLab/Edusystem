from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'student', 'student_name', 'notification_type',
            'title', 'message', 'is_read', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class NotificationListSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'student_name', 'notification_type', 'title', 'message', 'is_read', 'created_at']
