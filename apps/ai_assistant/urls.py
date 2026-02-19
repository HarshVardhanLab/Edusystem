"""
AI Assistant URL Configuration
"""
from django.urls import path
from . import views

urlpatterns = [
    # Chat
    path('chat/', views.ai_chat, name='ai-chat'),
    path('chat-history/', views.chat_history, name='ai-chat-history'),
    
    # Student Features
    path('analyze-performance/', views.analyze_performance, name='ai-analyze-performance'),
    path('study-plan/', views.generate_study_plan, name='ai-study-plan'),
    path('summarize-notes/', views.summarize_notes, name='ai-summarize-notes'),
    path('analyze-image/', views.analyze_image, name='ai-analyze-image'),
    
    # Library Owner Features
    path('business-insights/', views.business_insights, name='ai-business-insights'),
]
