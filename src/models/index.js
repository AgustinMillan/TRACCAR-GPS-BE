const { sequelize } = require('../database/connection');

// Importar todos los modelos aquí
// const User = require('./User');
const MotorBike = require('./motorBike.model');

// Definir asociaciones aquí si es necesario
// User.hasMany(Device);
// Device.belongsTo(User);

// Sincronizar modelos (opcional, mejor usar migraciones en producción)
sequelize.sync({ alter: true });

module.exports = {
    sequelize,
    // Exportar modelos
    // User,
    MotorBike,
};

