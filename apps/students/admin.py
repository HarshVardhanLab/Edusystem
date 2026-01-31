from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'library', 'phone', 'seat', 'time_slot', 'is_active', 'created_at']
    list_filter = ['is_active', 'time_slot', 'library', 'created_at']
    search_fields = ['full_name', 'phone']
    readonly_fields = ['created_at', 'updated_at']
