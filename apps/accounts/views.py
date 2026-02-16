from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.utils import timezone
from .models import User
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer, ChangePasswordSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        user_type = request.data.get('user_type', 'owner')
        
        if user_type == 'superadmin':
            # Super Admin login
            email = request.data.get('email')
            password = request.data.get('password')
            
            if not all([email, password]):
                return Response({
                    'error': 'Email and Password are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                # Find super admin user
                user = User.objects.get(email=email)
                
                # Check if user is super admin
                if not (hasattr(user, 'superadmin') or user.is_superuser):
                    return Response({
                        'error': 'Invalid super admin credentials'
                    }, status=status.HTTP_401_UNAUTHORIZED)
                
                # Check password
                if not user.check_password(password):
                    return Response({
                        'error': 'Invalid credentials'
                    }, status=status.HTTP_401_UNAUTHORIZED)
                
                # Update last login
                previous_login = user.last_login
                user.last_login = timezone.now()
                user.save()
                
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                
                user_data = {
                    'id': user.id,
                    'email': user.email,
                    'full_name': user.get_full_name(),
                    'role': 'SUPER_ADMIN',
                    'last_login': previous_login.isoformat() if previous_login else None,
                }
                
                return Response({
                    'user': user_data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                })
                
            except User.DoesNotExist:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
            except Exception as e:
                return Response({
                    'error': f'Login failed: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        elif user_type == 'student':
            # Student login
            from apps.students.models import Student
            from apps.libraries.models import Library
            
            library_id = request.data.get('library_id')
            student_id = request.data.get('student_id')
            email = request.data.get('email')
            password = request.data.get('password')
            
            if not all([library_id, student_id, password]):
                return Response({
                    'error': 'Library ID, Student ID, and Password are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                # Find library
                library = Library.objects.get(library_id=library_id)
                
                # Find student by student_id (email is optional)
                student = Student.objects.get(
                    library=library,
                    student_id=student_id
                )
                
                # If email is provided, verify it matches (if student has email)
                if email and student.email and student.email != email:
                    return Response({
                        'error': 'Invalid credentials'
                    }, status=status.HTTP_401_UNAUTHORIZED)
                
                # Check password
                if not student.check_password(password):
                    return Response({
                        'error': 'Invalid credentials'
                    }, status=status.HTTP_401_UNAUTHORIZED)
                
                # Check if student is active
                if not student.is_active:
                    return Response({
                        'error': 'Your account has been deactivated. Please contact the library.'
                    }, status=status.HTTP_403_FORBIDDEN)
                
                # Update last login
                previous_login = student.last_login
                student.last_login = timezone.now()
                student.save()
                
                # Create a temporary user-like response
                user_data = {
                    'id': student.id,
                    'email': student.email or f'{student.student_id}@student.local',
                    'full_name': student.full_name,
                    'role': 'STUDENT',
                    'student_id': student.student_id,
                    'library_id': library.library_id,
                    'library_name': library.name,
                    'last_login': previous_login.isoformat() if previous_login else None,
                }
                
                # Generate tokens
                refresh = RefreshToken()
                refresh['user_id'] = student.id
                refresh['role'] = 'STUDENT'
                refresh['student_id'] = student.student_id
                
                return Response({
                    'user': user_data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                })
                
            except Library.DoesNotExist:
                return Response({
                    'error': 'Invalid Library ID'
                }, status=status.HTTP_404_NOT_FOUND)
            except Student.DoesNotExist:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
            except Exception as e:
                return Response({
                    'error': f'Login failed: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        else:
            # Library owner login
            from apps.libraries.models import Library
            
            library_id = request.data.get('library_id')
            email = request.data.get('email')
            password = request.data.get('password')
            
            if not all([library_id, email, password]):
                return Response({
                    'error': 'Library ID, Email, and Password are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                # Find library
                library = Library.objects.get(library_id=library_id)
                
                # Get the owner user
                user = library.owner
                
                # Check if email matches
                if user.email != email:
                    return Response({
                        'error': 'Invalid credentials'
                    }, status=status.HTTP_401_UNAUTHORIZED)
                
                # Check password
                if not user.check_password(password):
                    return Response({
                        'error': 'Invalid credentials'
                    }, status=status.HTTP_401_UNAUTHORIZED)
                
                # Update last login
                previous_login = user.last_login
                user.last_login = timezone.now()
                user.save()
                
                if hasattr(library, 'last_login'):
                    library.last_login = timezone.now()
                    library.save()
                
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                
                user_data = UserSerializer(user).data
                user_data['last_login'] = previous_login.isoformat() if previous_login else None
                
                return Response({
                    'user': user_data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                })
                
            except Library.DoesNotExist:
                return Response({
                    'error': 'Invalid Library ID'
                }, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({
                    'error': f'Login failed: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        from apps.students.models import Student
        
        if isinstance(user, Student):
            # Return student profile
            return Response({
                'id': user.id,
                'email': user.email or f'{user.student_id}@student.local',
                'full_name': user.full_name,
                'role': 'STUDENT',
                'student_id': user.student_id,
                'library_id': user.library.library_id,
                'library_name': user.library.name,
                'phone': user.phone,
                'father_name': user.father_name,
                'address': user.address,
                'education_level': user.education_level,
                'time_slot': user.time_slot,
                'is_active': user.is_active,
            })
        else:
            # Return library owner profile
            return Response(UserSerializer(user).data)
    
    def patch(self, request):
        user = request.user
        from apps.students.models import Student
        
        if isinstance(user, Student):
            # Update student profile (limited fields)
            allowed_fields = ['phone', 'address', 'email']
            for field in allowed_fields:
                if field in request.data:
                    setattr(user, field, request.data[field])
            user.save()
            
            return Response({
                'id': user.id,
                'email': user.email or f'{user.student_id}@student.local',
                'full_name': user.full_name,
                'role': 'STUDENT',
                'student_id': user.student_id,
                'library_id': user.library.library_id,
                'library_name': user.library.name,
                'phone': user.phone,
                'address': user.address,
            })
        else:
            # Update library owner profile
            serializer = UserSerializer(user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({'message': 'Password changed successfully'})
