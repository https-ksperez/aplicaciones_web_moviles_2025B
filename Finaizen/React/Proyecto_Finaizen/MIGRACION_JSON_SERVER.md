# 🔄 MIGRACIÓN A JSON SERVER - GUÍA COMPLETA

## 📊 Resumen de Cambios

Se ha migrado el proyecto Finaizen de usar **localStorage (mockDatabase.js)** a un backend real con **JSON Server**.

### ✅ ¿Qué se implementó?

1. **Backend JSON Server** - API REST completa en puerto 3000
2. **API Service** - Cliente HTTP centralizado para el frontend
3. **Adaptador de compatibilidad** - Mantiene la interfaz del mockDatabase
4. **Componentes actualizados** - Migrados para usar el backend

---

## 🏗️ Arquitectura Nueva

### Antes (Solo Frontend)
```
React App → mockDatabase.js → localStorage
```

### Ahora (Frontend + Backend)
```
React App → apiService.js → JSON Server (http://localhost:3000) → db.json
```

---

## 🚀 Iniciar el Proyecto

### 1️⃣ Iniciar Backend (JSON Server)

```powershell
cd backend
npm start
```

**El servidor estará en:** http://localhost:3000

### 2️⃣ Iniciar Frontend (React + Vite)

```powershell
# En otra terminal (en la raíz del proyecto)
npm run dev
```

**El frontend estará en:** http://localhost:5173

---

## 📡 Endpoints Disponibles

JSON Server crea automáticamente endpoints REST para cada colección en `db.json`:

| Recurso | GET (todos) | GET (por ID) | POST | PUT | PATCH | DELETE |
|---------|-------------|--------------|------|-----|-------|--------|
| **Users** | `/users` | `/users/:id` | `/users` | `/users/:id` | `/users/:id` | `/users/:id` |
| **Perfiles** | `/perfiles` | `/perfiles/:id` | `/perfiles` | `/perfiles/:id` | `/perfiles/:id` | `/perfiles/:id` |
| **Ingresos** | `/ingresos` | `/ingresos/:id` | `/ingresos` | `/ingresos/:id` | `/ingresos/:id` | `/ingresos/:id` |
| **Egresos** | `/egresos` | `/egresos/:id` | `/egresos` | `/egresos/:id` | `/egresos/:id` | `/egresos/:id` |
| **Historial** | `/historial` | `/historial/:id` | `/historial` | `/historial/:id` | `/historial/:id` | `/historial/:id` |
| **Presupuestos** | `/presupuestos` | `/presupuestos/:id` | `/presupuestos` | `/presupuestos/:id` | `/presupuestos/:id` | `/presupuestos/:id` |
| **Logros** | `/logros` | `/logros/:id` | `/logros` | `/logros/:id` | `/logros/:id` | `/logros/:id` |
| **Notificaciones** | `/notificaciones` | `/notificaciones/:id` | `/notificaciones` | `/notificaciones/:id` | `/notificaciones/:id` | `/notificaciones/:id` |
| **Planes Ahorro** | `/planesAhorro` | `/planesAhorro/:id` | `/planesAhorro` | `/planesAhorro/:id` | `/planesAhorro/:id` | `/planesAhorro/:id` |
| **Planes Deuda** | `/planesDeuda` | `/planesDeuda/:id` | `/planesDeuda` | `/planesDeuda/:id` | `/planesDeuda/:id` | `/planesDeuda/:id` |
| **Security Logs** | `/securityLogs` | `/securityLogs/:id` | `/securityLogs` | `/securityLogs/:id` | `/securityLogs/:id` | `/securityLogs/:id` |
| **Config** | `/config` | `/config/1` | - | `/config/1` | `/config/1` | - |

### Filtros y Búsquedas

JSON Server soporta queries automáticamente:

