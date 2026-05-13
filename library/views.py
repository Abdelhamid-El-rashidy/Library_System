from django.shortcuts import render


# ================= USER =================

def home(request):
    return render(request, 'library/user/index.html')

def books(request):
    return render(request, 'library/user/books.html')

def borrowed(request):
    return render(request, 'library/user/borrowed.html')

def search(request):
    return render(request, 'library/user/search.html')

def login(request):
    return render(request, 'library/user/LogIn.html')

def signup(request):
    return render(request, 'library/user/SignUp.html')


# ================= ADMIN =================

def admin_books(request):
    return render(request, 'library/admin/admin-books.html')

def admin_add_book(request):
    return render(request, 'library/admin/admin-add-book.html')

def admin_edit_book(request):
    return render(request, 'library/admin/admin-edit-book.html')

def admin_management(request):
    return render(request, 'library/admin/admin-book-management.html')