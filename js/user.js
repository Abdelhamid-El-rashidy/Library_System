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
    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', null);
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

function validateLogin() {
    const username = document.getElementById('us').value.trim();
    const password = document.getElementById('pw').value.trim();
    if (!username || !password) { alert('Username and password are required.'); return false; }
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', user.id);
        window.location.href = user.isAdmin ? '../admin/catalog.html' : 'dashboard.html';
        return false;
    } else {
        alert('Invalid credentials.');
        return false;
    }
}

function validateSignup() {
    const username = document.getElementById('us').value.trim();
    const password = document.getElementById('pw').value.trim();
    const confirmPassword = document.getElementById('cpw').value.trim();
    const email = document.getElementById('e').value.trim();
    if (!username || !password || !confirmPassword || !email) { alert('All fields are required.'); return false; }
    if (password !== confirmPassword) { alert('Passwords do not match.'); return false; }
    const users = JSON.parse(localStorage.getItem('users'));
    if (users.some(u => u.username === username || u.email === email)) { alert('Username or email already exists.'); return false; }
    const newUser = { id: users.length + 1, username, password, email, isAdmin: false, isSuperuser: false, borrowedBooks: [] };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', newUser.id);
    window.location.href = 'dashboard.html';
    return false;
}

function logout() {
    localStorage.setItem('currentUser', null);
    window.location.href = 'login.html';
}

function renderCoverThumb(url, alt) {
    const src = url || 'https://placehold.co/150x200/e2e8f0/64748b?text=Book';
    return '<img src="' + src + '" alt="' + alt + '" style="width:40px;height:56px;object-fit:cover;border-radius:4px;display:block" />';
}

function renderEmptyRow(colspan, message) {
    return '<tr><td colspan="' + colspan + '" style="text-align:center;color:var(--text3);padding:40px 16px;font-size:14px">' + message + '</td></tr>';
}

function renderBookRow(book, showCover) {
    const cover = showCover ? '<td style="vertical-align:middle">' + renderCoverThumb(book.coverUrl, book.title) + '</td>' : '';
    return '<tr>' + cover + '<td class="td-primary"><a href="books/book' + book.id + '.html" class="action-link">' + book.title + '</a></td>' +
        '<td class="td-muted">' + book.author + '</td>' +
        '<td><span class="category-badge">' + book.category + '</span></td>' +
        '<td class="td-primary">$' + book.price.toFixed(2) + '</td>' +
        '<td>' + (book.available ? '<span class="td-primary">Available</span> <button onclick="borrowBook(' + book.id + ')" class="btn btn-primary" style="padding:6px 14px;font-size:11px">Borrow</button>' : '<span class="warning-text">Borrowed</span>') + '</td></tr>';
}

function borrowBook(bookId) {
    const user = getCurrentUser();
    if (!user) { alert('Please log in to borrow books.'); window.location.href = 'login.html'; return; }
    const books = JSON.parse(localStorage.getItem('books'));
    const book = books.find(b => b.id == bookId);
    if (!book.available) { alert('Book is not available.'); return; }
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    book.available = false;
    book.borrowedBy = user.id;
    book.dueDate = dueDate.toISOString().split('T')[0];
    user.borrowedBooks.push(bookId);
    localStorage.setItem('books', JSON.stringify(books));
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.id == user.id);
    users[userIndex] = user;
    localStorage.setItem('users', JSON.stringify(users));
    alert('Book borrowed successfully. Due: ' + book.dueDate);
    location.reload();
}

function loadBooks() {
    const books = JSON.parse(localStorage.getItem('books'));
    const tbody = document.querySelector('.data-table tbody');
    const count = document.getElementById('book-count');
    if (!tbody) return;
    if (count) count.textContent = books.length;
    if (!books.length) {
        tbody.innerHTML = renderEmptyRow(6, 'No books in the library yet.');
        return;
    }
    tbody.innerHTML = '';
    books.forEach(book => {
        tbody.innerHTML += renderBookRow(book, true);
    });
}

