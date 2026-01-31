from django.urls import path
from .views import (
    AttendanceMarkView, AttendanceListView, DailyAttendanceView, MonthlyAttendanceSummaryView
)

app_name = 'attendance'

urlpatterns = [
    path('', AttendanceListView.as_view(), name='attendance_list'),
    path('mark/', AttendanceMarkView.as_view(), name='attendance_mark'),
    path('daily/', DailyAttendanceView.as_view(), name='daily_attendance'),
    path('monthly-summary/', MonthlyAttendanceSummaryView.as_view(), name='monthly_summary'),
]
