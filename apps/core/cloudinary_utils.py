"""
Cloudinary utility functions for Nova LBS
"""
import cloudinary
import cloudinary.uploader
import cloudinary.api
from django.conf import settings
from django.core.files.storage import default_storage
import os
import uuid


def upload_image_to_cloudinary(file, folder="nova_lbs", public_id=None):
    """
    Upload an image to Cloudinary
    
    Args:
        file: The file object to upload
        folder: Cloudinary folder to organize uploads
        public_id: Custom public ID for the image
    
    Returns:
        dict: Cloudinary response with URL and public_id
    """
    try:
        if not public_id:
            public_id = f"{folder}_{uuid.uuid4().hex[:8]}"
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            public_id=public_id,
            resource_type="image",
            format="jpg",  # Convert all images to JPG for consistency
            quality="auto:good",  # Optimize quality
            fetch_format="auto",  # Auto-select best format
            transformation=[
                {"width": 800, "height": 600, "crop": "limit"},  # Limit max size
                {"quality": "auto:good"}
            ]
        )
        
        return {
            'success': True,
            'url': result.get('secure_url'),
            'public_id': result.get('public_id'),
            'width': result.get('width'),
            'height': result.get('height'),
            'format': result.get('format'),
            'bytes': result.get('bytes')
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


def delete_image_from_cloudinary(public_id):
    """
    Delete an image from Cloudinary
    
    Args:
        public_id: The public ID of the image to delete
    
    Returns:
        dict: Success status and message
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        return {
            'success': result.get('result') == 'ok',
            'message': f"Image {public_id} deleted successfully"
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


def get_optimized_image_url(public_id, width=None, height=None, crop="fill", quality="auto:good"):
    """
    Get an optimized image URL from Cloudinary
    
    Args:
        public_id: The public ID of the image
        width: Desired width
        height: Desired height
        crop: Crop mode (fill, fit, scale, etc.)
        quality: Image quality
    
    Returns:
        str: Optimized image URL
    """
    try:
        transformations = []
        
        if width or height:
            transform = {"crop": crop, "quality": quality}
            if width:
                transform["width"] = width
            if height:
                transform["height"] = height
            transformations.append(transform)
        
        url = cloudinary.CloudinaryImage(public_id).build_url(
            transformation=transformations,
            secure=True,
            fetch_format="auto"
        )
        
        return url
        
    except Exception as e:
        return None


def upload_student_photo(file, student_id):
    """
    Upload student photo to Cloudinary
    
    Args:
        file: The photo file
        student_id: Student ID for organizing
    
    Returns:
        dict: Upload result
    """
    return upload_image_to_cloudinary(
        file, 
        folder="nova_lbs/students/photos",
        public_id=f"student_{student_id}_photo"
    )


def upload_student_id_proof(file, student_id):
    """
    Upload student ID proof to Cloudinary
    
    Args:
        file: The ID proof file
        student_id: Student ID for organizing
    
    Returns:
        dict: Upload result
    """
    return upload_image_to_cloudinary(
        file, 
        folder="nova_lbs/students/id_proofs",
        public_id=f"student_{student_id}_id_proof"
    )


def upload_library_logo(file, library_id):
    """
    Upload library logo to Cloudinary
    
    Args:
        file: The logo file
        library_id: Library ID for organizing
    
    Returns:
        dict: Upload result
    """
    return upload_image_to_cloudinary(
        file, 
        folder="nova_lbs/libraries/logos",
        public_id=f"library_{library_id}_logo"
    )


# Image size presets for different use cases
IMAGE_PRESETS = {
    'thumbnail': {'width': 150, 'height': 150, 'crop': 'fill'},
    'profile': {'width': 300, 'height': 300, 'crop': 'fill'},
    'card': {'width': 400, 'height': 300, 'crop': 'fill'},
    'banner': {'width': 1200, 'height': 400, 'crop': 'fill'},
    'full': {'width': 800, 'height': 600, 'crop': 'limit'}
}


def get_preset_image_url(public_id, preset='profile'):
    """
    Get image URL with predefined preset
    
    Args:
        public_id: The public ID of the image
        preset: Preset name (thumbnail, profile, card, banner, full)
    
    Returns:
        str: Optimized image URL
    """
    if preset not in IMAGE_PRESETS:
        preset = 'profile'
    
    settings = IMAGE_PRESETS[preset]
    return get_optimized_image_url(
        public_id, 
        width=settings['width'],
        height=settings['height'],
        crop=settings['crop']
    )