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
});

module.exports = MotorBike;
