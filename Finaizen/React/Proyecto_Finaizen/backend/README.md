# 🚀 Backend Finaizen - API REST

Backend desarrollado con Node.js y Express para el sistema de gestión financiera personal Finaizen.

## 📋 Requisitos Técnicos Implementados

✅ **Inicialización del proyecto**
- Node.js con gestor de paquetes npm
- Framework Express configurado
- Estructura modular de carpetas

✅ **Servidor Express**
- Escuchando en puerto configurable (default: 3000)
- CORS habilitado para desarrollo
- Middleware para procesamiento JSON

✅ **API REST con endpoints básicos**
- `GET /items` - Obtener todos los elementos
- `GET /items/:id` - Obtener elemento por ID
- `POST /items` - Crear nuevo elemento
- `PUT /items/:id` - Actualizar elemento
- `DELETE /items/:id` - Eliminar elemento por ID

✅ **Características adicionales**
- Arreglo en memoria como base de datos simulada
- Procesamiento de cuerpo con `express.json()`
- Códigos HTTP apropiados (200, 201, 404, 500)
- Validación de datos
- Manejo de errores

## 📁 Estructura del Proyecto

```
backend/
├── server.js              # Servidor principal Express
├── package.json           # Dependencias y scripts
├── .env                   # Variables de entorno
├── .env.example           # Ejemplo de configuración
├── .gitignore            # Archivos ignorados
├── controllers/           # Lógica de negocio
│   └── itemsController.js
├── routes/               # Definición de rutas
│   └── items.js
└── data/                 # Datos en memoria
    └── items.js
```

## 🔧 Instalación

1. **Navegar a la carpeta backend:**
```powershell
cd backend
```

2. **Instalar dependencias** (ya instaladas):
```powershell
npm install
```

## 🚀 Ejecutar el Servidor

### Modo desarrollo (con auto-reinicio):
```powershell
npm run dev
```

### Modo producción:
```powershell
npm start
```

El servidor se iniciará en: **http://localhost:3000**

## 📡 Endpoints Disponibles

### 1. **Información de la API**
```http
GET http://localhost:3000/
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Bienvenido a Finaizen API REST",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

### 2. **Obtener todos los items**
```http
GET http://localhost:3000/items
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Item 1",
      "description": "Primer elemento de ejemplo",
      "createdAt": "2026-01-13T..."
    }
  ]
}
```

### 3. **Obtener item por ID**
```http
GET http://localhost:3000/items/1
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Item 1",
    "description": "Primer elemento de ejemplo",
    "createdAt": "2026-01-13T..."
  }
}
```

**Error (404 NOT FOUND):**
```json
{
  "success": false,
  "message": "Item con ID 999 no encontrado"
}
```

### 4. **Crear nuevo item**
```http
POST http://localhost:3000/items
Content-Type: application/json

{
  "name": "Nuevo Item",
  "description": "Descripción del nuevo item"
}
```

**Respuesta (201 CREATED):**
```json
{
  "success": true,
  "message": "Item creado exitosamente",
  "data": {
    "id": 4,
    "name": "Nuevo Item",
    "description": "Descripción del nuevo item",
    "createdAt": "2026-01-13T..."
  }
}
```

### 5. **Actualizar item**
```http
PUT http://localhost:3000/items/1
Content-Type: application/json

{
  "name": "Item Actualizado",
  "description": "Descripción actualizada"
}
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "Item actualizado exitosamente",
  "data": { ... }
}
```

### 6. **Eliminar item**
```http
DELETE http://localhost:3000/items/1
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "Item eliminado exitosamente",
  "data": { ... }
}
```

## 🧪 Probar con Postman / Thunder Client

### **Opción 1: Postman**
1. Abrir Postman
2. Crear nueva petición
3. Seleccionar método HTTP (GET, POST, DELETE, etc.)
4. Ingresar URL: `http://localhost:3000/items`
5. Para POST/PUT: Ir a "Body" → "raw" → "JSON" y añadir el cuerpo
6. Click en "Send"

### **Opción 2: Thunder Client (VS Code)**
1. Instalar extensión "Thunder Client"
2. Abrir panel de Thunder Client
3. New Request
4. Configurar método y URL
5. Enviar petición

### **Opción 3: Navegador (solo GET)**
Abrir directamente:
- `http://localhost:3000/`
- `http://localhost:3000/items`
- `http://localhost:3000/items/1`

### **Opción 4: PowerShell (curl)**
```powershell
# GET todos los items
curl http://localhost:3000/items

# GET item por ID
curl http://localhost:3000/items/1

# POST crear item
curl -X POST http://localhost:3000/items `
  -H "Content-Type: application/json" `
  -d '{"name":"Item desde PowerShell","description":"Creado con curl"}'

# DELETE eliminar item
curl -X DELETE http://localhost:3000/items/1
```

## 📝 Ejemplos de Prueba

### Secuencia de pruebas recomendada:

1. **Verificar servidor funcionando:**
   ```
   GET http://localhost:3000/
   ```

2. **Ver items iniciales:**
   ```
   GET http://localhost:3000/items
   ```

3. **Crear nuevo item:**
   ```
   POST http://localhost:3000/items
   Body: {"name": "Mi Item", "description": "Prueba"}
   ```

4. **Verificar creación:**
   ```
   GET http://localhost:3000/items
   ```

5. **Actualizar item:**
   ```
   PUT http://localhost:3000/items/4
   Body: {"name": "Item Modificado"}
   ```

6. **Eliminar item:**
   ```
   DELETE http://localhost:3000/items/1
   ```

7. **Verificar eliminación:**
   ```
   GET http://localhost:3000/items
   ```

## 🔧 Configuración

### Variables de entorno (.env):
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Cambiar puerto:
Editar `.env` y cambiar `PORT=3000` a otro puerto disponible.

## 📦 Dependencias

- **express**: ^4.x - Framework web
- **cors**: ^2.x - Middleware CORS
- **nodemon**: ^3.x - Auto-reinicio en desarrollo

## 🛠️ Tecnologías

- Node.js
- Express.js
- ES Modules (import/export)
- CORS
- RESTful API

## ✅ Validación de Requisitos

| Requisito | Estado | Implementación |
|-----------|--------|----------------|
| Proyecto Node.js + npm | ✅ | package.json configurado |
| Framework Express | ✅ | server.js con Express |
| Puerto configurable | ✅ | Variable PORT en .env |
| GET /items | ✅ | itemsController.getItems |
| POST /items | ✅ | itemsController.createItem |
| DELETE /items/:id | ✅ | itemsController.deleteItem |
| Arreglo en memoria | ✅ | data/items.js |
| express.json() | ✅ | Middleware configurado |
| Códigos HTTP | ✅ | 200, 201, 404, 500 |
| Pruebas | ✅ | Ver sección de pruebas |

## 🚧 Próximos Pasos (Opcional)

- [ ] Conectar con base de datos real (MongoDB, PostgreSQL)
- [ ] Agregar autenticación y autorización
- [ ] Implementar endpoints para datos de Finaizen (usuarios, ingresos, egresos)
- [ ] Validaciones más robustas con express-validator
- [ ] Tests unitarios con Jest
- [ ] Documentación con Swagger

## 📞 Soporte

Para más información sobre el proyecto Finaizen, consultar la documentación principal en el directorio raíz.

---

**Desarrollado como parte del curso de Aplicaciones Web y Móviles**
*Fecha: Enero 2026*