function loadBorrowedBooks() {
    const user = getCurrentUser();
    if (!user) { window.location.href = 'login.html'; return; }
    const books = JSON.parse(localStorage.getItem('books'));
    const borrowedBooks = books.filter(b => user.borrowedBooks.includes(b.id));
    const tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;
    if (!borrowedBooks.length) {
        tbody.innerHTML = renderEmptyRow(5, 'You have no borrowed books.');
        return;
    }
    tbody.innerHTML = '';
    borrowedBooks.forEach(book => {
        const cover = '<td style="vertical-align:middle">' + renderCoverThumb(book.coverUrl, book.title) + '</td>';
        tbody.innerHTML += '<tr>' + cover + '<td class="td-primary"><a href="books/book' + book.id + '.html" class="action-link">' + book.title + '</a></td>' +
            '<td class="td-muted">' + book.author + '</td>' +
            '<td><span class="category-badge">' + book.category + '</span></td>' +
            '<td class="warning-text">' + (book.dueDate ? 'Due: ' + book.dueDate : 'Borrowed') + '</td></tr>';
    });
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const searchBy = document.getElementById('searchBy').value;
    const availability = document.getElementById('filterAvailability').value;
    if (!searchTerm) { alert('Please enter a search term.'); return false; }
    let books = JSON.parse(localStorage.getItem('books'));
    if (searchBy === 'All') {
        books = books.filter(b => b.title.toLowerCase().includes(searchTerm) || b.author.toLowerCase().includes(searchTerm) || b.category.toLowerCase().includes(searchTerm));
    } else if (searchBy === 'Book') {
        books = books.filter(b => b.title.toLowerCase().includes(searchTerm));
    } else if (searchBy === 'Author') {
        books = books.filter(b => b.author.toLowerCase().includes(searchTerm));
    } else if (searchBy === 'Category') {
        books = books.filter(b => b.category.toLowerCase().includes(searchTerm));
    }
    if (availability === 'available') books = books.filter(b => b.available);
    else if (availability === 'borrowed') books = books.filter(b => !b.available);
    displaySearchResults(books);
    return false;
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchBy').value = 'All';
    document.getElementById('filterAvailability').value = 'all';
    const tbody = document.querySelector('.data-table tbody');
    if (tbody) tbody.innerHTML = renderEmptyRow(6, 'Use the search form above to find books.');
}

function displaySearchResults(books) {
    const tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;
    if (!books.length) {
        tbody.innerHTML = renderEmptyRow(6, 'No books match your search.');
        return;
    }
    tbody.innerHTML = '';
    books.forEach(book => {
        tbody.innerHTML += renderBookRow(book, true);
    });
}

function loadDashboard() {
    const user = getCurrentUser();
    if (!user) return;
    const books = JSON.parse(localStorage.getItem('books'));
    const borrowed = books.filter(b => user.borrowedBooks.includes(b.id));
    const available = books.filter(b => b.available);
    const borrowedGrid = document.getElementById('borrowed-grid');
    const availableGrid = document.getElementById('available-grid');
    const borrowedCount = document.getElementById('borrowed-count');
    const availableCount = document.getElementById('available-count');
    if (!borrowedGrid || !availableGrid) return;
    if (borrowedCount) borrowedCount.textContent = borrowed.length;
    if (availableCount) availableCount.textContent = available.length;
    if (borrowed.length) {
        borrowedGrid.innerHTML = borrowed.map(book => '<div class="book-card"><img src="' + (book.coverUrl || 'https://placehold.co/150x200/e2e8f0/64748b?text=Book') + '" alt="' + book.title + '" loading="lazy"><div class="book-card-body"><h3><a href="books/book' + book.id + '.html">' + book.title + '</a></h3><p class="td-muted">' + book.author + '</p><span class="due-badge">Due: ' + (book.dueDate || 'N/A') + '</span></div></div>').join('');
    } else {
        borrowedGrid.innerHTML = '<p class="td-muted" style="grid-column:1/-1;text-align:center;padding:40px">No borrowed books yet. Browse the catalog to borrow!</p>';
    }
    if (available.length) {
        availableGrid.innerHTML = available.map(book => '<div class="book-card"><img src="' + (book.coverUrl || 'https://placehold.co/150x200/e2e8f0/64748b?text=Book') + '" alt="' + book.title + '" loading="lazy"><div class="book-card-body"><h3><a href="books/book' + book.id + '.html">' + book.title + '</a></h3><p class="td-muted">' + book.author + ' &middot; <span class="category-badge">' + book.category + '</span></p><button onclick="borrowBook(' + book.id + ')" class="btn btn-primary" style="padding:6px 14px;font-size:11px">Borrow</button></div></div>').join('');
    } else {
        availableGrid.innerHTML = '<p class="td-muted" style="grid-column:1/-1;text-align:center;padding:40px">No books available right now.</p>';
    }
}

