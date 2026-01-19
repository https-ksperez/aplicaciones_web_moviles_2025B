# 🔌 Conexión Frontend-Backend - Resumen Completo

## ✅ Archivos Creados

### Backend (8 seeders)
- ✅ `backend/src/seeders/20260118000001-demo-users.js` - 3 usuarios con contraseñas hasheadas
- ✅ `backend/src/seeders/20260118000002-demo-perfiles.js` - 4 perfiles financieros
- ✅ `backend/src/seeders/20260118000003-demo-ingresos.js` - 5 ingresos de ejemplo
- ✅ `backend/src/seeders/20260118000004-demo-egresos.js` - 9 egresos de ejemplo
- ✅ `backend/src/seeders/20260118000005-demo-presupuestos.js` - 6 presupuestos
- ✅ `backend/src/seeders/20260118000006-demo-planes-ahorro.js` - 4 planes de ahorro
- ✅ `backend/src/seeders/20260118000007-demo-planes-deuda.js` - 4 planes de deuda
- ✅ `backend/src/seeders/20260118000008-demo-logros.js` - 6 logros con recompensas

### Frontend
- ✅ `React/Proyecto_Finaizen/src/services/apiService.js` - Servicio completo con todos los endpoints
- ✅ `React/Proyecto_Finaizen/.env` - Variable VITE_API_URL agregada
- ✅ `React/Proyecto_Finaizen/GUIA_MIGRACION_API.md` - Guía paso a paso completa

---

## 🚀 Inicio Rápido (5 minutos)

### 1. Setup Backend

```powershell
# Terminal 1 - Backend
cd backend

# Instalar dependencias
npm install

# Crear base de datos PostgreSQL
# En pgAdmin o psql: CREATE DATABASE finaizen_db;

# Configurar .env (editar con tu password de PostgreSQL)
# DB_PASSWORD=tu_password_aqui

# Ejecutar migraciones
npm run migrate

# Cargar datos de prueba
npm run seed

# Iniciar servidor
npm run dev
```

**Resultado:** Servidor corriendo en `http://localhost:5000` ✅

---

### 2. Setup Frontend

```powershell
# Terminal 2 - Frontend
cd React/Proyecto_Finaizen

# El .env ya está configurado con:
# VITE_API_URL=http://localhost:5000/api

# Iniciar servidor de desarrollo
npm run dev
```

**Resultado:** App corriendo en `http://localhost:5173` ✅

---

## 🔐 Usuarios de Prueba

Los seeders crean 3 usuarios que puedes usar de inmediato:

| Usuario | Correo | Contraseña | Rol | Perfiles |
|---------|--------|------------|-----|----------|
| **Admin** | admin@finaizen.com | admin123 | admin | 1 perfil |
| **María** | maria@example.com | maria123 | user | 2 perfiles (Personal, Negocio) |
| **Carlos** | carlos@example.com | carlos123 | user | 1 perfil |

---

## 📊 Datos Pre-cargados

Los seeders recrean los mismos datos que tenías en `mockDatabase.js`:

### María González (maria@example.com)

