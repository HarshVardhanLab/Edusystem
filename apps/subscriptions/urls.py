from django.urls import path
from .views import (
    SubscriptionCreateView, SubscriptionListView, SubscriptionDetailView,
    SubscriptionPaymentUpdateView, ExpiringSubscriptionsView
)

app_name = 'subscriptions'

urlpatterns = [
    path('', SubscriptionListView.as_view(), name='subscription_list'),
    path('create/', SubscriptionCreateView.as_view(), name='subscription_create'),
    path('<int:pk>/', SubscriptionDetailView.as_view(), name='subscription_detail'),
    path('<int:pk>/payment/', SubscriptionPaymentUpdateView.as_view(), name='subscription_payment'),
    path('expiring/', ExpiringSubscriptionsView.as_view(), name='expiring_subscriptions'),
]
