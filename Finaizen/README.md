# 💰 Finaizen - Plataforma de Gestión Financiera Personal

Sistema completo de gestión financiera personal con frontend React y backend Express + PostgreSQL.

---

## 🚀 Inicio Rápido (5 minutos)

### Opción 1: Setup Automático ⚡

```powershell
.\setup.ps1
```

Este script configura todo automáticamente:
- ✅ Instala dependencias
- ✅ Crea base de datos
- ✅ Ejecuta migraciones
- ✅ Carga datos de prueba
- ✅ Inicia servidores

### Opción 2: Setup Manual 🔧

#### 1. Backend

```powershell
cd backend
npm install

# Crear base de datos en PostgreSQL
# CREATE DATABASE finaizen_db;

# Editar .env con tu password de PostgreSQL
# DB_PASSWORD=tu_password

npm run migrate      # Crear tablas
npm run seed         # Cargar datos de prueba
npm run dev          # Iniciar servidor :5000
```

#### 2. Frontend

```powershell
cd React/Proyecto_Finaizen
npm run dev          # Iniciar servidor :5173
```

---

## 🔐 Usuarios de Prueba

| Usuario | Email | Contraseña | Datos |
|---------|-------|------------|-------|
| **Admin** | admin@finaizen.com | admin123 | 1 perfil |
| **María** | maria@example.com | maria123 | 2 perfiles + datos completos |
| **Carlos** | carlos@example.com | carlos123 | 1 perfil + datos completos |

---

## 📁 Estructura del Proyecto

```
Finaizen/
├── backend/                          # API Backend
│   ├── src/
│   │   ├── models/                   # 11 modelos Sequelize
│   │   ├── migrations/               # 11 migraciones
│   │   ├── seeders/                  # 8 seeders con datos
│   │   ├── controllers/              # Lógica de negocio
│   │   ├── routes/                   # 10 archivos de rutas
│   │   └── middleware/               # Auth, validación, errores
│   ├── .env                          # Configuración
│   └── package.json                  # Dependencias
│
├── React/Proyecto_Finaizen/          # Frontend React
│   ├── src/
│   │   ├── components/               # Componentes React
│   │   ├── services/
│   │   │   └── apiService.js         # ⭐ Servicio API completo
│   │   ├── utils/
│   │   │   └── mockDatabase.js       # (Legacy - datos locales)
│   │   └── pages/                    # Vistas de la app
│   └── .env                          # VITE_API_URL configurado
│
├── setup.ps1                         # 🔧 Script de instalación
├── ARQUITECTURA_VISUAL.md            # 📊 Diagrama de arquitectura
├── CONEXION_FRONTEND_BACKEND.md      # 🔌 Guía de conexión
└── README.md                         # 📖 Este archivo
```

---

## 💻 Características del Backend

### 🔐 Autenticación
- JWT con tokens de 7 días
- Contraseñas hasheadas con bcrypt
- Sistema de refresh tokens

### 📊 Modelos de Datos (11 tablas)
- **Users** - Usuarios del sistema
- **Perfiles** - Perfiles financieros
- **Ingresos** - Ingresos recurrentes/ocasionales
- **Egresos** - Gastos recurrentes/ocasionales
- **Presupuestos** - Límites de gasto por categoría
- **Planes de Ahorro** - Objetivos de ahorro
- **Planes de Deuda** - Estrategias de pago de deudas
- **Logros** - Sistema de gamificación
- **Notificaciones** - Alertas del sistema
- **Historial** - Registro de transacciones
- **Security Logs** - Auditoría de seguridad

### 🛡️ Seguridad
- Rate limiting (100 req/15min)
- CORS configurado
- Helmet (security headers)
- Validación de entrada con express-validator
- Manejo profesional de errores

### 📡 API REST (~55 endpoints)
- Autenticación: 5 endpoints
- Perfiles: 6 endpoints
- CRUD por perfil: 35 endpoints
- Notificaciones: 4 endpoints

---

## ⚛️ Características del Frontend

### 🎨 Interfaz de Usuario
- Dashboard interactivo
- Gestión de ingresos y egresos
- Planificador de ahorros
- Calculadora de deudas
- Sistema de logros
- Notificaciones en tiempo real

### 🔌 Integración con API
- **apiService.js** - Servicio centralizado
- Manejo automático de tokens JWT
- Estados de carga y errores
- Integración con Context API

### 📦 Servicios Disponibles
```javascript
import apiService from './services/apiService';

// Autenticación
apiService.auth.login(credentials)
apiService.auth.register(userData)

// Perfiles
apiService.perfiles.getAll()
apiService.perfiles.getResumen(perfilId)

// Ingresos, Egresos, Presupuestos, etc.
apiService.ingresos.create(perfilId, data)
apiService.egresos.getAll(perfilId)
apiService.planesAhorro.update(perfilId, id, data)
```

