# Backend - BE

Proyecto Node.js backend con Express.

## 📋 Estructura del Proyecto

```
BE/
├── src/
│   ├── controllers/     # Endpoints y rutas
│   ├── services/        # Lógica de negocio
│   ├── external/        # Clientes para servicios externos
│   ├── models/          # Modelos de Sequelize
│   └── database/        # Configuración de base de datos
├── config/             # Archivos de configuración
├── index.js            # Punto de entrada de la aplicación
└── package.json
```

## 🚀 Instalación

```bash
npm install
```

## 🔧 Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# === SERVIDOR ===
PORT=3000
NODE_ENV=development

# === BASE DE DATOS (PostgreSQL) ===
# Opción 1: URL completa de conexión (recomendado para Supabase, Heroku, etc.)
DATABASE_URL=postgresql://user:password@host:port/database

# Opción 2: Variables individuales
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=postgres
DB_SSL=false
DB_LOGGING=false

# === TRACCAR GPS ===
TRACCAR_BASE_URL=http://localhost:8082
TRACCAR_USERNAME=admin
TRACCAR_PASSWORD=admin

# === DEBUG ===
DEBUG=false
```

## ▶️ Ejecución

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

## 📡 Endpoints

### Health Check
- `GET /health` - Health check del servidor

### Ejemplo
- `GET /api/example` - Endpoint de ejemplo
- `POST /api/example` - Endpoint de ejemplo con body

### Traccar GPS
- `GET /api/traccar/devices` - Obtiene todos los dispositivos GPS
- `GET /api/traccar/devices/:deviceId` - Obtiene información de un dispositivo
- `GET /api/traccar/devices/:deviceId/location` - Obtiene la ubicación actual de un dispositivo
- `GET /api/traccar/devices/:deviceId/history` - Obtiene el historial de posiciones (query: from, to)
- `GET /api/traccar/devices/:deviceId/events` - Obtiene eventos de un dispositivo (query: from, to, type)
- `GET /api/traccar/devices-with-location` - Obtiene todos los dispositivos con su última posición
- `POST /api/traccar/devices/:deviceId/command` - Envía un comando a un dispositivo (body: { type, attributes })

## 🏗️ Arquitectura

### Controllers (`src/controllers/`)
Los controllers manejan las peticiones HTTP y delegan la lógica de negocio a los servicios.

### Services (`src/services/`)
Los services contienen toda la lógica de negocio y procesamiento de datos.

### External Clients (`src/external/`)
Los clientes externos manejan la comunicación con APIs de terceros (Traccar, etc.).

### Database (`src/database/`)
Configuración y conexión a la base de datos PostgreSQL usando Sequelize.

### Models (`src/models/`)
Modelos de Sequelize que representan las tablas de la base de datos.

## 📝 Ejemplo de Uso

### Crear un nuevo Controller

```javascript
// src/controllers/myController.js
const express = require('express');
const router = express.Router();
const myService = require('../services/myService');

router.get('/', async (req, res) => {
  try {
    const result = await myService.getData();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

### Crear un nuevo Service

```javascript
// src/services/myService.js
class MyService {
  async getData() {
    // Lógica de negocio aquí
    return { message: 'Datos obtenidos' };
  }
}

module.exports = new MyService();
```

### Registrar el Controller en index.js

```javascript
const myController = require('./src/controllers/myController');
app.use('/api/my', myController);
```

## 🌐 Servicios Externos

### Traccar GPS

El proyecto incluye un cliente completo para interactuar con la API de Traccar (sistema de rastreo GPS).

#### Estructura

- **Cliente Base** (`src/external/baseClient.js`): Clase base reutilizable para crear clientes de servicios externos
- **Cliente Traccar** (`src/external/traccarClient.js`): Cliente específico para la API de Traccar
- **Servicio Traccar** (`src/services/traccarService.js`): Lógica de negocio relacionada con GPS
- **Controller Traccar** (`src/controllers/traccarController.js`): Endpoints HTTP para Traccar

#### Métodos disponibles en TraccarClient

- `getSession()` - Obtiene la sesión actual
- `getDevices()` - Obtiene todos los dispositivos
- `getDeviceById(deviceId)` - Obtiene un dispositivo por ID
- `getPositions(deviceId, params)` - Obtiene posiciones de un dispositivo
- `getLastPosition(deviceId)` - Obtiene la última posición
- `getEvents(params)` - Obtiene eventos
- `getGeofences()` - Obtiene geocercas
- `getGroups()` - Obtiene grupos
- `getUsers()` - Obtiene usuarios
- `sendCommand(deviceId, type, attributes)` - Envía un comando

#### Ejemplo de uso del cliente

```javascript
const traccarClient = require('./src/external/traccarClient');

// Obtener todos los dispositivos
const devices = await traccarClient.getDevices();

// Obtener ubicación de un dispositivo
const position = await traccarClient.getLastPosition(1);

// Enviar comando
await traccarClient.sendCommand(1, 'engineStop');
```

#### Crear un nuevo cliente externo

```javascript
// src/external/myExternalClient.js
const BaseClient = require('./baseClient');

class MyExternalClient extends BaseClient {
  constructor() {
    super(process.env.MY_API_URL);
    this.setBearerToken(process.env.MY_API_TOKEN);
  }

  async getData() {
    return await this.get('/api/data');
  }
}

module.exports = new MyExternalClient();
```

## 🗄️ Base de Datos

El proyecto usa **PostgreSQL** con **Sequelize** como ORM.

### Configuración

La conexión se puede configurar de dos formas:

#### Opción 1: URL completa (Recomendado para Supabase, Heroku, etc.)
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

#### Opción 2: Variables individuales
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=postgres
DB_SSL=false
DB_LOGGING=false
```

### Estructura

- **`src/database/config.js`**: Configuración de la base de datos por ambiente
- **`src/database/connection.js`**: Instancia de Sequelize y funciones de conexión
- **`src/models/`**: Modelos de Sequelize

### Crear un nuevo Modelo

```javascript
// src/models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
```

### Usar un Modelo en un Service

```javascript
// src/services/userService.js
const { User } = require('../models');

class UserService {
  async getAllUsers() {
    return await User.findAll();
  }

  async getUserById(id) {
    return await User.findByPk(id);
  }

  async createUser(userData) {
    return await User.create(userData);
  }
}

module.exports = new UserService();
```

### Funciones de Conexión

```javascript
const { testConnection, syncDatabase } = require('./src/database/connection');

// Probar conexión
await testConnection();

// Sincronizar modelos (solo en desarrollo)
await syncDatabase(false); // false = no eliminar datos existentes
```

### Migraciones (Recomendado para producción)

Para producción, se recomienda usar migraciones en lugar de `sync()`. Puedes instalar Sequelize CLI:

```bash
npm install --save-dev sequelize-cli
npx sequelize init
```

Esto creará una carpeta `migrations/` donde puedes definir cambios de esquema versionados.

