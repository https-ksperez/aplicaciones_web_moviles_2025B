# Finaizen Backend API

Backend REST API para Finaizen - Plataforma de Gestión Financiera Personal desarrollada con Node.js, Express, PostgreSQL y Sequelize.

## 🚀 Características

- ✅ Autenticación JWT
- ✅ CRUD completo para todas las entidades
- ✅ Migraciones de base de datos con Sequelize
- ✅ Validación de datos con express-validator
- ✅ Seguridad con Helmet y CORS
- ✅ Rate limiting
- ✅ Logs de seguridad
- ✅ Arquitectura MVC
- ✅ PostgreSQL como base de datos

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- PostgreSQL >= 13
- npm >= 9.0.0

## 🔧 Instalación

### 1. Clonar el repositorio (si aún no lo has hecho)

```bash
cd Finaizen/backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Servidor
NODE_ENV=development
PORT=5000
HOST=localhost

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finaizen_db
DB_USER=postgres
DB_PASSWORD=tu_password_aqui

# JWT
JWT_SECRET=tu_secret_key_super_segura
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 4. Crear la base de datos PostgreSQL

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE finaizen_db;

# Salir de psql
\q
```

### 5. Ejecutar migraciones

```bash
npm run migrate
```

### 6. (Opcional) Ejecutar seeders para datos de prueba

```bash
npm run seed
```

## 🏃‍♂️ Ejecución

### Modo Desarrollo (con nodemon)

```bash
npm run dev
```

### Modo Producción

```bash
npm start
```

El servidor estará corriendo en `http://localhost:5000`

## 📚 Endpoints de la API

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/profile` | Obtener perfil | Sí |
| PUT | `/api/auth/profile` | Actualizar perfil | Sí |
| POST | `/api/auth/change-password` | Cambiar contraseña | Sí |

### Perfiles

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/perfiles` | Obtener todos los perfiles | Sí |
| GET | `/api/perfiles/:id` | Obtener un perfil | Sí |
| POST | `/api/perfiles` | Crear perfil | Sí |
| PUT | `/api/perfiles/:id` | Actualizar perfil | Sí |
| DELETE | `/api/perfiles/:id` | Eliminar perfil | Sí |
| GET | `/api/perfiles/:id/resumen` | Resumen financiero | Sí |

### Ingresos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/perfiles/:perfilId/ingresos` | Listar ingresos | Sí |
| GET | `/api/perfiles/:perfilId/ingresos/:id` | Obtener ingreso | Sí |
| POST | `/api/perfiles/:perfilId/ingresos` | Crear ingreso | Sí |
| PUT | `/api/perfiles/:perfilId/ingresos/:id` | Actualizar ingreso | Sí |
| DELETE | `/api/perfiles/:perfilId/ingresos/:id` | Eliminar ingreso | Sí |

### Egresos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/perfiles/:perfilId/egresos` | Listar egresos | Sí |
| GET | `/api/perfiles/:perfilId/egresos/:id` | Obtener egreso | Sí |
| POST | `/api/perfiles/:perfilId/egresos` | Crear egreso | Sí |
| PUT | `/api/perfiles/:perfilId/egresos/:id` | Actualizar egreso | Sí |
| DELETE | `/api/perfiles/:perfilId/egresos/:id` | Eliminar egreso | Sí |

### Presupuestos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/perfiles/:perfilId/presupuestos` | Listar presupuestos | Sí |
| GET | `/api/perfiles/:perfilId/presupuestos/:id` | Obtener presupuesto | Sí |
| POST | `/api/perfiles/:perfilId/presupuestos` | Crear presupuesto | Sí |
| PUT | `/api/perfiles/:perfilId/presupuestos/:id` | Actualizar presupuesto | Sí |
| DELETE | `/api/perfiles/:perfilId/presupuestos/:id` | Eliminar presupuesto | Sí |

### Planes de Ahorro

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/perfiles/:perfilId/planes-ahorro` | Listar planes | Sí |
| GET | `/api/perfiles/:perfilId/planes-ahorro/:id` | Obtener plan | Sí |
| POST | `/api/perfiles/:perfilId/planes-ahorro` | Crear plan | Sí |
| PUT | `/api/perfiles/:perfilId/planes-ahorro/:id` | Actualizar plan | Sí |
| DELETE | `/api/perfiles/:perfilId/planes-ahorro/:id` | Eliminar plan | Sí |

### Planes de Deuda

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/perfiles/:perfilId/planes-deuda` | Listar planes | Sí |
| GET | `/api/perfiles/:perfilId/planes-deuda/:id` | Obtener plan | Sí |
| POST | `/api/perfiles/:perfilId/planes-deuda` | Crear plan | Sí |
| PUT | `/api/perfiles/:perfilId/planes-deuda/:id` | Actualizar plan | Sí |
| DELETE | `/api/perfiles/:perfilId/planes-deuda/:id` | Eliminar plan | Sí |

