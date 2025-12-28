const traccarClient = require('../external/traccarClient');
const { MotorBike } = require('../models');

/**
 * Servicio para interactuar con Traccar
 * Contiene la lógica de negocio relacionada con GPS y dispositivos
 */
class TraccarService {

    async getPositions(motorBikeId) {
        try {
            const motorBike = await MotorBike.findByPk(motorBikeId);
            if (!motorBike) {
                throw new Error(`Moto de motor no encontrada`);
            }
            const positions = await traccarClient.getPositions(motorBike.trackingToken);
            return {
                success: true,
                data: positions,
                count: positions.length,
            };
        } catch (error) {
            throw new Error(`Error obteniendo dispositivos: ${error.message}`);
        }
    }
}

module.exports = new TraccarService();

