from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'books', views.BookViewSet)
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('auth/login/', views.login_view, name='api-login'),
    path('auth/signup/', views.signup_view, name='api-signup'),
    path('auth/me/', views.me_view, name='api-me'),
    path('auth/refresh/', views.refresh_view, name='api-refresh'),
    path('books/<int:pk>/borrow/', views.borrow_book, name='api-borrow'),
    path('books/<int:pk>/return/', views.return_book, name='api-return'),
    path('users/<int:pk>/toggle-admin/', views.toggle_admin, name='api-toggle-admin'),
    path('', include(router.urls)),
]
