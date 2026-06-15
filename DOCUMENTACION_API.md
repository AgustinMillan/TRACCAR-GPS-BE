# Documentación de API: Clientes (`Client`), Motos (`MotorBike`), Archivos (`File`) y Seguridad (`User`)

Este documento detalla los nuevos endpoints y modificaciones en el backend para facilitar la integración con el frontend.

---

## 1. Cambios en el modelo de Moto (`MotorBike`)

Se agregaron tres nuevos campos opcionales al recurso de motocicletas:

* `domain` (String): Patente o chapa del vehículo.
* `seguro` (String): URL/Link del documento del seguro.
* `clientId` (Integer): ID del cliente dueño de la moto.

### Respuesta del GET `/api/motor-bikes` y `/api/motor-bikes/:id`
Al consultar las motos, ahora se retornará el objeto `client` asociado (o `null` si no tiene uno):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Moto Honda Wave",
    "trackingToken": "xyz123",
    "isActive": true,
    "phoneNumber": "+5411223344",
    "phoneCompany": "Claro",
    "gpsType": "Coban",
    "debt": 0,
    "lastMaintenanceDate": "2026-06-15",
    "domain": "ABC123",
    "seguro": "https://bucket-name.s3.amazonaws.com/seguros/honda.pdf",
    "clientId": 2,
    "client": {
      "id": 2,
      "name": "Agustin Millan",
      "phoneNumber": "+5491100002222",
      "isActive": true
    }
  }
}
```

---

## 2. Endpoints de Clientes (`/api/clients`)

### A. Crear Cliente
Crea un cliente nuevo en el sistema.

* **Método**: `POST`
* **Ruta**: `/api/clients`
* **Headers**: `Content-Type: application/json`
* **Payload (Body)**:
```json
{
  "name": "Agustin Millan",
  "phoneNumber": "+5491100002222",
  "dni": "https://bucket-name.s3.amazonaws.com/dni/agustin.jpg",
  "driverLicense": "https://bucket-name.s3.amazonaws.com/licencias/agustin.jpg",
  "serviceBill": "https://bucket-name.s3.amazonaws.com/servicios/agustin.pdf",
  "observations": "Cliente preferencial, entrega en zona norte.",
  "isActive": true
}
```
* **Respuesta (`201 Created`)**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Agustin Millan",
    "phoneNumber": "+5491100002222",
    "dni": "https://bucket-name.s3.amazonaws.com/dni/agustin.jpg",
    "driverLicense": "https://bucket-name.s3.amazonaws.com/licencias/agustin.jpg",
    "serviceBill": "https://bucket-name.s3.amazonaws.com/servicios/agustin.pdf",
    "observations": "Cliente preferencial, entrega en zona norte.",
    "isActive": true,
    "updatedAt": "2026-06-15T16:15:00.000Z",
    "createdAt": "2026-06-15T16:15:00.000Z"
  }
}
```

---

### B. Obtener Todos los Clientes (Listado Simplificado)
Retorna la lista de todos los clientes con los atributos mínimos indispensables para listados/tablas.

* **Método**: `GET`
* **Ruta**: `/api/clients`
* **Respuesta (`200 OK`)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Juan Perez",
      "phoneNumber": "+5491133334444",
      "isActive": true
    },
    {
      "id": 2,
      "name": "Agustin Millan",
      "phoneNumber": "+5491100002222",
      "isActive": true
    }
  ],
  "count": 2
}
```

---

### C. Obtener Detalle del Cliente (Información Completa)
Retorna toda la información, incluyendo URLs de documentos y observaciones.

* **Método**: `GET`
* **Ruta**: `/api/clients/:id`
* **Respuesta (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Agustin Millan",
    "phoneNumber": "+5491100002222",
    "dni": "https://bucket-name.s3.amazonaws.com/dni/agustin.jpg",
    "driverLicense": "https://bucket-name.s3.amazonaws.com/licencias/agustin.jpg",
    "serviceBill": "https://bucket-name.s3.amazonaws.com/servicios/agustin.pdf",
    "observations": "Cliente preferencial, entrega en zona norte.",
    "isActive": true,
    "createdAt": "2026-06-15T16:15:00.000Z",
    "updatedAt": "2026-06-15T16:15:00.000Z"
  }
}
```

