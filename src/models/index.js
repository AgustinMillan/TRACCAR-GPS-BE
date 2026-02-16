const { sequelize } = require("../database/connection");

const MotorBike = require("./motorBike.model");
const Account = require("./account.model");
const Transaction = require("./transaction.model");

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

// ⚠️ En producción: usar migraciones, no sync
sequelize.sync({ alter: true });

module.exports = {
  sequelize,
  Account,
  Transaction,
  MotorBike,
};
