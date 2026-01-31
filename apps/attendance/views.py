from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db.models import Count, Q
from datetime import datetime, timedelta
from .models import Attendance
from .serializers import AttendanceSerializer, AttendanceListSerializer
from apps.core.permissions import IsLibraryOwner

class AttendanceMarkView(generics.CreateAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def perform_create(self, serializer):
        serializer.save(
            library=self.request.user.library,
            marked_by=self.request.user,
            date=timezone.now().date()
        )

class AttendanceListView(generics.ListAPIView):
    serializer_class = AttendanceListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['date', 'attendance_type']
    pagination_class = None
    
    def get_queryset(self):
        user = self.request.user
        # Check if user is a student (has student_id attribute)
        if hasattr(user, 'student_id'):
            # Student can only see their own attendance
            return Attendance.objects.filter(student=user)
        else:
            # Library owner can see all attendance for their library
            return Attendance.objects.filter(library=user.library)

class DailyAttendanceView(APIView):
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get(self, request):
        date_str = request.query_params.get('date', timezone.now().date())
        if isinstance(date_str, str):
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        else:
            date = date_str
        
        attendance = Attendance.objects.filter(
            library=request.user.library,
            date=date
        )
        
        serializer = AttendanceListSerializer(attendance, many=True)
        return Response({
            'date': date,
            'total_present': attendance.count(),
            'attendance': serializer.data
        })

class MonthlyAttendanceSummaryView(APIView):
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get(self, request):
        month = request.query_params.get('month', timezone.now().month)
        year = request.query_params.get('year', timezone.now().year)
        
        attendance = Attendance.objects.filter(
            library=request.user.library,
            date__month=month,
            date__year=year
        )
        
        summary = attendance.values('student__full_name').annotate(
            total_days=Count('id')
        ).order_by('-total_days')
        
        return Response({
            'month': month,
            'year': year,
            'summary': summary
        })
