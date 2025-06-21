from django.db import models
from django.conf import settings

class Event(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='organized_events')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_tickets = models.PositiveIntegerField(null=True, blank=True)
    available_tickets = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.pk is None and self.total_tickets is not None:
            self.available_tickets = self.total_tickets
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} at {self.location} on {self.start_time.strftime('%m-%d %H:%M')}"

class Reservation(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reservations')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reservations')
    name = models.CharField(max_length=255, null=True, blank=True)
    surname = models.CharField(max_length=255, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} reserved {self.quantity} tickets for {self.event.name}"