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
    this.activeRequests = new Map();
  }

  async getPositions(motorBikeId) {
    // 🔒 Si ya hay una request activa, devolver esa misma
    if (this.activeRequests.has(motorBikeId)) {
      return this.activeRequests.get(motorBikeId);
    }

    const requestPromise = (async () => {
      try {
        const motorBike = await MotorBike.findByPk(motorBikeId);
        if (!motorBike) {
          throw new Error("Moto no encontrada");
        }

        let positions;

        if (motorBike.gpsType !== "TRACCAR") {
          let daGpsClient = this.daGpsClients.get(motorBikeId);

          if (!daGpsClient) {
            daGpsClient = await this.getdaGpsClient(motorBike.trackingToken);
            this.daGpsClients.set(motorBikeId, daGpsClient);
          }

          const res = await daGpsClient.getOnlineGpsInfo({
            userId: daGpsClient.userId,
            schoolId: daGpsClient.userId,
          });

          if (res.reconect) {
            this.daGpsClients.delete(motorBikeId);
            throw new Error("Requiere reconexión");
          }

          positions = res;
        } else {
          positions = await traccarClient.getPositions(motorBike.trackingToken);
        }

        return {
          success: true,
          data: positions,
          count: positions?.length || 0,
        };
      } catch (error) {
        // Si falla, limpiamos cliente
        this.daGpsClients.delete(motorBikeId);

        throw error;
      } finally {
        // 🔓 Siempre liberar el lock
        this.activeRequests.delete(motorBikeId);
      }
    })();

    // Guardamos la promise activa
    this.activeRequests.set(motorBikeId, requestPromise);

    return requestPromise;
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