```javascript
// Filtrar por campo
GET /users?rol=admin
GET /ingresos?userId=1
GET /egresos?categoria=Alimentación

// Búsqueda parcial
GET /users?nombre_like=Maria

// Ordenamiento
GET /historial?_sort=fechaEjecucion&_order=desc

// Paginación
GET /users?_page=1&_limit=10

// Rango
GET /ingresos?monto_gte=100&monto_lte=500
```

---

## 🔧 Usar el API Service en Componentes

### Importar el servicio

```javascript
import apiService from '../services/apiService';
```

### Ejemplos de uso

#### 1. **Obtener datos**
```javascript
// Obtener todos los usuarios
const users = await apiService.getUsers();

// Obtener usuario por ID
const user = await apiService.getUserById(1);

// Obtener con filtros
const adminUsers = await apiService.getWithQuery('users', { rol: 'admin' });
```

#### 2. **Crear datos**
```javascript
const newIngreso = {
  userId: 1,
  descripcion: 'Salario',
  monto: 1500,
  categoria: 'Salario',
  fecha: new Date().toISOString()
};

const created = await apiService.createIngreso(newIngreso);
```

#### 3. **Actualizar datos**
```javascript
// Actualización completa (PUT)
await apiService.updateUser(1, { ...userData });

// Actualización parcial (PATCH)
await apiService.patch('users', 1, { isPremium: true });
```

#### 4. **Eliminar datos**
```javascript
await apiService.deleteIngreso(5);
```

---

## 📝 Ejemplo Completo: Componente con Backend

```javascript
import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

function MisIngresos() {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos al montar
  useEffect(() => {
    loadIngresos();
  }, []);

  const loadIngresos = async () => {
    try {
      setLoading(true);
      const data = await apiService.getIngresosByUserId(currentUser.id);
      setIngresos(data);
    } catch (error) {
      console.error('Error al cargar ingresos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear ingreso
  const handleCreate = async (ingresoData) => {
    try {
      const newIngreso = await apiService.createIngreso(ingresoData);
      setIngresos([...ingresos, newIngreso]);
    } catch (error) {
      console.error('Error al crear ingreso:', error);
    }
  };

  // Eliminar ingreso
  const handleDelete = async (id) => {
    try {
      await apiService.deleteIngreso(id);
      setIngresos(ingresos.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error al eliminar ingreso:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {ingresos.map(ingreso => (
        <div key={ingreso.id}>
          <span>{ingreso.descripcion}: ${ingreso.monto}</span>
          <button onClick={() => handleDelete(ingreso.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔄 Migración Paso a Paso

### Para actualizar un componente que usa mockDatabase:

#### 1. **Cambiar el import**
```javascript
// ANTES
import mockDB from '../../../utils/mockDatabase';

// DESPUÉS
import apiService from '../../../services/apiService';
```

#### 2. **Hacer funciones asíncronas**
```javascript
// ANTES
const loadData = () => {
  const data = mockDB.historial.filter(...);
  setData(data);
};

