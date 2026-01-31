from django.db import models
from apps.students.models import Student
from apps.libraries.models import Library
from django.conf import settings

class Attendance(models.Model):
    ATTENDANCE_TYPE_CHOICES = [
        ('MANUAL', 'Manual'),
        ('QR_CODE', 'QR Code'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendances')
    library = models.ForeignKey(Library, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    check_in_time = models.TimeField()
    attendance_type = models.CharField(max_length=10, choices=ATTENDANCE_TYPE_CHOICES, default='MANUAL')
    marked_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'attendance'
        verbose_name = 'Attendance'
        verbose_name_plural = 'Attendance Records'
        unique_together = ['student', 'date']
        ordering = ['-date', '-check_in_time']
    
    def __str__(self):
        return f"{self.student.full_name} - {self.date}"
