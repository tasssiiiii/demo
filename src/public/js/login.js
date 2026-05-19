document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userLogin', login); 
            if (data.role === 'admin') {
                window.location.href = './admin.html';
            } else {
                window.location.href = './dashboard.html';
            }
        } else {
            alert(data.error || 'Ошибка входа');
        }
    } catch (err) {
        alert('Ошибка соединения с сервером');
    }
});