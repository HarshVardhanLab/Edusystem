from celery import Celery
from celery.schedules import crontab
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_backend.settings')

app = Celery('library_backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Celery Beat Schedule for periodic tasks
app.conf.beat_schedule = {
    'generate-expiry-notifications': {
        'task': 'apps.notifications.tasks.generate_expiry_notifications',
        'schedule': crontab(hour=9, minute=0),  # Run daily at 9 AM
    },
    'generate-fee-due-notifications': {
        'task': 'apps.notifications.tasks.generate_fee_due_notifications',
        'schedule': crontab(hour=9, minute=30),  # Run daily at 9:30 AM
    },
}

app.conf.timezone = 'Asia/Kolkata'
