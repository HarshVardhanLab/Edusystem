from django.db import models
from apps.accounts.models import User
from apps.libraries.models import Library

class SuperAdmin(models.Model):
    """Super Admin model for managing multiple libraries"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='superadmin')
    company_name = models.CharField(max_length=200, default='Nova LBS')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'superadmins'
        verbose_name = 'Super Admin'
        verbose_name_plural = 'Super Admins'
    
    def __str__(self):
        return f"Super Admin - {self.user.get_full_name()}"

class LibraryLicense(models.Model):
    """License management for libraries"""
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('SUSPENDED', 'Suspended'),
        ('EXPIRED', 'Expired'),
        ('TRIAL', 'Trial'),
    ]
    
    library = models.OneToOneField(Library, on_delete=models.CASCADE, related_name='license')
    license_key = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TRIAL')
    max_students = models.IntegerField(default=100)
    max_seats = models.IntegerField(default=50)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_licenses')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'library_licenses'
        verbose_name = 'Library License'
        verbose_name_plural = 'Library Licenses'
    
    def __str__(self):
        return f"{self.library.name} - {self.status}"
    
    @property
    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.end_date
    
    @property
    def days_remaining(self):
        from django.utils import timezone
        if self.is_expired:
            return 0
        return (self.end_date - timezone.now()).days