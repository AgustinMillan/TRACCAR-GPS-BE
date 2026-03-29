const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/connection");

const Maintenance = sequelize.define("Maintenance", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "Mantenimiento no especificado",
  },
  motorBikeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  motorBikeDayId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Maintenance;
