from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Job, JobApplication


# 1. User Serializer
class UserSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


# 2. Job Serializer
class JobSerializer(serializers.ModelSerializer):

    class Meta:
        model = Job
        fields = '__all__'


# 3. Job Application Serializer
class JobApplicationSerializer(serializers.ModelSerializer):

    job_title = serializers.CharField(
        source='job.title',
        read_only=True
    )

    company_name = serializers.CharField(
        source='job.company_name',
        read_only=True
    )

    class Meta:
        model = JobApplication
        fields = [
            'id',
            'user',
            'job',
            'job_title',
            'company_name',
            'applied_at'
        ]

        read_only_fields = ['user', 'applied_at']

    def validate(self, data):
        user = self.context['request'].user
        job = data['job']

        if JobApplication.objects.filter(
            user=user,
            job=job
        ).exists():
            raise serializers.ValidationError(
                "You have already applied for this job."
            )

        return data