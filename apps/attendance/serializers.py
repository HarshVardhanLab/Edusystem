from rest_framework import serializers
from .models import Attendance
from apps.students.models import Student
from django.utils import timezone

class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    library_name = serializers.CharField(source='library.name', read_only=True)
    marked_by_email = serializers.EmailField(source='marked_by.email', read_only=True)
    
    class Meta:
        model = Attendance
        fields = [
            'id', 'student', 'student_name', 'library', 'library_name',
            'date', 'check_in_time', 'attendance_type', 'marked_by',
            'marked_by_email', 'created_at'
        ]
        read_only_fields = ['id', 'library', 'marked_by', 'created_at']
    
    def validate(self, data):
        student = data.get('student')
        date = data.get('date', timezone.now().date())
        
        # Check if attendance already exists
        if Attendance.objects.filter(student=student, date=date).exists():
            raise serializers.ValidationError("Attendance already marked for this student today")
        
        # Validate student belongs to library
        library = self.context['request'].user.library
        if student.library != library:
            raise serializers.ValidationError("Student does not belong to your library")
        
        return data

class AttendanceListSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    seat_number = serializers.CharField(source='student.seat.seat_number', read_only=True)
    
    class Meta:
        model = Attendance
        fields = ['id', 'student_name', 'seat_number', 'date', 'check_in_time', 'attendance_type']
