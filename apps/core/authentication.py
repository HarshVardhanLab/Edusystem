from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from apps.accounts.models import User
from apps.students.models import Student


class CustomJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that supports both User and Student models
    """
    
    def get_user(self, validated_token):
        """
        Attempts to find and return a user or student using the given validated token.
        """
        try:
            user_id = validated_token.get('user_id')
            role = validated_token.get('role')
            
            if role == 'STUDENT':
                # For students, get the student object
                student_id = validated_token.get('student_id')
                try:
                    student = Student.objects.get(id=user_id, student_id=student_id)
                    # Create a mock user object with necessary attributes
                    # This allows the student to pass through Django's authentication
                    student.is_authenticated = True
                    student.is_active = student.is_active
                    student.pk = student.id
                    student.role = 'STUDENT'
                    return student
                except Student.DoesNotExist:
                    raise AuthenticationFailed('Student not found')
            else:
                # For library owners, use the standard User model
                try:
                    user = User.objects.get(id=user_id)
                    return user
                except User.DoesNotExist:
                    raise AuthenticationFailed('User not found')
                    
        except KeyError:
            raise AuthenticationFailed('Token contained no recognizable user identification')
