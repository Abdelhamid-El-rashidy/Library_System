const API_BASE = 'http://localhost:8000/api';

function getAuthToken() {
    return localStorage.getItem('accessToken');
}

function getRefreshToken() {
    return localStorage.getItem('refreshToken');
}

function getApiHeaders() {
    var headers = { 'Content-Type': 'application/json' };
    var token = getAuthToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    return headers;
}

async function refreshAuthToken() {
    var refresh = getRefreshToken();
    if (!refresh) return false;
    try {
        var res = await fetch(API_BASE + '/auth/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refresh })
        });
        if (!res.ok) return false;
        var data = await res.json();
        localStorage.setItem('accessToken', data.access);
        return true;
    } catch {
        return false;
    }
}

async function apiFetch(url, opts) {
    opts = opts || {};
    var attemptRefresh = opts._retry === undefined;
    var res = await fetch(API_BASE + url, {
        method: opts.method || 'GET',
        headers: Object.assign(getApiHeaders(), opts.headers || {}),
        body: opts.body || undefined
    });
    if (res.status === 401 && attemptRefresh) {
        var refreshed = await refreshAuthToken();
        if (refreshed) {
            opts._retry = true;
            return apiFetch(url, opts);
        }
        logout();
        throw new Error('Session expired. Please log in again.');
    }
    var data = await res.json().catch(function () {
        return {};
    });
    if (!res.ok && !attemptRefresh) throw new Error(data.error || data.detail || 'Request failed');
    if (!res.ok) throw new Error(data.error || data.detail || 'Request failed');
    return data;
}

async function syncFromApi() {
    var token = getAuthToken();
    if (!token) return;
    try {
        var results = await Promise.all([apiFetch('/auth/me/'), apiFetch('/books/')]);
        var user = results[0],
            books = results[1];
        localStorage.setItem('currentUser', user.id);
        localStorage.setItem('currentUserData', JSON.stringify(user));
        localStorage.setItem('books', JSON.stringify(books));
    } catch {}
}

async function apiSyncBooks() {
    try {
        var books = await apiFetch('/books/');
        localStorage.setItem('books', JSON.stringify(books));
    } catch {}
}

function initializeData() {
    if (!localStorage.getItem('books')) {
        var books = [
            {
                id: 1,
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                category: 'Fiction',
                price: 10.99,
                available: true,
                borrowedBy: null,
                coverUrl: 'https://placehold.co/150x200/fff7ed/b45309?text=Great+Gatsby',
                description:
                    "The Great Gatsby is a 1925 tragedy novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with Jay Gatsby, a mysterious millionaire obsessed with reuniting with his former lover, Daisy Buchanan."
            },
            {
                id: 2,
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                category: 'Fiction',
                price: 12.99,
                available: false,
                borrowedBy: 1,
                dueDate: '2026-05-20',
                coverUrl: 'https://placehold.co/150x200/fff7ed/b45309?text=Mockingbird',
                description:
                    'To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.'
            },
            {
                id: 3,
                title: '1984',
                author: 'George Orwell',
                category: 'Dystopian',
                price: 15.99,
                available: true,
                borrowedBy: null,
                coverUrl: 'https://placehold.co/150x200/fff7ed/b45309?text=1984',
                description:
                    '1984 is a dystopian social science fiction novel and cautionary tale written by English writer George Orwell.'
            },
            {
                id: 4,
                title: 'The Catcher in the Rye',
                author: 'J.D. Salinger',
                category: 'Fiction',
                price: 14.99,
                available: true,
                borrowedBy: null,
                coverUrl: 'https://placehold.co/150x200/fff7ed/b45309?text=Catcher+Rye',
                description:
                    'The Catcher in the Rye is a novel by J. D. Salinger that was partially published in serial form in 1945-1946 and as a novel in 1951.'
            },
            {
                id: 5,
                title: 'The Hobbit',
                author: 'J.R.R. Tolkien',
                category: 'Fantasy',
                price: 16.99,
                available: false,
                borrowedBy: 1,
                dueDate: '2026-05-22',
                coverUrl: 'https://placehold.co/150x200/fff7ed/b45309?text=The+Hobbit',
                description:
                    "The Hobbit, or There and Back Again is a children's fantasy novel by English author J. R. R. Tolkien."
            },
            {
                id: 6,
                title: 'Pride and Prejudice',
                author: 'Jane Austen',
                category: 'Romance',
                price: 13.99,
                available: true,
                borrowedBy: null,
                coverUrl: 'https://placehold.co/150x200/fff7ed/b45309?text=Pride+Prejudice',
                description: 'Pride and Prejudice is an 1813 romantic novel of manners written by Jane Austen.'
            },
            {
                id: 7,
                title: 'The Lord of the Rings',
                author: 'J.R.R. Tolkien',
                category: 'Fantasy',
                price: 18.99,
                available: true,
                borrowedBy: null,
                coverUrl: 'https://placehold.co/150x200/fff7ed/b45309?text=LOTR',
                description:
                    'The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.'
            }
        ];
        localStorage.setItem('books', JSON.stringify(books));
    }
    if (!localStorage.getItem('users')) {
        var users = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                email: 'admin@bookify.com',
                isAdmin: true,
                isSuperuser: true,
                borrowedBooks: []
            },
            {
                id: 2,
                username: 'user1',
                password: 'pass1',
                email: 'user1@example.com',
                isAdmin: false,
                isSuperuser: false,
                borrowedBooks: [2, 5]
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    } else {
        var existingUsers = JSON.parse(localStorage.getItem('users'));
        if (
            !existingUsers.some(function (u) {
                return u.username === 'admin';
            })
        ) {
            existingUsers.push({
                id: existingUsers.length + 1,
                username: 'admin',
                password: 'admin123',
                email: 'admin@bookify.com',
                isAdmin: true,
                isSuperuser: true,
                borrowedBooks: []
            });
            localStorage.setItem('users', JSON.stringify(existingUsers));
        }
    }
    if (localStorage.getItem('currentUser') === null) {
        localStorage.setItem('currentUser', null);
    }
}

