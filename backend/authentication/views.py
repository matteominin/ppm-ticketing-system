from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        return Response (
        {
            'refresh': str(refresh),
            'access': access,
            'user': serializer.data
        }, 
        status=201)
