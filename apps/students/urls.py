from django.urls import path
from .views import (
    StudentCreateView, StudentListView, StudentDetailView, 
    StudentDeactivateView, StudentActivateView, StudentDeleteView,
    StudentBulkUploadView, StudentSetPasswordView, StudentTrashListView,
    StudentRestoreView, StudentPermanentDeleteView
)
from .cloudinary_views import (
    StudentImageUploadView, StudentImageDeleteView, StudentImageUrlsView
)

app_name = 'students'

urlpatterns = [
    path('', StudentListView.as_view(), name='student_list'),
    path('create/', StudentCreateView.as_view(), name='student_create'),
    path('bulk-upload/', StudentBulkUploadView.as_view(), name='student_bulk_upload'),
    path('trash/', StudentTrashListView.as_view(), name='student_trash'),
    path('<int:pk>/', StudentDetailView.as_view(), name='student_detail'),
    path('<int:pk>/deactivate/', StudentDeactivateView.as_view(), name='student_deactivate'),
    path('<int:pk>/activate/', StudentActivateView.as_view(), name='student_activate'),
    path('<int:pk>/delete/', StudentDeleteView.as_view(), name='student_delete'),
    path('<int:pk>/set-password/', StudentSetPasswordView.as_view(), name='student_set_password'),
    path('<int:pk>/restore/', StudentRestoreView.as_view(), name='student_restore'),
    path('<int:pk>/permanent-delete/', StudentPermanentDeleteView.as_view(), name='student_permanent_delete'),
    
    # Cloudinary image endpoints
    path('<int:student_id>/upload-image/', StudentImageUploadView.as_view(), name='student_upload_image'),
    path('<int:student_id>/delete-image/', StudentImageDeleteView.as_view(), name='student_delete_image'),
    path('<int:student_id>/image-urls/', StudentImageUrlsView.as_view(), name='student_image_urls'),
]
