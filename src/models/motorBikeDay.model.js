const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/connection");

const MotorBikeDay = sequelize.define("MotorBikeDay", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pagado", "adeudado", "descanso", "mantenimiento"),
    allowNull: false,
  },
  debt: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  motorBikeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = MotorBikeDay;
