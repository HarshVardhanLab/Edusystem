from django.contrib import admin
from .models import Seat

@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ['seat_number', 'library', 'seat_type', 'is_available', 'created_at']
    list_filter = ['seat_type', 'is_available', 'library']
    search_fields = ['seat_number', 'library__name']
    readonly_fields = ['created_at', 'updated_at']
