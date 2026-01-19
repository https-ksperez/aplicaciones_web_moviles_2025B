# 🚀 Guía Completa: Instalación de Finaizen

Esta guía te ayudará a levantar el sistema completo de Finaizen en cualquier computadora.

---

## 📋 Requisitos Previos

### 1. Node.js (v18 o superior)
- **Descargar de:** https://nodejs.org/
- **Verificar instalación:**
  ```powershell
  node --version
  npm --version
  ```

### 2. PostgreSQL (v14 o superior)
- **Descargar de:** https://www.postgresql.org/download/
- Durante la instalación, **recuerda la contraseña** del usuario `postgres`

### 3. Git
- **Descargar de:** https://git-scm.com/downloads

### 4. VS Code (recomendado)
- **Descargar de:** https://code.visualstudio.com/

---

## 📥 Paso 1: Clonar el Repositorio

```powershell
cd C:\Users\TuUsuario\Documents
git clone https://github.com/TU_USUARIO/aplicaciones_web_moviles_2025B.git
cd aplicaciones_web_moviles_2025B
```

---

## 🗄️ Paso 2: Configurar PostgreSQL

### Opción A: Usando pgAdmin (interfaz gráfica)

1. Abrir **pgAdmin 4**
2. Conectar al servidor local
3. Click derecho en "Databases" → "Create" → "Database"
4. Nombre: `finaizen_db`
5. Click "Save"

### Opción B: Usando psql (línea de comandos)

```sql
-- Conectar a PostgreSQL
psql -U postgres

-- Crear la base de datos
CREATE DATABASE finaizen_db;

-- (Opcional) Crear usuario específico
CREATE USER finaizen_user WITH PASSWORD 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON DATABASE finaizen_db TO finaizen_user;

-- Salir
\q
```

---

## ⚙️ Paso 3: Configurar el Backend

### 3.1 Ir al directorio del backend

```powershell
cd Finaizen\backend
```

### 3.2 Instalar dependencias

```powershell
npm install
```

### 3.3 Crear archivo de configuración `.env`

Crear un archivo llamado `.env` en la carpeta `Finaizen\backend\` con el siguiente contenido:

```env
# ================================
# CONFIGURACIÓN DEL SERVIDOR
# ================================
PORT=5000
NODE_ENV=development

# ================================
# BASE DE DATOS POSTGRESQL
# ================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finaizen_db
DB_USER=postgres
DB_PASSWORD=TU_CONTRASEÑA_DE_POSTGRES

# ================================
# JWT (AUTENTICACIÓN)
# ================================
# Genera una clave única y segura
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_cambia_esto_12345
JWT_EXPIRES_IN=7d

# ================================
# CORS
# ================================
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **IMPORTANTE:** Reemplaza `TU_CONTRASEÑA_DE_POSTGRES` con la contraseña real de tu PostgreSQL.

### 3.4 Ejecutar migraciones (crear tablas)

```powershell
npx sequelize-cli db:migrate
```

Deberías ver algo como:
```
== 20260118000001-create-users: migrated
== 20260118000002-create-perfiles: migrated
...
```

### 3.5 Ejecutar seeders (datos de prueba)

```powershell
npx sequelize-cli db:seed:all
```

---

## 🎨 Paso 4: Configurar el Frontend

### 4.1 Ir al directorio del frontend

```powershell
cd ..\React\Proyecto_Finaizen
```

O desde la raíz:
```powershell
cd Finaizen\React\Proyecto_Finaizen
```

### 4.2 Instalar dependencias

```powershell
npm install
```

### 4.3 (Opcional) Crear archivo `.env`

El frontend ya tiene valores por defecto, pero puedes crear un `.env` si necesitas cambiar la URL del backend:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Paso 5: Levantar el Sistema

**Necesitas abrir 2 terminales:**

### Terminal 1 - Backend

```powershell
cd Finaizen\backend
npm start
```

✅ Deberías ver:
```
✅ Conexión a la base de datos establecida exitosamente.
📊 Base de datos sincronizada.
🚀 Servidor corriendo en http://localhost:5000
📝 Entorno: development
🔐 JWT configurado correctamente
🕐 Iniciando servicio de tareas programadas...
✅ Scheduler de transacciones iniciado - Revisión cada minuto
```

### Terminal 2 - Frontend

```powershell
cd Finaizen\React\Proyecto_Finaizen
npm run dev
```

✅ Deberías ver:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🔑 Paso 6: Acceder al Sistema

Abrir navegador en: **http://localhost:5173**

### Usuarios de Prueba

| Email | Contraseña | Rol | Descripción |
|-------|-----------|-----|-------------|
| maria.garcia@email.com | password123 | Usuario | Cuenta Premium con datos de ejemplo |
| carlos.lopez@email.com | password123 | Usuario | Cuenta básica |
| admin@finaizen.com | admin123 | Admin | Acceso al panel de administración |

---

