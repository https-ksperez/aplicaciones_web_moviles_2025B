# 🐘 Configuración PostgreSQL y pgAdmin - Guía Visual

Esta guía te mostrará cómo configurar PostgreSQL para Finaizen usando pgAdmin.

---

## 📋 Requisitos Previos

- ✅ PostgreSQL 13+ instalado
- ✅ pgAdmin 4 instalado (viene con PostgreSQL)

**Si no tienes PostgreSQL:**
- Descarga: https://www.postgresql.org/download/windows/
- Durante instalación, **recuerda la contraseña** que pongas para el usuario `postgres`

---

## 🎯 Paso a Paso con pgAdmin

### 1️⃣ Abrir pgAdmin

1. Busca "pgAdmin" en el menú de Windows
2. Ábrelo (puede tardar unos segundos en cargar)
3. Te pedirá una **contraseña maestra** (solo la primera vez)
   - Puedes usar cualquier contraseña, es solo para pgAdmin
   - O dejarlo en blanco si prefieres

### 2️⃣ Conectar al Servidor PostgreSQL

1. En el panel izquierdo, busca **"Servers"**
2. Expande **"PostgreSQL 13"** (o la versión que tengas)
3. Te pedirá la **contraseña del usuario postgres**
   - Esta es la que pusiste al instalar PostgreSQL
   - Márcala como "Save Password" para no escribirla siempre

```
┌─────────────────────────────────┐
│  Connect to Server              │
├─────────────────────────────────┤
│  Password: ************         │
│  ☑ Save Password                │
│                                 │
│  [Cancel]  [OK]                 │
└─────────────────────────────────┘
```

### 3️⃣ Crear la Base de Datos

Una vez conectado:

1. **Click derecho** en **"Databases"**
2. Selecciona **"Create" → "Database..."**

Se abrirá un diálogo:

```
┌─────────────────────────────────────────┐
│  Create - Database                      │
├─────────────────────────────────────────┤
│  General                                │
│                                         │
│  Database: finaizen_db                  │
│  Owner: postgres                        │
│  Comment: Base de datos Finaizen        │
│                                         │
│  [Cancel]  [Save]                       │
└─────────────────────────────────────────┘
```

**Configuración:**
- **Database:** `finaizen_db`
- **Owner:** `postgres`
- **Encoding:** `UTF8` (por defecto)
- **Template:** `template1` (por defecto)

3. Click en **"Save"**

✅ **¡Listo!** La base de datos `finaizen_db` está creada

---

## 🔍 Verificar que se Creó

En el panel izquierdo deberías ver:

```
📁 Servers
  └─ 📁 PostgreSQL 13
      └─ 📁 Databases
          ├─ 📁 postgres
          └─ 📁 finaizen_db  ← ¡Tu nueva base de datos!
```

---

## 🛠️ Alternativa: Usar SQL Query Tool

Si prefieres usar comandos SQL:

1. **Click derecho** en **"PostgreSQL 13"**
2. Selecciona **"Query Tool"**
3. Escribe este comando:

```sql
CREATE DATABASE finaizen_db;
```

4. Presiona **F5** o click en el botón **▶ Execute**

✅ Verás un mensaje: `CREATE DATABASE` en la parte inferior

---

## ⚙️ Configurar .env del Backend

Ahora que tienes la base de datos, configura el archivo `.env`:

**Ubicación:** `backend/.env`

```env
# ===============================================
# DATABASE CONFIGURATION
# ===============================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finaizen_db
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_AQUI    ← Cambia esto por tu contraseña
DB_DIALECT=postgres

# ===============================================
# SERVER CONFIGURATION
# ===============================================
PORT=5000
HOST=localhost
NODE_ENV=development

# ===============================================
# JWT CONFIGURATION
# ===============================================
JWT_SECRET=finaizen_secret_key_2026_change_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=finaizen_refresh_secret_2026
JWT_REFRESH_EXPIRE=30d

# ===============================================
# CORS CONFIGURATION
# ===============================================
CORS_ORIGIN=http://localhost:5173

# ===============================================
# RATE LIMITING
# ===============================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ IMPORTANTE:** Reemplaza `TU_PASSWORD_AQUI` con la contraseña real de PostgreSQL

---

## 🚀 Ejecutar Migraciones y Seeders

Una vez configurado el `.env`:

```powershell
cd backend

