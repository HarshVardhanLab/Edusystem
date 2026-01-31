from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Seat
from .serializers import SeatSerializer, SeatAssignSerializer
from apps.core.permissions import IsLibraryOwner
from apps.students.models import Student

class SeatCreateView(generics.CreateAPIView):
    serializer_class = SeatSerializer
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def perform_create(self, serializer):
        serializer.save(library=self.request.user.library)

class SeatListView(generics.ListAPIView):
    serializer_class = SeatSerializer
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['seat_type', 'is_available']
    pagination_class = None
    
    def get_queryset(self):
        return Seat.objects.filter(library=self.request.user.library)

class SeatDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SeatSerializer
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get_queryset(self):
        return Seat.objects.filter(library=self.request.user.library)

class SeatAssignView(APIView):
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def post(self, request, pk):
        try:
            seat = Seat.objects.get(pk=pk, library=request.user.library)
        except Seat.DoesNotExist:
            return Response({'error': 'Seat not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if not seat.is_available:
            return Response({'error': 'Seat is not available'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = SeatAssignSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        student = Student.objects.get(id=serializer.validated_data['student_id'])
        student.seat = seat
        student.save()
        
        seat.is_available = False
        seat.save()
        
        return Response({'message': 'Seat assigned successfully'}, status=status.HTTP_200_OK)

class SeatFreeView(APIView):
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def post(self, request, pk):
        try:
            seat = Seat.objects.get(pk=pk, library=request.user.library)
        except Seat.DoesNotExist:
            return Response({'error': 'Seat not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if hasattr(seat, 'student'):
            student = seat.student
            student.seat = None
            student.save()
        
        seat.is_available = True
        seat.save()
        
        return Response({'message': 'Seat freed successfully'}, status=status.HTTP_200_OK)

class SeatDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get_queryset(self):
        return Seat.objects.filter(library=self.request.user.library)
    
    def delete(self, request, pk):
        seat = self.get_object()
        if not seat.is_available:
            return Response({'error': 'Cannot delete an occupied seat'}, status=status.HTTP_400_BAD_REQUEST)
        seat.delete()
        return Response({'message': 'Seat deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