---

## 📚 Documentación Completa

| Documento | Descripción |
|-----------|-------------|
| [ARQUITECTURA_VISUAL.md](./ARQUITECTURA_VISUAL.md) | Diagrama completo de la arquitectura |
| [CONEXION_FRONTEND_BACKEND.md](./CONEXION_FRONTEND_BACKEND.md) | Resumen de conexión |
| [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) | Todos los endpoints con ejemplos |
| [backend/README.md](./backend/README.md) | Documentación detallada del backend |
| [backend/QUICK_START.md](./backend/QUICK_START.md) | Inicio rápido backend |
| [React/.../GUIA_MIGRACION_API.md](./React/Proyecto_Finaizen/GUIA_MIGRACION_API.md) | Migrar de mockDB a API |

---

## 🧪 Probar el Sistema

### 1. Iniciar Servidores

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd React/Proyecto_Finaizen
npm run dev
```

### 2. Abrir Aplicación

Frontend: `http://localhost:5173`

### 3. Login

Email: `maria@example.com`  
Password: `maria123`

### 4. Explorar

- ✅ Ver perfiles financieros
- ✅ Crear ingresos y egresos
- ✅ Configurar presupuestos
- ✅ Planificar ahorros
- ✅ Gestionar deudas
- ✅ Desbloquear logros

---

## 🔧 Scripts Disponibles

### Backend

```powershell
npm run dev              # Desarrollo con nodemon
npm run migrate          # Ejecutar migraciones
npm run migrate:undo     # Deshacer última migración
npm run seed             # Cargar datos de prueba
npm run seed:undo        # Eliminar datos
npm run db:reset         # Reset completo (undo + migrate + seed)
npm start                # Producción
```

### Frontend

```powershell
npm run dev              # Servidor desarrollo Vite
npm run build            # Build producción
npm run preview          # Preview del build
```

---

## 🗄️ Base de Datos

### Configuración PostgreSQL

1. Instalar PostgreSQL 13+
2. Crear base de datos:
   ```sql
   CREATE DATABASE finaizen_db;
   ```
3. Configurar credenciales en `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=finaizen_db
   DB_USER=postgres
   DB_PASSWORD=tu_password
   ```

### Datos de Prueba

Los seeders cargan:
- 3 usuarios (admin, María, Carlos)
- 4 perfiles financieros
- 50+ registros de ingresos, egresos, presupuestos, planes

---

## 🛠️ Tecnologías

### Backend
- Node.js + Express 4.18
- PostgreSQL 13+
- Sequelize ORM 6.35
- JWT Authentication
- bcrypt, helmet, cors
- express-validator

### Frontend
- React 18 + Vite
- React Router
- CSS Modules
- Fetch API
- Context API

---

## 📊 Datos del Proyecto

| Métrica | Valor |
|---------|-------|
| Modelos de BD | 11 |
| Migraciones | 11 |
| Seeders | 8 |
| Endpoints | ~55 |
| Líneas de Código Backend | ~3500+ |
| Componentes React | 50+ |
| Páginas | 15+ |

---

## ⚠️ Troubleshooting

### "Cannot connect to database"
- Verifica que PostgreSQL esté corriendo
- Revisa credenciales en `backend/.env`
- Verifica que la base de datos exista

### "Port 5000 already in use"
- Cambia puerto en `backend/.env`: `PORT=5001`
- O detén el proceso usando el puerto 5000

### "CORS error"
- Verifica `CORS_ORIGIN=http://localhost:5173` en backend
- Asegúrate de que ambos servidores estén corriendo

### "Token invalid"
- El token expira en 7 días
- Haz login nuevamente

---

## 🎯 Próximos Pasos

1. ✅ Setup completo (backend + frontend)
2. ✅ Login con usuario de prueba
3. ⏳ Migrar componentes de mockDB a API
4. ⏳ Implementar nuevas features
5. ⏳ Testing end-to-end
6. ⏳ Deploy a producción

---

## 📞 Soporte

- 📖 Consulta la [documentación completa](./ARQUITECTURA_VISUAL.md)
- 🔍 Revisa los logs del backend y frontend
- 🧪 Prueba endpoints con [Postman Collection](./backend/Finaizen_API.postman_collection.json)

---

## 👥 Equipo

**Proyecto:** Finaizen  
**Curso:** Aplicaciones Web y Móviles 2025B  
**Fecha:** Enero 2026

---

## 📄 Licencia

MIT License - Proyecto Educativo

---

**¡Sistema completo y listo para desarrollar!** 🚀

**Inicio rápido:**
```powershell
.\setup.ps1
```
