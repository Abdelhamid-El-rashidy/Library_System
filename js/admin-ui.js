/* global getCurrentUser, initializeData, logout, handleScroll, apiSyncBooks */

function getLoginPath() {
    var depth = window.location.pathname.split('/').filter(Boolean).length - 1;
    return depth > 0 ? '../'.repeat(depth) + 'login.html' : 'login.html';
}

function checkAdmin() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = getLoginPath();
    } else if (!user.isAdmin) {
        window.location.href = '../user/dashboard.html';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initializeData();
    apiSyncBooks();
    checkAdmin();
    const user = getCurrentUser();
    const userInfo = document.getElementById('user-nav-info');
    if (userInfo) userInfo.innerHTML = user ? '<span class="nav-user-icon">👤</span>' + user.username : 'Admin Panel';

    const adminsLink = document.getElementById('nav-admins');
    if (adminsLink && user && user.isSuperuser) {
        adminsLink.classList.remove('nav-item--hidden');
    }

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink)
        logoutLink.onclick = e => {
            e.preventDefault();
            logout();
        };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
});
