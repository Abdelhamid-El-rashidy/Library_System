from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Book


class BookSerializer(serializers.ModelSerializer):
    borrowed_by_username = serializers.CharField(
        source='borrowed_by.username', read_only=True, default=None
    )

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'category', 'available',
            'cover_url', 'description', 'borrowed_by',
            'borrowed_by_username', 'due_date', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    is_admin = serializers.BooleanField(source='is_staff', read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'is_admin', 'is_superuser',
        ]


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=4)
    password_confirm = serializers.CharField(write_only=True, min_length=4)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError('Passwords do not match.')
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError('Username already exists.')
        if User.objects.filter(email=data.get('email', '')).exists():
            raise serializers.ValidationError('Email already exists.')
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        return user
