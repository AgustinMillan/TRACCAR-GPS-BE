const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/connection");

const MotorBike = sequelize.define("MotorBike", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  trackingToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneCompany: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gpsType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  debt: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  lastMaintenanceDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  seguro: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = MotorBike;
