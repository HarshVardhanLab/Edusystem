from django.contrib import admin
from .models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['student', 'plan_name', 'start_date', 'end_date', 'fee_amount', 'fee_status', 'is_active']
    list_filter = ['fee_status', 'is_active', 'start_date', 'end_date']
    search_fields = ['student__full_name', 'plan_name']
    readonly_fields = ['created_at', 'updated_at']
