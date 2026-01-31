from django.db import models
from apps.students.models import Student

class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = [
        ('SUBSCRIPTION_EXPIRY', 'Subscription Expiry'),
        ('FEE_DUE', 'Fee Due'),
        ('ANNOUNCEMENT', 'Announcement'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student.full_name} - {self.notification_type}"
