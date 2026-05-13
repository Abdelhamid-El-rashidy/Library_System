/* global renderEmptyRow, renderBookRow, ITEMS_PER_PAGE, paginate, renderPagination */

var lastSearchResults = [];
var searchPage = 1;

function performSearch() {
    var searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    var searchBy = document.getElementById('searchBy').value;
    var availability = document.getElementById('filterAvailability').value;
    if (!searchTerm) {
        alert('Please enter a search term.');
        return false;
    }
    var books = JSON.parse(localStorage.getItem('books'));
    if (searchBy === 'All') {
        books = books.filter(function (b) {
            return (
                b.title.toLowerCase().includes(searchTerm) ||
                b.author.toLowerCase().includes(searchTerm) ||
                b.category.toLowerCase().includes(searchTerm)
            );
        });
    } else if (searchBy === 'Book') {
        books = books.filter(function (b) {
            return b.title.toLowerCase().includes(searchTerm);
        });
    } else if (searchBy === 'Author') {
        books = books.filter(function (b) {
            return b.author.toLowerCase().includes(searchTerm);
        });
    } else if (searchBy === 'Category') {
        books = books.filter(function (b) {
            return b.category.toLowerCase().includes(searchTerm);
        });
    }
    if (availability === 'available')
        books = books.filter(function (b) {
            return b.available;
        });
    else if (availability === 'borrowed')
        books = books.filter(function (b) {
            return !b.available;
        });
    lastSearchResults = books;
    searchPage = 1;
    displaySearchResults(1);
    return false;
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchBy').value = 'All';
    document.getElementById('filterAvailability').value = 'all';
    lastSearchResults = [];
    searchPage = 1;
    var tbody = document.querySelector('.data-table tbody');
    var paginationEl = document.getElementById('search-pagination');
    if (tbody) tbody.innerHTML = renderEmptyRow(5, 'Use the search form above to find books.');
    if (paginationEl) paginationEl.innerHTML = '';
}

function displaySearchResults(page) {
    if (page) searchPage = page;
    var tbody = document.querySelector('.data-table tbody');
    var paginationEl = document.getElementById('search-pagination');
    if (!tbody) return;
    if (!lastSearchResults.length) {
        tbody.innerHTML = renderEmptyRow(5, 'No books match your search.');
        if (paginationEl) paginationEl.innerHTML = '';
        return;
    }
    var totalPages = Math.ceil(lastSearchResults.length / ITEMS_PER_PAGE) || 1;
    if (searchPage > totalPages) searchPage = totalPages;
    var pageItems = paginate(lastSearchResults, searchPage);
    tbody.innerHTML = '';
    pageItems.forEach(function (book) {
        tbody.innerHTML += renderBookRow(book, true);
    });
    if (paginationEl) paginationEl.innerHTML = renderPagination(searchPage, totalPages, 'goToSearchPage');
}

function goToSearchPage(page) {
    displaySearchResults(page);
}

document.addEventListener('DOMContentLoaded', function () {
    var searchForm = document.querySelector('form');
    if (searchForm && document.getElementById('searchInput')) searchForm.onsubmit = performSearch;
    var clearBtn = document.querySelector('button[type="reset"]');
    if (clearBtn) clearBtn.onclick = clearSearch;
});
