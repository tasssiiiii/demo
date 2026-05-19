document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, email, login, password })
    });
    const data = await res.json();
    if (res.ok) {
        alert('Регистрация успешна! Теперь войдите.');
        window.location.href = './login.html';
    } else {
        alert(data.error || 'Ошибка регистрации');
    }
});