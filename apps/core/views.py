"""
Core views for health checks and system status
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import connection
from django.core.cache import cache
from datetime import datetime
import sys


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Health check endpoint for monitoring and keep-alive services
    Returns system status without requiring authentication
    """
    health_status = {
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'Nova Library Backend',
        'version': '1.0.0',
    }
    
    # Check database connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        health_status['database'] = 'connected'
    except Exception as e:
        health_status['database'] = 'error'
        health_status['database_error'] = str(e)
        health_status['status'] = 'unhealthy'
    
    # Check cache (if configured)
    try:
        cache.set('health_check', 'ok', 10)
        cache_value = cache.get('health_check')
        health_status['cache'] = 'working' if cache_value == 'ok' else 'error'
    except Exception as e:
        health_status['cache'] = 'not_configured'
    
    # Python version
    health_status['python_version'] = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    
    # Return appropriate status code
    status_code = 200 if health_status['status'] == 'healthy' else 503
    
    return Response(health_status, status=status_code)


@api_view(['GET'])
@permission_classes([AllowAny])
def ping(request):
    """
    Simple ping endpoint for keep-alive services
    Ultra-lightweight response
    """
    return Response({
        'status': 'ok',
        'timestamp': datetime.now().isoformat()
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def status(request):
    """
    Detailed status endpoint with system information
    """
    from django.conf import settings
    from apps.students.models import Student
    from apps.libraries.models import Library
    from apps.attendance.models import Attendance
    
    try:
        status_info = {
            'status': 'operational',
            'timestamp': datetime.now().isoformat(),
            'environment': 'production' if settings.DEBUG is False else 'development',
            'debug_mode': settings.DEBUG,
            'database': {
                'connected': True,
                'engine': settings.DATABASES['default']['ENGINE'].split('.')[-1]
            },
            'statistics': {
                'total_libraries': Library.objects.count(),
                'total_students': Student.objects.filter(is_deleted=False).count(),
                'active_students': Student.objects.filter(is_active=True, is_deleted=False).count(),
                'total_attendance_records': Attendance.objects.count(),
            },
            'features': {
                'cloudinary': bool(settings.CLOUDINARY_STORAGE),
                'cors_enabled': bool(settings.CORS_ALLOWED_ORIGINS),
            }
        }
        
        return Response(status_info)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'timestamp': datetime.now().isoformat(),
            'error': str(e)
        }, status=500)
