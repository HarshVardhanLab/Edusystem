from django.urls import path
from .views import (
    NotificationListView, NotificationDetailView, NotificationMarkReadView,
    NotificationMarkAllReadView, NotificationCreateView
)

app_name = 'notifications'

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification_list'),
    path('create/', NotificationCreateView.as_view(), name='notification_create'),
    path('<int:pk>/', NotificationDetailView.as_view(), name='notification_detail'),
    path('<int:pk>/mark-read/', NotificationMarkReadView.as_view(), name='notification_mark_read'),
    path('mark-all-read/', NotificationMarkAllReadView.as_view(), name='notification_mark_all_read'),
]
