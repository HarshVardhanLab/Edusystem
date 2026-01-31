from django.contrib import admin
from .models import Attendance

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['student', 'library', 'date', 'check_in_time', 'attendance_type', 'marked_by']
    list_filter = ['date', 'attendance_type', 'library']
    search_fields = ['student__full_name']
    readonly_fields = ['created_at']
    date_hierarchy = 'date'
