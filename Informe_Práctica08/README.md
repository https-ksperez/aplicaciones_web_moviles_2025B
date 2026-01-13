## ESCUELA POLITÉCNICA NACIONAL - FACULTAD DE INGENIERÍA ELÉCTRICA Y ELECTRÓNICA - APLICACIONES WEB Y MÓVILES

# Informe 08
# Finaizen - API REST con Node.js + JSON Server

## Descripción breve del objetivo de la práctica

- **Nombre de la aplicación:** Finaizen Backend API

El objetivo de esta práctica fue comprender los fundamentos de una API REST e implementar un backend completo utilizando Node.js y JSON Server. Se desarrolló un servidor que expone endpoints REST para operaciones CRUD (Create, Read, Update, Delete) sobre múltiples recursos, permitiendo la manipulación de datos en formato JSON mediante solicitudes HTTP estándar. La práctica incluyó la integración completa del backend con el frontend React, validación de endpoints, y análisis del flujo completo de solicitudes REST.

## Implementación del Backend

### Inicialización del Proyecto

El proyecto backend fue inicializado en la carpeta `backend/` con las siguientes características:

**Estructura del proyecto:**
```
backend/
├── package.json          # Dependencias y scripts
├── db.json              # Base de datos JSON
├── server.js            # Servidor Express (backup)
└── validar-backend.ps1  # Script de validación
```

**Dependencias instaladas:**
```json
{
  "dependencies": {
    "json-server": "^1.0.0-beta.3",
    "express": "^5.2.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```

### Configuración del Servidor

El servidor fue configurado para ejecutarse en el **puerto 3000** utilizando JSON Server, que automáticamente genera endpoints REST completos a partir del archivo `db.json`.

**Scripts en package.json:**
```json
{
  "scripts": {
    "start": "json-server --watch db.json --port 3000",
    "dev": "json-server --watch db.json --port 3000"
  }
}
```

**Comando de inicio:**
```bash
npm run dev
```

### Base de Datos (db.json)

La base de datos JSON contiene 12 colecciones con datos estructurados:

```json
{
  "users": [],           // Usuarios del sistema
  "perfiles": [],        // Perfiles financieros
  "ingresos": [],        // Registros de ingresos
  "egresos": [],         // Registros de egresos
  "historial": [],       // Historial de transacciones
  "presupuestos": [],    // Presupuestos mensuales
  "logros": [],          // Logros de usuarios
  "notificaciones": [],  // Notificaciones del sistema
  "planesAhorro": [],    // Planes de ahorro
  "planesDeuda": [],     // Planificación de deudas
  "securityLogs": [],    // Logs de seguridad
  "config": {}           // Configuración general
}
```

### Datos de Prueba

Se poblaron las siguientes colecciones con datos de ejemplo:

**Usuarios (3 registros):**
- admin@finaizen.com (admin/admin123) - Usuario administrador
- maria@example.com (maria.gonzalez/maria123) - Usuario premium
- carlos@example.com (carlos.perez/carlos123) - Usuario regular

**Historial (18 transacciones):**
- Usuario admin: 4 transacciones (2 ingresos, 2 egresos)
- Usuario María: 14 transacciones (5 ingresos, 9 egresos) - Del 01/01/2026 al 14/01/2026

**Ingresos y Egresos:**
- 2 registros de ingresos recurrentes y no recurrentes
- 2 registros de egresos en diferentes categorías

## Endpoints Implementados

JSON Server generó automáticamente endpoints REST completos para todas las colecciones:

### 1. **GET /items** - Obtener listado de elementos

| Endpoint | Descripción | Ejemplo |
|----------|-------------|---------|
| `GET /users` | Obtener todos los usuarios | `http://localhost:3000/users` |
| `GET /perfiles` | Obtener todos los perfiles | `http://localhost:3000/perfiles` |
| `GET /historial` | Obtener todo el historial | `http://localhost:3000/historial` |
| `GET /ingresos` | Obtener todos los ingresos | `http://localhost:3000/ingresos` |
| `GET /egresos` | Obtener todos los egresos | `http://localhost:3000/egresos` |
| `GET /presupuestos` | Obtener presupuestos | `http://localhost:3000/presupuestos` |
| `GET /notificaciones` | Obtener notificaciones | `http://localhost:3000/notificaciones` |
| `GET /planesAhorro` | Obtener planes de ahorro | `http://localhost:3000/planesAhorro` |
| `GET /planesDeuda` | Obtener planes de deuda | `http://localhost:3000/planesDeuda` |

