from rest_framework import serializers
from .models import Seat

class SeatSerializer(serializers.ModelSerializer):
    library_name = serializers.CharField(source='library.name', read_only=True)
    assigned_to = serializers.SerializerMethodField()
    assigned_student_id = serializers.SerializerMethodField()
    
    class Meta:
        model = Seat
        fields = [
            'id', 'library', 'library_name', 'seat_number', 'seat_type',
            'is_available', 'assigned_to', 'assigned_student_id', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'library', 'created_at', 'updated_at']
    
    def get_assigned_to(self, obj):
        """Get the student assigned to this seat"""
        try:
            # Use the reverse relationship from Student model
            if hasattr(obj, 'student') and obj.student:
                return obj.student.full_name
            return None
        except:
            return None
    
    def get_assigned_student_id(self, obj):
        """Get the ID of the student assigned to this seat"""
        try:
            if hasattr(obj, 'student') and obj.student:
                return obj.student.id
            return None
        except:
            return None
    
    def validate_seat_number(self, value):
        library = self.context['request'].user.library
        if Seat.objects.filter(library=library, seat_number=value).exists():
            if not self.instance or self.instance.seat_number != value:
                raise serializers.ValidationError("Seat number already exists")
        return value

class SeatAssignSerializer(serializers.Serializer):
    student_id = serializers.IntegerField()
    
    def validate_student_id(self, value):
        from apps.students.models import Student
        library = self.context['request'].user.library
        try:
            student = Student.objects.get(id=value, library=library)
            if hasattr(student, 'seat') and student.seat:
                raise serializers.ValidationError("Student already has a seat assigned")
        except Student.DoesNotExist:
            raise serializers.ValidationError("Student not found")
        return value
