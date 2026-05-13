from django.db import models
from django.contrib.auth.models import User


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    available = models.BooleanField(default=True)
    cover_url = models.URLField(max_length=500, blank=True, default='')
    description = models.TextField(blank=True, default='')
    borrowed_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
