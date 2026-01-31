from django.db import models
from django.conf import settings
import uuid

class Library(models.Model):
    owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='library')
    library_id = models.CharField(max_length=20, unique=True, editable=False, null=True, blank=True, help_text='Unique Library ID')
    name = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=15)
    total_seats = models.PositiveIntegerField()
    opening_time = models.TimeField()
    closing_time = models.TimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'libraries'
        verbose_name = 'Library'
        verbose_name_plural = 'Libraries'
    
    def __str__(self):
        return f"{self.name} ({self.library_id})"
    
    def save(self, *args, **kwargs):
        if not self.library_id:
            # Generate unique library ID (e.g., LIB001234)
            last_library = Library.objects.order_by('-id').first()
            if last_library and last_library.library_id:
                last_number = int(last_library.library_id.replace('LIB', ''))
                new_number = last_number + 1
            else:
                new_number = 1
            self.library_id = f'LIB{new_number:06d}'
        super().save(*args, **kwargs)