// DESPUÉS
const loadData = async () => {
  try {
    const data = await apiService.getHistorialByUserId(userId);
    setData(data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### 3. **Actualizar operaciones CRUD**
```javascript
// ANTES
mockDB.historial.push(newRecord);
mockDB.saveToLocalStorage();

// DESPUÉS
await apiService.createHistorial(newRecord);

// ANTES
mockDB.historial.splice(index, 1);
mockDB.saveToLocalStorage();

// DESPUÉS
await apiService.deleteHistorial(id);
```

---

## 📂 Estructura de Archivos

### Backend
```
backend/
├── db.json              # Base de datos JSON
├── db-generator.js      # Generador de datos
├── package.json         # Configuración npm
├── server.js            # Express (backup)
├── routes/              # Rutas Express (backup)
├── controllers/         # Controladores (backup)
└── data/                # Datos Express (backup)
```

### Frontend - Nuevos archivos
```
src/
├── services/
│   ├── apiService.js            # ✨ Cliente HTTP para backend
│   └── mockDatabaseAdapter.js   # ✨ Adaptador de compatibilidad
├── .env                          # ✨ Variables de entorno
└── pages/
    └── User/
        └── Historial/
            └── Historial.jsx     # ✅ Actualizado para usar API
```

---

## 🎯 Variables de Entorno

### `.env` (raíz del proyecto frontend)
```env
VITE_API_URL=http://localhost:3000
```

### Usar en el código
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## 🧪 Probar el Backend

### Con PowerShell
```powershell
# GET - Obtener usuarios
Invoke-RestMethod -Uri "http://localhost:3000/users"

# POST - Crear usuario
$body = @{
  nombre = "Juan"
  apellido = "Pérez"
  correo = "juan@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/users" -Method POST -Body $body -ContentType "application/json"

# DELETE - Eliminar usuario
Invoke-RestMethod -Uri "http://localhost:3000/users/1" -Method DELETE
```

### Con Navegador
- http://localhost:3000/users
- http://localhost:3000/ingresos
- http://localhost:3000/historial

---

## 📊 Datos Iniciales

El archivo `db.json` incluye:
- ✅ 3 usuarios de prueba
- ✅ 3 perfiles asociados
- ✅ Configuración de seguridad
- ⚠️ Arrays vacíos para ingresos, egresos, historial, etc.

**Para agregar más datos:**
1. Editar `backend/db.json` manualmente
2. O usar la API para crear datos vía POST

---

## ⚙️ Comandos npm del Backend

```json
{
  "json-server": "Iniciar JSON Server con watch",
  "start": "Iniciar JSON Server",
  "dev": "Iniciar JSON Server (modo desarrollo)",
  "express": "Iniciar servidor Express (backup)",
  "express:dev": "Iniciar Express con nodemon (backup)"
}
```

---

## 🔀 Compatibilidad con mockDatabase

Se creó `mockDatabaseAdapter.js` que:
- ✅ Mantiene la misma interfaz que `mockDatabase.js`
- ✅ Usa el backend en lugar de localStorage
- ✅ Permite migración gradual de componentes

### Usar el adaptador:
```javascript
import mockDB from '../services/mockDatabaseAdapter';

// Funciona igual que antes, pero usa el backend
const users = mockDB.users; // Internamente hace GET /users
```

---

## 🚨 Notas Importantes

1. **Servidor debe estar corriendo:** Frontend no funcionará sin el backend
2. **Puerto 3000:** Asegúrate que esté libre
3. **CORS:** JSON Server tiene CORS habilitado por defecto
4. **Persistencia:** Los cambios se guardan en `db.json` automáticamente
5. **IDs automáticos:** JSON Server genera IDs incrementales automáticamente

---

## 🐛 Troubleshooting

### Error: "Cannot connect to server"
```powershell
# Verificar que el backend esté corriendo
cd backend
npm start
```

### Puerto 3000 ocupado
```powershell
# Cambiar puerto en package.json del backend
"start": "json-server --watch db.json --port 3001"

# Actualizar .env del frontend
VITE_API_URL=http://localhost:3001
```

### Datos no se guardan
- Verificar que el backend esté corriendo
- Revisar consola del navegador para errores HTTP
- Confirmar que `db.json` tenga permisos de escritura

---

## ✅ Checklist de Migración Completa

- [x] JSON Server instalado y configurado
- [x] db.json creado con estructura
- [x] apiService.js implementado
- [x] mockDatabaseAdapter.js creado
- [x] .env configurado
- [x] Componente Historial migrado
- [ ] Migrar componente Login
- [ ] Migrar componente Dashboard
- [ ] Migrar componente Ingresos
- [ ] Migrar componente Egresos
- [ ] Migrar otros componentes según necesidad

---

## 📚 Recursos

- [JSON Server Docs](https://github.com/typicode/json-server)
- [Fetch API MDN](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)
- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Fecha de migración:** Enero 13, 2026  
**Estado:** ✅ Backend funcional, frontend parcialmente migrado
