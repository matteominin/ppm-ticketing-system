from rest_framework import generics, permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Event, Reservation
from .serializers import EventDetailSerializer, EventSummarySerializer, ReservationSerializer
from django.db import transaction

class IsAdminOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class EventList(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSummarySerializer
    permission_classes = [IsAdminOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class EventDetail(generics.RetrieveAPIView):
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer
    permission_classes = [permissions.AllowAny]

class ReservationListCreate(generics.ListCreateAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reservation.objects.filter(user=self.request.user)


    def perform_create(self, serializer):
        with transaction.atomic():
            event = serializer.validated_data.get("event")
            quantity = serializer.validated_data.get("quantity", 1)

            if event.available_tickets is None or event.available_tickets < quantity:
                raise serializers.ValidationError("Not enough tickets available.")

            serializer.save(user=self.request.user)
            event.available_tickets -= quantity
            event.save()




class ReservationDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reservation.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        with transaction.atomic():
            instance = self.get_object()
            event = instance.event

            old_quantity = instance.quantity
            new_quantity = serializer.validated_data.get("quantity", old_quantity)
            diff = new_quantity - old_quantity

            if diff > 0:
                raise serializers.ValidationError("Increasing the number of tickets is not allowed.")
            elif diff < 0:
                event.available_tickets += abs(diff)
                event.save()
                serializer.save()
            else:
                serializer.save()

    def perform_destroy(self, instance):
        with transaction.atomic():
            event = instance.event
            event.available_tickets += instance.quantity
            event.save()
            instance.delete()

class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        event_id = request.data.get("event_id")
        quantity = int(request.data.get("quantity", 1))
        event = Event.objects.get(id=event_id)

        if event.available_tickets < quantity:
            return Response({"error": "Not enough tickets available."}, status=400)

        # Simulate payment processing
        payment_successful = True 

        if not payment_successful:
            return Response({"error": "Payment failed."}, status=402)

        event.available_tickets -= quantity
        event.save()

        reservation = Reservation.objects.create(
            event=event,
            user=request.user,
            name=request.data.get("name"),
            surname=request.data.get("surname"),
            quantity=quantity,
        )

        return Response({"message": "Payment and reservation successful", "reservation_id": reservation.id})