const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  login: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(50), allowNull: false },
  fullName: { type: DataTypes.STRING(100), allowNull: false },
  phone: { type: DataTypes.STRING(20), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false },
  role: { type: DataTypes.STRING(20), defaultValue: 'user' },
});

const Room = sequelize.define('Room', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  type: { type: DataTypes.STRING(50), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  image: { type: DataTypes.STRING(255), allowNull: true },
});

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  eventDate: { type: DataTypes.DATEONLY, allowNull: false },
  paymentType: { type: DataTypes.STRING(20), allowNull: false },
  status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'new' },
  userComment: { type: DataTypes.TEXT, allowNull: true },
});

const Feedback = sequelize.define('Feedback', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: false },
});

User.hasMany(Booking);
Booking.belongsTo(User);

Room.hasMany(Booking);
Booking.belongsTo(Room);

Booking.hasOne(Feedback);
Feedback.belongsTo(Booking);

User.hasMany(Feedback);
Feedback.belongsTo(User);

module.exports = { sequelize, User, Room, Booking, Feedback };