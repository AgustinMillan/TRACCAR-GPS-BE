const { MotorBike } = require('../models');

class MotorBikeService {
    async getMotorBikes() {
        try {
            const motorBikes = await MotorBike.findAll();
            return {
                success: true,
                data: motorBikes,
                count: motorBikes.length,
            };
        } catch (error) {
            throw new Error(`Error obteniendo motos de motor: ${error.message}`);
        }
    }

    async getMotorBikeById(id) {
        try {
            const motorBike = await MotorBike.findByPk(id);
            return {
                success: true,
                data: motorBike,
            };
        } catch (error) {
            throw new Error(`Error obteniendo moto de motor: ${error.message}`);
        }
    }

    async createMotorBike(motorBike) {
        try {
            const newMotorBike = await MotorBike.create(motorBike);
            return {
                success: true,
                data: newMotorBike,
            };
        } catch (error) {
            throw new Error(`Error creando moto de motor: ${error.message}`);
        }
    }

    async updateMotorBike(id, motorBike) {
        try {
            const updatedMotorBike = await MotorBike.update(motorBike, { where: { id } });
            return {
                success: true,
                data: updatedMotorBike,
            };
        } catch (error) {
            throw new Error(`Error actualizando moto de motor: ${error.message}`);
        }
    }
}

module.exports = new MotorBikeService();