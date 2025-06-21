from django.urls import path
from .views import (
    EventList, EventDetail,
    ReservationListCreate, ReservationDetail,
    CheckoutView
)

urlpatterns = [
    path('events/', EventList.as_view(), name='event-list'),
    path('events/<int:pk>/', EventDetail.as_view(), name='event-detail'),
    path('reservations/', ReservationListCreate.as_view(), name='reservation-list-create'),
    path('reservations/<int:pk>/', ReservationDetail.as_view(), name='reservation-detail'),
    path('checkout/', CheckoutView.as_view(), name='checkout-view'),
]