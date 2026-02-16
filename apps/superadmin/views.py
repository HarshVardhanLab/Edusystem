from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count, Q
from django.contrib.auth import get_user_model
from .models import SuperAdmin, LibraryLicense
from .serializers import LibraryStatsSerializer, LibraryLicenseSerializer, SuperAdminDashboardSerializer
from apps.libraries.models import Library
from apps.libraries.serializers import LibrarySerializer
from apps.students.models import Student
from apps.seats.models import Seat
from apps.core.permissions import IsSuperAdmin

User = get_user_model()

class SuperAdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    
    def get(self, request):
        # Calculate dashboard statistics
        total_libraries = Library.objects.count()
        active_libraries = Library.objects.filter(is_active=True).count()
        total_students = Student.objects.filter(is_deleted=False).count()
        total_seats = Seat.objects.count()
        
        # Licenses expiring in next 30 days
        thirty_days_from_now = timezone.now() + timedelta(days=30)
        licenses_expiring_soon = LibraryLicense.objects.filter(
            end_date__lte=thirty_days_from_now,
            status='ACTIVE'
        ).count()
        
        # Recent library registrations (last 7 days)
        seven_days_ago = timezone.now() - timedelta(days=7)
        recent_registrations = Library.objects.filter(
            created_at__gte=seven_days_ago
        ).values('name', 'created_at', 'library_id')[:5]
        
        # License status breakdown
        license_status_breakdown = LibraryLicense.objects.values('status').annotate(
            count=Count('status')
        )
        license_breakdown = {item['status']: item['count'] for item in license_status_breakdown}
        
        data = {
            'total_libraries': total_libraries,
            'active_libraries': active_libraries,
            'total_students': total_students,
            'total_seats': total_seats,
            'licenses_expiring_soon': licenses_expiring_soon,
            'recent_registrations': list(recent_registrations),
            'license_status_breakdown': license_breakdown
        }
        
        serializer = SuperAdminDashboardSerializer(data)
        return Response(serializer.data)

class LibraryManagementView(generics.ListCreateAPIView):
    serializer_class = LibraryStatsSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    
    def get_queryset(self):
        return Library.objects.all().order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        # Create library with owner
        data = request.data.copy()
        print(f"Received library creation data: {data}")
        
        # Create or get user for library owner
        owner_email = data.get('owner_email')
        if not owner_email:
            return Response({'error': 'Owner email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Check if user already exists
            try:
                owner = User.objects.get(email=owner_email)
                print(f"Found existing user: {owner.email}")
                # Check if user already has a library
                if hasattr(owner, 'library'):
                    return Response({'error': 'User already has a library'}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                # Create new user for library owner
                owner_password = data.get('owner_password')
                if not owner_password:
                    return Response({'error': 'Password is required for new library owner'}, status=status.HTTP_400_BAD_REQUEST)
                
                print(f"Creating new user with email: {owner_email}")
                owner = User.objects.create_user(
                    email=owner_email,
                    password=owner_password,
                    role='LIBRARY_OWNER'
                )
                print(f"Created new user: {owner.email}")
            
            # Create library
            library_data = {
                'name': data.get('name'),
                'address': data.get('address'),
                'phone': data.get('phone'),
                'total_seats': data.get('total_seats'),
                'opening_time': data.get('opening_time'),
                'closing_time': data.get('closing_time'),
            }
            
            print(f"Library data to create: {library_data}")
            
            # Validate required fields
            required_fields = ['name', 'address', 'phone', 'total_seats', 'opening_time', 'closing_time']
            missing_fields = [field for field in required_fields if not library_data.get(field)]
            if missing_fields:
                return Response({
                    'error': f'Missing required fields: {", ".join(missing_fields)}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            library = Library.objects.create(owner=owner, **library_data)
            print(f"Created library: {library.name} ({library.library_id})")
            
            serializer = self.get_serializer(library)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"Error creating library: {str(e)}")
            return Response({
                'error': f'Failed to create library: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LibraryDetailManagementView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LibraryStatsSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    queryset = Library.objects.all()
    
    def update(self, request, *args, **kwargs):
        library = self.get_object()
        data = request.data.copy()
        
        # Handle owner email change
        if 'owner_email' in data:
            owner_email = data.pop('owner_email')
            if owner_email != library.owner.email:
                try:
                    new_owner = User.objects.get(email=owner_email)
                    if hasattr(new_owner, 'library') and new_owner.library != library:
                        return Response({'error': 'User already has a library'}, status=status.HTTP_400_BAD_REQUEST)
                    library.owner = new_owner
                    library.save()
                except User.DoesNotExist:
                    return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Update other fields
        serializer = self.get_serializer(library, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        library = self.get_object()
        
        # Check if library has active students
        active_students = Student.objects.filter(library=library, is_deleted=False).count()
        if active_students > 0:
            return Response({
                'error': f'Cannot delete library with {active_students} active students. Please delete or transfer students first.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Soft delete - deactivate instead of hard delete
        library.is_active = False
        library.save()
        
        return Response({
            'message': 'Library deactivated successfully. It can be reactivated later if needed.'
        }, status=status.HTTP_200_OK)

class LibraryLicenseManagementView(generics.ListCreateAPIView):
    serializer_class = LibraryLicenseSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    
    def get_queryset(self):
        return LibraryLicense.objects.all().order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class LibraryLicenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LibraryLicenseSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    queryset = LibraryLicense.objects.all()

class LibraryToggleStatusView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    
    def post(self, request, pk):
        try:
            library = Library.objects.get(pk=pk)
            library.is_active = not library.is_active
            library.save()
            
            status_text = "activated" if library.is_active else "deactivated"
            return Response({
                'message': f'Library {status_text} successfully',
                'is_active': library.is_active
            })
        except Library.DoesNotExist:
            return Response({'error': 'Library not found'}, status=status.HTTP_404_NOT_FOUND)

class SystemStatsView(APIView):
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    
    def get(self, request):
        # System-wide statistics
        stats = {
            'libraries': {
                'total': Library.objects.count(),
                'active': Library.objects.filter(is_active=True).count(),
                'inactive': Library.objects.filter(is_active=False).count(),
            },
            'students': {
                'total': Student.objects.filter(is_deleted=False).count(),
                'active': Student.objects.filter(is_deleted=False, is_active=True).count(),
                'inactive': Student.objects.filter(is_deleted=False, is_active=False).count(),
            },
            'seats': {
                'total': Seat.objects.count(),
                'occupied': Seat.objects.filter(is_available=False).count(),
                'available': Seat.objects.filter(is_available=True).count(),
            },
            'licenses': {
                'active': LibraryLicense.objects.filter(status='ACTIVE').count(),
                'trial': LibraryLicense.objects.filter(status='TRIAL').count(),
                'expired': LibraryLicense.objects.filter(status='EXPIRED').count(),
                'suspended': LibraryLicense.objects.filter(status='SUSPENDED').count(),
            }
        }
        
        return Response(stats)