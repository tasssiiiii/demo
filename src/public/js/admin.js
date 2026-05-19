(async () => {
    const userId = getAuth();
    const userRole = localStorage.getItem('userRole');
    if (!userId || userRole !== 'admin') {
        alert('Доступ запрещён. Только для администратора.');
        window.location.href = '/login.html';
        return;
    }

    async function loadAllBookings() {
        try {
            const res = await authFetch('/api/admin/bookings');
            if (!res.ok) throw new Error('Ошибка загрузки');
            const bookings = await res.json();
            const tbody = document.getElementById('adminBookingsList');
            tbody.innerHTML = '';
            bookings.forEach(booking => {
                const row = tbody.insertRow();
                row.insertCell(0).innerText = booking.id;
                row.insertCell(1).innerText = booking.User ? `${booking.User.fullName} (${booking.User.login})` : '—';
                row.insertCell(2).innerText = booking.Room ? booking.Room.name : '—';
                row.insertCell(3).innerText = booking.eventDate;
                row.insertCell(4).innerText = booking.paymentType === 'cash' ? 'Наличные' : 'Карта';
            
                const statusCell = row.insertCell(4);
                const statusSpan = document.createElement('span');
                statusSpan.className = `status-${booking.status}`;
                statusSpan.innerText = getStatusText(booking.status);
                statusCell.appendChild(statusSpan);
                
                const actionCell = row.insertCell(5);
                const select = document.createElement('select');
                select.className = 'status-select';
                select.innerHTML = `
                    <option value="new" ${booking.status === 'new' ? 'selected' : ''}>Новая</option>
                    <option value="assigned" ${booking.status === 'assigned' ? 'selected' : ''}>Банкет назначен</option>
                    <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Банкет завершен</option>
                `;
                select.addEventListener('change', async (e) => {
                    const newStatus = e.target.value;
                    const res = await authFetch(`/api/admin/bookings/${booking.id}/status`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: newStatus })
                    });
                    if (res.ok) {
                        alert('Статус обновлён');
                        loadAllBookings(); // перезагружаем таблицу
                    } else {
                        alert('Ошибка обновления статуса');
                    }
                });
                actionCell.appendChild(select);
            });
        } catch (err) {
            console.error(err);
            alert('Ошибка загрузки заявок');
        }
    }

    function getStatusText(status) {
        switch(status) {
            case 'new': return 'Новая';
            case 'assigned': return 'Банкет назначен';
            case 'completed': return 'Банкет завершен';
            default: return status;
        }
    }

    document.getElementById('logoutBtn').onclick = (e) => {
        e.preventDefault();
        clearAuth();
        localStorage.removeItem('userRole');
        localStorage.removeItem('userLogin');
        window.location.href = '/login.html';
    };

    loadAllBookings();
})();