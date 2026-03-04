const traccarClient = require("../external/traccarClient");
const { MotorBike } = require("../models");
const DAGPSClient = require("./dagps.service");

/**
 * Servicio para interactuar con Traccar
 * Contiene la lógica de negocio relacionada con GPS y dispositivos
 */
class TraccarService {
  constructor() {
    this.daGpsClients = new Map();
  }

  async getPositions(motorBikeId) {
    try {
      const motorBike = await MotorBike.findByPk(motorBikeId);
      if (!motorBike) {
        throw new Error(`Moto de motor no encontrada`);
      }

      let positions = null;

      if (motorBike.gpsType !== "TRACCAR") {
        if (!this.daGpsClients.has(motorBikeId)) {
          this.daGpsClients.set(motorBikeId, "initializing");

          const daGpsClient = await this.getdaGpsClient(
            motorBike.trackingToken,
          );
          this.daGpsClients.set(motorBikeId, daGpsClient);
        }

        if (this.daGpsClients.get(motorBikeId) === "initializing") {
          return {
            success: true,
            message:
              "Inicializando conexión DAGPS, por favor intente nuevamente en unos segundos",
          };
        }

        const daGpsClient = this.daGpsClients.get(motorBikeId);
        const res = await daGpsClient.getOnlineGpsInfo({
          userId: daGpsClient.userId,
          schoolId: daGpsClient.userId,
        });

        if (res.reconect) {
          this.daGpsClients.delete(motorBikeId);
          throw new Error("Requiere reconexión, eliminando cliente DAGPS");
        } else {
          positions = res;
        }
      } else {
        positions = await traccarClient.getPositions(motorBike.trackingToken);
      }
      return {
        success: true,
        data: positions,
        count: positions.length,
      };
    } catch (error) {
      throw new Error(`Error obteniendo dispositivos: ${error.message}`);
    }
  }

  async getPositionByTraccar(trackingToken) {
    return await traccarClient.getPositions(trackingToken);
  }

  async getdaGpsClient(trackingToken) {
    const daGpsClient = new DAGPSClient(trackingToken, "123456");

    await daGpsClient.init();
    await daGpsClient.close();

    return daGpsClient;
  }
}

module.exports = new TraccarService();
