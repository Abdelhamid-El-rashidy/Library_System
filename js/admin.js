function initializeData() {
    if (!localStorage.getItem('books')) {
        const books = [
            { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', price: 10.99, available: true, borrowedBy: null, coverUrl: 'https://placehold.co/150x200/fff7ed/b45309?text=Great+Gatsby', description: 'The Great Gatsby is a 1925 tragedy novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway\'s interactions with Jay Gatsby, a mysterious millionaire obsessed with reuniting with his former lover, Daisy Buchanan.' },
            { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', price: 12.99, available: false, borrowedBy: 1, dueDate: '2026-05-20', coverUrl: 'https://placehold.co/150x200/fff7ed/b45309?text=Mockingbird', description: 'To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.' },
            { id: 3, title: '1984', author: 'George Orwell', category: 'Dystopian', price: 15.99, available: true, borrowedBy: null, coverUrl: 'https://placehold.co/150x200/fff7ed/b45309?text=1984', description: '1984 is a dystopian social science fiction novel and cautionary tale written by English writer George Orwell.' },
            { id: 4, title: 'The Catcher in the Rye', author: 'J.D. Salinger', category: 'Fiction', price: 14.99, available: true, borrowedBy: null, coverUrl: 'https://placehold.co/150x200/fff7ed/b45309?text=Catcher+Rye', description: 'The Catcher in the Rye is a novel by J. D. Salinger that was partially published in serial form in 1945–1946 and as a novel in 1951.' },
            { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', price: 16.99, available: false, borrowedBy: 1, dueDate: '2026-05-22', coverUrl: 'https://placehold.co/150x200/fff7ed/b45309?text=The+Hobbit', description: 'The Hobbit, or There and Back Again is a children\'s fantasy novel by English author J. R. R. Tolkien.' },
            { id: 6, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Romance', price: 13.99, available: true, borrowedBy: null, coverUrl: 'https://placehold.co/150x200/fff7ed/b45309?text=Pride+Prejudice', description: 'Pride and Prejudice is an 1813 romantic novel of manners written by Jane Austen.' },
            { id: 7, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', category: 'Fantasy', price: 18.99, available: true, borrowedBy: null, coverUrl: 'https://placehold.co/150x200/fff7ed/b45309?text=LOTR', description: 'The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.' }
        ];
        localStorage.setItem('books', JSON.stringify(books));
    }
    if (!localStorage.getItem('users')) {
        const users = [
            { id: 1, username: 'admin', password: 'admin123', email: 'admin@bookify.com', isAdmin: true, isSuperuser: true, borrowedBooks: [] },
            { id: 2, username: 'user1', password: 'pass1', email: 'user1@example.com', isAdmin: false, isSuperuser: false, borrowedBooks: [2, 5] }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    } else {
        const users = JSON.parse(localStorage.getItem('users'));
        if (!users.some(u => u.username === 'admin')) {
            users.push({ id: users.length + 1, username: 'admin', password: 'admin123', email: 'admin@bookify.com', isAdmin: true, isSuperuser: true, borrowedBooks: [] });
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
}

function getCurrentUser() {
    const userId = localStorage.getItem('currentUser');
    if (userId) {
        const users = JSON.parse(localStorage.getItem('users'));
        return users.find(u => u.id == userId);
    }
    return null;
}

function checkAdmin() {
    const user = getCurrentUser();
    if (!user || !user.isAdmin) {
        window.location.href = '../user/dashboard.html';
    }
}

function logout() {
    localStorage.setItem('currentUser', null);
    window.location.href = '../user/login.html';
}

function previewCover(input) {
    const preview = document.getElementById('cover-preview');
    const hidden = document.getElementById('cover-data');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataUrl = e.target.result;
            if (hidden) hidden.value = dataUrl;
            if (preview) preview.innerHTML = '<img src="' + dataUrl + '" style="max-width:120px;max-height:160px;border-radius:6px;border:1px solid var(--border);object-fit:cover" />';
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        if (hidden) hidden.value = '';
        if (preview) preview.innerHTML = '';
    }
}

function loadAdminBooks() {
    const books = JSON.parse(localStorage.getItem('books'));
    const tbody = document.querySelector('.data-table tbody');
    if (tbody) {
        tbody.innerHTML = '';
        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="td-primary">${book.title}</td>
                <td class="td-muted">${book.author}</td>
                <td class="td-primary">${book.id}</td>
                <td><span class="category-badge">${book.category}</span></td>
                <td class="text-center">
                    <a href="book-edit.html?id=${book.id}" class="action-link">Edit</a>
                    <a href="#" class="action-link--danger" onclick="deleteBook(${book.id})">Delete</a>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book? This cannot be undone.')) return;
    const books = JSON.parse(localStorage.getItem('books'));
    const bookIndex = books.findIndex(b => b.id == bookId);
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        localStorage.setItem('books', JSON.stringify(books));
        alert('Book deleted successfully.');
        loadAdminBooks();
    }
}

function validateAddBook() {
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value.trim();
    if (!title || !author || !category) {
        alert('Title, author, and category are required.');
        return false;
    }
    const coverData = document.getElementById('cover-data');
    const coverUrl = coverData && coverData.value ? coverData.value : 'https://placehold.co/150x200/e2e8f0/64748b?text=' + encodeURIComponent(title);
    const books = JSON.parse(localStorage.getItem('books'));
    const newBook = {
        id: books.length ? Math.max(...books.map(b => b.id)) + 1 : 1,
        title,
        author,
        category,
        price: 0,
        available: true,
        borrowedBy: null,
        description: description || '',
        coverUrl: coverUrl
    };
    books.push(newBook);
    localStorage.setItem('books', JSON.stringify(books));
    alert('Book added successfully.');
    window.location.href = 'catalog.html';
    return false;
}

function loadEditBookData() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) { return; }
    const books = JSON.parse(localStorage.getItem('books'));
    const book = books.find(b => b.id == id);
    if (book) {
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('isbn').value = book.id;
        document.getElementById('category').value = book.category.toLowerCase();
        document.getElementById('description').value = book.description || '';
        document.getElementById('price').value = book.price || 0;
        const preview = document.getElementById('cover-preview');
        if (preview && book.coverUrl && !book.coverUrl.includes('placehold.co')) {
            preview.innerHTML = '<img src="' + book.coverUrl + '" style="max-width:120px;max-height:160px;border-radius:6px;border:1px solid var(--border);object-fit:cover" />';
        }
    }
}

function validateEditBook() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) { alert('No book selected.'); return false; }
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value.trim();
    const price = document.getElementById('price').value.trim();
    if (!title || !author || !category) {
        alert('Title, author, and category are required.');
        return false;
    }
    const books = JSON.parse(localStorage.getItem('books'));
    const bookIndex = books.findIndex(b => b.id == id);
    if (bookIndex !== -1) {
        books[bookIndex].title = title;
        books[bookIndex].author = author;
        books[bookIndex].category = category;
        books[bookIndex].description = description || '';
        books[bookIndex].price = price ? parseFloat(price) : 0;
        const coverData = document.getElementById('cover-data');
        if (coverData && coverData.value) books[bookIndex].coverUrl = coverData.value;
        localStorage.setItem('books', JSON.stringify(books));
        alert('Book updated successfully.');
        window.location.href = 'catalog.html';
    }
    return false;
}

function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    if (event && event.target) event.target.classList.add('active');
}

document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    checkAdmin();
    const user = getCurrentUser();
    const userInfo = document.getElementById('user-nav-info');
    if (userInfo) userInfo.textContent = user ? 'Admin: ' + user.username : 'Admin Panel';

    const adminsLink = document.getElementById('nav-admins');
    if (adminsLink && user && user.isSuperuser) {
        adminsLink.classList.remove('nav-item--hidden');
    }

    if (window.location.pathname.includes('catalog.html')) { loadAdminBooks(); }
    if (window.location.pathname.includes('book-edit.html')) { loadEditBookData(); }

    const form = document.querySelector('form');
    if (form) {
        if (window.location.pathname.includes('book-add.html')) {
            form.onsubmit = validateAddBook;
        } else if (window.location.pathname.includes('book-edit.html')) {
            form.onsubmit = validateEditBook;
        }
    }

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) logoutLink.onclick = (e) => { e.preventDefault(); logout(); };
});
