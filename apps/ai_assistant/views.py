"""
AI Assistant API Views
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
from django.db import models
from django.db.models import Count, Avg, Sum
from .services import get_ai_service
from .models import ChatMessage, AIAnalysis
from apps.students.models import Student
from apps.students.study_models import StudySession, Task, Note
from apps.attendance.models import Attendance
from apps.libraries.models import Library
from apps.subscriptions.models import Subscription


def get_student_from_user(user):
    """Helper function to get Student object from User"""
    if user.role != 'STUDENT':
        return None
    try:
        return Student.objects.get(student_id=user.student_id)
    except Student.DoesNotExist:
        return None


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_chat(request):
    """
    AI chat endpoint for students and library owners
    
    POST /api/v1/ai/chat/
    Body: {
        "message": "How can I improve my focus?"
    }
    """
    message = request.data.get('message', '').strip()
    
    if not message:
        return Response(
            {'error': 'Message is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get comprehensive user context with database access
    context = build_comprehensive_context(request.user)
    
    # Get AI response
    try:
        ai_service = get_ai_service()
        response_text, response_time = ai_service.chat(message, context)
        
        # Save chat history
        ChatMessage.objects.create(
            user_id=request.user.id,
            user_email=request.user.email,
            user_role=getattr(request.user, 'role', 'UNKNOWN'),
            message=message,
            response=response_text,
            response_time=response_time
        )
        
        return Response({
            'response': response_text,
            'response_time': round(response_time, 2),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return Response(
            {'error': f'AI service error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analyze_performance(request):
    """
    Analyze student performance using AI
    
    GET /api/v1/ai/analyze-performance/
    """
    # Only students can use this
    student = get_student_from_user(request.user)
    if not student:
        return Response(
            {'error': 'Only students can use this feature'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        # Calculate metrics
        student_data = calculate_student_metrics(student)
        
        # Get AI analysis
        ai_service = get_ai_service()
        analysis_text, response_time = ai_service.analyze_performance(student_data)
        
        # Save analysis
        AIAnalysis.objects.create(
            user_id=request.user.id,
            user_email=request.user.email,
            user_role=getattr(request.user, 'role', 'UNKNOWN'),
            analysis_type='PERFORMANCE',
            input_data=student_data,
            result=analysis_text
        )
        
        return Response({
            'analysis': analysis_text,
            'metrics': student_data,
            'response_time': round(response_time, 2),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return Response(
            {'error': f'Analysis failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_study_plan(request):
    """
    Generate AI study plan for student
    
    POST /api/v1/ai/study-plan/
    Body: {
        "exam_date": "2026-05-15",
        "subjects": ["Physics", "Chemistry", "Math"],
        "hours_per_day": 8,
        "weak_subjects": ["Physics"]
    }
    """
    student = get_student_from_user(request.user)
    if not student:
        return Response(
            {'error': 'Only students can use this feature'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Build student profile
    student_profile = {
        'preparing_for': student.preparing_for or request.data.get('preparing_for', 'Competitive Exam'),
        'exam_date': request.data.get('exam_date', 'Not specified'),
        'hours_per_day': request.data.get('hours_per_day', 8),
        'subjects': request.data.get('subjects', ['Not specified']),
        'weak_subjects': request.data.get('weak_subjects', []),
        'education_level': student.education_level or 'Not specified'
    }
    
    try:
        # Generate study plan
        ai_service = get_ai_service()
        study_plan, response_time = ai_service.generate_study_plan(student_profile)
        
        # Save analysis
        AIAnalysis.objects.create(
            user_id=request.user.id,
            user_email=request.user.email,
            user_role=getattr(request.user, 'role', 'UNKNOWN'),
            analysis_type='STUDY_PLAN',
            input_data=student_profile,
            result=study_plan
        )
        
        return Response({
            'study_plan': study_plan,
            'profile': student_profile,
            'response_time': round(response_time, 2),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return Response(
            {'error': f'Study plan generation failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def summarize_notes(request):
    """
    Summarize student notes using AI
    
    POST /api/v1/ai/summarize-notes/
    Body: {
        "note_id": 123
    }
    OR
    Body: {
        "content": "Long notes text..."
    }
    OR
    Body: {
        "image": <file upload>
    }
    """
    student = get_student_from_user(request.user)
    if not student:
        return Response(
            {'error': 'Only students can use this feature'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get notes content
    note_id = request.data.get('note_id')
    content = request.data.get('content')
    note_title = ""
    
    # Check if image is uploaded
    if 'image' in request.FILES:
        image_file = request.FILES['image']
        try:
            # Save temporarily
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
                for chunk in image_file.chunks():
                    tmp_file.write(chunk)
                tmp_path = tmp_file.name
            
            # Extract text from image
            ai_service = get_ai_service()
            content, response_time = ai_service.extract_text_from_image(tmp_path)
            
            # Clean up
            import os
            os.unlink(tmp_path)
            
            note_title = "Extracted from image"
        except Exception as e:
            return Response(
                {'error': f'Failed to process image: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    elif note_id:
        try:
            note = Note.objects.get(id=note_id, student=student)
            content = note.content
            note_title = note.title
        except Note.DoesNotExist:
            return Response(
                {'error': 'Note not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    if not content:
        return Response(
            {'error': 'Note content or image is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Summarize notes
        ai_service = get_ai_service()
        summary, response_time = ai_service.summarize_notes(content, note_title)
        
        # Save analysis
        AIAnalysis.objects.create(
            user_id=request.user.id,
            user_email=request.user.email,
            user_role=getattr(request.user, 'role', 'UNKNOWN'),
            analysis_type='NOTE_SUMMARY',
            input_data={'note_id': note_id, 'title': note_title, 'length': len(content)},
            result=summary
        )
        
        return Response({
            'summary': summary,
            'original_length': len(content),
            'note_title': note_title,
            'response_time': round(response_time, 2),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return Response(
            {'error': f'Summarization failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def business_insights(request):
    """
    AI business insights for library owners
    
    GET /api/v1/ai/business-insights/
    """
    # Check if user is a library owner (support both LIBRARY and LIBRARY_OWNER roles)
    if request.user.role not in ['LIBRARY', 'LIBRARY_OWNER']:
        return Response(
            {'error': 'Only library owners can use this feature'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        # Get library from the OneToOne relationship
        library = request.user.library
    except Library.DoesNotExist:
        return Response(
            {'error': 'Library not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        # Calculate business metrics
        library_data = calculate_library_metrics(library)
        
        # Get AI insights
        ai_service = get_ai_service()
        insights, response_time = ai_service.analyze_business_metrics(library_data)
        
        # Save analysis
        AIAnalysis.objects.create(
            user_id=request.user.id,
            user_email=request.user.email,
            user_role=getattr(request.user, 'role', 'UNKNOWN'),
            analysis_type='BUSINESS_INSIGHT',
            input_data=library_data,
            result=insights
        )
        
        return Response({
            'insights': insights,
            'metrics': library_data,
            'response_time': round(response_time, 2),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return Response(
            {'error': f'Business analysis failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_history(request):
    """
    Get user's chat history
    
    GET /api/v1/ai/chat-history/?limit=20
    """
    limit = int(request.GET.get('limit', 20))
    
    messages = ChatMessage.objects.filter(
        user_id=request.user.id,
        user_email=request.user.email
    )[:limit]
    
    history = [{
        'id': msg.id,
        'message': msg.message,
        'response': msg.response,
        'created_at': msg.created_at.isoformat()
    } for msg in messages]
    
    return Response({
        'history': history,
        'count': len(history)
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_image(request):
    """
    Analyze an image using AI
    
    POST /api/v1/ai/analyze-image/
    Body: {
        "image": <file upload>,
        "prompt": "What's in this image?" (optional)
    }
    """
    if 'image' not in request.FILES:
        return Response(
            {'error': 'Image file is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    image_file = request.FILES['image']
    prompt = request.data.get('prompt', 'Analyze this image and describe what you see in detail')
    
    try:
        # Save temporarily
        import tempfile
        import os
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
            for chunk in image_file.chunks():
                tmp_file.write(chunk)
            tmp_path = tmp_file.name
        
        # Analyze image
        ai_service = get_ai_service()
        analysis, response_time = ai_service.analyze_image(tmp_path, prompt)
        
        # Clean up
        os.unlink(tmp_path)
        
        # Save analysis
        AIAnalysis.objects.create(
            user_id=request.user.id,
            user_email=request.user.email,
            user_role=getattr(request.user, 'role', 'UNKNOWN'),
            analysis_type='NOTE_SUMMARY',  # Reusing this type for image analysis
            input_data={'image_name': image_file.name, 'prompt': prompt},
            result=analysis
        )
        
        return Response({
            'analysis': analysis,
            'response_time': round(response_time, 2),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return Response(
            {'error': f'Image analysis failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Helper functions

def get_today_study_hours(student):
    """Calculate today's study hours"""
    today = datetime.now().date()
    sessions = StudySession.objects.filter(
        student=student,
        start_time__date=today,
        end_time__isnull=False
    )
    
    total_hours = 0
    for session in sessions:
        duration = (session.end_time - session.start_time).total_seconds() / 3600
        total_hours += duration
    
    return round(total_hours, 1)


