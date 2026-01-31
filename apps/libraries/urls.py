from django.urls import path
from .views import LibraryCreateView, LibraryDetailView, LibraryListView

app_name = 'libraries'

urlpatterns = [
    path('', LibraryListView.as_view(), name='library_list'),
    path('create/', LibraryCreateView.as_view(), name='library_create'),
    path('detail/', LibraryDetailView.as_view(), name='library_detail'),
]
