from django.db import models
from django.utils import timezone
from apps.students.models import Student
from apps.libraries.models import Library


class StudySession(models.Model):
    """Track student study sessions with timer"""
    SESSION_TYPE_CHOICES = [
        ('POMODORO', 'Pomodoro (25 min)'),
        ('CUSTOM', 'Custom Duration'),
        ('BREAK', 'Break Time'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='study_sessions')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    duration = models.IntegerField(default=0, help_text='Duration in minutes')
    session_type = models.CharField(max_length=20, choices=SESSION_TYPE_CHOICES, default='CUSTOM')
    notes = models.TextField(blank=True, help_text='Session notes or summary')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'study_sessions'
        ordering = ['-start_time']
        verbose_name = 'Study Session'
        verbose_name_plural = 'Study Sessions'
    
    def __str__(self):
        return f"{self.student.full_name} - {self.start_time.date()} ({self.duration} min)"
    
    def save(self, *args, **kwargs):
        # Calculate duration if end_time is set
        if self.end_time and self.start_time:
            delta = self.end_time - self.start_time
            self.duration = int(delta.total_seconds() / 60)
        super().save(*args, **kwargs)


class Note(models.Model):
    """Student notes with categories and tags"""
    CATEGORY_CHOICES = [
        ('GENERAL', 'General'),
        ('MATH', 'Mathematics'),
        ('SCIENCE', 'Science'),
        ('HISTORY', 'History'),
        ('LANGUAGE', 'Language'),
        ('EXAM_PREP', 'Exam Preparation'),
        ('REVISION', 'Revision'),
        ('OTHER', 'Other'),
    ]
    
    COLOR_CHOICES = [
        ('#FFFFFF', 'White'),
        ('#FEF3C7', 'Yellow'),
        ('#DBEAFE', 'Blue'),
        ('#D1FAE5', 'Green'),
        ('#FCE7F3', 'Pink'),
        ('#E0E7FF', 'Indigo'),
        ('#FED7AA', 'Orange'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='GENERAL')
    tags = models.JSONField(default=list, blank=True, help_text='List of tags')
    is_favorite = models.BooleanField(default=False)
    color = models.CharField(max_length=7, choices=COLOR_CHOICES, default='#FFFFFF')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'student_notes'
        ordering = ['-updated_at']
        verbose_name = 'Note'
        verbose_name_plural = 'Notes'
    
    def __str__(self):
        return f"{self.student.full_name} - {self.title}"


class AttendanceQRCode(models.Model):
    """QR codes for attendance marking"""
    library = models.ForeignKey(Library, on_delete=models.CASCADE, related_name='qr_codes')
    date = models.DateField()
    code = models.CharField(max_length=100, unique=True)
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'attendance_qr_codes'
        ordering = ['-date']
        unique_together = ['library', 'date']
        verbose_name = 'Attendance QR Code'
        verbose_name_plural = 'Attendance QR Codes'
    
    def __str__(self):
        return f"{self.library.name} - {self.date}"
    
    def is_valid(self):
        """Check if QR code is currently valid"""
        now = timezone.now()
        return self.is_active and self.valid_from <= now <= self.valid_until


class StudyGoal(models.Model):
    """Student study goals and targets"""
    GOAL_TYPE_CHOICES = [
        ('DAILY', 'Daily Goal'),
        ('WEEKLY', 'Weekly Goal'),
        ('MONTHLY', 'Monthly Goal'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='study_goals')
    goal_type = models.CharField(max_length=20, choices=GOAL_TYPE_CHOICES)
    target_hours = models.IntegerField(help_text='Target study hours')
    current_hours = models.IntegerField(default=0, help_text='Current progress in hours')
    start_date = models.DateField()
    end_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'study_goals'
        ordering = ['-start_date']
        verbose_name = 'Study Goal'
        verbose_name_plural = 'Study Goals'
    
    def __str__(self):
        return f"{self.student.full_name} - {self.goal_type} ({self.current_hours}/{self.target_hours}h)"
    
    @property
    def progress_percentage(self):
        """Calculate goal completion percentage"""
        if self.target_hours == 0:
            return 0
        return min(int((self.current_hours / self.target_hours) * 100), 100)


class Task(models.Model):
    """Student tasks and todo items"""
    PRIORITY_CHOICES = [
        ('HIGH', 'High Priority'),
        ('MEDIUM', 'Medium Priority'),
        ('LOW', 'Low Priority'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='MEDIUM')
    due_date = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'student_tasks'
        ordering = ['-priority', 'due_date', '-created_at']
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'
    
    def __str__(self):
        return f"{self.student.full_name} - {self.title}"
    
    def save(self, *args, **kwargs):
        # Set completed_at when task is marked complete
        if self.is_completed and not self.completed_at:
            self.completed_at = timezone.now()
        elif not self.is_completed:
            self.completed_at = None
        super().save(*args, **kwargs)


class MotivationalQuote(models.Model):
    """Motivational quotes for students"""
    CATEGORY_CHOICES = [
        ('STUDY', 'Study & Learning'),
        ('SUCCESS', 'Success'),
        ('PERSEVERANCE', 'Perseverance'),
        ('MOTIVATION', 'Motivation'),
        ('INSPIRATION', 'Inspiration'),
    ]
    
    quote = models.TextField()
    author = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='MOTIVATION')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'motivational_quotes'
        ordering = ['?']  # Random ordering
        verbose_name = 'Motivational Quote'
        verbose_name_plural = 'Motivational Quotes'
    
    def __str__(self):
        return f"{self.quote[:50]}... - {self.author}"
