const { MotorBikeDay, MotorBike, Maintenance, sequelize } = require("../models");
const { Op } = require("sequelize");

class MotorBikeDayService {
  async createDay(data) {
    const t = await sequelize.transaction();
    try {
      const debt = Number(data.debt || 0);

      const newDay = await MotorBikeDay.create(data, { transaction: t });

      if (debt > 0) {
        await MotorBike.increment("debt", {
          by: debt,
          where: { id: data.motorBikeId },
          transaction: t,
        });
      }

      if (data.status === "mantenimiento") {
        await Maintenance.create(
          {
            details: data.maintenanceDetails || "Mantenimiento no especificado",
            motorBikeId: data.motorBikeId,
            motorBikeDayId: newDay.id,
          },
          { transaction: t }
        );

        await MotorBike.update(
          { lastMaintenanceDate: data.date },
          { where: { id: data.motorBikeId }, transaction: t }
        );
      }

      await t.commit();
      return { success: true, data: newDay };
    } catch (error) {
      await t.rollback();
      throw new Error(`Error creando el día: ${error.message}`);
    }
  }

  async getDaysByMotorBikeAndMonth(motorBikeId, year, month) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Último día del mes

      const startStr = startDate.toISOString().split("T")[0];
      const endStr = endDate.toISOString().split("T")[0];

      const days = await MotorBikeDay.findAll({
        where: {
          motorBikeId,
          date: {
            [Op.between]: [startStr, endStr],
          },
        },
        include: [
          {
            model: Maintenance,
            as: "maintenance",
          },
        ],
        order: [["date", "ASC"]],
      });

      return { success: true, data: days };
    } catch (error) {
      throw new Error(`Error obteniendo los días: ${error.message}`);
    }
  }

  async updateDay(id, data) {
    const t = await sequelize.transaction();
    try {
      const existingDay = await MotorBikeDay.findByPk(id, { transaction: t });
      if (!existingDay) {
        throw new Error("Día no encontrado");
      }

      const oldDebt = Number(existingDay.debt || 0);
      const newDebt = Number(data.debt !== undefined ? data.debt : oldDebt);

      const oldMotorBikeId = existingDay.motorBikeId;
      const newMotorBikeId = data.motorBikeId !== undefined ? data.motorBikeId : oldMotorBikeId;

      // Deshacer deuda en la moto anterior
      if (oldDebt > 0) {
        await MotorBike.decrement("debt", {
          by: oldDebt,
          where: { id: oldMotorBikeId },
          transaction: t,
        });
      }

      // Aplicar deuda en la moto nueva
      if (newDebt > 0) {
        await MotorBike.increment("debt", {
          by: newDebt,
          where: { id: newMotorBikeId },
          transaction: t,
        });
      }

      const updatedStatus = data.status !== undefined ? data.status : existingDay.status;
      const updatedDate = data.date !== undefined ? data.date : existingDay.date;

      if (updatedStatus === "mantenimiento") {
        const existingMaintenance = await Maintenance.findOne({
          where: { motorBikeDayId: id },
          transaction: t,
        });

        if (existingMaintenance) {
          if (data.maintenanceDetails !== undefined) {
            await existingMaintenance.update(
              { details: data.maintenanceDetails },
              { transaction: t }
            );
          }
        } else {
          await Maintenance.create(
            {
              details: data.maintenanceDetails || "Mantenimiento no especificado",
              motorBikeId: newMotorBikeId,
              motorBikeDayId: id,
            },
            { transaction: t }
          );
        }

        await MotorBike.update(
          { lastMaintenanceDate: updatedDate },
          { where: { id: newMotorBikeId }, transaction: t }
        );
      } else if (existingDay.status === "mantenimiento" && updatedStatus !== "mantenimiento") {
        await Maintenance.destroy({ where: { motorBikeDayId: id }, transaction: t });
      }

      await existingDay.update(data, { transaction: t });

      await t.commit();
      return { success: true, data: existingDay };
    } catch (error) {
      await t.rollback();
      throw new Error(`Error actualizando el día: ${error.message}`);
    }
  }
}

module.exports = new MotorBikeDayService();
