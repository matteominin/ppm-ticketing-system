from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
from .models import Event
from datetime import datetime, timedelta

class EventTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        user = User.objects.create_user(username='testuser', password='testpass')
        Event.objects.create(
            name='Concert',
            description='Live show',
            location='Florence',
            start_time=datetime.now() + timedelta(days=1),
            end_time=datetime.now() + timedelta(days=1, hours=3),
            organizer=user,
            price=30.0,
            total_tickets=100,
            available_tickets=100
        )
    
    def test_list_events(self):
        url = reverse('event-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Concert')

    