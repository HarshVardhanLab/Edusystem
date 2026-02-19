from django.db import models
from django.conf import settings


class ChatMessage(models.Model):
    """Store chat history for context and analytics"""
    # Store user info as fields instead of ForeignKey to support both User and Student
    user_id = models.IntegerField(help_text='ID of the user or student')
    user_email = models.EmailField(help_text='Email of the user')
    user_role = models.CharField(max_length=20, help_text='Role: STUDENT, LIBRARY, etc.')
    message = models.TextField()
    response = models.TextField()
    tokens_used = models.IntegerField(default=0)
    response_time = models.FloatField(help_text='Response time in seconds')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ai_chat_messages'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user_email} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class AIAnalysis(models.Model):
    """Store AI analysis results"""
    ANALYSIS_TYPES = [
        ('PERFORMANCE', 'Performance Analysis'),
        ('STUDY_PLAN', 'Study Plan'),
        ('NOTE_SUMMARY', 'Note Summary'),
        ('BUSINESS_INSIGHT', 'Business Insight'),
    ]
    
    # Store user info as fields instead of ForeignKey to support both User and Student
    user_id = models.IntegerField(help_text='ID of the user or student')
    user_email = models.EmailField(help_text='Email of the user')
    user_role = models.CharField(max_length=20, help_text='Role: STUDENT, LIBRARY, etc.')
    analysis_type = models.CharField(max_length=20, choices=ANALYSIS_TYPES)
    input_data = models.JSONField()
    result = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ai_analyses'
        ordering = ['-created_at']
        verbose_name_plural = 'AI Analyses'
    
    def __str__(self):
        return f"{self.user_email} - {self.analysis_type} - {self.created_at.strftime('%Y-%m-%d')}"
