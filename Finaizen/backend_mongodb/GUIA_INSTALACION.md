# 📚 Guía de Instalación - Backend MongoDB para Finaizen

## 📋 Requisitos Previos

1. **Node.js** (v18 o superior)
2. **MongoDB** (v6 o superior) instalado y ejecutándose localmente
3. **npm** o **yarn**

## 🚀 Paso a Paso para Iniciar

### Paso 1: Instalar dependencias

```bash
cd Finaizen/backend_mongodb
npm install
```

### Paso 2: Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto (copia de `.env.example`):

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
PORT=8001
MONGODB_URI=mongodb://localhost/finaizen_db
JWT_SECRET=TuClaveSecretaMuySegura123!
JWT_EXPIRES_IN=30d
```

### Paso 3: Iniciar MongoDB

Asegúrate de que MongoDB esté corriendo:

```bash
# En Windows, si MongoDB está como servicio, ya debería estar corriendo
# Si no, inicia mongod manualmente:
mongod
```

### Paso 4: Iniciar el servidor

```bash
# Desarrollo con hot-reload
npm run dev

# O producción
npm start
```

El servidor estará disponible en: `http://localhost:8001`

## 📁 Estructura del Proyecto

```
backend_mongodb/
├── config/
│   └── mongoose.config.js    # Configuración de conexión a MongoDB
├── controllers/
│   ├── user.controller.js     # Autenticación y usuarios
│   ├── perfil.controller.js   # Gestión de perfiles
│   ├── ingreso.controller.js  # CRUD de ingresos
│   ├── egreso.controller.js   # CRUD de egresos
│   ├── presupuesto.controller.js  # CRUD de presupuestos
│   └── planAhorro.controller.js   # CRUD de planes de ahorro
├── middlewares/
│   ├── auth.middleware.js     # Protección de rutas con JWT
│   └── errorHandler.js        # Manejo centralizado de errores
├── models/
│   ├── user.model.js          # Esquema de usuarios
│   ├── perfil.model.js        # Esquema de perfiles
│   ├── ingreso.model.js       # Esquema de ingresos
│   ├── egreso.model.js        # Esquema de egresos
│   ├── presupuesto.model.js   # Esquema de presupuestos
│   └── planAhorro.model.js    # Esquema de planes de ahorro
├── routes/
│   ├── user.routes.js         # Rutas de autenticación
│   ├── perfil.routes.js       # Rutas de perfiles
│   ├── ingreso.routes.js      # Rutas de ingresos
│   ├── egreso.routes.js       # Rutas de egresos
│   ├── presupuesto.routes.js  # Rutas de presupuestos
│   └── planAhorro.routes.js   # Rutas de planes de ahorro
├── .env.example               # Ejemplo de variables de entorno
├── package.json               # Dependencias del proyecto
└── server.js                  # Punto de entrada principal
```

## 🔐 Endpoints Disponibles

### Autenticación (Público)
- `POST /api/register` - Registrar usuario
- `POST /api/login` - Iniciar sesión

### Perfiles (Protegido)
- `GET /api/perfiles` - Obtener perfiles del usuario
- `POST /api/perfiles` - Crear perfil
- `PUT /api/perfiles/:id` - Actualizar perfil
- `DELETE /api/perfiles/:id` - Eliminar perfil

### Ingresos (Protegido)
- `GET /api/ingresos/:perfilId` - Obtener ingresos de un perfil
- `POST /api/ingresos` - Crear ingreso
- `PUT /api/ingresos/:id` - Actualizar ingreso
- `DELETE /api/ingresos/:id` - Eliminar ingreso

### Egresos (Protegido)
- `GET /api/egresos/:perfilId` - Obtener egresos de un perfil
- `POST /api/egresos` - Crear egreso
- `PUT /api/egresos/:id` - Actualizar egreso
- `DELETE /api/egresos/:id` - Eliminar egreso

### Presupuestos (Protegido)
- `GET /api/presupuestos/:perfilId` - Obtener presupuestos de un perfil
- `POST /api/presupuestos` - Crear presupuesto
- `PUT /api/presupuestos/:id` - Actualizar presupuesto
- `DELETE /api/presupuestos/:id` - Eliminar presupuesto

### Planes de Ahorro (Protegido)
- `GET /api/planes-ahorro/:perfilId` - Obtener planes de un perfil
- `POST /api/planes-ahorro` - Crear plan de ahorro
- `PUT /api/planes-ahorro/:id` - Actualizar plan
- `DELETE /api/planes-ahorro/:id` - Eliminar plan

## 🔑 Autenticación

Todas las rutas protegidas requieren un token JWT en el header:

```
Authorization: Bearer <tu_token_jwt>
```

El token se obtiene al hacer login exitoso.

## 🧪 Probar con Postman/Thunder Client

1. **Registrar usuario:**
```json
POST http://localhost:8001/api/register
{
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@email.com",
    "nombreUsuario": "juanperez",
    "contraseña": "123456"
}
```

2. **Login:**
```json
POST http://localhost:8001/api/login
{
    "correo": "juan@email.com",
    "contraseña": "123456"
}
```

3. **Usar el token** recibido en las demás peticiones:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📝 Notas Importantes

- Este backend usa MongoDB (NoSQL) en lugar de PostgreSQL (SQL)
- La estructura está inspirada en nanec_backend para mantener simplicidad
- Los modelos utilizan Mongoose para la definición de esquemas
- Las contraseñas se encriptan automáticamente con bcryptjs
- El middleware de errores centraliza el manejo de excepciones
