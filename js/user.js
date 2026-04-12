// user.js - JavaScript for user frontend

// Initialize data in localStorage if not exists
function initializeData() {
    if (!localStorage.getItem('books')) {
        const books = [
            { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', price: 10.99, available: true, borrowedBy: null, description: 'The Great Gatsby is a 1925 tragedy novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway\'s interactions with Jay Gatsby, a mysterious millionaire obsessed with reuniting with his former lover, Daisy Buchanan.' },
            { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', price: 12.99, available: false, borrowedBy: 1, description: 'To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.' },
            { id: 3, title: '1984', author: 'George Orwell', category: 'Dystopian', price: 15.99, available: true, borrowedBy: null, description: '1984 is a dystopian social science fiction novel and cautionary tale written by English writer George Orwell. It was published on 8 June 1949 by Secker & Warburg as Orwell\'s ninth and final book completed in his lifetime.' },
            { id: 4, title: 'The Catcher in the Rye', author: 'J.D. Salinger', category: 'Fiction', price: 14.99, available: true, borrowedBy: null, description: 'The Catcher in the Rye is a novel by J. D. Salinger that was partially published in serial form in 1945–1946 and as a novel in 1951. It has been translated widely.' },
            { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', price: 16.99, available: false, borrowedBy: 1, description: 'The Hobbit, or There and Back Again is a children\'s fantasy novel by English author J. R. R. Tolkien. It was published in 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize from the New York Herald Tribune for best juvenile fiction.' },
            { id: 6, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Romance', price: 13.99, available: true, borrowedBy: null, description: 'Pride and Prejudice is an 1813 romantic novel of manners written by Jane Austen. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist of the book who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.' },
            { id: 7, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', category: 'Fantasy', price: 18.99, available: true, borrowedBy: null, description: 'The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien. The story began as a sequel to Tolkien\'s 1937 fantasy novel The Hobbit, but eventually developed into a much larger work.' }
        ];
        localStorage.setItem('books', JSON.stringify(books));
    }

    if (!localStorage.getItem('users')) {
        const users = [
            { id: 1, username: 'user1', password: 'pass1', email: 'user1@example.com', isAdmin: false, borrowedBooks: [2, 5] }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }

    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', null);
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

// Login validation
function validateLogin() {
    const username = document.getElementById('us').value.trim();
    const password = document.getElementById('pw').value.trim();

    if (!username || !password) {
        alert('Username and password are required.');
        return false;
    }

    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', user.id);
        if (user.isAdmin) {
            window.location.href = '../../admin/frontend/admin-books.html';
        } else {
            window.location.href = 'books.html';
        }
        return false; // Prevent form submission
    } else {
        alert('Invalid credentials.');
        return false;
    }
}

// Signup validation
function validateSignup() {
    const username = document.getElementById('us').value.trim();
    const password = document.getElementById('pw').value.trim();
    const confirmPassword = document.getElementById('cpw').value.trim();
    const email = document.getElementById('e').value.trim();
    const isAdmin = document.getElementById('ia').checked;

    if (!username || !password || !confirmPassword || !email) {
        alert('All fields are required.');
        return false;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return false;
    }

    const users = JSON.parse(localStorage.getItem('users'));
    if (users.some(u => u.username === username || u.email === email)) {
        alert('Username or email already exists.');
        return false;
    }

    const newUser = {
        id: users.length + 1,
        username,
        password,
        email,
        isAdmin,
        borrowedBooks: []
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', newUser.id);

    if (isAdmin) {
        window.location.href = '../../admin/frontend/admin-books.html';
    } else {
        window.location.href = 'books.html';
    }
    return false;
}

// Logout
function logout() {
    localStorage.setItem('currentUser', null);
    window.location.href = 'LogIn.html';
}

// Search functionality
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const searchBy = document.getElementById('searchBy').value;

    if (!searchTerm) {
        alert('Please enter a search term.');
        return false;
    }

    const books = JSON.parse(localStorage.getItem('books'));
    let filteredBooks = books;

    if (searchBy === 'Book') {
        filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchTerm));
    } else if (searchBy === 'Author') {
        filteredBooks = books.filter(b => b.author.toLowerCase().includes(searchTerm));
    } else if (searchBy === 'Category') {
        filteredBooks = books.filter(b => b.category.toLowerCase().includes(searchTerm));
    }

    displaySearchResults(filteredBooks);
    return false;
}

function displaySearchResults(books) {
    const tbody = document.querySelector('.data-table tbody');
    tbody.innerHTML = '';

    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="td-primary"><a href="books/book${book.id}.html" class="action-link">${book.title}</a></td>
            <td class="td-muted">${book.author}</td>
            <td><span class="category-badge">${book.category}</span></td>
            <td class="td-primary">$${book.price.toFixed(2)}</td>
            <td>${book.available ? '<span class="td-primary">Available</span> <button onclick="borrowBook(' + book.id + ')" class="btn btn-primary">Borrow</button>' : '<span class="warning-text">Borrowed</span>'}</td>
        `;
        tbody.appendChild(row);
    });
}

// Borrow book
function borrowBook(bookId) {
    const user = getCurrentUser();
    if (!user) {
        alert('Please log in to borrow books.');
        window.location.href = 'LogIn.html';
        return;
    }

    const books = JSON.parse(localStorage.getItem('books'));
    const book = books.find(b => b.id == bookId);

    if (!book.available) {
        alert('Book is not available.');
        return;
    }

    book.available = false;
    book.borrowedBy = user.id;
    user.borrowedBooks.push(bookId);

    localStorage.setItem('books', JSON.stringify(books));
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.id == user.id);
    users[userIndex] = user;
    localStorage.setItem('users', JSON.stringify(users));

    alert('Book borrowed successfully.');
    location.reload();
}

// Load books on books.html
function loadBooks() {
    const books = JSON.parse(localStorage.getItem('books'));
    const tbody = document.querySelector('.data-table tbody');
    if (tbody) {
        tbody.innerHTML = '';
        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="td-primary"><a href="books/book${book.id}.html" class="action-link">${book.title}</a></td>
                <td class="td-muted">${book.author}</td>
                <td><span class="category-badge">${book.category}</span></td>
                <td class="td-primary">$${book.price.toFixed(2)}</td>
                <td>${book.available ? '<span class="td-primary">Available</span> <button onclick="borrowBook(' + book.id + ')" class="btn btn-primary">Borrow</button>' : '<span class="warning-text">Borrowed</span>'}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Load borrowed books
function loadBorrowedBooks() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'LogIn.html';
        return;
    }

    const books = JSON.parse(localStorage.getItem('books'));
    const borrowedBooks = books.filter(b => user.borrowedBooks.includes(b.id));

    const tbody = document.querySelector('.data-table tbody');
    if (tbody) {
        tbody.innerHTML = '';
        borrowedBooks.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="td-primary"><a href="books/book${book.id}.html" class="action-link">${book.title}</a></td>
                <td class="td-muted">${book.author}</td>
                <td><span class="category-badge">${book.category}</span></td>
                <td class="warning-text">Borrowed</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Load book details
function loadBookDetails(bookId) {
    const books = JSON.parse(localStorage.getItem('books'));
    const book = books.find(b => b.id == bookId);

    if (book) {
        document.querySelector('.form-legend').textContent = book.title;
        document.querySelector('.td-muted').textContent = book.author;
        document.querySelector('.category-badge').textContent = book.category;
        document.querySelector('.warning-text').textContent = book.available ? 'Available' : 'Borrowed';
        document.querySelector('.page-description').textContent = book.description;

        const borrowBtn = document.querySelector('.btn');
        if (borrowBtn) {
            borrowBtn.disabled = !book.available;
            borrowBtn.textContent = book.available ? 'Borrow Book' : 'Book Not Available';
            borrowBtn.className = book.available ? 'btn btn-primary' : 'btn btn-secondary';
            if (book.available) {
                borrowBtn.onclick = () => borrowBook(bookId);
            }
        }
    }
}

// Navigation check
function checkLoginStatus() {
    const user = getCurrentUser();
    if (!user && window.location.pathname.includes('borrowed.html')) {
        window.location.href = 'LogIn.html';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    checkLoginStatus();

    // Set username
    const user = getCurrentUser();
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        if (user) {
            userInfo.innerHTML = `Welcome, <strong>${user.username}</strong>!`;
        } else {
            userInfo.innerHTML = 'Welcome to Bookify!';
        }
    }

    // Attach event listeners
    const loginForm = document.querySelector('form[action="admin-books.html"]');
    if (loginForm) {
        loginForm.onsubmit = validateLogin;
    }

    const signupForm = document.querySelector('form[action="books.html"]');
    if (signupForm) {
        signupForm.onsubmit = validateSignup;
    }

    const searchForm = document.querySelector('form');
    if (searchForm && document.getElementById('searchInput')) {
        searchForm.onsubmit = performSearch;
    }

    // Load data for specific pages
    if (window.location.pathname.includes('books.html') && !window.location.pathname.includes('book')) {
        loadBooks();
    }

    if (window.location.pathname.includes('borrowed.html')) {
        loadBorrowedBooks();
    }

    // For book detail pages
    const path = window.location.pathname;
    const match = path.match(/book(\d+)\.html/);
    if (match) {
        loadBookDetails(parseInt(match[1]));
    }

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