# 🔌 Conexión Frontend-Backend Completada

## ✅ Resumen

Se ha configurado completamente la conexión entre el frontend React y el backend Express con PostgreSQL. Los datos que tenías en `mockDatabase.js` ahora se pueden migrar a la base de datos real mediante **seeders**.

---

## 📁 Archivos Creados

### 🗄️ Backend - Seeders (8 archivos)

Todos los seeders están en `backend/src/seeders/`:

1. **20260118000001-demo-users.js** - 3 usuarios con contraseñas hasheadas
2. **20260118000002-demo-perfiles.js** - 4 perfiles financieros
3. **20260118000003-demo-ingresos.js** - 5 ingresos de ejemplo
4. **20260118000004-demo-egresos.js** - 9 egresos de ejemplo
5. **20260118000005-demo-presupuestos.js** - 6 presupuestos
6. **20260118000006-demo-planes-ahorro.js** - 4 planes de ahorro
7. **20260118000007-demo-planes-deuda.js** - 4 planes de deuda
8. **20260118000008-demo-logros.js** - 6 logros con recompensas de empresas

### ⚛️ Frontend - Servicio API

1. **src/services/apiService.js** - Servicio completo para consumir el API
   - authService (login, register, profile, logout)
   - perfilService (CRUD + resumen financiero)
   - ingresoService (CRUD)
   - egresoService (CRUD)
   - presupuestoService (CRUD)
   - planAhorroService (CRUD)
   - planDeudaService (CRUD)
   - logroService (CRUD)
   - historialService (CRUD con filtros)
   - notificacionService (getAll, markAsRead, markAllAsRead)

2. **.env** - Actualizado con `VITE_API_URL=http://localhost:5000/api`

### 📚 Documentación

1. **GUIA_MIGRACION_API.md** - Guía completa paso a paso
2. **CONEXION_FRONTEND_BACKEND.md** - Resumen ejecutivo
3. **setup.ps1** - Script automático de configuración

---

## 🚀 Inicio Rápido (Opción 1: Manual)

### 1️⃣ Backend

```powershell
cd backend

# Instalar dependencias
npm install

# Crear base de datos (en pgAdmin o psql)
# CREATE DATABASE finaizen_db;

# Editar .env con tu contraseña de PostgreSQL
# DB_PASSWORD=tu_password

# Ejecutar migraciones
npm run migrate

# Cargar datos de prueba
npm run seed

# Iniciar servidor
npm run dev
```

✅ Backend corriendo en `http://localhost:5000`

### 2️⃣ Frontend

```powershell
cd React/Proyecto_Finaizen

# Ya está configurado el .env con:
# VITE_API_URL=http://localhost:5000/api

# Iniciar desarrollo
npm run dev
```

✅ Frontend corriendo en `http://localhost:5173`

---

## ⚡ Inicio Rápido (Opción 2: Automático)

Ejecuta el script de setup que configura todo automáticamente:

```powershell
cd Finaizen
.\setup.ps1
```

El script:
1. ✅ Instala dependencias del backend
2. ✅ Crea la base de datos PostgreSQL
3. ✅ Ejecuta migraciones (11 tablas)
4. ✅ Carga datos de prueba (seeders)
5. ✅ Configura el frontend
6. ✅ Opcionalmente inicia ambos servidores

---

## 🔐 Usuarios de Prueba

Los seeders crean 3 usuarios que puedes usar inmediatamente:

| Usuario | Email | Password | Rol | Perfiles |
|---------|-------|----------|-----|----------|
| **Admin** | admin@finaizen.com | admin123 | admin | 1 |
| **María** | maria@example.com | maria123 | user | 2 (Personal, Negocio) |
| **Carlos** | carlos@example.com | carlos123 | user | 1 |

Cada usuario tiene datos completos:
- ✅ Ingresos y egresos recurrentes
- ✅ Presupuestos configurados
- ✅ Planes de ahorro activos
- ✅ Planes de deuda
- ✅ Logros desbloqueados

---

## 💻 Cómo Usar el API

### Importar el Servicio

```javascript
import apiService from '../services/apiService';
// O servicios específicos:
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
    
    // Token guardado en localStorage automáticamente
    console.log('Usuario:', response.user);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### CRUD Completo

```javascript
// Obtener todos los perfiles
const perfiles = await apiService.perfiles.getAll();

// Obtener ingresos de un perfil
const ingresos = await apiService.ingresos.getAll('perfil-id');

// Crear ingreso
const nuevoIngreso = await apiService.ingresos.create('perfil-id', {
  monto: 1500,
  descripcion: 'Salario Mensual',
  categoria: 'Salario',
  frecuencia: 'mensual',
  diaMes: 5
});

// Actualizar ingreso
await apiService.ingresos.update('perfil-id', 'ingreso-id', {
  monto: 1600
});

