from django.urls import path
from .views import (
    SuperAdminDashboardView, LibraryManagementView, LibraryDetailManagementView,
    LibraryLicenseManagementView, LibraryLicenseDetailView, LibraryToggleStatusView,
    SystemStatsView
)

app_name = 'superadmin'

urlpatterns = [
    path('dashboard/', SuperAdminDashboardView.as_view(), name='dashboard'),
    path('libraries/', LibraryManagementView.as_view(), name='library_list'),
    path('libraries/<int:pk>/', LibraryDetailManagementView.as_view(), name='library_detail'),
    path('libraries/<int:pk>/toggle-status/', LibraryToggleStatusView.as_view(), name='library_toggle_status'),
    path('licenses/', LibraryLicenseManagementView.as_view(), name='license_list'),
    path('licenses/<int:pk>/', LibraryLicenseDetailView.as_view(), name='license_detail'),
    path('stats/', SystemStatsView.as_view(), name='system_stats'),
]