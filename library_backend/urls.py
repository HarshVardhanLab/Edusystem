from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Library Management API",
        default_version='v1',
        description="Study Library Management System API",
        contact=openapi.Contact(email="admin@library.com"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Health Check & Monitoring (no auth required)
    path('api/v1/', include('apps.core.urls')),
    
    # AI Assistant
    path('api/v1/ai/', include('apps.ai_assistant.urls')),
    
    # API v1
    path('api/v1/accounts/', include('apps.accounts.urls')),
    path('api/v1/libraries/', include('apps.libraries.urls')),
    path('api/v1/students/', include('apps.students.urls')),
    path('api/v1/students/', include('apps.students.study_urls')),  # Student portal features
    path('api/v1/seats/', include('apps.seats.urls')),
    path('api/v1/attendance/', include('apps.attendance.urls')),
    path('api/v1/subscriptions/', include('apps.subscriptions.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/reports/', include('apps.reports.urls')),
    path('api/v1/superadmin/', include('apps.superadmin.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
