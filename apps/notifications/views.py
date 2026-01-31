from rest_framework import generics, status, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Notification
from .serializers import NotificationSerializer, NotificationListSerializer
from apps.core.permissions import IsLibraryOwner

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_read', 'notification_type']
    
    def get_queryset(self):
        user = self.request.user
        # Check if user is a student
        if hasattr(user, 'student_id'):
            # Student can only see their own notifications
            return Notification.objects.filter(student=user)
        else:
            # Library owner can see all notifications for their library
            return Notification.objects.filter(student__library=user.library)

class NotificationDetailView(generics.RetrieveAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get_queryset(self):
        return Notification.objects.filter(student__library=self.request.user.library)

class NotificationMarkReadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, pk):
        user = request.user
        try:
            if hasattr(user, 'student_id'):
                # Student can only mark their own notifications
                notification = Notification.objects.get(pk=pk, student=user)
            else:
                # Library owner can mark any notification in their library
                notification = Notification.objects.get(pk=pk, student__library=user.library)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
        
        notification.is_read = True
        notification.save()
        
        return Response({'message': 'Notification marked as read'})

class NotificationMarkAllReadView(APIView):
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def post(self, request):
        Notification.objects.filter(
            student__library=request.user.library,
            is_read=False
        ).update(is_read=True)
        
        return Response({'message': 'All notifications marked as read'})

class NotificationCreateView(generics.CreateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def perform_create(self, serializer):
        student = serializer.validated_data['student']
        if student.library != self.request.user.library:
            raise serializers.ValidationError("Student does not belong to your library")
        serializer.save()
