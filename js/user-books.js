/* global getCurrentUser, ITEMS_PER_PAGE, paginate, renderPagination, apiFetch, apiSyncBooks, normalizeBooks, showAlert, showConfirm */

function renderCoverThumb(url, alt) {
    var src = url || 'https://placehold.co/150x200/e2e8f0/64748b?text=Book';
    return (
        '<img src="' +
        src +
        '" alt="' +
        alt +
        '" style="width:40px;height:56px;object-fit:cover;border-radius:4px;display:block" />'
    );
}

function renderEmptyRow(colspan, message) {
    return (
        '<tr><td colspan="' +
        colspan +
        '" style="text-align:center;color:var(--text3);padding:40px 16px;font-size:14px">' +
        message +
        '</td></tr>'
    );
}

function renderBookRow(book, showCover) {
    var cover = showCover
        ? '<td style="vertical-align:middle">' + renderCoverThumb(book.coverUrl, book.title) + '</td>'
        : '';
    return (
        '<tr>' +
        cover +
        '<td class="td-primary"><a href="detail.html?id=' +
        book.id +
        '" class="action-link">' +
        book.title +
        '</a></td>' +
        '<td class="td-muted">' +
        book.author +
        '</td>' +
        '<td><span class="category-badge">' +
        book.category +
        '</span></td>' +
        '<td>' +
        (book.available
            ? '<span class="td-primary">Available</span> <button onclick="borrowBook(' +
              book.id +
              ')" class="btn btn-primary btn-sm">Borrow</button>'
            : '<span class="warning-text">Borrowed</span>') +
        '</td></tr>'
    );
}

function getLoginPath() {
    var depth = window.location.pathname.split('/').filter(Boolean).length - 1;
    return depth > 0 ? '../'.repeat(depth) + 'login.html' : 'login.html';
}

function borrowBook(bookId) {
    var user = getCurrentUser();
    if (!user) {
        showAlert('Please log in to borrow books.');
        window.location.href = getLoginPath();
        return;
    }
    apiFetch('/books/' + bookId + '/borrow/', { method: 'POST' })
        .then(function () {
            return apiSyncBooks();
        })
        .then(function () {
            location.reload();
        })
        .catch(function () {
            var books = JSON.parse(localStorage.getItem('books'));
            var book = books.find(function (b) {
                return b.id == bookId;
            });
            if (!book || !book.available) {
                showAlert('Book is not available.');
                return;
            }
            var dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14);
            book.available = false;
            book.borrowedBy = user.id;
            book.dueDate = dueDate.toISOString().split('T')[0];
            localStorage.setItem('books', JSON.stringify(books));
            showAlert('Book borrowed successfully. Due: ' + book.dueDate);
            location.reload();
        });
}

function returnBook(bookId) {
    var user = getCurrentUser();
    if (!user) {
        showAlert('Please log in.');
        window.location.href = getLoginPath();
        return;
    }
    showConfirm('Return this book?', function () {
        apiFetch('/books/' + bookId + '/return/', { method: 'POST' })
            .then(function () {
                return apiSyncBooks();
            })
            .then(function () {
                location.reload();
            })
            .catch(function () {
                var books = JSON.parse(localStorage.getItem('books'));
                var book = books.find(function (b) {
                    return b.id == bookId;
                });
                if (book) {
                    book.available = true;
                    book.borrowedBy = null;
                    book.dueDate = null;
                    localStorage.setItem('books', JSON.stringify(books));
                    location.reload();
                }
            });
    });
}

var catalogPage = 1;

function loadBooks(page) {
    if (page) catalogPage = page;
    var books = JSON.parse(localStorage.getItem('books'));
    var tbody = document.querySelector('.data-table tbody');
    var paginationEl = document.getElementById('catalog-pagination');
    var count = document.getElementById('book-count');
    if (!tbody) return;
    if (count) count.textContent = books.length;
    if (!books.length) {
        tbody.innerHTML = renderEmptyRow(5, 'No books in the library yet.');
        if (paginationEl) paginationEl.innerHTML = '';
        return;
    }
    var totalPages = Math.ceil(books.length / ITEMS_PER_PAGE) || 1;
    if (catalogPage > totalPages) catalogPage = totalPages;
    var pageItems = paginate(books, catalogPage);
    tbody.innerHTML = '';
    pageItems.forEach(function (book) {
        tbody.innerHTML += renderBookRow(book, true);
    });
    if (paginationEl) paginationEl.innerHTML = renderPagination(catalogPage, totalPages, 'loadBooks');
}

function loadBorrowedBooks() {
    var user = getCurrentUser();
    if (!user) {
        window.location.href = getLoginPath();
        return;
    }
    var books = JSON.parse(localStorage.getItem('books'));
    var borrowedBooks = books.filter(function (b) {
        return b.borrowedBy == user.id;
    });
    var tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;
    if (!borrowedBooks.length) {
        tbody.innerHTML = renderEmptyRow(6, 'You have no borrowed books.');
        return;
    }
    tbody.innerHTML = '';
    borrowedBooks.forEach(function (book) {
        var cover = '<td style="vertical-align:middle">' + renderCoverThumb(book.coverUrl, book.title) + '</td>';
        tbody.innerHTML +=
            '<tr>' +
            cover +
            '<td class="td-primary"><a href="detail.html?id=' +
            book.id +
            '" class="action-link">' +
            book.title +
            '</a></td>' +
            '<td class="td-muted">' +
            book.author +
            '</td>' +
            '<td><span class="category-badge">' +
            book.category +
            '</span></td>' +
            '<td class="warning-text">' +
            (book.dueDate ? 'Due: ' + book.dueDate : 'Borrowed') +
            '</td>' +
            '<td><button onclick="returnBook(' +
            book.id +
            ')" class="btn btn-primary btn-sm">Return</button></td>' +
            '</tr>';
    });
}

