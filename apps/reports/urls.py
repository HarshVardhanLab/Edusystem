from django.urls import path
from .views import DashboardStatsView, MonthlyAttendanceReportView, StudentReportView

app_name = 'reports'

urlpatterns = [
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard'),
    path('monthly-attendance/', MonthlyAttendanceReportView.as_view(), name='monthly_attendance'),
    path('students/', StudentReportView.as_view(), name='student_report'),
]