## 🔧 Comandos Útiles

### Migraciones

```powershell
# Ver estado de migraciones
npx sequelize-cli db:migrate:status

# Ejecutar migraciones pendientes
npx sequelize-cli db:migrate

# Revertir última migración
npx sequelize-cli db:migrate:undo

# Revertir TODAS las migraciones
npx sequelize-cli db:migrate:undo:all
```

### Seeders

```powershell
# Ejecutar todos los seeders
npx sequelize-cli db:seed:all

# Revertir todos los seeders
npx sequelize-cli db:seed:undo:all
```

### Resetear Base de Datos Completamente

```powershell
# Desde la carpeta backend
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

---

## ⚠️ Solución de Problemas Comunes

### Error: "ECONNREFUSED" al conectar a PostgreSQL

**Causa:** PostgreSQL no está corriendo o las credenciales son incorrectas.

**Solución:**
1. Verificar que el servicio PostgreSQL esté activo:
   - Windows: Buscar "Servicios" → PostgreSQL debe estar "En ejecución"
2. Verificar credenciales en el archivo `.env`

### Error: "relation does not exist"

**Causa:** Las tablas no fueron creadas.

**Solución:**
```powershell
npx sequelize-cli db:migrate
```

### Error: "CORS policy"

**Causa:** El frontend no está autorizado.

**Solución:**
- Verificar que `FRONTEND_URL` en `.env` del backend sea `http://localhost:5173`

### Puerto 5000 ya está en uso

**Solución Windows:**
```powershell
# Encontrar el proceso usando el puerto
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess

# Terminar el proceso (reemplazar <PID> con el número)
Stop-Process -Id <PID> -Force
```

### Puerto 5173 ya está en uso

**Solución:** Vite automáticamente usará el siguiente puerto disponible (5174, 5175, etc.)

### Error: "MODULE_NOT_FOUND"

**Causa:** Dependencias no instaladas.

**Solución:**
```powershell
# En backend
cd Finaizen\backend
npm install

# En frontend
cd Finaizen\React\Proyecto_Finaizen
npm install
```

---

## 📁 Estructura del Proyecto

```
aplicaciones_web_moviles_2025B/
└── Finaizen/
    ├── backend/                    ← API REST (Puerto 5000)
    │   ├── .env                    ← ⚠️ Crear este archivo
    │   ├── src/
    │   │   ├── config/             ← Configuración de BD
    │   │   ├── controllers/        ← Lógica de negocio
    │   │   ├── middleware/         ← Auth, validación
    │   │   ├── models/             ← Modelos Sequelize
    │   │   ├── routes/             ← Endpoints API
    │   │   ├── services/           ← Scheduler, etc.
    │   │   └── server.js           ← Punto de entrada
    │   ├── migrations/             ← Estructura de tablas
    │   ├── seeders/                ← Datos de prueba
    │   └── package.json
    │
    └── React/
        └── Proyecto_Finaizen/      ← Frontend React (Puerto 5173)
            ├── .env                ← Opcional
            ├── src/
            │   ├── components/     ← Componentes reutilizables
            │   ├── context/        ← AuthContext, etc.
            │   ├── pages/          ← Páginas (User, Admin)
            │   ├── services/       ← apiService.js
            │   └── App.jsx         ← Rutas principales
            ├── public/
            └── package.json
```

---

## 🔐 Variables de Entorno

### Backend (`Finaizen/backend/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| PORT | Puerto del servidor | 5000 |
| NODE_ENV | Entorno | development |
| DB_HOST | Host de PostgreSQL | localhost |
| DB_PORT | Puerto de PostgreSQL | 5432 |
| DB_NAME | Nombre de la BD | finaizen_db |
| DB_USER | Usuario de BD | postgres |
| DB_PASSWORD | Contraseña de BD | tu_contraseña |
| JWT_SECRET | Clave para tokens | clave_secreta_larga |
| JWT_EXPIRES_IN | Duración del token | 7d |
| FRONTEND_URL | URL del frontend | http://localhost:5173 |

### Frontend (`Finaizen/React/Proyecto_Finaizen/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| VITE_API_URL | URL del API | http://localhost:5000/api |

---

## 🎯 Verificación Final

Después de seguir todos los pasos, verifica que todo funcione:

1. ✅ Backend corriendo en http://localhost:5000
2. ✅ Frontend corriendo en http://localhost:5173
3. ✅ Puedes iniciar sesión con `maria.garcia@email.com` / `password123`
4. ✅ El dashboard muestra datos correctamente
5. ✅ Puedes crear/editar ingresos y egresos

---

## 📞 Soporte

Si encuentras problemas, verifica:
1. Las versiones de Node.js y PostgreSQL
2. Que los archivos `.env` estén correctamente configurados
3. Que las migraciones y seeders se ejecutaron sin errores
4. Los logs de la terminal para mensajes de error específicos

---

*Última actualización: Enero 2026*
