from django.urls import path
from .views import (
    StudentCreateView, StudentListView, StudentDetailView, 
    StudentDeactivateView, StudentActivateView, StudentDeleteView,
    StudentBulkUploadView
)

app_name = 'students'

urlpatterns = [
    path('', StudentListView.as_view(), name='student_list'),
    path('create/', StudentCreateView.as_view(), name='student_create'),
    path('bulk-upload/', StudentBulkUploadView.as_view(), name='student_bulk_upload'),
    path('<int:pk>/', StudentDetailView.as_view(), name='student_detail'),
    path('<int:pk>/deactivate/', StudentDeactivateView.as_view(), name='student_deactivate'),
    path('<int:pk>/activate/', StudentActivateView.as_view(), name='student_activate'),
    path('<int:pk>/delete/', StudentDeleteView.as_view(), name='student_delete'),
]
