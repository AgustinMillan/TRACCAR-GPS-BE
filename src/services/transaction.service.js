const e = require("express");
const { Transaction } = require("../models");
const AccountService = require("./account.service");

class TransactionService {
  async createTransaction(transaction) {
    try {
      const account = await AccountService.getAccountById(
        transaction.accountId,
      );

      if (transaction.type === "ingreso") {
        await AccountService.updateAccount(transaction.accountId, {
          balance: account.balance + transaction.amount,
        });
      } else {
        await AccountService.updateAccount(transaction.accountId, {
          balance: account.balance - transaction.amount,
        });
      }

      const newTransaction = await Transaction.create(transaction);

      return {
        success: true,
        data: newTransaction,
      };
    } catch (error) {
      throw new Error(`Error creando transacción: ${error.message}`);
    }
  }

  async getTransactions({
    motorBikeId,
    accountId,
    type,
    page = 1,
    limit = 10,
  }) {
    try {
      const whereClause = {};
      if (motorBikeId) {
        whereClause.motorBikeId = motorBikeId;
      }
      if (accountId) {
        whereClause.accountId = accountId;
      }
      if (type) {
        whereClause.type = type;
      }

      const transactions = await Transaction.findAll({
        where: whereClause,
        offset: (page - 1) * limit,
        limit,
        sort: [["createdAt", "ASC"]],
      });
      return {
        success: true,
        data: transactions,
        count: await Transaction.count({ where: whereClause }),
      };
    } catch (error) {
      throw new Error(`Error obteniendo transacciones: ${error.message}`);
    }
  }

  async getTransactionById(id) {
    try {
      const transaction = await Transaction.findByPk(id);
      if (!transaction) {
        throw new Error("Transacción no encontrada");
      }
      return {
        success: true,
        data: transaction,
      };
    } catch (error) {
      throw new Error(`Error obteniendo transacción: ${error.message}`);
    }
  }
  async updateTransaction(id, transaction) {
    try {
      const existingTransaction = await Transaction.findByPk(id);
      if (!existingTransaction) {
        throw new Error("Transacción no encontrada");
      }

      const account = await AccountService.getAccountById(
        existingTransaction.accountId,
      );

      const oldAmount = existingTransaction.amount;
      const newAmount = transaction.amount;

      const diff = newAmount - oldAmount;

      if (existingTransaction.type === "ingreso") {
        await AccountService.updateAccount(existingTransaction.accountId, {
          balance: account.balance + diff,
        });
      } else {
        await AccountService.updateAccount(existingTransaction.accountId, {
          balance: account.balance - diff,
        });
      }

      await Transaction.update(transaction, {
        where: { id },
      });

      return {
        success: true,
      };
    } catch (error) {
      throw new Error(`Error actualizando transacción: ${error.message}`);
    }
  }
}

module.exports = new TransactionService();
