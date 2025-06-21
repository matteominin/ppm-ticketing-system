from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    User = get_user_model()
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
