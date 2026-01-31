from rest_framework import serializers
from .models import Student
from apps.seats.models import Seat

class StudentSerializer(serializers.ModelSerializer):
    library_name = serializers.CharField(source='library.name', read_only=True)
    seat_number = serializers.CharField(source='seat.seat_number', read_only=True)
    age = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Student
        fields = [
            'id', 'library', 'library_name', 'full_name', 'phone', 'email', 'photo',
            'id_proof', 'seat', 'seat_number', 'time_slot',
            # Personal Details
            'gender', 'date_of_birth', 'age', 'father_name', 'emergency_contact',
            # Educational Details
            'preparing_for', 'qualification', 'education_level', 'institution_name',
            # Address
            'address',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'library', 'age', 'created_at', 'updated_at']
    
    def validate_phone(self, value):
        if not value.isdigit() or len(value) < 10:
            raise serializers.ValidationError("Invalid phone number")
        return value
    
    def validate_seat(self, value):
        if value and value.student and value.student != self.instance:
            raise serializers.ValidationError("This seat is already assigned")
        return value

class StudentListSerializer(serializers.ModelSerializer):
    library_name = serializers.CharField(source='library.name', read_only=True)
    seat_number = serializers.CharField(source='seat.seat_number', read_only=True)
    age = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Student
        fields = [
            'id', 'full_name', 'phone', 'email', 'library_name', 'seat_number', 'time_slot',
            'gender', 'age', 'father_name',
            'preparing_for', 'qualification', 'education_level', 'institution_name',
            'is_active'
        ]
