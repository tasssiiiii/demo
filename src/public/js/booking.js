// Проверка авторизации
const userId = getAuth();
if (!userId) {
    alert('Сначала войдите в систему');
    window.location.href = '/login.html';
}

async function loadRooms() {
    try {
        const res = await fetch('/api/rooms');
        const rooms = await res.json();
        const select = document.getElementById('roomId');
        select.innerHTML = '<option value="">Выберите помещение</option>';
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = `${room.name} (${room.type})`;
            select.appendChild(option);
        });
    } catch (err) {
        console.error('Ошибка загрузки помещений', err);
        document.getElementById('roomId').innerHTML = '<option value="">Ошибка загрузки</option>';
    }
}

document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const roomId = document.getElementById('roomId').value;
    const eventDate = document.getElementById('eventDate').value;
    const paymentType = document.getElementById('paymentType').value;
    const userComment = document.getElementById('userComment').value;

    if (!roomId || !eventDate || !paymentType) {
        alert('Заполните все обязательные поля');
        return;
    }

    try {
        const res = await authFetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomId, eventDate, paymentType, userComment })
        });
        const data = await res.json();
        if (res.ok) {
            alert('Заявка успешно создана!');
            window.location.href = '/dashboard.html';
        } else {
            alert(data.error || 'Ошибка создания заявки');
        }
    } catch (err) {
        alert('Ошибка соединения с сервером');
    }
});

loadRooms();