# Ejecutar migraciones (crear las 11 tablas)
npm run migrate

# Cargar datos de prueba
npm run seed

# Iniciar servidor
npm run dev
```

---

## 🔍 Ver los Datos en pgAdmin

Después de ejecutar las migraciones y seeders:

### Ver las Tablas Creadas

1. Expande **finaizen_db**
2. Expande **Schemas**
3. Expande **public**
4. Expande **Tables**

Deberías ver **11 tablas**:

```
📁 Tables
  ├─ 📄 SequelizeMeta
  ├─ 📄 users
  ├─ 📄 perfiles
  ├─ 📄 ingresos
  ├─ 📄 egresos
  ├─ 📄 presupuestos
  ├─ 📄 registro_historial
  ├─ 📄 planes_ahorro
  ├─ 📄 planes_deuda
  ├─ 📄 logros
  ├─ 📄 notificaciones
  └─ 📄 security_logs
```

### Ver los Datos

**Opción 1: Interfaz Gráfica**
1. **Click derecho** en cualquier tabla (ej: `users`)
2. Selecciona **"View/Edit Data" → "All Rows"**

**Opción 2: Query Tool**
1. **Click derecho** en **finaizen_db**
2. Selecciona **"Query Tool"**
3. Escribe consultas:

```sql
-- Ver todos los usuarios
SELECT * FROM users;

-- Ver perfiles
SELECT * FROM perfiles;

-- Ver ingresos de María (perfil Personal)
SELECT i.* 
FROM ingresos i
JOIN perfiles p ON i."perfilId" = p.id
JOIN users u ON p."userId" = u.id
WHERE u.correo = 'maria@example.com';

-- Ver resumen de datos
SELECT 
  (SELECT COUNT(*) FROM users) as usuarios,
  (SELECT COUNT(*) FROM perfiles) as perfiles,
  (SELECT COUNT(*) FROM ingresos) as ingresos,
  (SELECT COUNT(*) FROM egresos) as egresos,
  (SELECT COUNT(*) FROM presupuestos) as presupuestos,
  (SELECT COUNT(*) FROM planes_ahorro) as planes_ahorro,
  (SELECT COUNT(*) FROM planes_deuda) as planes_deuda,
  (SELECT COUNT(*) FROM logros) as logros;
```

---

## 🎯 Resultado Esperado

Después de ejecutar los seeders, deberías ver:

| Tabla | Registros |
|-------|-----------|
| users | 3 |
| perfiles | 4 |
| ingresos | 5 |
| egresos | 9 |
| presupuestos | 6 |
| planes_ahorro | 4 |
| planes_deuda | 4 |
| logros | 6 |

---

## 🔧 Comandos Útiles de PostgreSQL

### Desde Query Tool en pgAdmin:

```sql
-- Ver todas las bases de datos
SELECT datname FROM pg_database;

-- Ver todas las tablas
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Eliminar base de datos (si quieres empezar de cero)
-- IMPORTANTE: Primero desconéctate de la base de datos
DROP DATABASE finaizen_db;

-- Ver usuarios de PostgreSQL
SELECT * FROM users;

-- Buscar usuario por email
SELECT * FROM users WHERE correo = 'maria@example.com';

-- Ver perfiles con sus usuarios
SELECT 
  u.nombre, 
  u.correo, 
  p.nombre as perfil_nombre, 
  p.moneda
FROM users u
JOIN perfiles p ON p."userId" = u.id;

-- Contar registros por tabla
SELECT 
  'users' as tabla, COUNT(*) as total FROM users