### Logros

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/perfiles/:perfilId/logros` | Listar logros | Sí |
| GET | `/api/perfiles/:perfilId/logros/:id` | Obtener logro | Sí |
| POST | `/api/perfiles/:perfilId/logros` | Crear logro | Sí |
| PUT | `/api/perfiles/:perfilId/logros/:id` | Actualizar logro | Sí |
| DELETE | `/api/perfiles/:perfilId/logros/:id` | Eliminar logro | Sí |

### Historial de Transacciones

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/perfiles/:perfilId/historial` | Listar transacciones | Sí |
| GET | `/api/perfiles/:perfilId/historial/:id` | Obtener transacción | Sí |
| POST | `/api/perfiles/:perfilId/historial` | Registrar transacción | Sí |
| PUT | `/api/perfiles/:perfilId/historial/:id` | Actualizar transacción | Sí |
| DELETE | `/api/perfiles/:perfilId/historial/:id` | Eliminar transacción | Sí |

## 🔐 Autenticación

El API utiliza JWT (JSON Web Tokens) para autenticación. Para acceder a endpoints protegidos, debes incluir el token en el header:

```
Authorization: Bearer <tu_token_jwt>
```

### Ejemplo de registro:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@example.com",
    "nombreUsuario": "juanperez",
    "contraseña": "password123",
    "pais": "Ecuador"
  }'
```

### Ejemplo de login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "juan@example.com",
    "contraseña": "password123"
  }'
```

## 🗄️ Estructura de la Base de Datos

El proyecto incluye las siguientes tablas:

- **users** - Usuarios del sistema
- **perfiles** - Perfiles financieros (un usuario puede tener varios)
- **ingresos** - Ingresos recurrentes u ocasionales
- **egresos** - Gastos/egresos
- **presupuestos** - Límites de gasto por categoría
- **planes_ahorro** - Planes de ahorro personalizados
- **planes_deuda** - Planes de pago de deudas
- **logros** - Sistema de logros y recompensas
- **notificaciones** - Notificaciones del sistema
- **registro_historial** - Historial de transacciones ejecutadas
- **security_logs** - Logs de eventos de seguridad

## 🔄 Migraciones

### Ejecutar todas las migraciones:

```bash
npm run migrate
```

### Revertir última migración:

```bash
npm run migrate:undo
```

### Revertir todas las migraciones:

```bash
npm run migrate:undo:all
```

### Resetear base de datos completa:

```bash
npm run db:reset
```

## 📝 Scripts Disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm run migrate` - Ejecuta las migraciones
- `npm run migrate:undo` - Revierte la última migración
- `npm run migrate:undo:all` - Revierte todas las migraciones
- `npm run seed` - Ejecuta los seeders
- `npm run seed:undo` - Revierte los seeders
- `npm run db:reset` - Resetea completamente la BD

## 🏗️ Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   ├── config.js          # Configuración general
│   │   └── database.js        # Configuración de Sequelize
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── perfilController.js
│   │   └── crudController.js  # Controlador genérico
│   ├── middleware/
│   │   ├── auth.js            # Middleware de autenticación
│   │   ├── errorHandler.js    # Manejo de errores
│   │   └── validator.js       # Validaciones
│   ├── migrations/            # Migraciones de BD
│   ├── models/                # Modelos de Sequelize
│   │   ├── User.js
│   │   ├── Perfil.js
│   │   ├── Ingreso.js
│   │   ├── Egreso.js
│   │   ├── Presupuesto.js
│   │   ├── PlanAhorro.js
│   │   ├── PlanDeuda.js
│   │   ├── Logro.js
│   │   ├── Notificacion.js
│   │   ├── RegistroHistorial.js
│   │   ├── SecurityLog.js
│   │   └── index.js
│   ├── routes/                # Rutas del API
│   ├── seeders/               # Datos de prueba
│   ├── utils/                 # Utilidades
│   └── server.js              # Punto de entrada
├── .env.example
├── .gitignore
├── .sequelizerc
├── package.json
└── README.md
```

## 🧪 Testing

```bash
npm test
```

## 📦 Deployment

Para desplegar en producción:

1. Configurar variables de entorno de producción
2. Ejecutar migraciones en el servidor
3. Configurar PostgreSQL en la nube (Heroku, AWS RDS, etc.)
4. Desplegar en Heroku, Railway, Render, etc.

### Ejemplo con Heroku:

```bash
heroku create finaizen-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
heroku run npm run migrate
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Autores

- Equipo Finaizen

## 📞 Soporte

Para reportar bugs o solicitar features, por favor abre un issue en GitHub.

---

Desarrollado con ❤️ por el equipo de Finaizen
