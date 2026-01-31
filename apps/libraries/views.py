from rest_framework import generics, status, serializers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Library
from .serializers import LibrarySerializer
from apps.core.permissions import IsLibraryOwner

class LibraryCreateView(generics.CreateAPIView):
    serializer_class = LibrarySerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        if Library.objects.filter(owner=self.request.user).exists():
            raise serializers.ValidationError("You already have a library")
        serializer.save(owner=self.request.user)

class LibraryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LibrarySerializer
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get_queryset(self):
        return Library.objects.filter(owner=self.request.user)
    
    def get_object(self):
        return self.request.user.library

class LibraryListView(generics.ListAPIView):
    serializer_class = LibrarySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Library.objects.filter(owner=self.request.user)