def calculate_student_metrics(student):
    """Calculate comprehensive student metrics"""
    # Last 30 days
    thirty_days_ago = datetime.now().date() - timedelta(days=30)
    
    # Attendance (count check-ins in last 30 days)
    total_days = 30
    attendance_count = Attendance.objects.filter(
        student=student,
        date__gte=thirty_days_ago
    ).count()
    attendance_rate = (attendance_count / total_days) * 100
    
    # Study sessions
    study_sessions = StudySession.objects.filter(
        student=student,
        start_time__date__gte=thirty_days_ago,
        end_time__isnull=False
    )
    total_sessions = study_sessions.count()
    
    # Average session duration
    avg_duration = 0
    if total_sessions > 0:
        total_duration = sum([
            (session.end_time - session.start_time).total_seconds() / 3600
            for session in study_sessions
        ])
        avg_duration = total_duration / total_sessions
    
    # Tasks
    total_tasks = Task.objects.filter(student=student).count()
    completed_tasks = Task.objects.filter(student=student, is_completed=True).count()
    task_completion = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    
    # Active days
    active_days = study_sessions.values('start_time__date').distinct().count()
    
    return {
        'attendance_rate': round(attendance_rate, 1),
        'total_sessions': total_sessions,
        'avg_duration': round(avg_duration, 1),
        'task_completion': round(task_completion, 1),
        'active_days': active_days,
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks
    }


