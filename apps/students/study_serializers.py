from rest_framework import serializers
from .study_models import StudySession, Note, AttendanceQRCode, StudyGoal, Task, MotivationalQuote


class StudySessionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    
    class Meta:
        model = StudySession
        fields = [
            'id', 'student', 'student_name', 'start_time', 'end_time', 
            'duration', 'session_type', 'notes', 'is_active', 'created_at'
        ]
        read_only_fields = ['student', 'duration', 'created_at']
    
    def validate(self, data):
        # Ensure end_time is after start_time
        if data.get('end_time') and data.get('start_time'):
            if data['end_time'] <= data['start_time']:
                raise serializers.ValidationError("End time must be after start time")
        return data


class StudySessionListSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    date = serializers.SerializerMethodField()
    
    class Meta:
        model = StudySession
        fields = ['id', 'student_name', 'date', 'start_time', 'end_time', 'duration', 'session_type', 'is_active']
    
    def get_date(self, obj):
        return obj.start_time.date() if obj.start_time else None


class NoteSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    
    class Meta:
        model = Note
        fields = [
            'id', 'student', 'student_name', 'title', 'content', 'category', 
            'tags', 'is_favorite', 'color', 'created_at', 'updated_at'
        ]
        read_only_fields = ['student', 'created_at', 'updated_at']


class NoteListSerializer(serializers.ModelSerializer):
    preview = serializers.SerializerMethodField()
    
    class Meta:
        model = Note
        fields = ['id', 'title', 'preview', 'category', 'is_favorite', 'color', 'updated_at']
    
    def get_preview(self, obj):
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content


class AttendanceQRCodeSerializer(serializers.ModelSerializer):
    library_name = serializers.CharField(source='library.name', read_only=True)
    is_currently_valid = serializers.SerializerMethodField()
    
    class Meta:
        model = AttendanceQRCode
        fields = [
            'id', 'library', 'library_name', 'date', 'code', 
            'valid_from', 'valid_until', 'is_active', 'is_currently_valid', 'created_at'
        ]
        read_only_fields = ['created_at']
    
    def get_is_currently_valid(self, obj):
        return obj.is_valid()


class StudyGoalSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    progress_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = StudyGoal
        fields = [
            'id', 'student', 'student_name', 'goal_type', 'target_hours', 
            'current_hours', 'progress_percentage', 'start_date', 'end_date', 
            'is_completed', 'created_at'
        ]
        read_only_fields = ['student', 'current_hours', 'is_completed', 'created_at']


class TaskSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    is_overdue = serializers.SerializerMethodField()
    
    class Meta:
        model = Task
        fields = [
            'id', 'student', 'student_name', 'title', 'description', 'priority', 
            'due_date', 'is_completed', 'completed_at', 'is_overdue', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['student', 'completed_at', 'created_at', 'updated_at']
    
    def get_is_overdue(self, obj):
        if obj.due_date and not obj.is_completed:
            from django.utils import timezone
            return obj.due_date < timezone.now()
        return False


class TaskListSerializer(serializers.ModelSerializer):
    is_overdue = serializers.SerializerMethodField()
    
    class Meta:
        model = Task
        fields = ['id', 'title', 'priority', 'due_date', 'is_completed', 'is_overdue']
    
    def get_is_overdue(self, obj):
        if obj.due_date and not obj.is_completed:
            from django.utils import timezone
            return obj.due_date < timezone.now()
        return False


class MotivationalQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MotivationalQuote
        fields = ['id', 'quote', 'author', 'category']
