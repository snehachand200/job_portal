
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token

from .models import Job, JobApplication
from .serializers import (
    UserSerializer,
    JobSerializer,
    JobApplicationSerializer
)


# 1. User Registration
class RegisterView(generics.CreateAPIView):

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# 2. User Login
class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'error': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid email or password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(
            username=user_obj.username,
            password=password
        )

        if user is not None:
            token, created = Token.objects.get_or_create(
                user=user
            )

            return Response({
                'message': 'Login successful',
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
                'email': user.email
            }, status=status.HTTP_200_OK)

        return Response(
            {'error': 'Invalid email or password'},
            status=status.HTTP_400_BAD_REQUEST
        )


# 3. User Logout
class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        request.user.auth_token.delete()

        return Response(
            {'message': 'Logout successful'},
            status=status.HTTP_200_OK
        )


# 4. List All Jobs
class JobListView(generics.ListAPIView):

    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [AllowAny]


# 5. View Single Job Details
class JobDetailView(generics.RetrieveAPIView):

    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [AllowAny]


# 6. Apply for a Job
class ApplyJobView(generics.CreateAPIView):

    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# 7. View Logged-in User's Applications
class MyApplicationsView(generics.ListAPIView):

    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(
            user=self.request.user
        ).order_by('-applied_at')

