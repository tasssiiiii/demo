(async () => {
    
    const userId = getAuth();
    if (!userId) {
        alert('Сначала войдите в систему');
        window.location.href = './login.html';
        return;
    }
    const swiper = new Swiper('.mySwiper', {
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        pagination: { el: '.swiper-pagination', clickable: true },
    });

    try {
        const userRes = await authFetch('/api/user/bookings'); 
        document.getElementById('userLogin').innerText = localStorage.getItem('userLogin') || 'Пользователь';
    } catch(e) {}

    async function loadBookings() {
        const res = await authFetch('/api/user/bookings');
        const bookings = await res.json();
        const tbody = document.getElementById('bookingsList');
        tbody.innerHTML = '';
        for (const b of bookings) {
            const row = tbody.insertRow();
            row.insertCell(0).innerText = b.Room ? b.Room.name : '—';
            row.insertCell(1).innerText = b.eventDate;
            row.insertCell(2).innerText = b.paymentType === 'cash' ? 'Наличные' : 'Карта';
            row.insertCell(3).innerHTML = `<span class="status-${b.status}">${getStatusText(b.status)}</span>`;
            const reviewCell = row.insertCell(4);
            if (b.status === 'completed') {
                const reviewBtn = document.createElement('button');
                reviewBtn.textContent = 'Оставить отзыв';
                reviewBtn.className = 'btn btn-small';
                reviewBtn.onclick = () => showReviewForm(b.id, reviewBtn);
                reviewCell.appendChild(reviewBtn);
            } else {
                reviewCell.innerText = '—';
            }
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

    window.showReviewForm = async (bookingId, btn) => {
        const existingForm = btn.parentNode.querySelector('.review-form');
        if (existingForm) existingForm.remove();
        const formDiv = document.createElement('div');
        formDiv.className = 'review-form';
        formDiv.innerHTML = `
            <select id="rating-${bookingId}">
                <option value="5">5 - Отлично</option>
                <option value="4">4 - Хорошо</option>
                <option value="3">3 - Нормально</option>
                <option value="2">2 - Плохо</option>
                <option value="1">1 - Ужасно</option>
            </select>
            <textarea id="comment-${bookingId}" placeholder="Ваш отзыв..." rows="2"></textarea>
            <button class="btn btn-small" id="submit-review-${bookingId}">Отправить</button>
            <button class="btn-small" id="cancel-review">Отмена</button>
        `;
        btn.parentNode.appendChild(formDiv);
        document.getElementById(`submit-review-${bookingId}`).onclick = async () => {
            const rating = parseInt(document.getElementById(`rating-${bookingId}`).value);
            const comment = document.getElementById(`comment-${bookingId}`).value;
            if (!comment.trim()) {
                alert('Напишите отзыв');
                return;
            }
            const res = await authFetch('/api/feedbacks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId, rating, comment })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Отзыв сохранён, спасибо!');
                formDiv.remove();
                btn.remove(); // убираем кнопку
            } else {
                alert(data.error || 'Ошибка');
            }
        };
        document.getElementById('cancel-review').onclick = () => formDiv.remove();
    };

    document.getElementById('logoutBtn').onclick = (e) => {
        e.preventDefault();
        clearAuth();
        localStorage.removeItem('userRole');
        localStorage.removeItem('userLogin');
        window.location.href = '/login.html';
    };

    loadBookings();
})();