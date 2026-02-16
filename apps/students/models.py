from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from apps.libraries.models import Library
from apps.seats.models import Seat
from cloudinary.models import CloudinaryField
import random
import string

class Student(models.Model):
    TIME_SLOT_CHOICES = [
        ('MORNING', 'Morning (6 AM - 12 PM)'),
        ('AFTERNOON', 'Afternoon (12 PM - 6 PM)'),
        ('EVENING', 'Evening (6 PM - 12 AM)'),
        ('FULL_DAY', 'Full Day'),
    ]
    
    EDUCATION_LEVEL_CHOICES = [
        ('SCHOOL', 'School'),
        ('COLLEGE', 'College'),
        ('UNIVERSITY', 'University'),
        ('COMPETITIVE_EXAM', 'Competitive Exam'),
        ('OTHER', 'Other'),
    ]
    
    GENDER_CHOICES = [
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
    ]
    
    library = models.ForeignKey(Library, on_delete=models.CASCADE, related_name='students')
    student_id = models.CharField(max_length=20, unique=True, editable=False, null=True, blank=True, help_text='Unique Student ID')
    
    # Basic Information
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
    password = models.CharField(max_length=128, null=True, blank=True, help_text='Student login password')
    photo = CloudinaryField('image', blank=True, null=True, folder='students/photos')
    id_proof = CloudinaryField('raw', blank=True, null=True, folder='students/documents')
    seat = models.OneToOneField(Seat, on_delete=models.SET_NULL, null=True, blank=True, related_name='student')
    time_slot = models.CharField(max_length=20, choices=TIME_SLOT_CHOICES)
    
    # Personal Details
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    father_name = models.CharField(max_length=200, blank=True, null=True)
    emergency_contact = models.CharField(max_length=15, blank=True, null=True, help_text='Emergency contact number')
    
    # Educational Details
    preparing_for = models.CharField(max_length=200, blank=True, null=True, help_text='What exam/course they are preparing for')
    qualification = models.CharField(max_length=200, blank=True, null=True, help_text='Current qualification or class')
    education_level = models.CharField(max_length=20, choices=EDUCATION_LEVEL_CHOICES, blank=True, null=True)
    institution_name = models.CharField(max_length=200, blank=True, null=True, help_text='School/College name')
    
    # Address
    address = models.TextField(blank=True, null=True, help_text='Full address')
    
    is_active = models.BooleanField(default=True)
    
    # Soft Delete Fields
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    deleted_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_students')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'students'
        verbose_name = 'Student'
        verbose_name_plural = 'Students'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.full_name} ({self.student_id}) - {self.library.name}"
    
    def save(self, *args, **kwargs):
        # Generate unique student ID if not exists - New format: STU00001
        if not self.student_id:
            last_student = Student.objects.filter(
                student_id__startswith='STU'
            ).order_by('-student_id').first()
            
            if last_student and last_student.student_id:
                try:
                    last_number = int(last_student.student_id.replace('STU', ''))
                    new_number = last_number + 1
                except ValueError:
                    new_number = 1
            else:
                new_number = 1
            
            self.student_id = f'STU{new_number:05d}'
        
        # Hash password if it's being set or changed
        if self.pk is None:  # New student
            if self.password and not self.password.startswith('pbkdf2_'):
                self.password = make_password(self.password)
        else:  # Existing student
            old_student = Student.objects.get(pk=self.pk)
            if self.password != old_student.password and not self.password.startswith('pbkdf2_'):
                self.password = make_password(self.password)
        
        super().save(*args, **kwargs)
    
    def check_password(self, raw_password):
        """Check if the provided password is correct"""
        return check_password(raw_password, self.password)
    
    def generate_random_password(self, length=6):
        """Generate a random numeric password"""
        return ''.join([str(random.randint(0, 9)) for _ in range(length)])
    
    def soft_delete(self, deleted_by=None):
        """Soft delete student and free their seat"""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.deleted_by = deleted_by
        self.is_active = False
        
        # Free the seat safely
        if self.seat:
            try:
                # Refresh the seat from database to ensure it exists
                seat = self.seat
                seat.is_available = True
                seat.save()
                # Clear the relationship
                self.seat = None
            except Exception as e:
                # Log the error but don't fail the deletion
                print(f"Warning: Could not free seat for student {self.id}: {e}")
                # Clear the relationship anyway
                self.seat = None
        
        self.save()
    
    def restore(self):
        """Restore soft-deleted student"""
        self.is_deleted = False
        self.deleted_at = None
        self.deleted_by = None
        self.is_active = True
        self.save()
    
    @property
    def age(self):
        """Calculate age from date of birth"""
        if self.date_of_birth:
            from datetime import date
            today = date.today()
            return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        return None
    
    @property
    def days_until_permanent_delete(self):
        """Calculate days remaining until permanent deletion"""
        if self.is_deleted and self.deleted_at:
            days_passed = (timezone.now() - self.deleted_at).days
            return max(0, 30 - days_passed)
        return None
