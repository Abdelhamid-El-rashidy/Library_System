/* global ITEMS_PER_PAGE, paginate, renderPagination, apiFetch, apiSyncBooks */

var adminCatalogPage = 1;

function loadAdminBooks(page) {
    if (page) adminCatalogPage = page;
    var books = JSON.parse(localStorage.getItem('books'));
    var grid = document.getElementById('admin-book-grid');
    var count = document.getElementById('admin-book-count');
    var paginationEl = document.getElementById('admin-catalog-pagination');
    if (!grid) return;
    if (count) count.textContent = books.length;
    grid.innerHTML = '';
    if (!books.length) {
        grid.innerHTML =
            '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text3)"><div style="font-size:40px;margin-bottom:12px">📚</div><p style="font-size:16px;font-weight:600;margin:0 0 4px">No books yet</p><p style="font-size:14px;margin:0">Add your first book to get started.</p></div>';
        if (paginationEl) paginationEl.innerHTML = '';
        return;
    }
    var totalPages = Math.ceil(books.length / ITEMS_PER_PAGE) || 1;
    if (adminCatalogPage > totalPages) adminCatalogPage = totalPages;
    var pageItems = paginate(books, adminCatalogPage);
    pageItems.forEach(function (book) {
        var card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML =
            '<img src="' +
            (book.coverUrl || 'https://placehold.co/150x200/e2e8f0/64748b?text=Book') +
            '" alt="' +
            book.title +
            '" loading="lazy"><div class="book-card-body"><h3>' +
            book.title +
            '</h3><p class="td-muted">' +
            book.author +
            '</p><p style="margin:4px 0 10px"><span class="category-badge">' +
            book.category +
            '</span> <span class="' +
            (book.available ? 'td-primary' : 'warning-text') +
            '" style="font-size:12px;margin-left:6px">' +
            (book.available ? 'Available' : 'Borrowed') +
            '</span></p><div style="display:flex;gap:6px"><a href="book-edit.html?id=' +
            book.id +
            '" class="btn btn-primary" style="padding:6px 14px;font-size:11px;flex:1;justify-content:center">Edit</a><a href="#" class="btn btn-danger" style="padding:6px 14px;font-size:11px;flex:1;justify-content:center" onclick="deleteBook(' +
            book.id +
            ')">Delete</a></div></div>';
        grid.appendChild(card);
    });
    if (paginationEl) paginationEl.innerHTML = renderPagination(adminCatalogPage, totalPages, 'goToAdminPage');
}

function goToAdminPage(page) {
    loadAdminBooks(page);
}

function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book? This cannot be undone.')) return;
    apiFetch('/books/' + bookId + '/', { method: 'DELETE' })
        .then(function () {
            return apiSyncBooks();
        })
        .then(function () {
            alert('Book deleted successfully.');
            loadAdminBooks();
        })
        .catch(function () {
            var books = JSON.parse(localStorage.getItem('books'));
            var bookIndex = books.findIndex(function (b) {
                return b.id == bookId;
            });
            if (bookIndex !== -1) {
                books.splice(bookIndex, 1);
                localStorage.setItem('books', JSON.stringify(books));
                alert('Book deleted successfully.');
                loadAdminBooks();
            }
        });
}

function validateAddBook(e) {
    if (e) e.preventDefault();
    var title = document.getElementById('title').value.trim();
    var author = document.getElementById('author').value.trim();
    var category = document.getElementById('category').value;
    var description = document.getElementById('description').value.trim();
    if (!title || !author || !category) {
        alert('Title, author, and category are required.');
        return false;
    }
    var coverData = document.getElementById('cover-data');
    var coverUrl =
        coverData && coverData.value
            ? coverData.value
            : 'https://placehold.co/150x200/e2e8f0/64748b?text=' + encodeURIComponent(title);
    var body = JSON.stringify({
        title: title,
        author: author,
        category: category,
        description: description || '',
        cover_url: coverUrl
    });
    apiFetch('/books/', { method: 'POST', body: body })
        .then(function () {
            return apiSyncBooks();
        })
        .then(function () {
            alert('Book added successfully.');
            window.location.href = 'catalog.html';
        })
        .catch(function () {
            var books = JSON.parse(localStorage.getItem('books'));
            var newBook = {
                id: books.length
                    ? Math.max.apply(
                          Math,
                          books.map(function (b) {
                              return b.id;
                          })
                      ) + 1
                    : 1,
                title: title,
                author: author,
                category: category,
                available: true,
                description: description || '',
                coverUrl: coverUrl
            };
            books.push(newBook);
            localStorage.setItem('books', JSON.stringify(books));
            alert('Book added successfully.');
            window.location.href = 'catalog.html';
        });
    return false;
}

function loadEditBookData() {
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');
    if (!id) return;
    var books = JSON.parse(localStorage.getItem('books'));
    var book = books.find(function (b) {
        return b.id == id;
    });
    if (book) {
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('isbn').value = book.id;
        document.getElementById('category').value = book.category;
        document.getElementById('description').value = book.description || '';
        var preview = document.getElementById('cover-preview');
        if (preview) {
            if (book.coverUrl && !book.coverUrl.includes('placehold.co')) {
                preview.innerHTML = '<img src="' + book.coverUrl + '" alt="Current cover" />';
            } else {
                preview.innerHTML = '<div class="cover-placeholder">No cover</div>';
            }
        }
    }
}

function validateEditBook(e) {
    if (e) e.preventDefault();
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');
    if (!id) {
        alert('No book selected.');
        return false;
    }
    var title = document.getElementById('title').value.trim();
    var author = document.getElementById('author').value.trim();
    var category = document.getElementById('category').value;
    var description = document.getElementById('description').value.trim();
    if (!title || !author || !category) {
        alert('Title, author, and category are required.');
        return false;
    }
    var coverData = document.getElementById('cover-data');
    var body = JSON.stringify({
        title: title,
        author: author,
        category: category,
        description: description || ''
    });
    apiFetch('/books/' + id + '/', { method: 'PUT', body: body })
        .then(function (data) {
            if (coverData && coverData.value) {
                return apiFetch('/books/' + id + '/', {
                    method: 'PATCH',
                    body: JSON.stringify({ cover_url: coverData.value })
                });
            }
            return data;
        })
        .then(function () {
            return apiSyncBooks();
        })
        .then(function () {
            alert('Book updated successfully.');
            window.location.href = 'catalog.html';
        })
        .catch(function () {
            var books = JSON.parse(localStorage.getItem('books'));
            var bookIndex = books.findIndex(function (b) {
                return b.id == id;
            });
            if (bookIndex !== -1) {
                books[bookIndex].title = title;
                books[bookIndex].author = author;
                books[bookIndex].category = category;
                books[bookIndex].description = description || '';
                if (coverData && coverData.value) books[bookIndex].coverUrl = coverData.value;
                localStorage.setItem('books', JSON.stringify(books));
                alert('Book updated successfully.');
                window.location.href = 'catalog.html';
            }
        });
    return false;
}

document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('catalog.html')) loadAdminBooks();
    if (window.location.pathname.includes('book-edit.html')) loadEditBookData();
    var form = document.querySelector('form');
    if (form) {
        if (window.location.pathname.includes('book-add.html')) {
            form.addEventListener('submit', validateAddBook);
        } else if (window.location.pathname.includes('book-edit.html')) {
            form.addEventListener('submit', validateEditBook);
        }
    }
});
