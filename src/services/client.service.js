const { Client } = require("../models");

class ClientService {
  async createClient(client) {
    try {
      const newClient = await Client.create(client);
      return {
        success: true,
        data: newClient,
      };
    } catch (error) {
      throw new Error(`Error creando cliente: ${error.message}`);
    }
  }

  async getClients() {
    try {
      const clients = await Client.findAll({
        attributes: ["id", "name", "phoneNumber", "isActive"],
        order: [["name", "ASC"]],
      });
      return {
        success: true,
        data: clients,
        count: clients.length,
      };
    } catch (error) {
      throw new Error(`Error obteniendo clientes: ${error.message}`);
    }
  }

  async getClientById(id) {
    try {
      const client = await Client.findByPk(id);
      if (!client) {
        throw new Error("Cliente no encontrado");
      }
      return {
        success: true,
        data: client,
      };
    } catch (error) {
      throw new Error(`Error obteniendo cliente: ${error.message}`);
    }
  }

  async updateClient(id, client) {
    try {
      const [updatedRows] = await Client.update(client, { where: { id } });
      return {
        success: true,
        data: updatedRows,
      };
    } catch (error) {
      throw new Error(`Error actualizando cliente: ${error.message}`);
    }
  }
}

module.exports = new ClientService();
