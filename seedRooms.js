const { sequelize, Room } = require('./src/models/index');

(async () => {
    await sequelize.sync();
    await Room.bulkCreate([
        { name: 'Зал', type: 'зал', description: 'Просторный зал' },
        { name: 'Ресторан', type: 'ресторан', description: 'Уютный ресторан' },
        { name: 'Летняя веранда', type: 'летняя веранда', description: 'Открытая терраса' },
        { name: 'Закрытая веранда', type: 'закрытая веранда', description: 'Остеклённая веранда' }
    ]);
    console.log('Помещения добавлены');
    process.exit();
})();