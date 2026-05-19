const express = require('express');
const { sequelize, User, Room, Booking, Feedback } = require('./src/models/index');

const app = express();
app.use(express.json());
app.use(express.static('src/public'));

const getUserId = req => req.headers['x-user-id'] && parseInt(req.headers['x-user-id']);

const auth = async (req, res, next) => {
  const id = getUserId(req);
  if (!id) return res.status(401).json({ error: 'Не авторизован' });
  req.userId = id;
  next();
};

const admin = async (req, res, next) => {
  const id = getUserId(req);
  if (!id) return res.status(401).json({ error: 'Не авторизован' });
  const user = await User.findByPk(id);
  if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Доступ запрещён' });
  req.userId = id;
  next();
};

app.post('/api/register', async (req, res) => {
  const { login, password, fullName, phone, email } = req.body;
  if (await User.findOne({ where: { login } })) return res.status(400).json({ error: 'Логин занят' });
  const user = await User.create({ login, password, fullName, phone, email, role: 'user' });
  res.json({ message: 'OK', userId: user.id });
});

app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  const user = await User.findOne({ where: { login } });
  if (!user || user.password !== password) return res.status(401).json({ error: 'Неверный логин/пароль' });
  res.json({ userId: user.id, role: user.role });
});

app.post('/api/logout', (req, res) => res.json({ message: 'OK' }));

app.get('/api/rooms', async (req, res) => res.json(await Room.findAll()));

app.post('/api/bookings', auth, async (req, res) => {
  const { roomId, eventDate, paymentType, userComment } = req.body;
  const booking = await Booking.create({ 
    UserId: req.userId,   
    RoomId: roomId,       
    eventDate, 
    paymentType, 
    status: 'new', 
    userComment 
  });
  res.json({ message: 'Заявка создана', bookingId: booking.id });
});

app.get('/api/user/bookings', auth, async (req, res) => {
  // Условие where: UserId = req.userId (с заглавной)
  const bookings = await Booking.findAll({ 
    where: { UserId: req.userId }, 
    include: [Room] 
  });
  res.json(bookings);
});

app.get('/api/admin/bookings', admin, async (req, res) => {
  res.json(await Booking.findAll({ include: [User, Room] }));
});

app.put('/api/admin/bookings/:id/status', admin, async (req, res) => {
  const booking = await Booking.findByPk(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Не найдена' });
  booking.status = req.body.status;
  await booking.save();
  res.json({ message: 'Статус обновлён' });
});

app.post('/api/feedbacks', auth, async (req, res) => {
  const { bookingId, rating, comment } = req.body;
  // Проверка: заявка принадлежит пользователю и завершена
  const booking = await Booking.findOne({ 
    where: { id: bookingId, UserId: req.userId }  
  });
  if (!booking || booking.status !== 'completed') 
    return res.status(400).json({ error: 'Нельзя оставить отзыв' });
  if (await Feedback.findOne({ where: { BookingId: bookingId } }))  
    return res.status(400).json({ error: 'Отзыв уже есть' });
  await Feedback.create({ 
    BookingId: bookingId, 
    UserId: req.userId, 
    rating, 
    comment 
  });
  res.json({ message: 'Спасибо за отзыв' });
});

sequelize.sync({ alter: true }).then(() => app.listen(3000, () => console.log('Сервер на http://localhost:3000')));