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
                'price': 10.99,
                'available': True,
                'cover_url': 'https://placehold.co/150x200/fff7ed/b45309?text=Great+Gatsby',
                'description': 'The Great Gatsby is a 1925 tragedy novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway\'s interactions with Jay Gatsby, a mysterious millionaire obsessed with reuniting with his former lover, Daisy Buchanan.',
            },
            {
                'title': 'To Kill a Mockingbird',
                'author': 'Harper Lee',
                'category': 'Fiction',
                'price': 12.99,
                'available': False,
                'borrowed_by': user1,
                'due_date': date.today() + timedelta(days=7),
                'cover_url': 'https://placehold.co/150x200/fff7ed/b45309?text=Mockingbird',
                'description': 'To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.',
            },
            {
                'title': '1984',
                'author': 'George Orwell',
                'category': 'Dystopian',
                'price': 15.99,
                'available': True,
                'cover_url': 'https://placehold.co/150x200/fff7ed/b45309?text=1984',
                'description': '1984 is a dystopian social science fiction novel and cautionary tale written by English writer George Orwell.',
            },
            {
                'title': 'The Catcher in the Rye',
                'author': 'J.D. Salinger',
                'category': 'Fiction',
                'price': 14.99,
                'available': True,
                'cover_url': 'https://placehold.co/150x200/fff7ed/b45309?text=Catcher+Rye',
                'description': 'The Catcher in the Rye is a novel by J. D. Salinger that was partially published in serial form in 1945-1946 and as a novel in 1951.',
            },
            {
                'title': 'The Hobbit',
                'author': 'J.R.R. Tolkien',
                'category': 'Fantasy',
                'price': 16.99,
                'available': False,
                'borrowed_by': user1,
                'due_date': date.today() + timedelta(days=9),
                'cover_url': 'https://placehold.co/150x200/fff7ed/b45309?text=The+Hobbit',
                'description': 'The Hobbit, or There and Back Again is a children\'s fantasy novel by English author J. R. R. Tolkien.',
            },
            {
                'title': 'Pride and Prejudice',
                'author': 'Jane Austen',
                'category': 'Romance',
                'price': 13.99,
                'available': True,
                'cover_url': 'https://placehold.co/150x200/fff7ed/b45309?text=Pride+Prejudice',
                'description': 'Pride and Prejudice is an 1813 romantic novel of manners written by Jane Austen.',
            },
            {
                'title': 'The Lord of the Rings',
                'author': 'J.R.R. Tolkien',
                'category': 'Fantasy',
                'price': 18.99,
                'available': True,
                'cover_url': 'https://placehold.co/150x200/fff7ed/b45309?text=LOTR',
                'description': 'The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.',
            },
        ]

        for data in books_data:
            Book.objects.create(**data)

        self.stdout.write(self.style.SUCCESS('Seeded: 2 users (admin/admin123, user1/pass1) and 7 books'))
