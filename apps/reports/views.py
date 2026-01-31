from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Q, Sum, Case, When, IntegerField
from datetime import timedelta
from apps.students.models import Student
from apps.attendance.models import Attendance
from apps.subscriptions.models import Subscription
from apps.core.permissions import IsLibraryOwner

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get(self, request):
        library = request.user.library
        today = timezone.now().date()
        current_month_start = today.replace(day=1)
        
        # Total students
        total_students = Student.objects.filter(library=library, is_active=True).count()
        
        # Present today
        present_today = Attendance.objects.filter(
            library=library,
            date=today
        ).count()
        
        # Absent today
        absent_today = total_students - present_today
        
        # Active subscriptions
        active_subscriptions = Subscription.objects.filter(
            student__library=library,
            is_active=True,
            end_date__gte=today
        ).count()
        
        # Expiring in 7 days
        expiring_date = today + timedelta(days=7)
        expiring_subscriptions = Subscription.objects.filter(
            student__library=library,
            is_active=True,
            end_date__lte=expiring_date,
            end_date__gte=today
        ).count()
        
        # Fee due count
        fee_due_count = Subscription.objects.filter(
            student__library=library,
            is_active=True,
            fee_status='DUE'
        ).count()
        
        # Available seats
        available_seats = library.seats.filter(is_available=True).count()
        
        # Financial stats
        all_subscriptions = Subscription.objects.filter(student__library=library)
        total_earnings = all_subscriptions.filter(fee_status='PAID').aggregate(
            total=Sum('fee_amount')
        )['total'] or 0
        
        total_dues = all_subscriptions.filter(fee_status='DUE', is_active=True).aggregate(
            total=Sum('fee_amount')
        )['total'] or 0
        
        monthly_earnings = all_subscriptions.filter(
            fee_status='PAID',
            start_date__gte=current_month_start
        ).aggregate(total=Sum('fee_amount'))['total'] or 0
        
        # Unpaid students (top 10)
        unpaid_students = Subscription.objects.filter(
            student__library=library,
            is_active=True,
            fee_status='DUE'
        ).select_related('student').order_by('-fee_amount')[:10]
        
        unpaid_list = [{
            'id': sub.student.id,
            'name': sub.student.full_name,
            'phone': sub.student.phone,
            'amount': float(sub.fee_amount),
            'plan': sub.plan_name,
            'due_date': sub.end_date.isoformat()
        } for sub in unpaid_students]
        
        # Attendance leaderboard (top 10 students by attendance this month)
        students_with_attendance = Student.objects.filter(
            library=library,
            is_active=True
        ).annotate(
            attendance_count=Count(
                'attendances',
                filter=Q(attendances__date__gte=current_month_start)
            )
        ).order_by('-attendance_count')[:10]
        
        leaderboard = [{
            'id': student.id,
            'name': student.full_name,
            'attendance_days': student.attendance_count,
            'seat_number': student.seat.seat_number if student.seat else 'N/A'
        } for student in students_with_attendance]
        
        # Last 7 days attendance for graph
        attendance_graph = []
        for i in range(6, -1, -1):
            date = today - timedelta(days=i)
            count = Attendance.objects.filter(
                library=library,
                date=date
            ).count()
            attendance_graph.append({
                'date': date.isoformat(),
                'count': count
            })
        
        return Response({
            'total_students': total_students,
            'present_today': present_today,
            'absent_today': absent_today,
            'active_subscriptions': active_subscriptions,
            'expiring_in_7_days': expiring_subscriptions,
            'fee_due_count': fee_due_count,
            'available_seats': available_seats,
            'total_seats': library.total_seats,
            'total_earnings': float(total_earnings),
            'total_dues': float(total_dues),
            'monthly_earnings': float(monthly_earnings),
            'unpaid_students': unpaid_list,
            'attendance_leaderboard': leaderboard,
            'attendance_graph': attendance_graph,
        })

class MonthlyAttendanceReportView(APIView):
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get(self, request):
        library = request.user.library
        month = int(request.query_params.get('month', timezone.now().month))
        year = int(request.query_params.get('year', timezone.now().year))
        
        # Get all students
        students = Student.objects.filter(library=library, is_active=True)
        
        report_data = []
        for student in students:
            attendance_count = Attendance.objects.filter(
                student=student,
                date__month=month,
                date__year=year
            ).count()
            
            active_subscription = student.subscriptions.filter(is_active=True).first()
            
            report_data.append({
                'student_id': student.id,
                'student_name': student.full_name,
                'seat_number': student.seat.seat_number if student.seat else None,
                'attendance_days': attendance_count,
                'subscription_status': active_subscription.fee_status if active_subscription else 'N/A',
            })
        
        return Response({
            'month': month,
            'year': year,
            'total_students': len(report_data),
            'report': report_data
        })

class StudentReportView(APIView):
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get(self, request):
        library = request.user.library
        student_id = request.query_params.get('student_id')
        
        if not student_id:
            return Response({'error': 'student_id is required'}, status=400)
        
        try:
            student = Student.objects.get(id=student_id, library=library)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=404)
        
        # Get attendance stats
        total_attendance = student.attendances.count()
        current_month_attendance = student.attendances.filter(
            date__month=timezone.now().month,
            date__year=timezone.now().year
        ).count()
        
        # Get subscription info
        active_subscription = student.subscriptions.filter(is_active=True).first()
        
        # Get recent attendance
        recent_attendance = student.attendances.all()[:10].values(
            'date', 'check_in_time', 'attendance_type'
        )
        
        return Response({
            'student': {
                'id': student.id,
                'name': student.full_name,
                'phone': student.phone,
                'seat': student.seat.seat_number if student.seat else None,
                'time_slot': student.time_slot,
                'is_active': student.is_active,
            },
            'attendance': {
                'total': total_attendance,
                'current_month': current_month_attendance,
                'recent': list(recent_attendance),
            },
            'subscription': {
                'plan_name': active_subscription.plan_name if active_subscription else None,
                'end_date': active_subscription.end_date if active_subscription else None,
                'fee_status': active_subscription.fee_status if active_subscription else None,
                'days_remaining': active_subscription.days_remaining if active_subscription else 0,
            } if active_subscription else None,
        })
