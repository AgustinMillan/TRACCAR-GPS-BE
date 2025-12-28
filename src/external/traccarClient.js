const axios = require('axios');

/**
 * Cliente para interactuar con la API de Traccar
 * Documentación: https://www.traccar.org/api-reference/
 */
class TraccarClient {
    constructor() {
        this.baseURL = process.env.TRACCAR_BASE_URL || 'http://localhost:8082';

        // Crear instancia de axios con configuración base
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 10000, // 10 segundos
            headers: {
                'Content-Type': 'application/json',
            },
        });

    }

    async getPositions(trackingToken) {
        try {
            const response = await this.client.get(`/api/positions`, {
                headers: {
                    'Authorization': `Bearer ${trackingToken}`,
                }
            });
            const data = response.data[0];

            const latitude = String(data.latitude).split(".")[0] + "." + String(data.latitude).split(".")[1].slice(0, 6);
            const longitude = String(data.longitude).split(".")[0] + "." + String(data.longitude).split(".")[1].slice(0, 6);

            return { latitude: latitude, longitude: longitude, speed: String(data.speed).split(".")[0] };
        } catch (error) {
            throw new Error(`Error obteniendo posiciones del dispositivo ${trackingToken}: ${error.message}`);
        }
    }
}

module.exports = new TraccarClient();

