const { sequelize } = require("../database/connection");

const MotorBike = require("./motorBike.model");
const Account = require("./account.model");
const Transaction = require("./transaction.model");
const MotorBikeDay = require("./motorBikeDay.model");
const Maintenance = require("./maintenance.model");
const Category = require("./category.model");
const Client = require("./client.model");
const File = require("./file.model");
const User = require("./user.model");

// Asociaciones
Category.hasMany(Transaction, {
  foreignKey: "categoryId",
  as: "transactions",
});

Transaction.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

MotorBike.hasMany(Transaction, {
  foreignKey: "motorBikeId",
  as: "transactions",
});

Transaction.belongsTo(MotorBike, {
  foreignKey: "motorBikeId",
  as: "motorBike",
});

Account.hasMany(Transaction, {
  foreignKey: "accountId",
  as: "transactions",
});

Transaction.belongsTo(Account, {
  foreignKey: "accountId",
  as: "account",
});

MotorBike.hasMany(MotorBikeDay, {
  foreignKey: "motorBikeId",
  as: "days",
});

MotorBikeDay.belongsTo(MotorBike, {
  foreignKey: "motorBikeId",
  as: "motorBike",
});

MotorBike.hasMany(Maintenance, {
  foreignKey: "motorBikeId",
  as: "maintenances",
});

Maintenance.belongsTo(MotorBike, {
  foreignKey: "motorBikeId",
  as: "motorBike",
});

MotorBikeDay.hasOne(Maintenance, {
  foreignKey: "motorBikeDayId",
  as: "maintenance",
});

Maintenance.belongsTo(MotorBikeDay, {
  foreignKey: "motorBikeDayId",
  as: "motorBikeDay",
});

Client.hasMany(MotorBike, {
  foreignKey: "clientId",
  as: "motorBikes",
});

MotorBike.belongsTo(Client, {
  foreignKey: "clientId",
  as: "client",
});

// ⚠️ En producción: usar migraciones, no sync
sequelize.sync({ alter: true });

module.exports = {
  sequelize,
  Account,
  Transaction,
  MotorBike,
  MotorBikeDay,
  Maintenance,
  Category,
  Client,
  File,
  User,
};
