const { sequelize } = require("../database/connection");

const MotorBike = require("./motorBike.model");
const Account = require("./account.model");
const Transaction = require("./transaction.model");
const MotorBikeDay = require("./motorBikeDay.model");
const Maintenance = require("./maintenance.model");

// Asociaciones

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

// ⚠️ En producción: usar migraciones, no sync
sequelize.sync({ alter: true });

module.exports = {
  sequelize,
  Account,
  Transaction,
  MotorBike,
  MotorBikeDay,
  Maintenance,
};
