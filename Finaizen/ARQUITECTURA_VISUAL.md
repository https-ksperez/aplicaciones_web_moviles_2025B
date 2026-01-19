# 📊 Arquitectura Final - Finaizen Full-Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FINAIZEN - FULL STACK                        │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┐       ┌──────────────────────────┐
│         FRONTEND (React)         │       │    BACKEND (Express)     │
│          Port: 5173              │◄─────►│       Port: 5000         │
├──────────────────────────────────┤       ├──────────────────────────┤
│                                  │       │                          │
│  📁 src/services/                │       │  📁 src/routes/          │
│    └── apiService.js     ────────┼──────►│    ├── authRoutes.js     │
│        ├── authService           │       │    ├── perfilRoutes.js   │
│        ├── perfilService         │       │    ├── ingresoRoutes.js  │
│        ├── ingresoService        │       │    ├── egresoRoutes.js   │
│        ├── egresoService         │       │    └── ...10 archivos    │
│        ├── presupuestoService    │       │                          │
│        ├── planAhorroService     │       │  📁 src/controllers/     │
│        ├── planDeudaService      │       │    ├── authController.js │
│        ├── logroService          │       │    ├── crudController.js │
│        ├── historialService      │       │    └── perfilController  │
│        └── notificacionService   │       │                          │
│                                  │       │  📁 src/middleware/      │
│  📁 src/utils/                   │       │    ├── auth.js           │
│    ├── mockDatabase.js (legacy) │       │    ├── validator.js      │
│    └── ...otros archivos        │       │    └── errorHandler.js   │
│                                  │       │                          │
│  📁 src/components/              │       │  📁 src/models/          │
│    ├── dashboard/                │       │    ├── User.js           │
│    ├── savings/                  │       │    ├── Perfil.js         │
│    ├── deudas/                   │       │    ├── Ingreso.js        │
│    └── ...múltiples módulos     │       │    ├── Egreso.js         │
│                                  │       │    └── ...11 modelos     │
│  📄 .env                         │       │                          │
│    VITE_API_URL=localhost:5000  │       │  📄 .env                 │
│                                  │       │    DB_HOST=localhost     │
└──────────────────────────────────┘       │    DB_NAME=finaizen_db   │
                                           │    JWT_SECRET=...        │
                                           └────────┬─────────────────┘
                                                    │
                                                    ▼
                                           ┌──────────────────────────┐
                                           │   PostgreSQL Database    │
                                           │      Port: 5432          │
                                           ├──────────────────────────┤
                                           │                          │
                                           │  📊 11 Tablas:           │
                                           │    ├── users             │
                                           │    ├── perfiles          │
                                           │    ├── ingresos          │
                                           │    ├── egresos           │
                                           │    ├── presupuestos      │
                                           │    ├── registro_historial│
                                           │    ├── planes_ahorro     │
                                           │    ├── planes_deuda      │
                                           │    ├── logros            │
                                           │    ├── notificaciones    │
                                           │    └── security_logs     │
                                           │                          │
                                           │  📦 Datos de Prueba:     │
                                           │    ├── 3 usuarios        │
                                           │    ├── 4 perfiles        │
                                           │    ├── 5 ingresos        │
                                           │    ├── 9 egresos         │
                                           │    ├── 6 presupuestos    │
                                           │    ├── 4 planes ahorro   │
                                           │    ├── 4 planes deuda    │
                                           │    └── 6 logros          │
                                           └──────────────────────────┘
```

---

## 🔄 Flujo de Datos

### 1. Autenticación

```
Usuario ingresa email/password
         │
         ▼
Frontend: apiService.auth.login({ correo, contraseña })
         │
         ▼
Backend: POST /api/auth/login
         │
         ├──► authController.login()
         │
         ├──► User.findOne({ correo })
         │
         ├──► bcrypt.compare(password)
         │
         ├──► jwt.sign({ userId })
         │
         └──► return { user, token }
         │
         ▼
Frontend: localStorage.setItem('authToken', token)
```

### 2. Operaciones CRUD

```
Usuario crea un ingreso
         │
         ▼