function getCurrentUser() {
    var data = localStorage.getItem('currentUserData');
    if (data) {
        var u = JSON.parse(data);
        if (u.is_admin !== undefined && u.isAdmin === undefined) {
            u.isAdmin = u.is_admin;
            u.isSuperuser = u.is_superuser;
        }
        return u;
    }
    var userId = localStorage.getItem('currentUser');
    if (userId) {
        var users = JSON.parse(localStorage.getItem('users') || '[]');
        var user = users.find(function (u) {
            return u.id == userId;
        });
        if (user) {
            localStorage.setItem('currentUserData', JSON.stringify(user));
            return user;
        }
    }
    return null;
}

function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUserData');
    var path =
        (document.getElementById('logout-link') && document.getElementById('logout-link').getAttribute('href')) ||
        'login.html';
    localStorage.setItem('currentUser', null);
    window.location.href = path;
}

function handleScroll() {
    var header = document.querySelector('header');
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 40);
}

function previewCover(input) {
    var preview = document.getElementById('cover-preview');
    var hidden = document.getElementById('cover-data');
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var dataUrl = e.target.result;
            if (hidden) hidden.value = dataUrl;
            if (preview) preview.innerHTML = '<img src="' + dataUrl + '" alt="Cover preview" />';
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        if (hidden) hidden.value = '';
        if (preview) preview.innerHTML = '<div class="cover-placeholder">No cover selected</div>';
    }
}

var ITEMS_PER_PAGE = 5;

function paginate(arr, page) {
    var start = (page - 1) * ITEMS_PER_PAGE;
    return arr.slice(start, start + ITEMS_PER_PAGE);
}

function renderPagination(currentPage, totalPages, goToPageFn) {
    if (totalPages <= 1) return '';
    var html = '<div class="pagination">';
    html +=
        '<button onclick="' +
        goToPageFn +
        '(' +
        (currentPage - 1) +
        ')"' +
        (currentPage <= 1 ? ' disabled' : '') +
        '>Prev</button>';
    for (var i = 1; i <= totalPages; i++) {
        html +=
            '<button onclick="' +
            goToPageFn +
            '(' +
            i +
            ')"' +
            (i === currentPage ? ' class="active"' : '') +
            '>' +
            i +
            '</button>';
    }
    html +=
        '<button onclick="' +
        goToPageFn +
        '(' +
        (currentPage + 1) +
        ')"' +
        (currentPage >= totalPages ? ' disabled' : '') +
        '>Next</button>';
    html += '<span class="page-info">Page ' + currentPage + ' of ' + totalPages + '</span>';
    html += '</div>';
    return html;
}
