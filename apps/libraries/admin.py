from django.contrib import admin
from .models import Library

@admin.register(Library)
class LibraryAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'phone', 'total_seats', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'owner__email', 'phone']
    readonly_fields = ['created_at', 'updated_at']
