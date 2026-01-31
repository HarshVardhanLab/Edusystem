from django.utils import timezone
from datetime import timedelta
from apps.subscriptions.models import Subscription
from .models import Notification

def generate_expiry_notifications():
    """
    Background task to generate subscription expiry notifications
    Run this daily via cron or Celery
    """
    # Get subscriptions expiring in 7 days
    expiring_date = timezone.now().date() + timedelta(days=7)
    
    expiring_subscriptions = Subscription.objects.filter(
        is_active=True,
        end_date=expiring_date
    )
    
    for subscription in expiring_subscriptions:
        # Check if notification already exists
        if not Notification.objects.filter(
            student=subscription.student,
            notification_type='SUBSCRIPTION_EXPIRY',
            created_at__date=timezone.now().date()
        ).exists():
            Notification.objects.create(
                student=subscription.student,
                notification_type='SUBSCRIPTION_EXPIRY',
                title='Subscription Expiring Soon',
                message=f'Your subscription "{subscription.plan_name}" will expire on {subscription.end_date}. Please renew to continue.'
            )

def generate_fee_due_notifications():
    """
    Background task to generate fee due notifications
    Run this daily via cron or Celery
    """
    due_subscriptions = Subscription.objects.filter(
        is_active=True,
        fee_status='DUE'
    )
    
    for subscription in due_subscriptions:
        # Check if notification already exists
        if not Notification.objects.filter(
            student=subscription.student,
            notification_type='FEE_DUE',
            created_at__date=timezone.now().date()
        ).exists():
            Notification.objects.create(
                student=subscription.student,
                notification_type='FEE_DUE',
                title='Fee Payment Due',
                message=f'Your fee of ₹{subscription.fee_amount} for "{subscription.plan_name}" is due. Please make the payment.'
            )