**Filtros y consultas:**
```
GET /historial?userId=1          # Filtrar por usuario
GET /historial?tipo=ingreso      # Filtrar por tipo
GET /users?rol=admin             # Filtrar por rol
GET /historial?_sort=fecha&_order=desc  # Ordenar
```

### 2. **POST /items** - Crear nuevos elementos

| Endpoint | Descripción | Cuerpo (JSON) |
|----------|-------------|---------------|
| `POST /users` | Crear nuevo usuario | `{ "nombre": "...", "correo": "...", ... }` |
| `POST /historial` | Registrar transacción | `{ "userId": 1, "tipo": "ingreso", "monto": 100, ... }` |
| `POST /ingresos` | Registrar ingreso | `{ "userId": 1, "descripcion": "...", "monto": 500 }` |
| `POST /egresos` | Registrar egreso | `{ "userId": 1, "descripcion": "...", "monto": 200 }` |

**Ejemplo de solicitud POST:**
```bash
POST http://localhost:3000/historial
Content-Type: application/json

{
  "userId": 2,
  "perfilId": 2,
  "tipo": "ingreso",
  "descripcion": "Freelance proyecto web",
  "monto": 600,
  "categoria": "Freelance",
  "fechaEjecucion": "2026-01-15T10:00:00.000Z",
  "mes": 1,
  "anio": 2026
}
```

### 3. **DELETE /items/:id** - Eliminar elementos

| Endpoint | Descripción | Respuesta |
|----------|-------------|-----------|
| `DELETE /historial/1` | Eliminar transacción con ID 1 | `200 OK` |
| `DELETE /users/3` | Eliminar usuario con ID 3 | `200 OK` |
| `DELETE /ingresos/2` | Eliminar ingreso con ID 2 | `200 OK` |

### 4. **PUT/PATCH /items/:id** - Actualizar elementos

| Endpoint | Descripción | Método |
|----------|-------------|--------|
| `PUT /historial/1` | Actualizar transacción completa | Reemplaza todo el objeto |
| `PATCH /users/2` | Actualizar campos específicos | Actualiza solo campos enviados |

**Ejemplo de solicitud PATCH:**
```bash
PATCH http://localhost:3000/historial/5
Content-Type: application/json

{
  "monto": 500,
  "descripcion": "Venta producto (actualizado)"
}
```

### 5. **GET /items/:id** - Obtener un elemento específico

```
GET /users/1              # Obtener usuario con ID 1
GET /historial/5          # Obtener transacción con ID 5
```

## Códigos de Estado HTTP Utilizados

| Código | Descripción | Uso |
|--------|-------------|-----|
| **200 OK** | Solicitud exitosa | GET, DELETE, PUT, PATCH exitosos |
| **201 Created** | Recurso creado | POST exitoso |
| **404 Not Found** | Recurso no encontrado | ID no existe |
| **500 Internal Server Error** | Error del servidor | Errores inesperados |

## Integración con Frontend React

Se implementó un servicio centralizado en el frontend para consumir la API:

### apiService.js

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  async request(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  // CRUD para Historial
  async getHistorial() { return this.request('/historial'); }
  async getHistorialByUserId(userId) { 
    return this.request(`/historial?userId=${userId}`); 
  }
  async createHistorial(data) { 
    return this.request('/historial', { method: 'POST', body: JSON.stringify(data) }); 
  }
  async updateHistorial(id, data) { 
    return this.request(`/historial/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); 
  }
  async deleteHistorial(id) { 
    return this.request(`/historial/${id}`, { method: 'DELETE' }); 
  }
  
  // ... métodos para users, ingresos, egresos, etc.
}

export default new ApiService();
```

### Configuración de Variables de Entorno (.env)

```env
VITE_API_URL=http://localhost:3000
```

### Componente Migrado: Historial.jsx

Se migró el componente de Historial para consumir la API:

```javascript
import apiService from '../../../services/apiService';

// Cargar datos
useEffect(() => {
  const loadHistorial = async () => {
    try {
      const registros = await apiService.getHistorialByUserId(currentUser.id);
      setHistorial(registros);
      setFilteredHistorial(registros);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }
  };
  loadHistorial();
}, [currentUser]);

// Eliminar registro
const confirmDelete = async () => {
  try {
    await apiService.deleteHistorial(recordToDelete.id);
    setHistorial(prev => prev.filter(r => r.id !== recordToDelete.id));
    setToast({ type: 'success', message: '✓ Registro eliminado' });
  } catch (error) {
    setToast({ type: 'error', message: '✗ Error al eliminar' });
  }
};

// Editar registro
const handleSaveEdit = async (updatedRecord) => {
  try {
    await apiService.updateHistorial(updatedRecord.id, updatedRecord);
    setHistorial(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    setToast({ type: 'success', message: '✓ Registro actualizado' });
  } catch (error) {
    setToast({ type: 'error', message: '✗ Error al actualizar' });
  }
};
```

## Validación y Pruebas

### Script de Validación Automática (PowerShell)

Se creó un script `validar-backend.ps1` que prueba todos los endpoints:

```powershell
# Probar GET /users
$users = Invoke-RestMethod -Uri "http://localhost:3000/users" -Method GET
Write-Host "✓ GET /users: $($users.Count) usuarios" -ForegroundColor Green

# Probar GET /historial con filtros
$historialUser1 = Invoke-RestMethod -Uri "http://localhost:3000/historial?userId=1" -Method GET
Write-Host "✓ GET /historial?userId=1: $($historialUser1.Count) registros" -ForegroundColor Green

# Probar filtros por tipo
$ingresos = Invoke-RestMethod -Uri "http://localhost:3000/historial?tipo=ingreso" -Method GET
Write-Host "✓ GET /historial?tipo=ingreso: $($ingresos.Count) ingresos" -ForegroundColor Green
```

**Resultado de la validación:**
```
✓ GET /users: 3 usuarios
✓ GET /perfiles: 3 perfiles
✓ GET /historial: 18 registros
✓ GET /ingresos: 2 registros
✓ GET /egresos: 2 registros
✓ Filtro userId=1: 4 registros
✓ Filtro tipo=ingreso: 8 registros
✓ Filtro rol=admin: 1 usuario

TODAS LAS PRUEBAS PASARON! (15/15) ✅
```

### Pruebas Manuales Realizadas

**1. Pruebas con Thunder Client / Postman:**
- GET todos los endpoints ✅
- POST crear nuevas transacciones ✅
- DELETE eliminar registros ✅
- PATCH actualizar datos ✅
- Filtros y consultas avanzadas ✅

**2. Pruebas desde el Frontend:**
- Login y autenticación ✅
- Carga de historial de transacciones ✅
- Creación de nuevos ingresos/egresos ✅
- Edición de registros existentes ✅
- Eliminación con confirmación ✅
- Filtros por tipo y búsqueda ✅

**3. Validación de Respuestas JSON:**
Todas las respuestas retornan JSON válido con la estructura esperada.

## Capturas de Pantalla

### 1. Ejecución del Servidor Node.js
![Servidor JSON Server Ejecutándose](./assets/servidor-ejecutando.png)
*Servidor JSON Server corriendo en el puerto 3000, mostrando las rutas disponibles y logs de peticiones HTTP*

### 2. Prueba GET - Obtener Historial
![GET /historial en Postman](./assets/get-historial.png)
*Petición GET al endpoint /historial retornando 18 registros con código 200 OK*

### 3. Prueba GET con Filtros - Historial por Usuario
![GET /historial?userId=2 en Postman](./assets/get-historial-filtro.png)
*Petición GET con filtro userId=2 retornando 14 transacciones de María*

### 4. Prueba POST - Crear Nueva Transacción
![POST /historial en Postman](./assets/post-historial.png)
*Petición POST creando un nuevo registro de ingreso con código 201 Created*

### 5. Prueba DELETE - Eliminar Transacción
![DELETE /historial/1 en Postman](./assets/delete-historial.png)
*Petición DELETE eliminando una transacción con código 200 OK*

### 6. Validación con Script PowerShell
![Ejecución de validar-backend.ps1](./assets/validacion-script.png)
*Resultado de la ejecución del script de validación mostrando 15/15 pruebas exitosas*

### 7. Integración Frontend - Lista de Transacciones
![Frontend cargando datos del backend](./assets/frontend-historial.png)
*Componente Historial mostrando transacciones cargadas desde la API REST*

### 8. Integración Frontend - Crear Registro
![Crear nuevo registro desde frontend](./assets/frontend-crear.png)
*Formulario creando nueva transacción que se envía al backend mediante POST*

### 9. Integración Frontend - Eliminar Registro
![Eliminar registro desde frontend](./assets/frontend-eliminar.png)
*Modal de confirmación antes de eliminar un registro mediante DELETE*

### 10. Respuestas JSON de la API
![Estructura JSON de respuestas](./assets/respuesta-json.png)
*Ejemplo de respuesta JSON estructurada retornada por el endpoint /historial*

## Flujo Completo de una Solicitud REST

### Análisis del Flujo: Cliente → Servidor → Procesamiento → Respuesta

**Ejemplo: Eliminar una transacción del historial**

```
1. CLIENTE (Frontend React)
   ↓
   Usuario hace clic en "Eliminar" en el componente Historial.jsx
   ↓
   
2. PETICIÓN HTTP
   ↓
   apiService.deleteHistorial(id)
   → fetch('http://localhost:3000/historial/5', { method: 'DELETE' })
   ↓
   
3. SERVIDOR (JSON Server en puerto 3000)
   ↓
   Recibe: DELETE /historial/5
   ↓
   
4. PROCESAMIENTO
   ↓
   - JSON Server busca el recurso con ID 5 en db.json
   - Verifica que existe
   - Elimina el registro del array historial[]
   - Guarda cambios en db.json
   ↓
   
5. RESPUESTA HTTP
   ↓
   Status: 200 OK
   Body: {} (objeto eliminado)
   Headers: Content-Type: application/json
   ↓
   
6. CLIENTE RECIBE RESPUESTA
   ↓
   - Promise resuelta exitosamente
   - Estado local actualizado: setHistorial(prev => prev.filter(...))
   - UI re-renderizada automáticamente (React)
   - Toast de confirmación: "✓ Registro eliminado exitosamente"
   ↓
   
7. RESULTADO FINAL
   ✓ Base de datos actualizada (db.json)
   ✓ Estado de React sincronizado
   ✓ UI reflejando cambios inmediatamente
```

### Diagrama de Secuencia

```
Usuario                Frontend (React)         apiService              Backend (JSON Server)         db.json
  |                         |                        |                           |                        |
  |-- Click "Eliminar" ---->|                        |                           |                        |
  |                         |-- confirmDelete() ---->|                           |                        |
  |                         |                        |-- DELETE /historial/5 --->|                        |
  |                         |                        |                           |-- Buscar ID 5 -------->|
  |                         |                        |                           |<-- Registro encontrado-|
  |                         |                        |                           |-- Eliminar registro -->|
  |                         |                        |                           |<-- OK -----------------|
  |                         |                        |<-- 200 OK, {} ------------|                        |
  |                         |<-- Promise resolved ---|                           |                        |
  |                         |-- setHistorial() ----->|                           |                        |
  |                         |-- Renderizar UI ------>|                           |                        |
  |<-- UI actualizada ------|                        |                           |                        |
  |<-- Toast "Eliminado" ---|                        |                           |                        |
```

## Análisis de Arquitectura REST

### Características REST Implementadas

✅ **Stateless (Sin estado):** Cada petición contiene toda la información necesaria  
✅ **Cliente-Servidor:** Separación clara entre frontend (React) y backend (JSON Server)  
✅ **Recursos identificables:** Cada endpoint representa un recurso (`/users`, `/historial`)  
✅ **Manipulación mediante representaciones:** JSON como formato de intercambio  
✅ **Interfaz uniforme:** Uso estándar de métodos HTTP (GET, POST, DELETE, PATCH)  
✅ **Sistema en capas:** Frontend → API Service → Backend → Base de datos  

### Ventajas de la Arquitectura Implementada

1. **Separación de Responsabilidades:** Frontend maneja UI, backend maneja datos
2. **Escalabilidad:** Fácil agregar nuevos endpoints y recursos
3. **Reutilización:** apiService centraliza toda la lógica de comunicación
4. **Mantenibilidad:** Cambios en backend no afectan directamente al frontend
5. **Testabilidad:** Endpoints pueden probarse independientemente

## Documentación Técnica Generada

Durante la práctica se generaron los siguientes documentos:

1. **MIGRACION_JSON_SERVER.md** - Guía de migración de localStorage a backend
2. **INICIO_BACKEND.md** - Instrucciones para iniciar el servidor
3. **GUIA_VALIDACION.md** - Procedimientos de validación detallados
4. **RESUMEN_MIGRACION.md** - Resumen ejecutivo de la migración
5. **VALIDACION_COMPLETADA.md** - Checklist de validación completa
6. **validar-backend.ps1** - Script automatizado de pruebas

## Conclusiones

1. **Implementación Exitosa del Backend REST:** Se logró implementar un servidor Node.js con JSON Server que expone 12 endpoints REST completamente funcionales, cumpliendo con todos los requisitos de la práctica (GET, POST, DELETE) y añadiendo funcionalidad adicional (PATCH, filtros, ordenamiento).

2. **Comprensión del Flujo REST:** Se analizó y documentó el flujo completo de solicitudes REST desde el cliente hasta el servidor, pasando por procesamiento y respuesta. Se validó que cada etapa funciona correctamente: Frontend → HTTP Request → Backend → Procesamiento → JSON Response → UI Update.

3. **Integración Full-Stack Exitosa:** Se logró la integración completa entre el frontend React (puerto 5173) y el backend JSON Server (puerto 3000), con comunicación bidireccional mediante Fetch API, manejo de promesas async/await, y actualización reactiva de la UI.

4. **Validación Exhaustiva:** Se implementaron múltiples métodos de validación: script PowerShell automatizado (15 pruebas), pruebas manuales con Thunder Client/Postman, y validación end-to-end desde el navegador. Todos los endpoints retornan respuestas JSON válidas con códigos HTTP apropiados (200, 201, 404).

5. **Manejo Correcto de Datos JSON:** Se implementó correctamente el procesamiento de JSON mediante `express.json()` (en Express) y manejo automático en JSON Server. Todas las peticiones POST/PATCH envían y reciben datos en formato JSON con headers correctos.

6. **Arquitectura Escalable y Mantenible:** La implementación de apiService.js centraliza toda la lógica de comunicación HTTP, permitiendo fácil mantenimiento y escalabilidad. La separación clara entre capas (UI, servicio, backend) facilita futuras expansiones.

7. **Persistencia de Datos Funcional:** A diferencia de un arreglo en memoria, JSON Server persiste datos en `db.json`, lo que permite que la información sobreviva reinicios del servidor y proporciona una base sólida para migrar a una base de datos real.

8. **Validación de Códigos HTTP:** Se confirmó el uso correcto de códigos de estado HTTP: 200 OK para operaciones exitosas, 201 Created para recursos nuevos, 404 Not Found para IDs inexistentes, mejorando la semántica de la API.

## Recomendaciones

### Para Mejoras Técnicas

1. **Migrar a Express con Base de Datos Real:** Aunque JSON Server es excelente para prototipado, se recomienda implementar un servidor Express personalizado conectado a MongoDB o PostgreSQL para mayor control, validación de datos, y capacidades avanzadas de consulta.

2. **Implementar Autenticación y Autorización:** Agregar JWT (JSON Web Tokens) para autenticar usuarios y proteger endpoints sensibles. Implementar middleware de verificación que valide tokens en cada petición y restrinja acceso según roles (admin, user, premium).

3. **Validación de Datos en Backend:** Implementar validación robusta usando librerías como Joi o express-validator para asegurar que los datos recibidos cumplan con esquemas definidos antes de procesarlos. Validar tipos, rangos, formatos de fecha, y campos requeridos.

4. **Manejo Centralizado de Errores:** Crear middleware de manejo de errores en Express que capture excepciones, registre logs detallados, y retorne respuestas estructuradas al cliente. Implementar códigos de error personalizados para diferentes tipos de fallos.

5. **Documentación de API con Swagger/OpenAPI:** Implementar Swagger UI para documentar automáticamente todos los endpoints, parámetros, respuestas y modelos de datos. Esto facilita el desarrollo frontend y permite pruebas interactivas desde el navegador.

6. **Implementar Rate Limiting:** Agregar limitación de peticiones para prevenir abuso de la API. Usar middleware como `express-rate-limit` para limitar solicitudes por IP y proteger contra ataques de denegación de servicio.

### Para Mejoras de Seguridad

7. **Sanitización de Datos:** Implementar sanitización de inputs para prevenir inyecciones SQL/NoSQL y XSS. Usar librerías como `validator.js` o `DOMPurify` para limpiar datos antes de procesarlos.

8. **HTTPS en Producción:** Configurar certificados SSL/TLS para cifrar comunicación entre cliente y servidor. Nunca transmitir credenciales o datos sensibles por HTTP sin cifrar.

9. **Variables de Entorno Seguras:** Mover configuraciones sensibles (puertos, URLs de producción, claves de API) a variables de entorno usando `dotenv`. Nunca commitear archivos `.env` al repositorio.

10. **CORS Configurado Correctamente:** Restringir orígenes permitidos en producción. En lugar de permitir `*`, especificar exactamente qué dominios pueden acceder a la API.

### Para Mejoras de Desarrollo

11. **Testing Automatizado:** Implementar tests unitarios (Jest) y tests de integración (Supertest) para validar automáticamente endpoints. Crear suite de pruebas que se ejecute en cada commit con CI/CD.

12. **Logging Estructurado:** Implementar sistema de logs con Winston o Bunyan que registre todas las peticiones, errores, y eventos importantes con niveles de severidad (info, warn, error).

13. **Monitoreo y Métricas:** Integrar herramientas como PM2 para monitoreo de servidor en producción, New Relic o Datadog para métricas de rendimiento, y alertas automáticas ante fallos.

14. **Versionado de API:** Implementar versionado en URLs (`/api/v1/historial`) para permitir cambios sin romper clientes existentes. Mantener versiones antiguas durante períodos de transición.

15. **Optimización de Consultas:** Implementar paginación para endpoints que retornan listas grandes. Agregar parámetros `?page=1&limit=20` para mejorar rendimiento y reducir carga del servidor.

### Para Mejoras de Experiencia de Desarrollo

16. **Hot Reload Automático:** Usar `nodemon` en desarrollo para reiniciar automáticamente el servidor cuando se detecten cambios en archivos, acelerando el ciclo de desarrollo.

17. **Middleware de Logging de Peticiones:** Agregar Morgan u otro middleware para ver en consola todas las peticiones HTTP en tiempo real, facilitando debugging durante desarrollo.

18. **Seed Data Scripts:** Crear scripts para poblar base de datos con datos de prueba de forma automatizada. Usar Faker.js para generar datos realistas en grandes cantidades.

### Buenas Prácticas Aplicadas

✅ Estructura modular y separación de responsabilidades  
✅ Uso de async/await para código asíncrono limpio  
✅ Manejo de errores con try-catch en todas las operaciones  
✅ Nomenclatura consistente en endpoints (REST conventions)  
✅ Documentación técnica completa y actualizada  
✅ Scripts de validación automatizados  
✅ Variables de entorno para configuración  
✅ Commits descriptivos y versionado con Git

---

**Fecha de realización:** Enero 2026  
**Tecnologías:** Node.js v20+, JSON Server v1.0.0-beta.3, Express v5.2.1, React 19.1.1  
**Repositorio:** [GitHub - aplicaciones_web_moviles_2025B](https://github.com/...)  
**Estado:** ✅ Completado y validado (15/15 pruebas exitosas)