def calculate_library_metrics(library):
    """Calculate comprehensive library metrics"""
    # Current month
    now = datetime.now()
    first_day = now.replace(day=1)
    
    # Students
    total_students = library.students.filter(is_deleted=False).count()
    active_students = library.students.filter(is_active=True, is_deleted=False).count()
    new_students = library.students.filter(
        created_at__gte=first_day,
        is_deleted=False
    ).count()
    
    # Revenue
    monthly_revenue = Subscription.objects.filter(
        student__library=library,
        start_date__gte=first_day
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    # Occupancy
    from apps.seats.models import Seat
    total_seats = Seat.objects.filter(library=library).count()
    occupied_seats = Seat.objects.filter(library=library, is_available=False).count()
    occupancy_rate = (occupied_seats / total_seats * 100) if total_seats > 0 else 0
    
    # Attendance (count check-ins in last 30 days)
    thirty_days_ago = now.date() - timedelta(days=30)
    total_possible = total_students * 30
    total_present = Attendance.objects.filter(
        student__library=library,
        date__gte=thirty_days_ago
    ).count()
    avg_attendance = (total_present / total_possible * 100) if total_possible > 0 else 0
    
    # Retention (students active for > 30 days)
    old_students = library.students.filter(
        created_at__lt=thirty_days_ago,
        is_deleted=False
    ).count()
    retained_students = library.students.filter(
        created_at__lt=thirty_days_ago,
        is_active=True,
        is_deleted=False
    ).count()
    retention_rate = (retained_students / old_students * 100) if old_students > 0 else 100
    
    return {
        'total_students': total_students,
        'active_students': active_students,
        'new_students': new_students,
        'monthly_revenue': int(monthly_revenue),
        'occupancy_rate': round(occupancy_rate, 1),
        'avg_attendance': round(avg_attendance, 1),
        'retention_rate': round(retention_rate, 1),
        'total_seats': total_seats,
        'occupied_seats': occupied_seats
    }


def build_comprehensive_context(user):
    """
    Build comprehensive context with full database access for AI
    """
    context = {
        'user_role': user.role,
        'user_email': user.email,
        'app_features': get_app_features_description()
    }
    
    try:
        # Student context
        student = get_student_from_user(user)
        if student:
            # Basic info
            context['user_type'] = 'student'
            context['student_id'] = student.student_id
            context['full_name'] = student.full_name
            context['preparing_for'] = student.preparing_for or 'Not specified'
            context['education_level'] = student.education_level or 'Not specified'
            
            # Library info
            context['library_name'] = student.library.name
            context['library_id'] = student.library.library_id
            
            # Study metrics
            context['study_hours_today'] = get_today_study_hours(student)
            student_metrics = calculate_student_metrics(student)
            context['performance_metrics'] = student_metrics
            
            # Study sessions
            recent_sessions = StudySession.objects.filter(
                student=student,
                start_time__gte=datetime.now() - timedelta(days=7)
            ).count()
            context['study_sessions_this_week'] = recent_sessions
            
            # Tasks
            pending_tasks = Task.objects.filter(student=student, is_completed=False).count()
            completed_tasks = Task.objects.filter(student=student, is_completed=True).count()
            context['pending_tasks'] = pending_tasks
            context['completed_tasks'] = completed_tasks
            
            # Notes
            total_notes = Note.objects.filter(student=student).count()
            context['total_notes'] = total_notes
            
            # Goals
            from apps.students.study_models import StudyGoal
            active_goals = StudyGoal.objects.filter(student=student, is_completed=False).count()
            context['active_goals'] = active_goals
            
            # Subscription
            try:
                from apps.subscriptions.models import Subscription
                subscription = Subscription.objects.filter(student=student).order_by('-end_date').first()
                if subscription:
                    context['subscription_status'] = 'active' if subscription.end_date >= datetime.now().date() else 'expired'
                    context['subscription_end_date'] = subscription.end_date.isoformat()
            except:
                pass
            
            # Seat info
            from apps.seats.models import Seat
            try:
                seat = Seat.objects.get(student=student)
                context['assigned_seat'] = seat.seat_number
            except:
                context['assigned_seat'] = 'Not assigned'
        
        # Library owner context
        elif user.role in ['LIBRARY', 'LIBRARY_OWNER']:
            context['user_type'] = 'library_owner'
            
            try:
                library = user.library
                context['library_name'] = library.name
                context['library_id'] = library.library_id
                context['total_seats'] = library.total_seats
                context['opening_time'] = library.opening_time.strftime('%H:%M')
                context['closing_time'] = library.closing_time.strftime('%H:%M')
                
                # Business metrics
                library_metrics = calculate_library_metrics(library)
                context['business_metrics'] = library_metrics
                
                # Recent activity
                today = datetime.now().date()
                today_attendance = Attendance.objects.filter(
                    library=library,
                    date=today
                ).count()
                context['today_attendance'] = today_attendance
                
                # Notifications
                from apps.notifications.models import Notification
                pending_notifications = Notification.objects.filter(
                    library=library,
                    is_sent=False
                ).count()
                context['pending_notifications'] = pending_notifications
                
                # Subscriptions expiring soon
                from apps.subscriptions.models import Subscription
                expiring_soon = Subscription.objects.filter(
                    student__library=library,
                    end_date__lte=datetime.now().date() + timedelta(days=7),
                    end_date__gte=datetime.now().date()
                ).count()
                context['subscriptions_expiring_soon'] = expiring_soon
                
            except Exception as e:
                print(f"Library context error: {e}")
    
    except Exception as e:
        print(f"Context building error: {e}")
    
    return context


def get_app_features_description():
    """
    Return comprehensive description of all app features
    """
    return """
Nova Study Library Management System Features:

**For Students:**
1. **Study Timer** - Track study sessions with start/stop timer
2. **Notes Management** - Create, edit, and organize study notes
3. **Task Management** - Create tasks, set deadlines, mark as complete
4. **Study Goals** - Set and track study goals
5. **QR Attendance** - Mark attendance by scanning QR code
6. **Attendance History** - View attendance records and statistics
7. **Subscription Management** - View subscription status and renewal
8. **Seat Assignment** - Check assigned seat number
9. **Notifications** - Receive important updates from library
10. **Profile Management** - Update personal information
11. **AI Assistant (Nova AI)** - Get study tips, performance analysis, study plans

**For Library Owners:**
1. **Dashboard** - Overview of library statistics and metrics
2. **Student Management** - Add, edit, view, deactivate students
3. **Seat Management** - Manage seats, assign/unassign to students
4. **Attendance Tracking** - Mark attendance manually or via QR codes
5. **QR Code Management** - Generate and manage QR codes for attendance
6. **Subscription Management** - Manage student subscriptions and payments
7. **Notifications** - Send notifications to students
8. **Reports** - Generate attendance, revenue, and student reports
9. **Library Profile** - Manage library information and settings
10. **AI Assistant (Nova AI)** - Get business insights, analytics, recommendations

**Key Metrics Tracked:**
- Attendance rates
- Study session duration
- Task completion rates
- Seat occupancy
- Revenue and subscriptions
- Student retention
- Active vs inactive students
"""

