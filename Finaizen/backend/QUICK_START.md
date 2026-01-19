# Quick Start - Finaizen Backend

## Inicio Rápido en 5 Minutos ⚡

### 1️⃣ Prerrequisitos

Asegúrate de tener instalado:
- PostgreSQL (descargar de https://www.postgresql.org/download/)
- Node.js 18+ (descargar de https://nodejs.org/)

### 2️⃣ Instalar Dependencias

```powershell
cd backend
npm install
```

### 3️⃣ Configurar PostgreSQL

Abre PowerShell como administrador y ejecuta:

```powershell
# Iniciar servicio de PostgreSQL (Windows)
Start-Service postgresql-x64-13

# O si usas pgAdmin, ábrelo y conéctate

# Crear base de datos usando psql
psql -U postgres

# Dentro de psql, ejecuta:
CREATE DATABASE finaizen_db;
\q
```

### 4️⃣ Configurar Variables de Entorno

```powershell
# Copiar archivo de ejemplo
Copy-Item .env.example .env

# Editar .env con tu editor favorito
notepad .env
```

Configura estas variables en el archivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finaizen_db
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_AQUI

JWT_SECRET=mi_clave_secreta_super_segura_123
```

### 5️⃣ Ejecutar Migraciones

```powershell
npm run migrate
```

Deberías ver:

```
✅ Migración 20260118000001-create-users ejecutada
✅ Migración 20260118000002-create-perfiles ejecutada
... (11 migraciones en total)
```

### 6️⃣ Iniciar el Servidor

```powershell
npm run dev
```

Deberías ver:

```
✅ Conexión a la base de datos establecida exitosamente.
📊 Base de datos sincronizada.
🚀 Servidor corriendo en http://localhost:5000
📝 Entorno: development
🔐 JWT configurado correctamente
```

### 7️⃣ Probar el API

Abre tu navegador o Postman/Thunder Client y prueba:

**Health Check:**
```
GET http://localhost:5000/health
```

**Registro de usuario:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@example.com",
  "nombreUsuario": "juanperez",
  "contraseña": "password123",
  "pais": "Ecuador"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "correo": "juan@example.com",
  "contraseña": "password123"
}
```

La respuesta incluirá un `token` que debes usar en requests autenticados:

```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 🔥 Comandos Útiles

```powershell
# Desarrollo (auto-reload)
npm run dev

# Producción
npm start

# Ver todas las migraciones
npm run migrate

# Revertir última migración
npm run migrate:undo

# Resetear base de datos completa
npm run db:reset

# Ver estado de PostgreSQL
Get-Service postgresql*
```

## 🐛 Solución de Problemas Comunes

### Error: "ECONNREFUSED"
- PostgreSQL no está corriendo
- Solución: `Start-Service postgresql-x64-13`

### Error: "password authentication failed"
- Contraseña incorrecta en `.env`
- Solución: Verifica tu password de PostgreSQL

### Error: "database does not exist"
- No creaste la base de datos
- Solución: Ejecuta `CREATE DATABASE finaizen_db;` en psql

### Error: "Port 5000 already in use"
- Otro proceso usa el puerto
- Solución: Cambia `PORT=5001` en `.env`

## 📊 Verificar que Todo Funciona

Ejecuta estos comandos en PowerShell:

```powershell
# 1. Verificar Node.js
node --version  # Debe ser >= 18

# 2. Verificar PostgreSQL
psql --version

# 3. Verificar conexión a BD
psql -U postgres -d finaizen_db -c "\dt"
# Deberías ver 11 tablas

# 4. Verificar servidor
curl http://localhost:5000/health
```

## ✅ Checklist de Verificación

- [ ] PostgreSQL instalado y corriendo
- [ ] Node.js >= 18 instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` configurado
- [ ] Base de datos creada
- [ ] Migraciones ejecutadas (11 tablas creadas)
- [ ] Servidor corriendo en puerto 5000
- [ ] Health check responde correctamente
- [ ] Registro de usuario funciona
- [ ] Login funciona y devuelve token

## 🚀 Siguiente Paso

Una vez que el backend esté funcionando, ve a [INTEGRACION_FRONTEND.md](./INTEGRACION_FRONTEND.md) para conectarlo con tu aplicación React.

---

¿Problemas? Revisa [README.md](./README.md) para más detalles.
