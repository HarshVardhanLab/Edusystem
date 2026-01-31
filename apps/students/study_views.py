from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone
from django.db.models import Sum, Count, Q, Avg
from datetime import datetime, timedelta
import secrets
import hashlib

from .study_models import StudySession, Note, AttendanceQRCode, StudyGoal, Task, MotivationalQuote
from .study_serializers import (
    StudySessionSerializer, StudySessionListSerializer,
    NoteSerializer, NoteListSerializer,
    AttendanceQRCodeSerializer,
    StudyGoalSerializer,
    TaskSerializer, TaskListSerializer,
    MotivationalQuoteSerializer
)
from apps.core.permissions import IsLibraryOwner
from apps.attendance.models import Attendance


# ============ Study Session Views ============

class StudySessionListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['session_type', 'is_active']
    ordering_fields = ['start_time', 'duration']
    pagination_class = None
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return StudySessionListSerializer
        return StudySessionSerializer
    
    def get_queryset(self):
        user = self.request.user
        # Check if user is a Student instance
        from apps.students.models import Student
        if isinstance(user, Student):
            return StudySession.objects.filter(student=user)
        return StudySession.objects.filter(student__library=user.library)
    
    def perform_create(self, serializer):
        user = self.request.user
        from apps.students.models import Student
        if isinstance(user, Student):
            serializer.save(student=user)
        else:
            # Admin creating for a student - student must be provided
            serializer.save()


class StudySessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StudySessionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        from apps.students.models import Student
        if isinstance(user, Student):
            return StudySession.objects.filter(student=user)
        return StudySession.objects.filter(student__library=user.library)


