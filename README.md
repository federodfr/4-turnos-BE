# 4-turnos-BE - Sistema de Gestión de Turnos (Capa de Controladores y Formato de Respuesta Estandarizado)

Cuarta iteración del backend para la gestión de turnos y servicios. En esta versión se incorpora la **Capa de Controladores**, logrando una clara separación entre el enrutamiento HTTP y el manejo de peticiones/respuestas, y se implementa un **formato estándar unificado de respuesta (`status` y `payload`/`message`)** para toda la API.

---

## 📋 Descripción y Nuevas Actualizaciones

En comparación con `3-turnos-BE`, esta versión implementa:

1. **Capa de Controladores (`src/controllers/`)**:
   - `src/controllers/services.controller.js`: Gestiona las peticiones y respuestas para los servicios (`getServices`, `getServicesById`, `createService`, `updateService`, `deleteService`).
   - `src/controllers/bookings.controller.js`: Gestiona las peticiones y respuestas para las reservas (`getBookingByID`, `createBooking`, `updateServiceForBooking`).
   - Los routers (`src/routes/`) ahora tienen la única responsabilidad de mapear rutas HTTP hacia las funciones del controlador correspondiente.
2. **Estandarización de Respuestas de la API**:
   - **Éxito**:
     ```json
     {
       "status": "success",
       "payload": <datos>
     }
     ```
   - **Error**:
     ```json
     {
       "status": "error",
       "message": "<descripción del error>"
     }
     ```
3. **Manejo Robusto de Errores**:
   - Los managers ahora propagan excepciones (`throw error`) y los controladores capturan los fallos mediante bloques `try/catch`, respondiendo con códigos de estado HTTP semánticos (`200`, `201`, `400`, `404`, `500`).
4. **Persistencia**:
   - Mantiene el almacenamiento en archivos JSON en `src/data/services.json` y `src/data/bookings.json`.

---

## 🛠️ Requisitos Previos

- **Node.js** (versión 18 o superior)
- **npm**

---

## ⚙️ Variables de Entorno

Configura el archivo `.env` en la raíz de `4-turnos-BE`:

```env
PORT=8080
NODE_ENV=development
```

| Variable | Tipo | Obligatoria | Descripción |
| :--- | :--- | :--- | :--- |
| `PORT` | Number | Sí | Puerto donde escucha el servidor |
| `NODE_ENV` | String | Sí | Modo de ejecución (`development` / `production`) |

---

## 📦 Cómo Instalar

1. Navega al directorio del proyecto:
   ```bash
   cd 4-turnos-BE
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Genera el archivo de entorno:
   ```bash
   cp .env.example .env
   ```
   *(En PowerShell: `Copy-Item .env.example .env`)*

---

## 🚀 Cómo Ejecutar

- **Modo Desarrollo** (con recarga automática):
  ```bash
  npm run dev
  ```

- **Modo Producción**:
  ```bash
  npm start
  ```

Disponible en: `http://localhost:8080`.

---

## 📁 Estructura del Proyecto

```text
4-turnos-BE/
├── .env.example                  # Plantilla de variables de entorno
├── package.json                  # Dependencias y scripts
├── src/
│   ├── app.js                    # Configuración de Express, middlewares y rutas
│   ├── server.js                 # Listener del servidor HTTP
│   ├── config/
│   │   └── env.config.js         # Validación de variables de entorno
│   ├── controllers/              # [NUEVO] Capa de controladores
│   │   ├── bookings.controller.js
│   │   └── services.controller.js
│   ├── data/
│   │   ├── bookings.json         # Persistencia de turnos
│   │   └── services.json         # Persistencia de servicios
│   ├── managers/
│   │   ├── BookingManager.js     # Gestión de reservas
│   │   └── ServiceManager.js     # Gestión de servicios
│   ├── routes/
│   │   ├── booking.router.js     # Mapeo de rutas a controladores de reservas
│   │   └── services.router.js    # Mapeo de rutas a controladores de servicios
│   └── utils/
│       └── http.js
```

---

## 🏷️ Descripción de Recursos

### Recurso `services`
- `id` (UUID): Identificador único.
- `name` (String): Nombre del servicio.
- `description` (String): Detalle del servicio.
- `duration` (Number): Duración en minutos.
- `price` (Number): Costo monetario.
- `category` (String): Categoría.
- `available` (Boolean): Disponibilidad actual.

### Recurso `bookings`
- `id` (UUID): Identificador único de la reserva.
- `clientName` (String): Nombre del cliente.
- `clientEmail` (String): Email del cliente.
- `date` (String): Fecha del turno (`YYYY-MM-DD`).
- `time` (String): Hora del turno (`HH:mm`).
- `status` (String): Estado de la reserva (`confirmed`, `pending`, etc.).
- `services` (Array): Lista de servicios asociados `[{ service: String, quantity: Number }]`.

---

## 🔌 Endpoints y Ejemplos de Uso

A partir de esta versión, **todas las respuestas** siguen el formato estandarizado `{ status, payload }` o `{ status, message }`.

### Servicios (`/services`)

#### 1. Obtener todos los servicios
```bash
curl -X GET http://localhost:8080/services
```

