"""
Management command to set up production data automatically
This runs during deployment to create initial superuser and test data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.libraries.models import Library
from apps.students.models import Student
from apps.seats.models import Seat
from apps.subscriptions.models import Subscription
from datetime import datetime, timedelta
import os

User = get_user_model()

class Command(BaseCommand):
    help = 'Sets up production environment with initial data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting production setup...'))
        
        # Only run in production (when RENDER env var is set)
        if not os.environ.get('RENDER'):
            self.stdout.write(self.style.WARNING('Not in production environment. Skipping setup.'))
            return
        
        # Check if already set up
        if User.objects.filter(email='admin@novalibrary.com').exists():
            self.stdout.write(self.style.WARNING('Production data already exists. Skipping setup.'))
            return
        
        try:
            # Create superuser
            self.stdout.write('Creating superuser...')
            superuser = User.objects.create_superuser(
                email='superadmin@novalibrary.com',
                password='SuperAdmin@123',
                first_name='Super',
                last_name='Admin',
                phone='9999999999',
                role='SUPER_ADMIN'
            )
            self.stdout.write(self.style.SUCCESS(f'✓ Superuser created: {superuser.email}'))
            
            # Create test library
            self.stdout.write('Creating test library...')
            library = Library.objects.create(
                library_id='LIB1020',
                name='Nova Study Library',
                owner_name='Nova Admin',
                email='admin@novalibrary.com',
                phone='9876543210',
                address='123 Main Street, City, State 12345',
                total_seats=50,
                opening_time='06:00:00',
                closing_time='23:00:00'
            )
            library.set_password('Admin@123')
            library.save()
            self.stdout.write(self.style.SUCCESS(f'✓ Library created: {library.library_id}'))
            
            # Create seats
            self.stdout.write('Creating seats...')
            seats_created = 0
            for i in range(1, 51):
                Seat.objects.create(
                    library=library,
                    seat_number=f'S{i:03d}',
                    seat_type='FLEXIBLE',
                    is_available=True
                )
                seats_created += 1
            self.stdout.write(self.style.SUCCESS(f'✓ Created {seats_created} seats'))
            
            # Create test students
            self.stdout.write('Creating test students...')
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
            
            self.stdout.write(self.style.SUCCESS(f'✓ Created {students_created} students with subscriptions'))
            
            self.stdout.write(self.style.SUCCESS('\n' + '='*60))
            self.stdout.write(self.style.SUCCESS('Production setup completed successfully!'))
            self.stdout.write(self.style.SUCCESS('='*60))
            self.stdout.write(self.style.SUCCESS('\nLogin Credentials:'))
            self.stdout.write(self.style.SUCCESS('\nSuperAdmin:'))
            self.stdout.write(f'  Email: superadmin@novalibrary.com')
            self.stdout.write(f'  Password: SuperAdmin@123')
            self.stdout.write(self.style.SUCCESS('\nLibrary Admin:'))
            self.stdout.write(f'  Library ID: LIB1020')
            self.stdout.write(f'  Email: admin@novalibrary.com')
            self.stdout.write(f'  Password: Admin@123')
            self.stdout.write(self.style.SUCCESS('\nTest Students:'))
            self.stdout.write(f'  Library ID: LIB1020')
            self.stdout.write(f'  Student IDs: STU00001 to STU00005')
            self.stdout.write(f'  Passwords: Last 4 digits of phone (3211-3215)')
            self.stdout.write(self.style.SUCCESS('='*60 + '\n'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error during setup: {str(e)}'))
            raise
