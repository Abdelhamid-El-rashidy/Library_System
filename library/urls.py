from django.urls import path
from . import views

urlpatterns = [

    # USER
    path('', views.home),
    path('books/', views.books),
    path('borrowed/', views.borrowed),
    path('search/', views.search),
    path('login/', views.login),
    path('signup/', views.signup),

    # ADMIN
    path('dashboard/books/', views.admin_books),
    path('dashboard/add/', views.admin_add_book),
    path('dashboard/edit/', views.admin_edit_book),
    path('dashboard/manage/', views.admin_management),
    ]