**Respuesta Exitosa (200 OK):**
```json
{
  "status": "success",
  "payload": [
    {
      "id": "7a1e0b52-5a21-4d33-a621-e0c904fa1801",
      "name": "Tratamiento Capilar",
      "description": "Nutrición con keratina y botox capilar",
      "duration": 60,
      "price": 22000,
      "category": "Peluquería",
      "available": true
    }
  ]
}
```

---

#### 2. Obtener servicio por ID (`:sid`)
```bash
curl -X GET http://localhost:8080/services/7a1e0b52-5a21-4d33-a621-e0c904fa1801
```

**Respuesta Exitosa (200 OK):**
```json
{
  "status": "success",
  "payload": {
    "id": "7a1e0b52-5a21-4d33-a621-e0c904fa1801",
    "name": "Tratamiento Capilar",
    "description": "Nutrición con keratina y botox capilar",
    "duration": 60,
    "price": 22000,
    "category": "Peluquería",
    "available": true
  }
}
```

**Respuesta de Error (404 Not Found):**
```json
{
  "status": "error",
  "message": "Servicio no encontrado"
}
```

---

#### 3. Crear servicio
```bash
curl -X POST http://localhost:8080/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pedicura Spa",
    "description": "Exfoliación, masaje y esmaltado",
    "duration": 50,
    "price": 11000,
    "category": "Estética",
    "available": true
  }'
```

**Respuesta Exitosa (201 Created):**
```json
{
  "status": "success",
  "payload": {
    "id": "3c4a9192-35db-441f-829d-4786d79e6f30",
    "name": "Pedicura Spa",
    "description": "Exfoliación, masaje y esmaltado",
    "duration": 50,
    "price": 11000,
    "category": "Estética",
    "available": true
  }
}
```

---

#### 4. Actualizar servicio (`:sid`)
```bash
curl -X PUT http://localhost:8080/services/3c4a9192-35db-441f-829d-4786d79e6f30 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 12500
  }'
```

**Respuesta Exitosa (200 OK):**
```json
{
  "status": "success",
  "payload": {
    "id": "3c4a9192-35db-441f-829d-4786d79e6f30",
    "name": "Pedicura Spa",
    "description": "Exfoliación, masaje y esmaltado",
    "duration": 50,
    "price": 12500,
    "category": "Estética",
    "available": true
  }
}
```

---

#### 5. Eliminar servicio (`:sid`)
```bash
curl -X DELETE http://localhost:8080/services/3c4a9192-35db-441f-829d-4786d79e6f30
```

**Respuesta Exitosa (200 OK):**
```json
{
  "status": "success",
  "payload": {
    "id": "3c4a9192-35db-441f-829d-4786d79e6f30",
    "name": "Pedicura Spa",
    "description": "Exfoliación, masaje y esmaltado",
    "duration": 50,
    "price": 12500,
    "category": "Estética",
    "available": true
  }
}
```

---

### Reservas / Turnos (`/bookings`)

#### 1. Obtener reserva por ID (`:bid`)
```bash
curl -X GET http://localhost:8080/bookings/9a3d4f82-0198-4b72-9b0d-2bca4871e98a
```

**Respuesta Exitosa (200 OK):**
```json
{
  "status": "success",
  "payload": {
    "id": "9a3d4f82-0198-4b72-9b0d-2bca4871e98a",
    "clientName": "Juan Pérez",
    "clientEmail": "juan.perez@example.com",
    "date": "2026-11-20",
    "time": "15:00",
    "status": "confirmed",
    "services": [
      {
        "service": "7a1e0b52-5a21-4d33-a621-e0c904fa1801",
        "quantity": 1
      }
    ]
  }
}
```

---

#### 2. Crear una reserva
```bash
curl -X POST http://localhost:8080/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Laura Gómez",
    "clientEmail": "laura.gomez@example.com",
    "date": "2026-11-25",
    "time": "11:30",
    "status": "pending",
    "services": [
      {
        "service": "7a1e0b52-5a21-4d33-a621-e0c904fa1801",
        "quantity": 1
      }
    ]
  }'
```

**Respuesta Exitosa (200 OK):**
```json
{
  "status": "success",
  "payload": {
    "id": "4e712a80-1a2f-410a-b9c1-84091a0c4f81",
    "clientName": "Laura Gómez",
    "clientEmail": "laura.gomez@example.com",
    "date": "2026-11-25",
    "time": "11:30",
    "status": "pending",
    "services": [
      {
        "service": "7a1e0b52-5a21-4d33-a621-e0c904fa1801",
        "quantity": 1
      }
    ]
  }
}
```

---

#### 3. Agregar o incrementar un servicio a una reserva
```bash
curl -X POST http://localhost:8080/bookings/4e712a80-1a2f-410a-b9c1-84091a0c4f81/services/3c4a9192-35db-441f-829d-4786d79e6f30
```

**Respuesta Exitosa (200 OK):**
```json
{
  "status": "success",
  "payload": {
    "id": "4e712a80-1a2f-410a-b9c1-84091a0c4f81",
    "clientName": "Laura Gómez",
    "clientEmail": "laura.gomez@example.com",
    "date": "2026-11-25",
    "time": "11:30",
    "status": "pending",
    "services": [
      {
        "service": "7a1e0b52-5a21-4d33-a621-e0c904fa1801",
        "quantity": 1
      },
      {
        "service": "3c4a9192-35db-441f-829d-4786d79e6f30",
        "quantity": 1
      }
    ]
  }
}
```

