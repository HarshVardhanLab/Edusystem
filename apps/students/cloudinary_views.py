"""
Enhanced student views with Cloudinary integration
"""
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from .models import Student
from .serializers import StudentSerializer
from apps.core.permissions import IsLibraryOwner
from apps.core.cloudinary_utils import (
    upload_student_photo, 
    upload_student_id_proof, 
    delete_image_from_cloudinary,
    get_preset_image_url
)
import json


class StudentImageUploadView(APIView):
    """
    Handle student photo and ID proof uploads to Cloudinary
    """
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request, student_id):
        try:
            student = Student.objects.get(
                id=student_id, 
                library=request.user.library
            )
        except Student.DoesNotExist:
            return Response(
                {'error': 'Student not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        upload_type = request.data.get('upload_type')  # 'photo' or 'id_proof'
        file = request.FILES.get('file')
        
        if not file:
            return Response(
                {'error': 'No file provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not upload_type or upload_type not in ['photo', 'id_proof']:
            return Response(
                {'error': 'Invalid upload_type. Must be "photo" or "id_proof"'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        if upload_type == 'id_proof':
            allowed_types.extend(['application/pdf'])
        
        if file.content_type not in allowed_types:
            return Response(
                {'error': f'Invalid file type. Allowed: {", ".join(allowed_types)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file size (max 5MB)
        if file.size > 5 * 1024 * 1024:
            return Response(
                {'error': 'File size too large. Maximum 5MB allowed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Delete old image if exists
            if upload_type == 'photo' and student.photo:
                old_public_id = getattr(student.photo, 'public_id', None)
                if old_public_id:
                    delete_image_from_cloudinary(old_public_id)
            elif upload_type == 'id_proof' and student.id_proof:
                old_public_id = getattr(student.id_proof, 'public_id', None)
                if old_public_id:
                    delete_image_from_cloudinary(old_public_id)
            
            # Upload to Cloudinary
            if upload_type == 'photo':
                result = upload_student_photo(file, student.student_id)
            else:
                result = upload_student_id_proof(file, student.student_id)
            
            if not result['success']:
                return Response(
                    {'error': f'Upload failed: {result.get("error", "Unknown error")}'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Update student record
            if upload_type == 'photo':
                student.photo = result['public_id']
            else:
                student.id_proof = result['public_id']
            
            student.save()
            
            # Return success response with image URLs
            response_data = {
                'success': True,
                'message': f'{upload_type.title()} uploaded successfully',
                'url': result['url'],
                'public_id': result['public_id']
            }
            
            # Add different size URLs for photos
            if upload_type == 'photo':
                response_data['urls'] = {
                    'thumbnail': get_preset_image_url(result['public_id'], 'thumbnail'),
                    'profile': get_preset_image_url(result['public_id'], 'profile'),
                    'card': get_preset_image_url(result['public_id'], 'card'),
                    'full': get_preset_image_url(result['public_id'], 'full')
                }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': f'Upload failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class StudentImageDeleteView(APIView):
    """
    Delete student images from Cloudinary
    """
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def delete(self, request, student_id):
        try:
            student = Student.objects.get(
                id=student_id, 
                library=request.user.library
            )
        except Student.DoesNotExist:
            return Response(
                {'error': 'Student not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        image_type = request.query_params.get('type')  # 'photo' or 'id_proof'
        
        if not image_type or image_type not in ['photo', 'id_proof']:
            return Response(
                {'error': 'Invalid type. Must be "photo" or "id_proof"'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            if image_type == 'photo' and student.photo:
                public_id = getattr(student.photo, 'public_id', None)
                if public_id:
                    result = delete_image_from_cloudinary(public_id)
                    if result['success']:
                        student.photo = None
                        student.save()
                        return Response({'message': 'Photo deleted successfully'})
                    else:
                        return Response(
                            {'error': f'Delete failed: {result.get("error", "Unknown error")}'}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                        )
                else:
                    return Response({'error': 'No photo to delete'}, status=status.HTTP_404_NOT_FOUND)
            
            elif image_type == 'id_proof' and student.id_proof:
                public_id = getattr(student.id_proof, 'public_id', None)
                if public_id:
                    result = delete_image_from_cloudinary(public_id)
                    if result['success']:
                        student.id_proof = None
                        student.save()
                        return Response({'message': 'ID proof deleted successfully'})
                    else:
                        return Response(
                            {'error': f'Delete failed: {result.get("error", "Unknown error")}'}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                        )
                else:
                    return Response({'error': 'No ID proof to delete'}, status=status.HTTP_404_NOT_FOUND)
            
            else:
                return Response({'error': f'No {image_type} to delete'}, status=status.HTTP_404_NOT_FOUND)
                
        except Exception as e:
            return Response(
                {'error': f'Delete failed: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class StudentImageUrlsView(APIView):
    """
    Get optimized image URLs for a student
    """
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get(self, request, student_id):
        try:
            student = Student.objects.get(
                id=student_id, 
                library=request.user.library
            )
        except Student.DoesNotExist:
            return Response(
                {'error': 'Student not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        response_data = {
            'student_id': student.student_id,
            'photo': None,
            'id_proof': None
        }
        
        # Get photo URLs
        if student.photo:
            public_id = getattr(student.photo, 'public_id', None)
            if public_id:
                response_data['photo'] = {
                    'thumbnail': get_preset_image_url(public_id, 'thumbnail'),
                    'profile': get_preset_image_url(public_id, 'profile'),
                    'card': get_preset_image_url(public_id, 'card'),
                    'full': get_preset_image_url(public_id, 'full')
                }
        
        # Get ID proof URL
        if student.id_proof:
            public_id = getattr(student.id_proof, 'public_id', None)
            if public_id:
                response_data['id_proof'] = {
                    'url': get_preset_image_url(public_id, 'full')
                }
        
        return Response(response_data, status=status.HTTP_200_OK)