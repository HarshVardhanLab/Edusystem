"""
Setup view for initializing production data without shell access
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from apps.libraries.models import Library
from apps.students.models import Student
from apps.seats.models import Seat
from apps.subscriptions.models import Subscription
from datetime import datetime, timedelta
import os

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def initialize_production_data(request):
    """
    Initialize production data - can only be called once
    POST to /api/v1/accounts/initialize-data/
    Body: {"secret": "your-secret-key"}
    """
    # Security check - require a secret key
    secret = request.data.get('secret')
    expected_secret = os.environ.get('INIT_SECRET', 'init-nova-2026')
    
    if secret != expected_secret:
        return Response({'error': 'Invalid secret key'}, status=403)
    
    # Check if already initialized
    if Library.objects.filter(library_id='LIB1020').exists():
        return Response({
            'message': 'Data already initialized',
            'library_id': 'LIB1020',
            'status': 'already_exists'
        })
    
    try:
        results = {}
        
        # Create superuser if doesn't exist
        if not User.objects.filter(email='superadmin@novalibrary.com').exists():
            superuser = User.objects.create_superuser(
                email='superadmin@novalibrary.com',
                password='SuperAdmin@123',
                first_name='Super',
                last_name='Admin',
                phone='9999999999',
                role='SUPER_ADMIN'
            )
            results['superuser'] = f'Created: {superuser.email}'
        else:
            results['superuser'] = 'Already exists'
        
        # Create library owner
        if not User.objects.filter(email='admin@novalibrary.com').exists():
            library_owner = User.objects.create_user(
                email='admin@novalibrary.com',
                password='Admin@123',
                first_name='Nova',
                last_name='Admin',
                phone='9876543210',
                role='LIBRARY_OWNER'
            )
            results['library_owner'] = f'Created: {library_owner.email}'
        else:
            library_owner = User.objects.get(email='admin@novalibrary.com')
            results['library_owner'] = 'Already exists'
        
        # Create library
        library = Library.objects.create(
            owner=library_owner,
            library_id='LIB1020',
            name='Nova Study Library',
            phone='9876543210',
            address='123 Main Street, City, State 12345',
            total_seats=50,
            opening_time='06:00:00',
            closing_time='23:00:00'
        )
        results['library'] = f'Created: {library.library_id}'
        
        # Create seats
        seats_created = 0
        for i in range(1, 51):
            Seat.objects.create(
                library=library,
                seat_number=f'S{i:03d}',
                seat_type='FLEXIBLE',
                is_available=True
            )
            seats_created += 1
        results['seats'] = f'Created {seats_created} seats'
        
        # Create test students
        students_data = [
            {
                'student_id': 'STU00001',
                'first_name': 'Rahul',
                'last_name': 'Sharma',
                'email': 'rahul@example.com',
                'phone': '9876543211',
                'password': '3211',
                'gender': 'MALE',
                'education_level': 'COLLEGE'
            },
            {
                'student_id': 'STU00002',
                'first_name': 'Priya',
                'last_name': 'Patel',
                'email': 'priya@example.com',
                'phone': '9876543212',
                'password': '3212',
                'gender': 'FEMALE',
                'education_level': 'UNIVERSITY'
            },
            {
                'student_id': 'STU00003',
                'first_name': 'Amit',
                'last_name': 'Kumar',
                'email': 'amit@example.com',
                'phone': '9876543213',
                'password': '3213',
                'gender': 'MALE',
                'education_level': 'COMPETITIVE'
            },
            {
                'student_id': 'STU00004',
                'first_name': 'Sneha',
                'last_name': 'Reddy',
                'email': 'sneha@example.com',
                'phone': '9876543214',
                'password': '3214',
                'gender': 'FEMALE',
                'education_level': 'SCHOOL'
            },
            {
                'student_id': 'STU00005',
                'first_name': 'Vikram',
                'last_name': 'Singh',
                'email': 'vikram@example.com',
                'phone': '9876543215',
                'password': '3215',
                'gender': 'MALE',
                'education_level': 'COLLEGE'
            },
        ]
        
        students_created = 0
        for student_data in students_data:
            password = student_data.pop('password')
            student = Student.objects.create(
                library=library,
                **student_data
            )
            student.set_password(password)
            student.save()
            
            # Create active subscription
            Subscription.objects.create(
                student=student,
                plan_name='Monthly Plan',
                amount=1500.00,
                start_date=datetime.now().date(),
                end_date=(datetime.now() + timedelta(days=30)).date(),
                payment_status='PAID',
                is_active=True
            )
            students_created += 1
        
        results['students'] = f'Created {students_created} students with subscriptions'
        
        return Response({
            'message': 'Production data initialized successfully!',
            'results': results,
            'credentials': {
                'superadmin': {
                    'email': 'superadmin@novalibrary.com',
                    'password': 'SuperAdmin@123'
                },
                'library_admin': {
                    'library_id': 'LIB1020',
                    'email': 'admin@novalibrary.com',
                    'password': 'Admin@123'
                },
                'students': {
                    'library_id': 'LIB1020',
                    'student_ids': 'STU00001 to STU00005',
                    'passwords': '3211 to 3215 (last 4 digits of phone)'
                }
            }
        })
        
    except Exception as e:
        return Response({
            'error': str(e),
            'message': 'Failed to initialize data'
        }, status=500)
