from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from datetime import timedelta
from .models import Subscription
from .serializers import SubscriptionSerializer, SubscriptionListSerializer
from apps.core.permissions import IsLibraryOwner

class SubscriptionCreateView(generics.CreateAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated, IsLibraryOwner]

class SubscriptionListView(generics.ListAPIView):
    serializer_class = SubscriptionListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['fee_status', 'is_active']
    pagination_class = None
    
    def get_queryset(self):
        user = self.request.user
        # Check if user is a student
        if hasattr(user, 'student_id'):
            # Student can only see their own subscriptions
            return Subscription.objects.filter(student=user)
        else:
            # Library owner can see all subscriptions for their library
            return Subscription.objects.filter(student__library=user.library)

class SubscriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get_queryset(self):
        return Subscription.objects.filter(student__library=self.request.user.library)

class SubscriptionPaymentUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def patch(self, request, pk):
        try:
            subscription = Subscription.objects.get(
                pk=pk,
                student__library=request.user.library
            )
        except Subscription.DoesNotExist:
            return Response({'error': 'Subscription not found'}, status=status.HTTP_404_NOT_FOUND)
        
        fee_status = request.data.get('fee_status')
        if fee_status not in ['PAID', 'DUE']:
            return Response({'error': 'Invalid fee status'}, status=status.HTTP_400_BAD_REQUEST)
        
        subscription.fee_status = fee_status
        subscription.save()
        
        return Response({
            'message': 'Payment status updated successfully',
            'subscription': SubscriptionSerializer(subscription).data
        })

class ExpiringSubscriptionsView(generics.ListAPIView):
    serializer_class = SubscriptionListSerializer
    permission_classes = [IsAuthenticated, IsLibraryOwner]
    
    def get_queryset(self):
        days = int(self.request.query_params.get('days', 7))
        end_date = timezone.now().date() + timedelta(days=days)
        
        return Subscription.objects.filter(
            student__library=self.request.user.library,
            is_active=True,
            end_date__lte=end_date,
            end_date__gte=timezone.now().date()
        )