// Eliminar ingreso
await apiService.ingresos.delete('perfil-id', 'ingreso-id');
```

### Componente React Ejemplo

```javascript
import { useState, useEffect } from 'react';
import { ingresoService } from '../services/apiService';

function MisIngresos() {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const perfilId = localStorage.getItem('perfilActual');
        const data = await ingresoService.getAll(perfilId);
        setIngresos(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngresos();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      {ingresos.map(ingreso => (
        <div key={ingreso.id}>
          {ingreso.descripcion} - ${ingreso.monto}
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 Endpoints Disponibles

### Autenticación
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `PUT /api/auth/change-password`

### Perfiles
- `GET /api/perfiles`
- `POST /api/perfiles`
- `GET /api/perfiles/:id`
- `PUT /api/perfiles/:id`
- `DELETE /api/perfiles/:id`
- `GET /api/perfiles/:id/resumen`

### Por cada perfil (CRUD completo):
- `/api/perfiles/:perfilId/ingresos`
- `/api/perfiles/:perfilId/egresos`
- `/api/perfiles/:perfilId/presupuestos`
- `/api/perfiles/:perfilId/planes-ahorro`
- `/api/perfiles/:perfilId/planes-deuda`
- `/api/perfiles/:perfilId/logros`
- `/api/perfiles/:perfilId/historial`

### Notificaciones
- `GET /api/notificaciones`
- `PUT /api/notificaciones/:id/leer`
- `PUT /api/notificaciones/leer-todas`
- `DELETE /api/notificaciones/:id`

**Total: ~55 endpoints** 🎯

Ver documentación completa: [backend/API_DOCUMENTATION.md](../backend/API_DOCUMENTATION.md)

---

## 🔧 Comandos Útiles

### Backend

```powershell
npm run dev              # Iniciar en desarrollo
npm run migrate          # Ejecutar migraciones
npm run migrate:undo     # Deshacer última migración
npm run seed             # Cargar datos de prueba
npm run seed:undo        # Eliminar datos de prueba
npm run db:reset         # Reset completo (undo + migrate + seed)
```

### Frontend

```powershell
npm run dev              # Servidor desarrollo
npm run build            # Build producción
```

---

## 🧪 Probar la Conexión

1. **Inicia ambos servidores:**
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd React/Proyecto_Finaizen && npm run dev`

2. **Abre el frontend:** `http://localhost:5173`

3. **Haz login con:**
   - Email: `maria@example.com`
   - Password: `maria123`

4. **Verifica que se muestren los datos** de perfiles, ingresos, egresos, etc.

---

## 📚 Documentación Completa

- 📘 [API_DOCUMENTATION.md](../backend/API_DOCUMENTATION.md) - Todos los endpoints con ejemplos
- 📗 [GUIA_MIGRACION_API.md](./GUIA_MIGRACION_API.md) - Migrar de mockDB a API
- 📕 [CONEXION_FRONTEND_BACKEND.md](./CONEXION_FRONTEND_BACKEND.md) - Resumen ejecutivo
- 📙 [backend/README.md](../backend/README.md) - Arquitectura del backend
- 📔 [backend/QUICK_START.md](../backend/QUICK_START.md) - Inicio rápido backend

---

## ✅ Checklist

Antes de empezar a desarrollar:

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `finaizen_db` creada
- [ ] Backend: Dependencias instaladas
- [ ] Backend: Migraciones ejecutadas
- [ ] Backend: Seeders ejecutados
- [ ] Backend: Servidor corriendo en :5000
- [ ] Frontend: `.env` configurado con `VITE_API_URL`
- [ ] Frontend: `apiService.js` creado
- [ ] Frontend: Servidor corriendo en :5173
- [ ] Login funciona correctamente
- [ ] Se muestran datos del API

---

## 🎯 Próximos Pasos

1. **Actualizar componentes** - Reemplaza `mockDatabase.js` por `apiService.js`
2. **Integrar AuthContext** - Usa `authService` para autenticación
3. **Agregar estados de carga** - Mejora UX con spinners
4. **Manejo de errores** - Agrega try-catch y mensajes amigables
5. **Testing** - Prueba todos los endpoints con Postman

---

## ⚠️ Troubleshooting

### "Cannot connect to database"
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en `backend/.env`

### "Token invalid"
- El token expira en 7 días
- Haz login nuevamente si expira

### "CORS error"
- Verifica que `CORS_ORIGIN=http://localhost:5173` en `backend/.env`

### "Port already in use"
- Cambia el puerto en `.env`: `PORT=5001`

---

## 🎉 ¡Listo!

Ahora tienes una aplicación full-stack profesional:
- ✅ Backend con Express + PostgreSQL
- ✅ API REST con ~55 endpoints
- ✅ Autenticación JWT
- ✅ Frontend React conectado
- ✅ Datos de prueba cargados
- ✅ Documentación completa

**¡Empieza a desarrollar!** 🚀
