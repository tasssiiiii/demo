const { sequelize, User } = require('./src/models/index');
(async () => {
    await sequelize.sync();
    const admin = await User.findOne({ where: { login: 'Admin26' } });
    if (!admin) {
        await User.create({
            login: 'Admin26',
            password: 'Demo20',
            fullName: 'Администратор',
            phone: '000',
            email: 'admin@example.com',
            role: 'admin'
        });
        console.log('Администратор создан');
    } else {
        console.log('Администратор уже есть');
    }
    process.exit();
})();