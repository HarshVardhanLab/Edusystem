from rest_framework import serializers
from .models import SuperAdmin, LibraryLicense
from apps.libraries.models import Library
from apps.students.models import Student
from apps.seats.models import Seat

class LibraryStatsSerializer(serializers.ModelSerializer):
    total_students = serializers.SerializerMethodField()
    active_students = serializers.SerializerMethodField()
    total_seats = serializers.SerializerMethodField()
    occupied_seats = serializers.SerializerMethodField()
    license_status = serializers.SerializerMethodField()
    license_expires = serializers.SerializerMethodField()
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    
    class Meta:
        model = Library
        fields = [
            'id', 'library_id', 'name', 'owner', 'owner_email', 'phone', 'address',
            'total_seats', 'opening_time', 'closing_time', 'is_active',
            'total_students', 'active_students', 'occupied_seats',
            'license_status', 'license_expires', 'created_at', 'updated_at', 'last_login'
        ]
        read_only_fields = ['id', 'library_id', 'owner', 'created_at', 'updated_at']
    
    def get_total_students(self, obj):
        return Student.objects.filter(library=obj, is_deleted=False).count()
    
    def get_active_students(self, obj):
        return Student.objects.filter(library=obj, is_deleted=False, is_active=True).count()
    
    def get_total_seats(self, obj):
        return Seat.objects.filter(library=obj).count()
    
    def get_occupied_seats(self, obj):
        return Seat.objects.filter(library=obj, is_available=False).count()
    
    def get_license_status(self, obj):
        try:
            license_obj = LibraryLicense.objects.filter(library=obj).first()
            return license_obj.status if license_obj else 'NO_LICENSE'
        except:
            return 'NO_LICENSE'
    
    def get_license_expires(self, obj):
        try:
            license_obj = LibraryLicense.objects.filter(library=obj).first()
            return license_obj.end_date if license_obj else None
        except:
            return None

class LibraryLicenseSerializer(serializers.ModelSerializer):
    library_name = serializers.CharField(source='library.name', read_only=True)
    days_remaining = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()
    
    class Meta:
        model = LibraryLicense
        fields = [
            'id', 'library', 'library_name', 'license_key', 'status',
            'max_students', 'max_seats', 'start_date', 'end_date',
            'days_remaining', 'is_expired', 'created_at'
        ]

class SuperAdminDashboardSerializer(serializers.Serializer):
    total_libraries = serializers.IntegerField()
    active_libraries = serializers.IntegerField()
    total_students = serializers.IntegerField()
    total_seats = serializers.IntegerField()
    licenses_expiring_soon = serializers.IntegerField()
    recent_registrations = serializers.ListField()
    license_status_breakdown = serializers.DictField()