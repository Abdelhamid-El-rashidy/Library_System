/* global getCurrentUser, initializeData, logout, handleScroll */

function checkAdmin() {
    const user = getCurrentUser();
    if (!user || !user.isAdmin) {
        window.location.href = '../user/dashboard.html';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initializeData();
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
