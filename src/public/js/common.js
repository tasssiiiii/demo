function showMessage(container, message, type) {
    const div = document.createElement('div');
    div.className = `alert alert-${type}`;
    div.textContent = message;
    container.prepend(div);
    setTimeout(() => div.remove(), 3000);
}

function setAuth(userId) {
    localStorage.setItem('userId', userId);
}

function getAuth() {
    return localStorage.getItem('userId');
}

function clearAuth() {
    localStorage.removeItem('userId');
}

function authFetch(url, options = {}) {
    const userId = getAuth();
    if (userId) {
        options.headers = {
            ...options.headers,
            'X-User-Id': userId
        };
    }
    return fetch(url, options);
}