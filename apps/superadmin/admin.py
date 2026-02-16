from django.contrib import admin
from .models import SuperAdmin, LibraryLicense

@admin.register(SuperAdmin)
class SuperAdminAdmin(admin.ModelAdmin):
    list_display = ['user', 'company_name', 'created_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']

@admin.register(LibraryLicense)
class LibraryLicenseAdmin(admin.ModelAdmin):
    list_display = ['library', 'license_key', 'status', 'max_students', 'max_seats', 'end_date']
    list_filter = ['status', 'created_at']
    search_fields = ['library__name', 'license_key']
    readonly_fields = ['license_key', 'created_at', 'updated_at']