function loadBookDetails(bookId) {
    const books = JSON.parse(localStorage.getItem('books'));
    const book = books.find(b => b.id == bookId);
    if (!book) {
        const container = document.querySelector('.content-card');
        if (container) container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text3)">Book not found.</p>';
        return;
    }
    const img = document.getElementById('book-cover-img');
    if (img) {
        img.src = book.coverUrl || 'https://placehold.co/150x200/e2e8f0/64748b?text=Book';
        img.alt = book.title;
    }
    const legend = document.querySelector('.form-legend');
    if (legend) legend.textContent = book.title;
    const tdMuted = document.getElementById('book-author');
    if (tdMuted) tdMuted.textContent = book.author;
    const badge = document.getElementById('book-category');
    if (badge) badge.textContent = book.category;
    const status = document.getElementById('book-status');
    if (status) {
        status.textContent = book.available ? 'Available' : 'Borrowed';
        status.className = book.available ? 'td-primary' : 'warning-text';
    }
    const desc = document.getElementById('book-description');
    if (desc) desc.textContent = book.description;
    const borrowBtn = document.getElementById('borrow-btn');
    if (borrowBtn) {
        borrowBtn.disabled = !book.available;
        borrowBtn.textContent = book.available ? 'Borrow Book' : 'Book Not Available';
        borrowBtn.className = book.available ? 'btn btn-primary' : 'btn btn-secondary';
        if (book.available) borrowBtn.onclick = function() { borrowBook(bookId); };
    }
}

function checkLoginStatus() {
    const user = getCurrentUser();
    const path = window.location.pathname;
    const isProtected = path.includes('dashboard.html') || path.includes('borrowed.html');
    if (!user && isProtected) window.location.href = 'login.html';
}

function handleScroll() {
    const header = document.querySelector('header');
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 40);
}

document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    checkLoginStatus();
    const user = getCurrentUser();
    const userInfo = document.getElementById('user-nav-info');
    if (userInfo) userInfo.innerHTML = user ? '<span class="nav-user-icon">👤</span>' + user.username : '';
    const loginForm = document.querySelector('form[action="login"]');
    if (loginForm) loginForm.onsubmit = validateLogin;
    const signupForm = document.querySelector('form[action="books.html"]');
    if (signupForm) signupForm.onsubmit = validateSignup;
    const searchForm = document.querySelector('form');
    if (searchForm && document.getElementById('searchInput')) searchForm.onsubmit = performSearch;
    const clearBtn = document.querySelector('button[type="reset"]');
    if (clearBtn) clearBtn.onclick = clearSearch;
    if (window.location.pathname.includes('catalog.html')) loadBooks();
    if (window.location.pathname.includes('borrowed.html')) loadBorrowedBooks();
    if (window.location.pathname.includes('dashboard.html')) loadDashboard();
    const path = window.location.pathname;
    const match = path.match(/book(\d+)\.html/);
    if (match) loadBookDetails(parseInt(match[1]));
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) logoutLink.onclick = function(e) { e.preventDefault(); logout(); };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
});
