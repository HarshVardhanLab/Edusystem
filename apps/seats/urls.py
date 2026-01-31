from django.urls import path
from .views import (
    SeatCreateView, SeatListView, SeatDetailView, SeatAssignView, SeatFreeView, SeatDeleteView
)

app_name = 'seats'

urlpatterns = [
    path('', SeatListView.as_view(), name='seat_list'),
    path('create/', SeatCreateView.as_view(), name='seat_create'),
    path('<int:pk>/', SeatDetailView.as_view(), name='seat_detail'),
    path('<int:pk>/assign/', SeatAssignView.as_view(), name='seat_assign'),
    path('<int:pk>/free/', SeatFreeView.as_view(), name='seat_free'),
    path('<int:pk>/delete/', SeatDeleteView.as_view(), name='seat_delete'),
]