function loadDashboard() {
    var user = getCurrentUser();
    if (!user) return;
    var books = JSON.parse(localStorage.getItem('books'));
    var borrowed = books.filter(function (b) {
        return b.borrowedBy == user.id;
    });
    var borrowedIds = borrowed.map(function (b) {
        return b.id;
    });
    var available = books.filter(function (b) {
        return borrowedIds.indexOf(b.id) === -1 && b.available;
    });
    var borrowedGrid = document.getElementById('borrowed-grid');
    var availableGrid = document.getElementById('available-grid');
    var borrowedCount = document.getElementById('borrowed-count');
    var availableCount = document.getElementById('available-count');
    if (!borrowedGrid || !availableGrid) return;
    if (borrowedCount) borrowedCount.textContent = borrowed.length;
    if (availableCount) availableCount.textContent = available.length;
    if (borrowed.length) {
        borrowedGrid.innerHTML = borrowed
            .map(function (book) {
                return (
                    '<div class="book-card"><img src="' +
                    (book.coverUrl || 'https://placehold.co/150x200/e2e8f0/64748b?text=Book') +
                    '" alt="' +
                    book.title +
                    '" loading="lazy"><div class="book-card-body"><h3><a href="detail.html?id=' +
                    book.id +
                    '">' +
                    book.title +
                    '</a></h3><p class="td-muted">' +
                    book.author +
                    '</p><span class="due-badge">Due: ' +
                    (book.dueDate || 'N/A') +
                    '</span></div><div class="book-card-actions"><button onclick="returnBook(' +
                    book.id +
                    ')" class="btn btn-primary btn-sm">Return</button></div></div>'
                );
            })
            .join('');
    } else {
        borrowedGrid.innerHTML =
            '<p class="td-muted" style="grid-column:1/-1;text-align:center;padding:40px">No borrowed books yet. Browse the catalog to borrow!</p>';
    }
    if (available.length) {
        availableGrid.innerHTML = available
            .map(function (book) {
                return (
                    '<div class="book-card"><img src="' +
                    (book.coverUrl || 'https://placehold.co/150x200/e2e8f0/64748b?text=Book') +
                    '" alt="' +
                    book.title +
                    '" loading="lazy"><div class="book-card-body"><h3><a href="detail.html?id=' +
                    book.id +
                    '">' +
                    book.title +
                    '</a></h3><p class="td-muted">' +
                    book.author +
                    ' &middot; <span class="category-badge">' +
                    book.category +
                    '</span></p><div class="book-card-actions"><button onclick="borrowBook(' +
                    book.id +
                    ')" class="btn btn-primary btn-sm">Borrow</button></div></div></div>'
                );
            })
            .join('');
    } else {
        availableGrid.innerHTML =
            '<p class="td-muted" style="grid-column:1/-1;text-align:center;padding:40px">No books available right now.</p>';
    }
}

function loadBookDetails(bookId) {
    var books = JSON.parse(localStorage.getItem('books'));
    var book = books.find(function (b) {
        return b.id == bookId;
    });
    if (!book) {
        var container = document.querySelector('.content-card');
        if (container)
            container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text3)">Book not found.</p>';
        return;
    }
    var img = document.getElementById('book-cover-img');
    if (img) {
        img.src = book.coverUrl || 'https://placehold.co/150x200/e2e8f0/64748b?text=Book';
        img.alt = book.title;
        img.style.display = 'block';
        var skel = img.previousElementSibling;
        if (skel && skel.classList.contains('skeleton')) skel.style.display = 'none';
    }
    var legend = document.querySelector('.form-legend');
    if (legend) legend.textContent = book.title;
    var authorEl = document.getElementById('book-author');
    if (authorEl) {
        authorEl.textContent = book.author;
        var sk1 = authorEl.querySelector('.skeleton');
        if (sk1) sk1.style.display = 'none';
    }
    var badge = document.getElementById('book-category');
    if (badge) {
        badge.textContent = book.category;
        var sk2 = badge.querySelector('.skeleton');
        if (sk2) sk2.style.display = 'none';
    }
    var status = document.getElementById('book-status');
    if (status) {
        status.textContent = book.available ? 'Available' : 'Borrowed';
        status.className = book.available ? 'td-primary' : 'warning-text';
        var sk3 = status.querySelector('.skeleton');
        if (sk3) sk3.style.display = 'none';
    }
    var desc = document.getElementById('book-description');
    if (desc) {
        desc.textContent = book.description;
        desc.querySelectorAll('.skeleton').forEach(function (s) {
            s.style.display = 'none';
        });
    }
    var borrowBtn = document.getElementById('borrow-btn');
    if (borrowBtn) {
        borrowBtn.disabled = !book.available;
        borrowBtn.textContent = book.available ? 'Borrow Book' : 'Book Not Available';
        borrowBtn.className = book.available ? 'btn btn-primary' : 'btn btn-secondary';
        if (book.available)
            borrowBtn.onclick = function () {
                borrowBook(bookId);
            };
        var sk = borrowBtn.querySelector('.skeleton');
        if (sk) sk.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('catalog.html')) loadBooks();
    if (window.location.pathname.includes('borrowed.html')) loadBorrowedBooks();
    if (window.location.pathname.includes('dashboard.html')) loadDashboard();
    var urlParams = new URLSearchParams(window.location.search);
    var detailId = urlParams.get('id');
    if (detailId) {
        loadBookDetails(parseInt(detailId));
        return;
    }
    var path = window.location.pathname;
    var match = path.match(/book(\d+)\.html/);
    if (match) loadBookDetails(parseInt(match[1]));
});