---

### D. Actualizar Cliente
Permite modificar uno o varios campos de un cliente por su ID.

* **Método**: `PUT`
* **Ruta**: `/api/clients/:id`
* **Headers**: `Content-Type: application/json`
* **Payload (Body)**: *(se pueden enviar solo los campos a modificar)*
```json
{
  "name": "Agustin Millan Modificado",
  "isActive": false
}
```
* **Respuesta (`200 OK`)**:
```json
{
  "success": true,
  "data": 1
}
```

---

## 3. Endpoints de Archivos (`/api/files`)

Permite subir y eliminar imágenes y documentos PDF. Los archivos subidos se guardan localmente en la carpeta `uploads/` del backend y se sirven de forma estática bajo `/uploads/*`.

### A. Subir un Archivo (Imagen o PDF)
* **Método**: `POST`
* **Ruta**: `/api/files/upload`
* **Headers**: `Content-Type: multipart/form-data`
* **Body (form-data)**:
  * `file`: (Archivo de tipo imagen o pdf, máx. 10MB)
* **Respuesta (`201 Created`)**:
```json
{
  "success": true,
  "data": {
    "id": 5,
    "filename": "1718469854291-584729104.pdf",
    "originalName": "factura-luz.pdf",
    "mimeType": "application/pdf",
    "size": 142580,
    "path": "uploads\\1718469854291-584729104.pdf",
    "url": "/uploads/1718469854291-584729104.pdf",
    "updatedAt": "2026-06-15T16:30:00.000Z",
    "createdAt": "2026-06-15T16:30:00.000Z"
  }
}
```

---

### B. Listar Todos los Archivos
Obtiene la lista de todos los metadatos de archivos subidos y registrados en el sistema.

* **Método**: `GET`
* **Ruta**: `/api/files`
* **Respuesta (`200 OK`)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "filename": "1718469854291-584729104.pdf",
      "originalName": "factura-luz.pdf",
      "mimeType": "application/pdf",
      "size": 142580,
      "path": "uploads\\1718469854291-584729104.pdf",
      "url": "/uploads/1718469854291-584729104.pdf",
      "createdAt": "2026-06-15T16:30:00.000Z",
      "updatedAt": "2026-06-15T16:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

### C. Eliminar Archivo (Físico y Registro)
Elimina el registro de la base de datos y también borra el archivo físico correspondiente del disco (carpeta `uploads/`).

* **Método**: `DELETE`
* **Ruta**: `/api/files/:id`
* **Respuesta (`200 OK`)**:
```json
{
  "success": true,
  "message": "Archivo físico y registro eliminados correctamente"
}
```

---

## 4. Usuarios y Autenticación (`/api/auth` y `/api/users`)

Los endpoints de usuarios (`/api/users`) requieren autenticación mediante un token JWT enviado en las cabeceras HTTP:
`Authorization: Bearer <TOKEN>`

### A. Registro del Primer Administrador (Desprotegido)
Se utiliza para crear la primera cuenta de administrador en un sistema vacío. Requiere la clave del `.env` (`INITIAL_ADMIN_KEY`). **Solo funcionará si no existe ningún otro usuario con rol `ADMIN` en el sistema.**

* **Método**: `POST`
* **Ruta**: `/api/auth/register-first-admin`
* **Headers**: `Content-Type: application/json`
* **Payload (Body)**:
```json
{
  "initialAdminKey": "secret-first-admin-key-123",
  "user": {
    "name": "Administrador Principal",
    "username": "admin",
    "password": "miSuperPasswordSeguro",
    "phoneNumber": "+54911223344"
  }
}
```
* **Respuesta (`201 Created`)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Administrador Principal",
    "username": "admin",
    "phoneNumber": "+54911223344",
    "role": "ADMIN",
    "companyDebt": 0,
    "isActive": true,
    "createdAt": "2026-06-15T17:42:00.000Z",
    "updatedAt": "2026-06-15T17:42:00.000Z"
  }
}
```

---

### B. Inicio de Sesión (Login)
* **Método**: `POST`
* **Ruta**: `/api/auth/login`
* **Headers**: `Content-Type: application/json`
* **Payload (Body)**:
```json
{
  "username": "admin",
  "password": "miSuperPasswordSeguro"
}
```
* **Respuesta (`200 OK`)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Administrador Principal",
    "username": "admin",
    "phoneNumber": "+54911223344",
    "role": "ADMIN",
    "companyDebt": 0,
    "isActive": true,
    "createdAt": "2026-06-15T17:42:00.000Z",
    "updatedAt": "2026-06-15T17:42:00.000Z"
  }
}
```