UNION ALL
SELECT 'perfiles', COUNT(*) FROM perfiles
UNION ALL
SELECT 'ingresos', COUNT(*) FROM ingresos
UNION ALL
SELECT 'egresos', COUNT(*) FROM egresos;
```

---

## ⚠️ Troubleshooting

### ❌ "password authentication failed for user postgres"

**Solución:** La contraseña en `.env` no coincide con la de PostgreSQL

1. Verifica tu contraseña de PostgreSQL
2. Actualiza `DB_PASSWORD` en `backend/.env`

### ❌ "database finaizen_db does not exist"

**Solución:** No creaste la base de datos

1. Abre pgAdmin
2. Crea la base de datos `finaizen_db` (ver Paso 3 arriba)

### ❌ "connect ECONNREFUSED 127.0.0.1:5432"

**Solución:** PostgreSQL no está corriendo

**Windows:**
1. Abre **Servicios** (busca "services.msc")
2. Busca **"postgresql-x64-13"** (o tu versión)
3. Click derecho → **"Iniciar"**

O desde PowerShell como administrador:
```powershell
net start postgresql-x64-13
```

### ❌ "role 'postgres' does not exist"

**Solución:** Usuario postgres no existe (raro)

Crea el usuario:
```sql
CREATE USER postgres WITH SUPERUSER PASSWORD 'tu_password';
```

### ❌ pgAdmin no se conecta

**Soluciones:**
1. Verifica que PostgreSQL esté corriendo (ver arriba)
2. Click derecho en el servidor → **"Properties"**
3. Verifica:
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`

---

## 📊 Estructura Visual de la Base de Datos

```
finaizen_db
│
├── users (3 registros)
│   ├── id (UUID)
│   ├── nombre, apellido, correo
│   ├── contraseña (hasheada)
│   ├── rol (user/admin)
│   └── isPremium
│
├── perfiles (4 registros)
│   ├── id (UUID)
│   ├── userId → users.id
│   ├── nombre, moneda
│   └── simboloMoneda
│
├── ingresos (5 registros)
│   ├── id (UUID)
│   ├── perfilId → perfiles.id
│   ├── monto, descripcion
│   ├── categoria, frecuencia
│   └── proximaEjecucion
│
├── egresos (9 registros)
│   ├── Similar a ingresos
│   └── clasificacionIA
│
├── presupuestos (6 registros)
│   ├── perfilId → perfiles.id
│   ├── categoria, montoLimite
│   ├── montoGastado
│   └── alertaEn (%)
│
├── planes_ahorro (4 registros)
│   ├── nombre, objetivo
│   ├── montoActual, montoMeta
│   ├── estrategia
│   └── historialAhorros (JSON)
│
├── planes_deuda (4 registros)
│   ├── nombre, acreedor
│   ├── montoDeuda, tasaInteres
│   ├── estrategia
│   └── historialPagos (JSON)
│
└── logros (6 registros)
    ├── nombre, tipo
    ├── empresa, recompensa
    └── desbloqueado
```

---

## ✅ Checklist Final

Verifica que todo esté configurado:

- [ ] PostgreSQL instalado y corriendo
- [ ] pgAdmin abierto y conectado
- [ ] Base de datos `finaizen_db` creada
- [ ] Archivo `backend/.env` configurado con tu contraseña
- [ ] Migraciones ejecutadas (`npm run migrate`)
- [ ] Seeders ejecutados (`npm run seed`)
- [ ] En pgAdmin puedes ver las 11 tablas
- [ ] En pgAdmin puedes ver los datos (3 usuarios, 4 perfiles, etc.)
- [ ] Backend corriendo (`npm run dev`)

---

## 🎉 ¡Listo para Usar!

Una vez completados todos los pasos, tu base de datos está lista con:

- ✅ 11 tablas creadas
- ✅ 3 usuarios de prueba
- ✅ 50+ registros de datos
- ✅ Relaciones configuradas
- ✅ Índices optimizados

**Credenciales de prueba:**
- Email: `maria@example.com`
- Password: `maria123`

Ahora puedes iniciar el backend y frontend:

```powershell
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd React/Proyecto_Finaizen
npm run dev
```

---

**¿Necesitas ayuda?** Consulta la [documentación completa](./README.md)
