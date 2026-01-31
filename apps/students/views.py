from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone
from datetime import timedelta, datetime
import csv
import io
from .models import Student
from .serializers import StudentSerializer, StudentListSerializer
from apps.core.permissions import IsLibraryOwner

class StudentCreateView(generics.CreateAPIView):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def perform_create(self, serializer):
        serializer.save(library=self.request.user.library, is_active=True)

class StudentListView(generics.ListAPIView):
    serializer_class = StudentListSerializer
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active', 'time_slot']
    search_fields = ['full_name', 'phone']
    ordering_fields = ['created_at', 'full_name']
    
    def get_queryset(self):
        return Student.objects.filter(library=self.request.user.library)

class StudentDetailView(APIView):
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get(self, request, pk):
        try:
            student = Student.objects.get(pk=pk, library=request.user.library)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize basic student data
        serializer = StudentSerializer(student)
        data = serializer.data
        
        # Get subscription info
        active_subscription = student.subscriptions.filter(is_active=True).first()
        if active_subscription:
            data['subscription'] = {
                'id': active_subscription.id,
                'plan_name': active_subscription.plan_name,
                'start_date': active_subscription.start_date,
                'end_date': active_subscription.end_date,
                'fee_amount': float(active_subscription.fee_amount),
                'fee_status': active_subscription.fee_status,
                'days_remaining': active_subscription.days_remaining,
                'is_active': active_subscription.is_active,
            }
        else:
            data['subscription'] = None
        
        # Get attendance stats
        today = timezone.now().date()
        current_month_start = today.replace(day=1)
        last_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
        
        total_attendance = student.attendances.count()
        current_month_attendance = student.attendances.filter(
            date__gte=current_month_start
        ).count()
        last_month_attendance = student.attendances.filter(
            date__gte=last_month_start,
            date__lt=current_month_start
        ).count()
        
        # Get recent attendance (last 10 days)
        recent_attendance = student.attendances.order_by('-date')[:10].values(
            'id', 'date', 'check_in_time', 'attendance_type'
        )
        
        # Calculate attendance percentage for current month
        days_in_month = (today - current_month_start).days + 1
        attendance_percentage = round((current_month_attendance / days_in_month) * 100) if days_in_month > 0 else 0
        
        data['attendance_stats'] = {
            'total': total_attendance,
            'current_month': current_month_attendance,
            'last_month': last_month_attendance,
            'attendance_percentage': attendance_percentage,
            'recent': list(recent_attendance),
        }
        
        # Get payment history
        all_subscriptions = student.subscriptions.order_by('-created_at')[:5]
        data['payment_history'] = [{
            'id': sub.id,
            'plan_name': sub.plan_name,
            'amount': float(sub.fee_amount),
            'status': sub.fee_status,
            'date': sub.start_date,
        } for sub in all_subscriptions]
        
        return Response(data)
    
    def put(self, request, pk):
        try:
            student = Student.objects.get(pk=pk, library=request.user.library)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = StudentSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            student = Student.objects.get(pk=pk, library=request.user.library)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        
        student.delete()
        return Response({'message': 'Student deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class StudentDeactivateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get_queryset(self):
        return Student.objects.filter(library=self.request.user.library)
    
    def patch(self, request, pk):
        student = self.get_object()
        student.is_active = False
        student.save()
        return Response({'message': 'Student deactivated successfully'})

class StudentActivateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get_queryset(self):
        return Student.objects.filter(library=self.request.user.library)
    
    def patch(self, request, pk):
        student = self.get_object()
        student.is_active = True
        student.save()
        return Response({'message': 'Student activated successfully'})

class StudentDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get_queryset(self):
        return Student.objects.filter(library=self.request.user.library)
    
    def delete(self, request, pk):
        student = self.get_object()
        student.delete()
        return Response({'message': 'Student deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class StudentBulkUploadView(APIView):
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def post(self, request):
        csv_file = request.FILES.get('file')
        
        if not csv_file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not csv_file.name.endswith('.csv'):
            return Response({'error': 'File must be a CSV'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Read CSV file
            decoded_file = csv_file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)
            
            created_count = 0
            errors = []
            
            for row_num, row in enumerate(reader, start=2):  # Start at 2 (1 is header)
                try:
                    # Required fields
                    full_name = row.get('full_name', '').strip()
                    phone = row.get('phone', '').strip()
                    time_slot = row.get('time_slot', 'MORNING').strip().upper()
                    
                    if not full_name or not phone:
                        errors.append(f"Row {row_num}: Missing required fields (full_name, phone)")
                        continue
                    
                    # Validate time slot
                    if time_slot not in ['MORNING', 'AFTERNOON', 'EVENING', 'FULL_DAY']:
                        time_slot = 'MORNING'
                    
                    # Optional fields
                    email = row.get('email', '').strip() or None
                    gender = row.get('gender', '').strip().upper() or None
                    if gender and gender not in ['MALE', 'FEMALE', 'OTHER']:
                        gender = None
                    
                    # Parse date of birth
                    date_of_birth = None
                    dob_str = row.get('date_of_birth', '').strip()
                    if dob_str:
                        try:
                            date_of_birth = datetime.strptime(dob_str, '%Y-%m-%d').date()
                        except ValueError:
                            try:
                                date_of_birth = datetime.strptime(dob_str, '%d/%m/%Y').date()
                            except ValueError:
                                pass
                    
                    # Education level
                    education_level = row.get('education_level', '').strip().upper() or None
                    if education_level and education_level not in ['SCHOOL', 'COLLEGE', 'UNIVERSITY', 'COMPETITIVE_EXAM', 'OTHER']:
                        education_level = None
                    
                    # Create student
                    student = Student.objects.create(
                        library=request.user.library,
                        full_name=full_name,
                        phone=phone,
                        email=email,
                        time_slot=time_slot,
                        gender=gender,
                        date_of_birth=date_of_birth,
                        father_name=row.get('father_name', '').strip() or None,
                        emergency_contact=row.get('emergency_contact', '').strip() or None,
                        preparing_for=row.get('preparing_for', '').strip() or None,
                        qualification=row.get('qualification', '').strip() or None,
                        education_level=education_level,
                        institution_name=row.get('institution_name', '').strip() or None,
                        address=row.get('address', '').strip() or None,
                        is_active=True
                    )
                    created_count += 1
                    
                except Exception as e:
                    errors.append(f"Row {row_num}: {str(e)}")
            
            response_data = {
                'message': f'Successfully created {created_count} students',
                'created_count': created_count,
                'errors': errors if errors else None
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': f'Failed to process CSV: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
