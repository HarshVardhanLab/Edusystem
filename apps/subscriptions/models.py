from django.db import models
from apps.students.models import Student
from django.utils import timezone

class Subscription(models.Model):
    FEE_STATUS_CHOICES = [
        ('PAID', 'Paid'),
        ('DUE', 'Due'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='subscriptions')
    plan_name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    fee_amount = models.DecimalField(max_digits=10, decimal_places=2)
    fee_status = models.CharField(max_length=10, choices=FEE_STATUS_CHOICES, default='DUE')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subscriptions'
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student.full_name} - {self.plan_name}"
    
    @property
    def is_expired(self):
        return self.end_date < timezone.now().date()
    
    @property
    def days_remaining(self):
        if self.is_expired:
            return 0
        return (self.end_date - timezone.now().date()).days
    
    def save(self, *args, **kwargs):
        # Deactivate other active subscriptions for this student
        if self.is_active:
            Subscription.objects.filter(
                student=self.student,
                is_active=True
            ).exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)
