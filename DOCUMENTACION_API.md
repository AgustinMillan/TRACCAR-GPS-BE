# Documentación de API: Clientes (`Client`), Motos (`MotorBike`) y Archivos (`File`)

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
*(Nota: El campo `url` devuelto es el que debe guardarse en el cliente, por ejemplo en el campo `dni`, `driverLicense`, `serviceBill` del cliente, o `seguro` en la moto).*

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
