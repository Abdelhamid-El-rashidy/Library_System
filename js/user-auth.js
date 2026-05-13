/* global getCurrentUser, initializeData, logout, handleScroll, apiFetch, syncFromApi, showAlert */

function getLoginPath() {
    var depth = window.location.pathname.split('/').filter(Boolean).length - 1;
    return depth > 0 ? '../'.repeat(depth) + 'login.html' : 'login.html';
}

function validateLogin(e) {
    if (e) e.preventDefault();
    var username = document.getElementById('us').value.trim();
    var password = document.getElementById('pw').value.trim();
    if (!username || !password) {
        showAlert('Username and password are required.');
        return false;
    }
    apiFetch('/auth/login/', { method: 'POST', body: JSON.stringify({ username: username, password: password }) })
        .then(function (data) {
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('currentUser', data.user.id);
            localStorage.setItem('currentUserData', JSON.stringify(data.user));
            window.location.href = data.user.is_admin ? 'admin/catalog.html' : 'user/dashboard.html';
        })
        .catch(function () {
            var users = JSON.parse(localStorage.getItem('users') || '[]');
            var user = users.find(function (u) {
                return u.username === username && u.password === password;
            });
            if (user) {
                localStorage.setItem('currentUser', user.id);
                window.location.href = user.isAdmin ? 'admin/catalog.html' : 'user/dashboard.html';
            } else {
                showAlert('Invalid credentials.');
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
    var isAdmin = document.getElementById('is_admin') && document.getElementById('is_admin').checked;
    if (!username || !password || !confirmPassword || !email) {
        showAlert('All fields are required.');
        return false;
    }
    if (password !== confirmPassword) {
        showAlert('Passwords do not match.');
        return false;
    }
    var body = {
        username: username,
        password: password,
        password_confirm: confirmPassword,
        email: email
    };
    if (isAdmin) body.is_admin = true;
    apiFetch('/auth/signup/', {
        method: 'POST',
        body: JSON.stringify(body)
    })
        .then(function (data) {
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('currentUser', data.user.id);
            localStorage.setItem('currentUserData', JSON.stringify(data.user));
            window.location.href = data.user.is_admin ? 'admin/catalog.html' : 'user/dashboard.html';
        })
        .catch(function () {
            var users = JSON.parse(localStorage.getItem('users') || '[]');
            if (
                users.some(function (u) {
                    return u.username === username || u.email === email;
                })
            ) {
                showAlert('Username or email already exists.');
                return;
            }
            var newUser = {
                id: users.length + 1,
                username: username,
                password: password,
                email: email,
                isAdmin: !!isAdmin,
                isSuperuser: false
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', newUser.id);
            localStorage.setItem('currentUserData', JSON.stringify(newUser));
            window.location.href = newUser.isAdmin ? 'admin/catalog.html' : 'user/dashboard.html';
        });
    return false;
}

function checkLoginStatus() {
    var user = getCurrentUser();
    if (!user) window.location.href = getLoginPath();
}

document.addEventListener('DOMContentLoaded', function () {
    initializeData();
    checkLoginStatus();
    var user = getCurrentUser();
    var userInfo = document.getElementById('user-nav-info');
    if (userInfo) userInfo.innerHTML = user ? '<span class="nav-user-icon">👤</span>' + user.username : '';
    var loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', validateLogin);
    var signupForm = document.getElementById('signupForm');
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
