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
        print(f"Seat assignment request - Seat ID: {pk}, Data: {request.data}")
        
        try:
            seat = Seat.objects.get(pk=pk, library=request.user.library)
            print(f"Found seat: {seat.seat_number}, Available: {seat.is_available}")
        except Seat.DoesNotExist:
            print(f"Seat {pk} not found for library {request.user.library}")
            return Response({'error': 'Seat not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if not seat.is_available:
            print(f"Seat {pk} is not available")
            return Response({'error': 'Seat is not available'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = SeatAssignSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            print(f"Serializer validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            student = Student.objects.get(
                id=serializer.validated_data['student_id'],
                library=request.user.library
            )
            print(f"Found student: {student.full_name}, Current seat: {student.seat}")
        except Student.DoesNotExist:
            print(f"Student {serializer.validated_data['student_id']} not found")
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if student already has a seat
        if student.seat:
            print(f"Student {student.full_name} already has seat {student.seat.seat_number}")
            return Response({'error': 'Student already has a seat assigned'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Assign the seat to the student
        student.seat = seat
        student.save()
        print(f"Assigned seat {seat.seat_number} to student {student.full_name}")
        
        # Mark seat as unavailable
        seat.is_available = False
        seat.save()
        print(f"Marked seat {seat.seat_number} as unavailable")
        
        # Return updated seat data
        seat_serializer = SeatSerializer(seat)
        return Response({
            'message': 'Seat assigned successfully',
            'seat': seat_serializer.data
        }, status=status.HTTP_200_OK)

class SeatFreeView(APIView):
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def post(self, request, pk):
        try:
            seat = Seat.objects.get(pk=pk, library=request.user.library)
        except Seat.DoesNotExist:
            return Response({'error': 'Seat not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Find and clear the student assignment
        try:
            if hasattr(seat, 'student') and seat.student:
                student = seat.student
                student.seat = None
                student.save()
        except Exception as e:
            print(f"Warning: Could not clear student assignment: {e}")
        
        # Mark seat as available
        seat.is_available = True
        seat.save()
        
        # Return updated seat data
        seat_serializer = SeatSerializer(seat)
        return Response({
            'message': 'Seat freed successfully',
            'seat': seat_serializer.data
        }, status=status.HTTP_200_OK)

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
