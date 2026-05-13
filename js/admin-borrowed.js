/* global apiFetch, ITEMS_PER_PAGE, paginate, renderPagination, showAlert, showConfirm */

var borrowedPage = 1;

function loadBorrowed(page) {
    if (page) borrowedPage = page;
    apiFetch('/borrowed/')
        .then(function (books) {
            renderBorrowedTable(books);
        })
        .catch(function () {
            var all = JSON.parse(localStorage.getItem('books') || '[]');
            var borrowed = all.filter(function (b) {
                return !b.available;
            });
            renderBorrowedTable(borrowed);
        });
}

function renderBorrowedTable(books) {
    var tbody = document.getElementById('borrowed-tbody');
    var paginationEl = document.getElementById('borrowed-pagination');
    var countEl = document.getElementById('borrowed-count');
    if (!tbody) return;
    var users = JSON.parse(localStorage.getItem('users') || '[]');
    if (countEl) countEl.textContent = books.length;
    if (!books.length) {
        tbody.innerHTML =
            '<tr><td colspan="6" style="text-align:center;padding:40px 16px;color:var(--text3);font-size:14px">No books are currently borrowed.</td></tr>';
        if (paginationEl) paginationEl.innerHTML = '';
        return;
    }
    var totalPages = Math.ceil(books.length / ITEMS_PER_PAGE) || 1;
    if (borrowedPage > totalPages) borrowedPage = totalPages;
    var pageItems = paginate(books, borrowedPage);
    tbody.innerHTML = '';
    pageItems.forEach(function (book) {
        var user = users.find(function (u) {
            return u.id == (book.borrowed_by || book.borrowedBy);
        });
        var username = (user && user.username) || book.borrowed_by_username || 'Unknown';
        var coverUrl = book.coverUrl || book.cover_url || 'https://placehold.co/150x200/e2e8f0/64748b?text=Book';
        var dueDate = book.due_date || book.dueDate || '';
        tbody.innerHTML +=
            '<tr>' +
            '<td style="vertical-align:middle"><img src="' +
            coverUrl +
            '" alt="' +
            book.title +
            '" style="width:40px;height:56px;object-fit:cover;border-radius:4px" /></td>' +
            '<td class="td-primary">' +
            book.title +
            '</td>' +
            '<td class="td-muted">' +
            book.author +
            '</td>' +
            '<td>' +
            username +
            '</td>' +
            '<td>' +
            (dueDate || '-') +
            '</td>' +
            '<td><button onclick="adminReturnBook(' +
            book.id +
            ')" class="btn btn-primary" style="padding:6px 14px;font-size:11px">Mark Returned</button></td>' +
            '</tr>';
    });
    if (paginationEl) paginationEl.innerHTML = renderPagination(borrowedPage, totalPages, 'loadBorrowed');
}

function adminReturnBook(bookId) {
    showConfirm('Mark this book as returned?', function () {
        apiFetch('/books/' + bookId + '/return/', { method: 'POST' })
            .then(function () {
                showAlert('Book marked as returned.');
                loadBorrowed();
            })
            .catch(function () {
                var books = JSON.parse(localStorage.getItem('books') || '[]');
                var book = books.find(function (b) {
                    return b.id == bookId;
                });
                if (book) {
                    book.available = true;
                    book.borrowedBy = null;
                    book.dueDate = null;
                    localStorage.setItem('books', JSON.stringify(books));
                    showAlert('Book marked as returned.');
                    loadBorrowed();
                }
            });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    loadBorrowed();
});