Frontend: apiService.ingresos.create(perfilId, { monto, descripcion, ... })
         │
         ▼
Backend: POST /api/perfiles/:perfilId/ingresos
         │
         ├──► auth middleware (verifica JWT)
         │
         ├──► validator middleware (valida datos)
         │
         ├──► ingresoController.create()
         │
         ├──► Ingreso.create({ ... })
         │
         └──► return { success: true, data: nuevoIngreso }
         │
         ▼
Frontend: Actualiza estado React
```

---

## 📡 Endpoints por Categoría

### 🔐 Autenticación (5 endpoints)
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile          [Protected]
PUT    /api/auth/profile          [Protected]
PUT    /api/auth/change-password  [Protected]
```

### 👤 Perfiles (6 endpoints)
```
GET    /api/perfiles              [Protected]
POST   /api/perfiles              [Protected]
GET    /api/perfiles/:id          [Protected]
PUT    /api/perfiles/:id          [Protected]
DELETE /api/perfiles/:id          [Protected]
GET    /api/perfiles/:id/resumen  [Protected]
```

### 💰 Por Perfil (5 endpoints × 7 recursos = 35)
```
Cada recurso tiene: GET, GET/:id, POST, PUT/:id, DELETE/:id

/api/perfiles/:perfilId/ingresos
/api/perfiles/:perfilId/egresos
/api/perfiles/:perfilId/presupuestos
/api/perfiles/:perfilId/planes-ahorro
/api/perfiles/:perfilId/planes-deuda
/api/perfiles/:perfilId/logros
/api/perfiles/:perfilId/historial
```

### 🔔 Notificaciones (4 endpoints)
```
GET    /api/notificaciones              [Protected]
PUT    /api/notificaciones/:id/leer     [Protected]
PUT    /api/notificaciones/leer-todas   [Protected]
DELETE /api/notificaciones/:id          [Protected]
```

**Total: ~55 endpoints** ✅

---

## 🗃️ Modelo de Datos

```sql
users (Usuarios del Sistema)
  ├── id (UUID, PK)
  ├── nombre, apellido, correo (UNIQUE)
  ├── contraseña (hashed)
  ├── rol (user/admin)
  ├── isPremium (boolean)
  └── 1:N → perfiles

perfiles (Perfiles Financieros)
  ├── id (UUID, PK)
  ├── userId (FK → users)
  ├── nombre, moneda, simboloMoneda
  ├── 1:N → ingresos
  ├── 1:N → egresos
  ├── 1:N → presupuestos
  ├── 1:N → planes_ahorro
  ├── 1:N → planes_deuda
  ├── 1:N → logros
  └── 1:N → registro_historial

ingresos (Ingresos Recurrentes/Ocasionales)
  ├── id (UUID, PK)
  ├── perfilId (FK → perfiles)
  ├── monto, descripcion, categoria
  ├── frecuencia (mensual/semanal/etc)
  ├── diaMes, diaSemana, fechaEspecifica
  └── notificacionActiva, proximaEjecucion

egresos (Gastos Recurrentes/Ocasionales)
  ├── id (UUID, PK)
  ├── perfilId (FK → perfiles)
  ├── monto, descripcion, categoria
  ├── frecuencia, clasificacionIA
  └── ...similar a ingresos

presupuestos (Límites de Gasto)
  ├── id (UUID, PK)
  ├── perfilId (FK → perfiles)
  ├── categoria, montoLimite, montoGastado
  ├── periodo (mensual/trimestral/anual)
  └── alertaEn (%), mes, anio

planes_ahorro (Objetivos de Ahorro)
  ├── id (UUID, PK)
  ├── perfilId (FK → perfiles)
  ├── nombre, descripcion, objetivo
  ├── montoActual, montoMeta
  ├── montoAhorrarMensual
  ├── fechaInicio, fechaMeta
  ├── estado (activo/pausado/completado)
  ├── estrategia (consistente/agresiva/flexible)
  └── historialAhorros (JSON)

planes_deuda (Pagos de Deudas)
  ├── id (UUID, PK)
  ├── perfilId (FK → perfiles)
  ├── nombre, categoria, acreedor
  ├── montoDeuda, montoPagado
  ├── tasaInteres, cuotaMensual
  ├── fechaPago
  ├── estrategia (bola_nieve/avalancha/etc)
  └── historialPagos (JSON)

logros (Sistema de Gamificación)
  ├── id (UUID, PK)
  ├── perfilId (FK → perfiles)
  ├── nombre, descripcion, tipo
  ├── desbloqueado, progreso, meta
  ├── empresa, recompensa, valorRecompensa
  └── fechaDesbloqueo

notificaciones (Alertas del Sistema)
  ├── id (UUID, PK)
  ├── userId (FK → users)
  ├── tipo, titulo, mensaje
  ├── leida, accionUrl
  └── fechaEnvio

registro_historial (Historial de Transacciones)
  ├── id (UUID, PK)
  ├── perfilId (FK → perfiles)
  ├── tipo (ingreso/egreso)
  ├── monto, descripcion, categoria
  ├── fechaEjecucion, mes, anio
  └── transaccionOrigenId

security_logs (Logs de Seguridad)
  ├── id (UUID, PK)
  ├── userId (FK → users)
  ├── eventType, category, severity
  ├── ipAddress, userAgent, status
  └── metadata (JSON)
```