class StudySessionStatsView(APIView):
    """Get study session statistics for student"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        from apps.students.models import Student
        if not isinstance(user, Student):
            return Response({'error': 'Only students can access this'}, status=status.HTTP_403_FORBIDDEN)
        
        # Get date range
        period = request.query_params.get('period', 'week')  # week, month, year
        today = timezone.now().date()
        
        if period == 'week':
            start_date = today - timedelta(days=7)
        elif period == 'month':
            start_date = today - timedelta(days=30)
        else:
            start_date = today - timedelta(days=365)
        
        sessions = StudySession.objects.filter(
            student=user,
            start_time__date__gte=start_date,
            session_type__in=['POMODORO', 'CUSTOM']
        )
        
        # Calculate stats
        total_sessions = sessions.count()
        total_minutes = sessions.aggregate(total=Sum('duration'))['total'] or 0
        total_hours = round(total_minutes / 60, 2)
        avg_session = round(sessions.aggregate(avg=Avg('duration'))['avg'] or 0, 2)
        
        # Daily breakdown for last 7 days
        daily_stats = []
        for i in range(7):
            date = today - timedelta(days=6-i)
            day_minutes = sessions.filter(start_time__date=date).aggregate(total=Sum('duration'))['total'] or 0
            daily_stats.append({
                'date': date.strftime('%Y-%m-%d'),
                'day': date.strftime('%a'),
                'hours': round(day_minutes / 60, 2)
            })
        
        return Response({
            'period': period,
            'total_sessions': total_sessions,
            'total_hours': total_hours,
            'average_session_minutes': avg_session,
            'daily_breakdown': daily_stats
        })


# ============ Notes Views ============

class NoteListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'is_favorite']
    search_fields = ['title', 'content', 'tags']
    ordering_fields = ['created_at', 'updated_at', 'title']
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return NoteListSerializer
        return NoteSerializer
    
    def get_queryset(self):
        user = self.request.user
        from apps.students.models import Student
        if isinstance(user, Student):
            return Note.objects.filter(student=user)
        return Note.objects.filter(student__library=user.library)
    
    def perform_create(self, serializer):
        user = self.request.user
        from apps.students.models import Student
        if isinstance(user, Student):
            serializer.save(student=user)
        else:
            serializer.save()


class NoteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        from apps.students.models import Student
        if isinstance(user, Student):
            return Note.objects.filter(student=user)
        return Note.objects.filter(student__library=user.library)


# ============ QR Code Attendance Views ============

class QRCodeGenerateView(APIView):
    """Generate QR code for attendance (Admin only)"""
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def post(self, request):
        date_str = request.data.get('date', timezone.now().date())
        if isinstance(date_str, str):
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        else:
            date = date_str
        
        # Check if QR already exists for this date
        existing_qr = AttendanceQRCode.objects.filter(
            library=request.user.library,
            date=date
        ).first()
        
        if existing_qr:
            return Response({
                'message': 'QR code already exists for this date',
                'qr_code': AttendanceQRCodeSerializer(existing_qr).data
            })
        
        # Generate unique code
        random_string = f"{request.user.library.id}-{date}-{secrets.token_hex(16)}"
        code = hashlib.sha256(random_string.encode()).hexdigest()[:32]
        
        # Set validity period (6 AM to 11 PM)
        valid_from = timezone.make_aware(datetime.combine(date, datetime.min.time().replace(hour=6)))
        valid_until = timezone.make_aware(datetime.combine(date, datetime.min.time().replace(hour=23)))
        
        qr_code = AttendanceQRCode.objects.create(
            library=request.user.library,
            date=date,
            code=code,
            valid_from=valid_from,
            valid_until=valid_until,
            created_by=request.user
        )
        
        return Response({
            'message': 'QR code generated successfully',
            'qr_code': AttendanceQRCodeSerializer(qr_code).data
        }, status=status.HTTP_201_CREATED)


class QRCodeScanView(APIView):
    """Scan QR code to mark attendance (Student)"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        from apps.students.models import Student
        if not isinstance(user, Student):
            return Response({'error': 'Only students can scan QR codes'}, status=status.HTTP_403_FORBIDDEN)
        
        code = request.data.get('code')
        if not code:
            return Response({'error': 'QR code is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            qr_code = AttendanceQRCode.objects.get(code=code)
        except AttendanceQRCode.DoesNotExist:
            return Response({'error': 'Invalid QR code'}, status=status.HTTP_404_NOT_FOUND)
        
        # Validate QR code
        if not qr_code.is_valid():
            return Response({'error': 'QR code has expired or is inactive'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if student belongs to this library
        if user.library != qr_code.library:
            return Response({'error': 'QR code is not for your library'}, status=status.HTTP_403_FORBIDDEN)
        
        # Check if already marked attendance today
        today = timezone.now().date()
        existing_attendance = Attendance.objects.filter(
            student=user,
            date=today
        ).first()
        
        if existing_attendance:
            return Response({
                'error': 'Attendance already marked for today',
                'attendance': {
                    'date': existing_attendance.date,
                    'check_in_time': existing_attendance.check_in_time,
                    'attendance_type': existing_attendance.attendance_type
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark attendance
        attendance = Attendance.objects.create(
            library=qr_code.library,
            student=user,
            date=today,
            check_in_time=timezone.now(),
            attendance_type='PRESENT'
        )
        
        return Response({
            'message': 'Attendance marked successfully!',
            'attendance': {
                'date': attendance.date,
                'check_in_time': attendance.check_in_time,
                'attendance_type': attendance.attendance_type
            }
        }, status=status.HTTP_201_CREATED)


class QRCodeListView(generics.ListAPIView):
    """List QR codes (Admin only)"""
    serializer_class = AttendanceQRCodeSerializer
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get_queryset(self):
        return AttendanceQRCode.objects.filter(library=self.request.user.library)


# ============ Study Goals Views ============

class StudyGoalListCreateView(generics.ListCreateAPIView):
    serializer_class = StudyGoalSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None
    
    def get_queryset(self):
        user = self.request.user
        from apps.students.models import Student
        if isinstance(user, Student):
            return StudyGoal.objects.filter(student=user)
        return StudyGoal.objects.filter(student__library=user.library)
    
    def perform_create(self, serializer):
        user = self.request.user
        from apps.students.models import Student
        if isinstance(user, Student):
            serializer.save(student=user)
        else:
            serializer.save()


class StudyGoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StudyGoalSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        from apps.students.models import Student
        if isinstance(user, Student):
            return StudyGoal.objects.filter(student=user)
        return StudyGoal.objects.filter(student__library=user.library)


# ============ Tasks Views ============

class TaskListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['priority', 'is_completed']
    ordering_fields = ['due_date', 'priority', 'created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return TaskListSerializer
        return TaskSerializer
    
    def get_queryset(self):
        user = self.request.user
        from apps.students.models import Student
        if isinstance(user, Student):
            return Task.objects.filter(student=user)
        return Task.objects.filter(student__library=user.library)
    
    def perform_create(self, serializer):
        user = self.request.user
        from apps.students.models import Student
        if isinstance(user, Student):
            serializer.save(student=user)
        else:
            serializer.save()


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        from apps.students.models import Student
        if isinstance(user, Student):
            return Task.objects.filter(student=user)
        return Task.objects.filter(student__library=user.library)


# ============ Motivational Quotes Views ============

class DailyQuoteView(APIView):
    """Get daily motivational quote"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get random quote
        quote = MotivationalQuote.objects.filter(is_active=True).order_by('?').first()
        
        if not quote:
            # Default quote if none in database
            return Response({
                'quote': 'Success is the sum of small efforts repeated day in and day out.',
                'author': 'Robert Collier',
                'category': 'MOTIVATION'
            })
        
        return Response(MotivationalQuoteSerializer(quote).data)


class QuoteListView(generics.ListAPIView):
    """List all quotes (optional)"""
    serializer_class = MotivationalQuoteSerializer
    permission_classes = [IsAuthenticated]
    queryset = MotivationalQuote.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']
