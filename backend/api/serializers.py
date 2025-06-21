from rest_framework import serializers
from .models import Event, Reservation

class EventDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class EventSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'name', 'description', 'start_time', 'end_time', 'location', 'price')
    
class ReservationSerializer(serializers.ModelSerializer):
    event = EventSummarySerializer(read_only=True)
    event_id = serializers.PrimaryKeyRelatedField(
        queryset=Event.objects.all(),
        source='event',
        write_only=True
    )

    class Meta:
        model = Reservation
        fields = [
            'id', 'event', 'event_id', 'user',
            'name', 'surname', 'quantity', 'created_at'
        ]
        read_only_fields = ['user', 'created_at', 'event']