---

## 🔒 Seguridad Implementada

```
✅ JWT Authentication
   └── Tokens expiran en 7 días
   └── Refresh tokens en 30 días

✅ Password Hashing
   └── bcrypt con 10 rounds

✅ Rate Limiting
   └── 100 requests/15 min por IP

✅ CORS
   └── Solo permite localhost:5173

✅ Helmet
   └── Headers de seguridad HTTP

✅ Validación
   └── express-validator en todos los endpoints

✅ Error Handling
   └── No expone stack traces en producción

✅ Security Logs
   └── Auditoría de 29 tipos de eventos
```

---

## 📦 Tecnologías Usadas

### Backend
```javascript
{
  "framework": "Express 4.18.2",
  "database": "PostgreSQL 13+",
  "orm": "Sequelize 6.35.2",
  "auth": "JWT (jsonwebtoken 9.0.2)",
  "security": "bcrypt, helmet, cors",
  "validation": "express-validator 7.0.1",
  "dev": "nodemon, morgan"
}
```

### Frontend
```javascript
{
  "framework": "React 18 + Vite",
  "routing": "React Router",
  "state": "useState, useEffect, Context API",
  "api": "Fetch API (apiService.js)",
  "styling": "CSS Modules"
}
```

---

## 🎯 Estado del Proyecto

```
✅ Backend Completo
   ├── ✅ 11 modelos Sequelize
   ├── ✅ 11 migraciones
   ├── ✅ 8 seeders con datos reales
   ├── ✅ ~55 endpoints REST
   ├── ✅ Autenticación JWT
   ├── ✅ Middleware completo
   └── ✅ Documentación exhaustiva

✅ Frontend Listo
   ├── ✅ apiService.js completo
   ├── ✅ .env configurado
   ├── ✅ Componentes existentes
   └── ⏳ Pendiente: Migrar de mockDB a API

📚 Documentación
   ├── ✅ API_DOCUMENTATION.md
   ├── ✅ GUIA_MIGRACION_API.md
   ├── ✅ CONEXION_FRONTEND_BACKEND.md
   ├── ✅ backend/README.md
   └── ✅ backend/QUICK_START.md

🛠️ Herramientas
   ├── ✅ Postman Collection
   ├── ✅ Setup Script (setup.ps1)
   └── ✅ Scripts npm configurados
```

---

## 🚀 Siguiente Paso

**Ejecutar el setup:**

```powershell
cd Finaizen
.\setup.ps1
```

O manualmente:

```powershell
# Terminal 1
cd backend
npm install
npm run migrate
npm run seed
npm run dev

# Terminal 2
cd React/Proyecto_Finaizen
npm run dev
```

**Login de prueba:**
- Email: `maria@example.com`
- Password: `maria123`

---

¡Todo está listo para empezar a desarrollar! 🎉
