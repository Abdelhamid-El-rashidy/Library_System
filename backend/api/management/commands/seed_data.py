from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Book


class Command(BaseCommand):
    help = 'Seed the database with initial books and users'

    def handle(self, *args, **options):
        if User.objects.exists():
            self.stdout.write(self.style.WARNING('Database already has data. Skipping seed.'))
            return

        admin = User.objects.create_superuser(
            username='admin',
            password='admin123',
            email='admin@bookify.com',
        )

        user1 = User.objects.create_user(
            username='user1',
            password='pass1',
            email='user1@example.com',
        )

        books_data = [
            {
                'title': 'The Great Gatsby',
                'author': 'F. Scott Fitzgerald',
                'category': 'Fiction',
                'available': True,
                'cover_url': 'https://placehold.co/150x200/fff7ed/b45309?text=Great+Gatsby',
                'description': 'A tragic novel set in the Jazz Age about Jay Gatsby\'s obsession with Daisy Buchanan.',
            },
            {
                'title': 'To Kill a Mockingbird',
                'author': 'Harper Lee',
                'category': 'Fiction',
                'available': False,
                'borrowed_by': user1,
                'due_date': date.today() + timedelta(days=7),
                'cover_url': 'https://placehold.co/150x200/fff7ed/b45309?text=Mockingbird',
                'description': 'A novel about racial injustice and moral growth in a small Alabama town.',
            },
            {
                'title': '1984',
                'author': 'George Orwell',
                'category': 'Dystopian',
                'available': True,
                'cover_url': 'https://placehold.co/150x200/fff7ed/b45309?text=1984',
                'description': 'A dystopian novel set in a totalitarian society under constant surveillance.',
            },
            {
                'title': 'The Catcher in the Rye',
                'author': 'J.D. Salinger',
                'category': 'Fiction',
                'available': True,
                'cover_url': 'https://placehold.co/150x200/fff7ed/b45309?text=Catcher+Rye',
                'description': 'A story about teenage alienation and rebellion.',
            },
            {
                'title': 'The Hobbit',
                'author': 'J.R.R. Tolkien',
                'category': 'Fantasy',
                'available': False,
                'borrowed_by': user1,
                'due_date': date.today() + timedelta(days=9),
                'cover_url': 'https://placehold.co/150x200/fff7ed/b45309?text=The+Hobbit',
                'description': 'A fantasy novel about Bilbo Baggins on an unexpected journey.',
            },
            {
                'title': 'Pride and Prejudice',
                'author': 'Jane Austen',
                'category': 'Romance',
                'available': True,
                'cover_url': 'https://placehold.co/150x200/fff7ed/b45309?text=Pride+Prejudice',
                'description': 'A romantic novel about manners and marriage in Georgian England.',
            },
            {
                'title': 'The Lord of the Rings',
                'author': 'J.R.R. Tolkien',
                'category': 'Fantasy',
                'available': True,
                'cover_url': 'https://placehold.co/150x200/fff7ed/b45309?text=LOTR',
                'description': 'An epic high-fantasy novel about the quest to destroy the One Ring.',
            },
        ]

        for data in books_data:
            Book.objects.create(**data)

        self.stdout.write(self.style.SUCCESS('Seeded: 2 users, 7 books'))
