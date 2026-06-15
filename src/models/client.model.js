const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/connection");

const Client = sequelize.define("Client", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dni: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  driverLicense: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  serviceBill: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Client;