**Perfil Personal:**
- ✅ 3 ingresos (Salario $1500, Freelance $300, Bono $100)
- ✅ 5 egresos (Alquiler, Supermercado, Servicios, etc.)
- ✅ 3 presupuestos (Alimentación, Entretenimiento, Servicios)
- ✅ 3 planes de ahorro (Vacaciones, Emergencia, Laptop ✔️ completado)
- ✅ 2 planes de deuda (Tarjeta Visa, Préstamo Personal)
- ✅ 4 logros (2 desbloqueados: Starbucks, McDonald's)

**Perfil Negocio:**
- ✅ 1 ingreso (Ventas $2500)
- ✅ 2 egresos (Inventario, Local)
- ✅ 1 presupuesto (Compras)

### Carlos Ramírez (carlos@example.com)

**Perfil Personal:**
- ✅ 1 ingreso (Salario $18,000 MXN)
- ✅ 2 egresos (Renta, Supermercado)
- ✅ 2 presupuestos (Alimentación, Transporte)
- ✅ 1 plan de ahorro (Enganche Auto $50,000)
- ✅ 2 planes de deuda (Tarjeta AMEX, Hipoteca)
- ✅ 2 logros (2 desbloqueados: Liverpool, Spotify)

---

## 🛠️ Cómo Usar el API en tu Código

### Importar el Servicio

```javascript
import apiService from '../services/apiService';
// O importar servicios específicos:
import { authService, perfilService, ingresoService } from '../services/apiService';
```

### Login

```javascript
const handleLogin = async () => {
  try {
    const response = await apiService.auth.login({
      correo: 'maria@example.com',
      contraseña: 'maria123'
    });
    
    // Token guardado automáticamente en localStorage
    console.log('Usuario logueado:', response.user);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### Obtener Datos

```javascript
// Perfiles
const perfiles = await apiService.perfiles.getAll();

// Ingresos de un perfil
const ingresos = await apiService.ingresos.getAll('perfil-uuid');

// Crear ingreso
const nuevoIngreso = await apiService.ingresos.create('perfil-uuid', {
  monto: 1500,
  descripcion: 'Salario',
  categoria: 'Salario',
  frecuencia: 'mensual',
  diaMes: 5
});

// Actualizar
await apiService.ingresos.update('perfil-uuid', 'ingreso-uuid', {
  monto: 1600
});

// Eliminar
await apiService.ingresos.delete('perfil-uuid', 'ingreso-uuid');
```

### Componente React Ejemplo

```javascript
import { useState, useEffect } from 'react';
import { perfilService } from '../services/apiService';

function Dashboard() {
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await perfilService.getAll();
        setPerfiles(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      {perfiles.map(perfil => (
        <div key={perfil.id}>{perfil.nombre}</div>
      ))}
    </div>
  );
}
```

---

## 📚 Endpoints Disponibles

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere token)
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña

### Perfiles
- `GET /api/perfiles` - Listar perfiles
- `POST /api/perfiles` - Crear perfil
- `GET /api/perfiles/:id` - Obtener perfil
- `PUT /api/perfiles/:id` - Actualizar perfil
- `DELETE /api/perfiles/:id` - Eliminar perfil
- `GET /api/perfiles/:id/resumen` - Resumen financiero

### Recursos Anidados (requieren perfilId)
Cada entidad tiene endpoints CRUD completos:
- `/api/perfiles/:perfilId/ingresos`
- `/api/perfiles/:perfilId/egresos`
- `/api/perfiles/:perfilId/presupuestos`
- `/api/perfiles/:perfilId/planes-ahorro`
- `/api/perfiles/:perfilId/planes-deuda`
- `/api/perfiles/:perfilId/logros`
- `/api/perfiles/:perfilId/historial`

### Notificaciones
- `GET /api/notificaciones` - Listar notificaciones
- `PUT /api/notificaciones/:id/leer` - Marcar como leída
- `PUT /api/notificaciones/leer-todas` - Marcar todas como leídas
- `DELETE /api/notificaciones/:id` - Eliminar notificación

**Total: ~55 endpoints** 🎯

---

## 🧪 Probar el API

### Con Postman

1. Importa la colección: `backend/Finaizen_API.postman_collection.json`
2. Ejecuta "Login - María" para obtener token
3. El token se guardará automáticamente en variables
4. Prueba los demás endpoints

### Con cURL

```powershell
# Login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"correo":"maria@example.com","contraseña":"maria123"}'

# Obtener perfiles (reemplaza TOKEN)
curl http://localhost:5000/api/perfiles `
  -H "Authorization: Bearer TOKEN"
```

---

## 🔄 Comandos Útiles

### Backend

```powershell
# Desarrollo
npm run dev              # Iniciar con nodemon

# Base de Datos
npm run migrate          # Ejecutar migraciones
npm run migrate:undo     # Deshacer última migración
npm run seed             # Cargar datos de prueba
npm run seed:undo        # Eliminar datos de prueba
npm run db:reset         # Reset completo (undo all + migrate + seed)

# Producción
npm start                # Iniciar servidor producción
```

### Frontend

```powershell
npm run dev              # Servidor desarrollo Vite
npm run build            # Build para producción
npm run preview          # Preview del build
```

---

## ⚠️ Troubleshooting

### "Cannot connect to database"
```powershell
# Verificar que PostgreSQL está corriendo
# Windows: Services > PostgreSQL
# O revisar el puerto 5432 está libre
```

### "Token invalid"
```javascript
// El token expira en 7 días
// Si expira, hacer login nuevamente
localStorage.removeItem('authToken');
```

### "CORS error"
```javascript
// Verificar que el backend tenga configurado:
// CORS_ORIGIN=http://localhost:5173
```

### "Port 5000 already in use"
```powershell
# Cambiar puerto en backend/.env:
PORT=5001
```

---

## 📖 Documentación Adicional

- 📘 [API Documentation](../../../backend/API_DOCUMENTATION.md) - Todos los endpoints con ejemplos
- 📗 [Backend README](../../../backend/README.md) - Arquitectura y setup detallado
- 📕 [Quick Start Backend](../../../backend/QUICK_START.md) - Inicio rápido 5 minutos
- 📙 [Guía de Migración](./GUIA_MIGRACION_API.md) - Migrar de mockDB a API paso a paso
- 📔 [Integración Frontend](../../../backend/INTEGRACION_FRONTEND.md) - Cómo conectar React

---

## ✅ Checklist Final

Antes de empezar a desarrollar, verifica:

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `finaizen_db` creada
- [ ] Backend: `npm install` ejecutado
- [ ] Backend: Migraciones ejecutadas (`npm run migrate`)
- [ ] Backend: Seeders ejecutados (`npm run seed`)
- [ ] Backend: Servidor corriendo en puerto 5000
- [ ] Frontend: Variable `VITE_API_URL` configurada en `.env`
- [ ] Frontend: `apiService.js` existe en `src/services/`
- [ ] Frontend: Servidor Vite corriendo en puerto 5173
- [ ] Login funciona con `maria@example.com / maria123`
- [ ] Se pueden ver datos en el dashboard

---

## 🎯 Próximos Pasos

1. **Migrar componentes** - Reemplaza `mockDatabase.js` por `apiService.js` en tus componentes
2. **Actualizar AuthContext** - Integra `authService` para login/logout
3. **Probar CRUD completo** - Verifica crear, editar, eliminar en cada módulo
4. **Agregar loading states** - Mejora UX con spinners mientras cargan datos
5. **Manejar errores** - Agrega try-catch y mensajes de error amigables

---

## 🚀 ¡Todo Listo!

Tu aplicación ahora tiene:
- ✅ Backend profesional con Express + PostgreSQL
- ✅ API REST completa con ~55 endpoints
- ✅ Autenticación JWT segura
- ✅ Datos de prueba pre-cargados
- ✅ Servicio frontend para consumir el API
- ✅ Documentación completa

**¡Empieza a desarrollar!** 🎉

---

**Autor:** GitHub Copilot  
**Fecha:** 18 de Enero, 2026  
**Proyecto:** Finaizen - Plataforma de Gestión Financiera Personal
