from rest_framework import serializers
from .models import Subscription
from django.utils import timezone

class SubscriptionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Subscription
        fields = [
            'id', 'student', 'student_name', 'plan_name', 'start_date',
            'end_date', 'fee_amount', 'fee_status', 'is_active',
            'days_remaining', 'is_expired', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data):
        if data.get('start_date') and data.get('end_date'):
            if data['start_date'] >= data['end_date']:
                raise serializers.ValidationError("End date must be after start date")
        
        # Validate student belongs to library
        student = data.get('student')
        library = self.context['request'].user.library
        if student.library != library:
            raise serializers.ValidationError("Student does not belong to your library")
        
        return data

class SubscriptionListSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Subscription
        fields = ['id', 'student_name', 'plan_name', 'start_date', 'end_date', 'fee_amount', 'fee_status', 'days_remaining', 'is_active']
