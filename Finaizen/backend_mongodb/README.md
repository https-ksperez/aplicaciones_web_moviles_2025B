# 🚀 Finaizen Backend MongoDB

Backend simple y ordenado para la aplicación Finaizen, utilizando MongoDB como base de datos. Inspirado en la estructura de nanec_backend.

## 📁 Estructura del Proyecto

```
backend_mongodb/
├── config/
│   └── mongoose.config.js    # Conexión a MongoDB
├── controllers/
│   ├── user.controller.js     # Autenticación (register/login)
│   ├── perfil.controller.js   # CRUD de perfiles
│   ├── ingreso.controller.js  # CRUD de ingresos
│   ├── egreso.controller.js   # CRUD de egresos
│   ├── presupuesto.controller.js  # CRUD de presupuestos
│   ├── planAhorro.controller.js   # CRUD de planes de ahorro
│   └── planDeuda.controller.js    # CRUD de planes de deuda
├── middlewares/
│   ├── auth.middleware.js     # Protección de rutas con JWT
│   └── errorHandler.js        # Manejo centralizado de errores
├── models/
│   ├── user.model.js          # Esquema de usuarios
│   ├── perfil.model.js        # Esquema de perfiles
│   ├── ingreso.model.js       # Esquema de ingresos
│   ├── egreso.model.js        # Esquema de egresos
│   ├── presupuesto.model.js   # Esquema de presupuestos
│   ├── planAhorro.model.js    # Esquema de planes de ahorro
│   └── planDeuda.model.js     # Esquema de planes de deuda
├── routes/
│   ├── user.routes.js         # /api/register, /api/login, /api/me
│   ├── perfil.routes.js       # /api/perfiles
│   ├── ingreso.routes.js      # /api/ingresos
│   ├── egreso.routes.js       # /api/egresos
│   ├── presupuesto.routes.js  # /api/presupuestos
│   ├── planAhorro.routes.js   # /api/planes-ahorro
│   └── planDeuda.routes.js    # /api/planes-deuda
├── seeders/
│   ├── index.js               # Script principal de seeds
│   ├── clean.js               # Script para limpiar BD
│   ├── users.seed.js          # Datos de usuarios demo
│   ├── perfiles.seed.js       # Datos de perfiles demo
│   ├── ingresos.seed.js       # Datos de ingresos demo
│   ├── egresos.seed.js        # Datos de egresos demo
│   ├── presupuestos.seed.js   # Datos de presupuestos demo
│   ├── planesAhorro.seed.js   # Datos de planes ahorro demo
│   └── planesDeuda.seed.js    # Datos de planes deuda demo
├── .env.example
├── .gitignore
├── package.json
├── server.js                  # Punto de entrada
├── GUIA_INSTALACION.md        # Guía detallada
└── README.md
```

## ⚡ Quick Start

```bash
# 1. Entrar a la carpeta
cd Finaizen/backend_mongodb

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Asegurarse de que MongoDB esté corriendo
# (Debe estar instalado y ejecutándose en localhost:27017)

# 5. Poblar la base de datos con datos de prueba
npm run seed

# 6. Iniciar el servidor
npm run dev
```

El servidor estará en: `http://localhost:8001`

## 🌱 Seeds (Datos de Prueba)

El proyecto incluye seeds para poblar la base de datos con datos de demostración:

```bash
# Ejecutar seeds (poblar base de datos)
npm run seed

# Limpiar base de datos
npm run db:clean
```

### 🔑 Credenciales de Prueba

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| Admin | admin@finaizen.com | admin123 | admin |
| María | maria@example.com | maria123 | user (Premium) |
| Carlos | carlos@example.com | carlos123 | user |

### 📊 Datos Incluidos

- **3 Usuarios** (1 admin, 2 usuarios normales)
- **4 Perfiles** (Admin, María Personal, María Negocio, Carlos Personal)
- **5 Ingresos** de ejemplo
- **10 Egresos** de ejemplo
- **7 Presupuestos** mensuales
- **5 Planes de Ahorro** (vacaciones, emergencia, auto, etc.)
- **5 Planes de Deuda** (tarjetas, préstamos, hipoteca)

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens):

1. **Registrar** → `POST /api/register`
2. **Login** → `POST /api/login` (devuelve token)
3. **Usar token** → `Authorization: Bearer <token>` en headers

## 📋 Endpoints

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | /api/register | Registrar usuario | ❌ |
| POST | /api/login | Iniciar sesión | ❌ |
| GET | /api/me | Obtener mi perfil | ✅ |
| PUT | /api/me | Actualizar mi perfil | ✅ |
| GET | /api/perfiles | Listar mis perfiles | ✅ |
| POST | /api/perfiles | Crear perfil | ✅ |
| PUT | /api/perfiles/:id | Actualizar perfil | ✅ |
| DELETE | /api/perfiles/:id | Eliminar perfil | ✅ |
| GET | /api/ingresos/:perfilId | Listar ingresos | ✅ |
| POST | /api/ingresos | Crear ingreso | ✅ |
| PUT | /api/ingresos/:id | Actualizar ingreso | ✅ |
| DELETE | /api/ingresos/:id | Eliminar ingreso | ✅ |
| GET | /api/egresos/:perfilId | Listar egresos | ✅ |
| POST | /api/egresos | Crear egreso | ✅ |
| PUT | /api/egresos/:id | Actualizar egreso | ✅ |
| DELETE | /api/egresos/:id | Eliminar egreso | ✅ |
| GET | /api/presupuestos/:perfilId | Listar presupuestos | ✅ |
| POST | /api/presupuestos | Crear presupuesto | ✅ |
| PUT | /api/presupuestos/:id | Actualizar presupuesto | ✅ |
| DELETE | /api/presupuestos/:id | Eliminar presupuesto | ✅ |
| GET | /api/planes-ahorro/:perfilId | Listar planes | ✅ |
| POST | /api/planes-ahorro | Crear plan | ✅ |
| PUT | /api/planes-ahorro/:id | Actualizar plan | ✅ |
| PUT | /api/planes-ahorro/:id/depositar | Hacer depósito | ✅ |
| DELETE | /api/planes-ahorro/:id | Eliminar plan | ✅ |
| GET | /api/planes-deuda/perfil/:perfilId | Listar deudas | ✅ |
| GET | /api/planes-deuda/estadisticas/:perfilId | Estadísticas deudas | ✅ |
| POST | /api/planes-deuda | Crear deuda | ✅ |
| PUT | /api/planes-deuda/:id | Actualizar deuda | ✅ |
| POST | /api/planes-deuda/:id/pago | Registrar pago | ✅ |
| DELETE | /api/planes-deuda/:id | Eliminar deuda | ✅ |

## 🛠️ Tecnologías

- **Express.js** - Framework web
- **MongoDB** + **Mongoose** - Base de datos NoSQL
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Variables de entorno
- **nodemon** - Hot reload en desarrollo

## 📚 Documentación Completa

Ver [GUIA_INSTALACION.md](./GUIA_INSTALACION.md) para más detalles.
