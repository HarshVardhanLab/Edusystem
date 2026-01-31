from rest_framework import serializers
from .models import Seat

class SeatSerializer(serializers.ModelSerializer):
    library_name = serializers.CharField(source='library.name', read_only=True)
    assigned_to = serializers.CharField(source='student.full_name', read_only=True)
    
    class Meta:
        model = Seat
        fields = [
            'id', 'library', 'library_name', 'seat_number', 'seat_type',
            'is_available', 'assigned_to', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'library', 'created_at', 'updated_at']
    
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
