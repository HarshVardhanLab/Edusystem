from rest_framework import permissions

class IsLibraryOwner(permissions.BasePermission):
    """
    Custom permission to only allow library owners to access their own data
    """
    message = "You don't have permission to access this resource"
    
    def has_permission(self, request, view):
        # Check if user is authenticated and has a library
        if not request.user.is_authenticated:
            return False
        
        if request.user.role != 'LIBRARY_OWNER':
            return False
        
        # Check if user has a library
        if not hasattr(request.user, 'library'):
            return False
        
        return True
    
    def has_object_permission(self, request, view, obj):
        # Check if the object belongs to the user's library
        if hasattr(obj, 'library'):
            return obj.library == request.user.library
        
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        
        return False

class IsSuperAdmin(permissions.BasePermission):
    """
    Custom permission to only allow super admins to access system-wide data.
    """
    message = "You don't have super admin permissions"
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            (hasattr(request.user, 'superadmin') or request.user.is_superuser)
        )

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners to edit objects
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return obj.owner == request.user
