#!/usr/bin/env python
"""
Setup test data for Nova Library Management System
Creates library, admin, and students with credentials
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.libraries.models import Library
from apps.students.models import Student
from apps.seats.models import Seat
from datetime import time, date, timedelta
from decimal import Decimal

User = get_user_model()

def create_test_data():
    print("🚀 Creating test data for Nova LBS...\n")
    
    # 1. Create Library Owner/Admin
    print("1️⃣ Creating Library Owner...")
    try:
        owner = User.objects.create_user(
            email='admin@novalibrary.com',
            password='Admin@123',
            first_name='Nova',
            last_name='Admin',
            role='LIBRARY_OWNER',
            phone='9876543210'
        )
        print(f"   ✅ Owner created: {owner.email}")
    except Exception as e:
        owner = User.objects.get(email='admin@novalibrary.com')
        print(f"   ℹ️  Owner already exists: {owner.email}")
    
    # 2. Create Library
    print("\n2️⃣ Creating Library...")
    try:
        library = Library.objects.create(
            owner=owner,
            name='Nova Study Library',
            address='123 Main Street, City Center, State - 123456',
            phone='9876543210',
            total_seats=50,
            opening_time=time(6, 0),
            closing_time=time(23, 0),
            is_active=True
        )
        print(f"   ✅ Library created: {library.name}")
        print(f"   📍 Library ID: {library.library_id}")
    except Exception as e:
        library = Library.objects.filter(owner=owner).first()
        print(f"   ℹ️  Library already exists: {library.name}")
        print(f"   📍 Library ID: {library.library_id}")
    
    # 3. Create Seats
    print("\n3️⃣ Creating Seats...")
    existing_seats = Seat.objects.filter(library=library).count()
    if existing_seats == 0:
        seats_created = 0
        for i in range(1, 51):
            Seat.objects.create(
                library=library,
                seat_number=f"S{i:03d}",
                seat_type='FLEXIBLE',
                is_available=True
            )
            seats_created += 1
        print(f"   ✅ Created {seats_created} seats")
    else:
        print(f"   ℹ️  {existing_seats} seats already exist")
    
    # 4. Create Students
    print("\n4️⃣ Creating Students...")
    students_data = [
        {
            'full_name': 'Rahul Sharma',
            'phone': '9876543211',
            'email': 'rahul@example.com',
            'password': '3211',
            'gender': 'MALE',
            'education_level': 'UNDERGRADUATE'
        },
        {
            'full_name': 'Priya Patel',
            'phone': '9876543212',
            'email': 'priya@example.com',
            'password': '3212',
            'gender': 'FEMALE',
            'education_level': 'POSTGRADUATE'
        },
        {
            'full_name': 'Amit Kumar',
            'phone': '9876543213',
            'email': 'amit@example.com',
            'password': '3213',
            'gender': 'MALE',
            'education_level': 'COMPETITIVE_EXAM'
        },
        {
            'full_name': 'Sneha Reddy',
            'phone': '9876543214',
            'email': 'sneha@example.com',
            'password': '3214',
            'gender': 'FEMALE',
            'education_level': 'UNDERGRADUATE'
        },
        {
            'full_name': 'Vikram Singh',
            'phone': '9876543215',
            'email': 'vikram@example.com',
            'password': '3215',
            'gender': 'MALE',
            'education_level': 'POSTGRADUATE'
        }
    ]
    
    created_students = []
    for student_data in students_data:
        try:
            student = Student.objects.create(
                library=library,
                full_name=student_data['full_name'],
                phone=student_data['phone'],
                email=student_data['email'],
                gender=student_data['gender'],
                education_level=student_data['education_level'],
                date_of_birth=date(2000, 1, 1),
                address='Test Address',
                is_active=True
            )
            student.set_password(student_data['password'])
            student.save()
            created_students.append(student)
            print(f"   ✅ Created: {student.full_name} (ID: {student.student_id})")
        except Exception as e:
            print(f"   ⚠️  Error creating {student_data['full_name']}: {e}")
    
    # 5. Create Subscriptions for students
    print("\n5️⃣ Creating Subscriptions...")
    from apps.subscriptions.models import Subscription
    
    for student in created_students:
        try:
            subscription = Subscription.objects.create(
                student=student,
                plan_name='Monthly Plan',
                start_date=date.today(),
                end_date=date.today() + timedelta(days=30),
                fee_amount=Decimal('1500.00'),
                fee_status='PAID',
                is_active=True
            )
            print(f"   ✅ Subscription created for {student.full_name}")
        except Exception as e:
            print(f"   ⚠️  Error creating subscription for {student.full_name}: {e}")
    
    # Print Summary
    print("\n" + "="*60)
    print("✅ TEST DATA SETUP COMPLETE!")
    print("="*60)
    
    print(f"\n📚 LIBRARY INFORMATION:")
    print(f"   Name: {library.name}")
    print(f"   Library ID: {library.library_id}")
    print(f"   Total Seats: {library.total_seats}")
    print(f"   Hours: {library.opening_time.strftime('%I:%M %p')} - {library.closing_time.strftime('%I:%M %p')}")
    
    print(f"\n👨‍💼 LIBRARY ADMIN LOGIN:")
    print(f"   Email: admin@novalibrary.com")
    print(f"   Password: Admin@123")
    print(f"   Library ID: {library.library_id}")
    
    print(f"\n👨‍🎓 STUDENT LOGINS:")
    for i, student_data in enumerate(students_data):
        student = Student.objects.filter(phone=student_data['phone']).first()
        if student:
            print(f"\n   Student {i+1}: {student_data['full_name']}")
            print(f"   Library ID: {library.library_id}")
            print(f"   Student ID: {student.student_id}")
            print(f"   Password: {student_data['password']}")
    
    print("\n" + "="*60)
    print("🚀 You can now login to the app!")
    print("="*60 + "\n")

if __name__ == '__main__':
    create_test_data()
