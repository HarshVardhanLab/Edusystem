from django.contrib import admin
from .models import ChatMessage, AIAnalysis


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['user_email', 'user_role', 'message_preview', 'response_time', 'created_at']
    list_filter = ['created_at', 'user_role']
    search_fields = ['user_email', 'message', 'response']
    readonly_fields = ['user_id', 'user_email', 'user_role', 'message', 'response', 'tokens_used', 'response_time', 'created_at']
    
    def message_preview(self, obj):
        return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
    message_preview.short_description = 'Message'


@admin.register(AIAnalysis)
class AIAnalysisAdmin(admin.ModelAdmin):
    list_display = ['user_email', 'user_role', 'analysis_type', 'created_at']
    list_filter = ['analysis_type', 'created_at', 'user_role']
    search_fields = ['user_email', 'result']
    readonly_fields = ['user_id', 'user_email', 'user_role', 'analysis_type', 'input_data', 'result', 'created_at']
