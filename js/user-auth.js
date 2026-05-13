/* global getCurrentUser, initializeData, logout, handleScroll, apiFetch, syncFromApi */

function validateLogin(e) {
    if (e) e.preventDefault();
    var username = document.getElementById('us').value.trim();
    var password = document.getElementById('pw').value.trim();
    if (!username || !password) {
        alert('Username and password are required.');
        return false;
    }
    apiFetch('/auth/login/', { method: 'POST', body: JSON.stringify({ username: username, password: password }) })
        .then(function (data) {
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('currentUser', data.user.id);
            localStorage.setItem('currentUserData', JSON.stringify(data.user));
            window.location.href = data.user.is_admin ? '../admin/catalog.html' : 'dashboard.html';
        })
        .catch(function () {
            var users = JSON.parse(localStorage.getItem('users') || '[]');
            var user = users.find(function (u) {
                return u.username === username && u.password === password;
            });
            if (user) {
                localStorage.setItem('currentUser', user.id);
                window.location.href = user.isAdmin ? '../admin/catalog.html' : 'dashboard.html';
            } else {
                alert('Invalid credentials.');
            }
        });
    return false;
}

function validateSignup(e) {
    if (e) e.preventDefault();
    var username = document.getElementById('us').value.trim();
    var password = document.getElementById('pw').value.trim();
    var confirmPassword = document.getElementById('cpw').value.trim();
    var email = document.getElementById('e').value.trim();
    if (!username || !password || !confirmPassword || !email) {
        alert('All fields are required.');
        return false;
    }
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return false;
    }
    apiFetch('/auth/signup/', {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password,
            password_confirm: confirmPassword,
            email: email
        })
    })
        .then(function (data) {
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('currentUser', data.user.id);
            localStorage.setItem('currentUserData', JSON.stringify(data.user));
            window.location.href = 'dashboard.html';
        })
        .catch(function () {
            var users = JSON.parse(localStorage.getItem('users') || '[]');
            if (
                users.some(function (u) {
                    return u.username === username || u.email === email;
                })
            ) {
                alert('Username or email already exists.');
                return;
            }
            var newUser = {
                id: users.length + 1,
                username: username,
                password: password,
                email: email,
                isAdmin: false,
                isSuperuser: false,
                borrowedBooks: []
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', newUser.id);
            window.location.href = 'dashboard.html';
        });
    return false;
}

function checkLoginStatus() {
    var user = getCurrentUser();
    var path = window.location.pathname;
    var isProtected = path.includes('dashboard.html') || path.includes('borrowed.html');
    if (!user && isProtected) window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function () {
    initializeData();
    checkLoginStatus();
    var user = getCurrentUser();
    var userInfo = document.getElementById('user-nav-info');
    if (userInfo) userInfo.innerHTML = user ? '<span class="nav-user-icon">👤</span>' + user.username : '';
    var loginForm = document.querySelector('form[action="login"]');
    if (loginForm) loginForm.addEventListener('submit', validateLogin);
    var signupForm = document.querySelector('form[action="books.html"]');
    if (signupForm) signupForm.addEventListener('submit', validateSignup);
    var logoutLink = document.getElementById('logout-link');
    if (logoutLink)
        logoutLink.onclick = function (e) {
            e.preventDefault();
            logout();
        };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    syncFromApi();
});
