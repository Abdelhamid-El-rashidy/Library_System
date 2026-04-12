// admin.js - JavaScript for admin frontend

// Initialize data (same as user)
function initializeData() {
    if (!localStorage.getItem('books')) {
        const books = [
            { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', price: 10.99, available: true, borrowedBy: null, description: 'The Great Gatsby is a 1925 tragedy novel...' },
            { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', price: 12.99, available: false, borrowedBy: 1, description: 'To Kill a Mockingbird is a novel...' },
            { id: 3, title: '1984', author: 'George Orwell', category: 'Dystopian', price: 15.99, available: true, borrowedBy: null, description: '1984 is a dystopian...' },
            { id: 4, title: 'The Catcher in the Rye', author: 'J.D. Salinger', category: 'Fiction', price: 14.99, available: true, borrowedBy: null, description: 'The Catcher in the Rye is a novel...' },
            { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', price: 16.99, available: false, borrowedBy: 1, description: 'The Hobbit, or There and Back Again...' },
            { id: 6, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Romance', price: 13.99, available: true, borrowedBy: null, description: 'Pride and Prejudice is an 1813...' },
            { id: 7, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', category: 'Fantasy', price: 18.99, available: true, borrowedBy: null, description: 'The Lord of the Rings is an epic...' }
        ];
        localStorage.setItem('books', JSON.stringify(books));
    }

    if (!localStorage.getItem('users')) {
        const users = [
            { id: 1, username: 'user1', password: 'pass1', email: 'user1@example.com', isAdmin: false, borrowedBooks: [2, 5] }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Get current user
function getCurrentUser() {
    const userId = localStorage.getItem('currentUser');
    if (userId) {
        const users = JSON.parse(localStorage.getItem('users'));
        return users.find(u => u.id == userId);
    }
    return null;
}

// Check if admin
function checkAdmin() {
    const user = getCurrentUser();
    if (!user || !user.isAdmin) {
        window.location.href = '../user/frontend/index.html';
    }
}

// Logout
function logout() {
    localStorage.setItem('currentUser', null);
    window.location.href = '../user/frontend/LogIn.html';
}

// Load books for admin
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
                <td class="text-center"><a href="admin-edit-book.html?id=${book.id}" class="action-link">Edit</a></td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Add book validation
function validateAddBook() {
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const isbn = document.getElementById('isbn').value.trim();
    const category = document.getElementById('category').value.trim();
    const price = document.getElementById('price').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!title || !author || !isbn || !category || !price || !description) {
        alert('All fields are required.');
        return false;
    }

    if (isNaN(price) || price <= 0) {
        alert('Price must be a positive number.');
        return false;
    }

    const books = JSON.parse(localStorage.getItem('books'));
    const newBook = {
        id: books.length + 1,
        title,
        author,
        category,
        price: parseFloat(price),
        available: true,
        borrowedBy: null
    };
    books.push(newBook);
    localStorage.setItem('books', JSON.stringify(books));

    alert('Book added successfully.');
    window.location.href = 'admin-books.html';
    return false;
}

// Get current user
function getCurrentUser() {
    const userId = localStorage.getItem('currentUser');
    if (userId) {
        const users = JSON.parse(localStorage.getItem('users'));
        return users.find(u => u.id == userId);
    }
    return null;
}

// Check if admin
function checkAdmin() {
    const user = getCurrentUser();
    if (!user || !user.isAdmin) {
        window.location.href = '../user/frontend/index.html';
    }

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        const books = JSON.parse(localStorage.getItem('books'));
        const book = books.find(b => b.id == id);
        if (book) {
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;
            document.getElementById('isbn').value = book.id;
            document.getElementById('category').value = book.category;
            document.getElementById('price').value = book.price;
            document.getElementById('description').value = 'Description here'; // Placeholder
        }
    }
}

function validateEditBook() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const category = document.getElementById('category').value.trim();
    const price = document.getElementById('price').value.trim();

    if (!title || !author || !category || !price) {
        alert('All fields are required.');
        return false;
    }

    const books = JSON.parse(localStorage.getItem('books'));
    const bookIndex = books.findIndex(b => b.id == id);
    if (bookIndex !== -1) {
        books[bookIndex].title = title;
        books[bookIndex].author = author;
        books[bookIndex].category = category;
        books[bookIndex].price = parseFloat(price);
        localStorage.setItem('books', JSON.stringify(books));
        alert('Book updated successfully.');
        window.location.href = 'admin-books.html';
    }
    return false;
}

// Tab navigation
function openTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    checkAdmin();

    // Set username
    const user = getCurrentUser();
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        if (user) {
            userInfo.innerHTML = `Admin: <strong>${user.username}</strong>`;
        } else {
            userInfo.innerHTML = 'Admin Panel';
        }
    }

    // Load data
    if (window.location.pathname.includes('admin-books.html')) {
        loadAdminBooks();
    }

    if (window.location.pathname.includes('admin-edit-book.html')) {
        loadEditBook();
    }

    // Attach event listeners
    const addBookForm = document.querySelector('form');
    if (addBookForm && window.location.pathname.includes('admin-add-book.html')) {
        addBookForm.onsubmit = validateAddBook;
    }

    if (addBookForm && window.location.pathname.includes('admin-edit-book.html')) {
        addBookForm.onsubmit = validateEditBook;
    }

    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(btn => {
        btn.onclick = () => openTab(btn.getAttribute('data-tab'));
    });

    // Logout links
    const logoutLinks = document.querySelectorAll('a[href="#"]');
    logoutLinks.forEach(link => {
        if (link.textContent.trim() === 'Logout') {
            link.onclick = (e) => {
                e.preventDefault();
                logout();
            };
        }
    });
});