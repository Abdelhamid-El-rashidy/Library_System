from datetime import date, timedelta
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Book
from .serializers import (
    BookSerializer, UserSerializer, SignupSerializer,
)


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_staff


class IsSuperuser(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_superuser
        )


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('-created_at')
    serializer_class = BookSerializer
    permission_classes_by_action = {
        'create': [IsAdminOrReadOnly],
        'update': [IsAdminOrReadOnly],
        'partial_update': [IsAdminOrReadOnly],
        'destroy': [IsAdminOrReadOnly],
    }

    def get_permissions(self):
        perms = self.permission_classes_by_action.get(
            self.action, [permissions.AllowAny]
        )
        return [p() for p in perms]


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsSuperuser]


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')
    if not username or not password:
        return Response(
            {'error': 'Username and password are required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        })
    return Response(
        {'error': 'Invalid credentials.'},
        status=status.HTTP_401_UNAUTHORIZED,
    )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def signup_view(request):
    serializer = SignupSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    user = serializer.save()
    refresh = RefreshToken.for_user(user)
    return Response(
        {'access': str(refresh.access_token), 'refresh': str(refresh), 'user': UserSerializer(user).data},
        status=status.HTTP_201_CREATED,
    )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def me_view(request):
    return Response(UserSerializer(request.user).data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def borrow_book(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)
    if not book.available:
        return Response({'error': 'Book is not available.'}, status=status.HTTP_400_BAD_REQUEST)
    book.available = False
    book.borrowed_by = request.user
    book.due_date = date.today() + timedelta(days=14)
    book.save()
    return Response(BookSerializer(book).data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def return_book(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)
    if book.borrowed_by != request.user and not request.user.is_staff:
        return Response({'error': 'Not your borrowed book.'}, status=status.HTTP_403_FORBIDDEN)
    book.available = True
    book.borrowed_by = None
    book.due_date = None
    book.save()
    return Response(BookSerializer(book).data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def borrowed_list_view(request):
    if not request.user.is_staff:
        return Response(
            {'error': 'Admin access required.'},
            status=status.HTTP_403_FORBIDDEN,
        )
    books = Book.objects.filter(available=False).order_by('-updated_at')
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_borrowed_view(request):
    books = Book.objects.filter(borrowed_by=request.user).order_by('-updated_at')
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def refresh_view(request):
    from rest_framework_simplejwt.exceptions import TokenError
    from rest_framework_simplejwt.tokens import RefreshToken as RT

    token = request.data.get('refresh', '')
    try:
        refresh = RT(token)
        return Response({'access': str(refresh.access_token)})
    except TokenError:
        return Response({'error': 'Invalid refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['PATCH'])
@permission_classes([IsSuperuser])
def toggle_admin(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    user.is_staff = not user.is_staff
    user.save()
    return Response(UserSerializer(user).data)
