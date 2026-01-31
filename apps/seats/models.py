from django.db import models
from apps.libraries.models import Library

class Seat(models.Model):
    SEAT_TYPE_CHOICES = [
        ('FIXED', 'Fixed'),
        ('FLEXIBLE', 'Flexible'),
    ]
    
    library = models.ForeignKey(Library, on_delete=models.CASCADE, related_name='seats')
    seat_number = models.CharField(max_length=10)
    seat_type = models.CharField(max_length=10, choices=SEAT_TYPE_CHOICES)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'seats'
        verbose_name = 'Seat'
        verbose_name_plural = 'Seats'
        unique_together = ['library', 'seat_number']
        ordering = ['seat_number']
    
    def __str__(self):
        return f"{self.library.name} - Seat {self.seat_number}"