---

### C. Crear Usuario (Solo ADMIN)
* **Método**: `POST`
* **Ruta**: `/api/users`
* **Headers**: 
  * `Authorization: Bearer <TOKEN>` (Debe ser un usuario con rol `ADMIN`)
  * `Content-Type: application/json`
* **Payload (Body)**:
```json
{
  "name": "Soporte Técnico",
  "username": "soporte",
  "password": "PasswordSoporte123",
  "phoneNumber": "+5491155556666",
  "role": "SUPP",
  "companyDebt": 1500
}
```
* **Respuesta (`201 Created`)**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Soporte Técnico",
    "username": "soporte",
    "phoneNumber": "+5491155556666",
    "role": "SUPP",
    "companyDebt": 1500,
    "isActive": true,
    "createdAt": "2026-06-15T17:43:00.000Z",
    "updatedAt": "2026-06-15T17:43:00.000Z"
  }
}
```

---

### D. Listar Todos los Usuarios (Autenticado)
* **Método**: `GET`
* **Ruta**: `/api/users`
* **Headers**: `Authorization: Bearer <TOKEN>` (Cualquier usuario autenticado `ADMIN` o `SUPP`)
* **Respuesta (`200 OK`)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Administrador Principal",
      "username": "admin",
      "phoneNumber": "+54911223344",
      "role": "ADMIN",
      "companyDebt": 0,
      "isActive": true,
      "createdAt": "2026-06-15T17:42:00.000Z",
      "updatedAt": "2026-06-15T17:42:00.000Z"
    },
    {
      "id": 2,
      "name": "Soporte Técnico",
      "username": "soporte",
      "phoneNumber": "+5491155556666",
      "role": "SUPP",
      "companyDebt": 1500,
      "isActive": true,
      "createdAt": "2026-06-15T17:43:00.000Z",
      "updatedAt": "2026-06-15T17:43:00.000Z"
    }
  ],
  "count": 2
}
```

---

### E. Obtener Detalle de Usuario (Autenticado)
* **Método**: `GET`
* **Ruta**: `/api/users/:id`
* **Headers**: `Authorization: Bearer <TOKEN>` (Cualquier usuario autenticado)
* **Respuesta (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Soporte Técnico",
    "username": "soporte",
    "phoneNumber": "+5491155556666",
    "role": "SUPP",
    "companyDebt": 1500,
    "isActive": true,
    "createdAt": "2026-06-15T17:43:00.000Z",
    "updatedAt": "2026-06-15T17:43:00.000Z"
  }
}
```

---

### F. Actualizar Usuario (Autenticado)
* **Método**: `PUT`
* **Ruta**: `/api/users/:id`
* **Headers**:
  * `Authorization: Bearer <TOKEN>`
  * `Content-Type: application/json`
* **Payload (Body)**: *(se pueden enviar solo los campos a modificar)*
```json
{
  "name": "Soporte Actualizado",
  "password": "NuevaPasswordSoporte123"
}
```
* **Reglas de Seguridad**:
  1. Si el usuario logueado **NO es un `ADMIN`**:
     * Solo puede editar su propio perfil (`req.params.id` igual a su propio ID). No puede editar perfiles ajenos.
     * Si envía campos como `role`, `companyDebt` o `isActive` en el cuerpo del request, el backend **los ignorará automáticamente** para prevenir escalado de privilegios y fraude de deudas.
  2. Si el usuario logueado **SÍ es un `ADMIN`**:
     * Puede actualizar cualquier usuario y modificar cualquier campo, incluyendo deudas, roles y estado de actividad.
* **Respuesta (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Soporte Actualizado",
    "username": "soporte",
    "phoneNumber": "+5491155556666",
    "role": "SUPP",
    "companyDebt": 1500,
    "isActive": true,
    "createdAt": "2026-06-15T17:43:00.000Z",
    "updatedAt": "2026-06-15T17:44:00.000Z"
  }
}
```
