from django.urls import path
from .study_views import (
    # Study Sessions
    StudySessionListCreateView,
    StudySessionDetailView,
    StudySessionStatsView,
    
    # Notes
    NoteListCreateView,
    NoteDetailView,
    
    # QR Code Attendance
    QRCodeGenerateView,
    QRCodeScanView,
    QRCodeListView,
    
    # Study Goals
    StudyGoalListCreateView,
    StudyGoalDetailView,
    
    # Tasks
    TaskListCreateView,
    TaskDetailView,
    
    # Quotes
    DailyQuoteView,
    QuoteListView,
)

urlpatterns = [
    # Study Sessions
    path('study-sessions/', StudySessionListCreateView.as_view(), name='study-session-list'),
    path('study-sessions/<int:pk>/', StudySessionDetailView.as_view(), name='study-session-detail'),
    path('study-sessions/stats/', StudySessionStatsView.as_view(), name='study-session-stats'),
    
    # Notes
    path('notes/', NoteListCreateView.as_view(), name='note-list'),
    path('notes/<int:pk>/', NoteDetailView.as_view(), name='note-detail'),
    
    # QR Code Attendance
    path('qr-codes/generate/', QRCodeGenerateView.as_view(), name='qr-generate'),
    path('qr-codes/scan/', QRCodeScanView.as_view(), name='qr-scan'),
    path('qr-codes/', QRCodeListView.as_view(), name='qr-list'),
    
    # Study Goals
    path('goals/', StudyGoalListCreateView.as_view(), name='goal-list'),
    path('goals/<int:pk>/', StudyGoalDetailView.as_view(), name='goal-detail'),
    
    # Tasks
    path('tasks/', TaskListCreateView.as_view(), name='task-list'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    
    # Quotes
    path('quotes/daily/', DailyQuoteView.as_view(), name='daily-quote'),
    path('quotes/', QuoteListView.as_view(), name='quote-list'),
]
