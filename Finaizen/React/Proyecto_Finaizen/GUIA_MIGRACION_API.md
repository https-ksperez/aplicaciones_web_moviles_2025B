# 🔄 Guía de Migración: MockDatabase → API Real

Esta guía te ayudará a migrar tu aplicación de usar `mockDatabase.js` a consumir el API real del backend.

---

## 📋 Pasos de Migración

### 1. ✅ Configurar Backend

#### a) Instalar dependencias del backend
```powershell
cd backend
npm install
```

#### b) Configurar PostgreSQL

Abre **pgAdmin** o la terminal de PostgreSQL:

```sql
CREATE DATABASE finaizen_db;
```

#### c) Configurar variables de entorno

Edita [backend/.env](../../../backend/.env) con tus credenciales de PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finaizen_db
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_AQUI
```

#### d) Ejecutar migraciones
```powershell
npm run migrate
```

#### e) Cargar datos de prueba (seeders)
```powershell
npm run seed
```

Este comando poblará la base de datos con los mismos datos que tenías en `mockDatabase.js`:
- 3 usuarios (admin, maria, carlos)
- 4 perfiles financieros
- Múltiples ingresos, egresos, presupuestos
- Planes de ahorro y deuda
- Logros

#### f) Iniciar servidor backend
```powershell
npm run dev
```

El servidor correrá en `http://localhost:5000`

---

### 2. ✅ Configurar Frontend

#### a) Variable de entorno

Asegúrate de que [.env](./.env) tenga configurada la URL del API:

```env
VITE_API_URL=http://localhost:5000/api
```

#### b) Importar el servicio API

En lugar de usar `mockDatabase.js`, importa `apiService.js`:

**❌ ANTES:**
```javascript
import { db } from '../utils/mockDatabase';

// Obtener datos
const perfiles = db.getAllPerfiles();
```

**✅ DESPUÉS:**
```javascript
import apiService from '../services/apiService';

// Obtener datos (async)
const perfiles = await apiService.perfiles.getAll();
```

---

### 3. 🔐 Autenticación

#### Login de Usuario

```javascript
import { authService } from '../services/apiService';

// Login
const handleLogin = async (correo, contraseña) => {
  try {
    const response = await authService.login({ correo, contraseña });
    // El token se guarda automáticamente en localStorage
    console.log('Usuario:', response.user);
    console.log('Token:', response.token);
  } catch (error) {
    console.error('Error en login:', error.message);
  }
};

// Logout
const handleLogout = () => {
  authService.logout(); // Elimina token y redirige a /login
};

// Obtener perfil del usuario autenticado
const getProfile = async () => {
  const user = await authService.getProfile();
  console.log('Perfil:', user);
};
```

#### Credenciales de Prueba

**Usuario Admin:**
- Correo: `admin@finaizen.com`
- Contraseña: `admin123`

**Usuario Regular (María):**
- Correo: `maria@example.com`
- Contraseña: `maria123`

**Usuario Regular (Carlos):**
- Correo: `carlos@example.com`
- Contraseña: `carlos123`

---

### 4. 📊 Ejemplos de Uso

#### Perfiles

```javascript
import { perfilService } from '../services/apiService';

// Obtener todos los perfiles del usuario autenticado
const perfiles = await perfilService.getAll();

// Obtener un perfil específico
const perfil = await perfilService.getById('perfil-uuid');

// Crear perfil
const nuevoPerfil = await perfilService.create({
  nombre: 'Personal',
  moneda: 'USD',
  simboloMoneda: '$'
});

// Actualizar perfil
const actualizado = await perfilService.update('perfil-uuid', {
  nombre: 'Personal Actualizado'
});

// Obtener resumen financiero
const resumen = await perfilService.getResumen('perfil-uuid');
console.log('Balance:', resumen.balance);
```

#### Ingresos

```javascript
import { ingresoService } from '../services/apiService';

// Listar ingresos de un perfil
const ingresos = await ingresoService.getAll('perfil-uuid');

// Crear ingreso
const nuevoIngreso = await ingresoService.create('perfil-uuid', {
  monto: 1500.00,
  descripcion: 'Salario Mensual',
  categoria: 'Salario',
  frecuencia: 'mensual',
  diaMes: 5,
  notificacionActiva: true
});

// Actualizar ingreso
await ingresoService.update('perfil-uuid', 'ingreso-uuid', {
  monto: 1600.00
});

// Eliminar ingreso
await ingresoService.delete('perfil-uuid', 'ingreso-uuid');
```

#### Egresos

```javascript
import { egresoService } from '../services/apiService';

// Crear egreso
const nuevoEgreso = await egresoService.create('perfil-uuid', {
  monto: 50.00,
  descripcion: 'Supermercado',
  categoria: 'Alimentación',
  frecuencia: 'ocasional',
  fechaEspecifica: '2026-01-20'
});
```

#### Presupuestos

```javascript
import { presupuestoService } from '../services/apiService';

// Listar presupuestos
const presupuestos = await presupuestoService.getAll('perfil-uuid');

// Crear presupuesto
const nuevoPresupuesto = await presupuestoService.create('perfil-uuid', {
  categoria: 'Alimentación',
  montoLimite: 300.00,
  periodo: 'mensual',
  alertaEn: 80,
  mes: 1,
  anio: 2026
});
```

#### Planes de Ahorro

```javascript
import { planAhorroService } from '../services/apiService';

// Crear plan de ahorro
const plan = await planAhorroService.create('perfil-uuid', {
  nombre: 'Vacaciones 2026',
  descripcion: 'Viaje a la playa',
  montoMeta: 2000.00,
  montoAhorrarMensual: 200.00,
  categoria: 'Viajes',
  fechaInicio: '2026-01-01',
  fechaMeta: '2026-12-01',
  estrategia: 'consistente',
  prioridad: 'alta'
});

// Actualizar progreso
await planAhorroService.update('perfil-uuid', 'plan-uuid', {
  montoActual: 400.00,
  depositosRealizados: 2
});
```

#### Planes de Deuda

```javascript
import { planDeudaService } from '../services/apiService';

// Crear plan de deuda
const deuda = await planDeudaService.create('perfil-uuid', {
  nombre: 'Tarjeta Visa',
  categoria: 'Tarjeta de Crédito',
  montoDeuda: 5000.00,
  tasaInteres: 18.5,
  cuotaMensual: 250.00,
  fechaPago: '2026-02-15',
  estrategia: 'avalancha',
  acreedor: 'Banco Pichincha'
});
```

#### Historial

```javascript
import { historialService } from '../services/apiService';

// Obtener historial con filtros
const historial = await historialService.getAll('perfil-uuid', {
  tipo: 'egreso',
  mes: 1,
  anio: 2026
});

// Crear registro en historial
await historialService.create('perfil-uuid', {
  tipo: 'ingreso',
  monto: 1500.00,
  descripcion: 'Salario Enero',
  categoria: 'Salario'
});
```

#### Notificaciones

```javascript
import { notificacionService } from '../services/apiService';

// Obtener notificaciones no leídas
const noLeidas = await notificacionService.getAll({ leidas: false });

// Marcar como leída
await notificacionService.markAsRead('notificacion-uuid');

// Marcar todas como leídas
await notificacionService.markAllAsRead();
```

---

### 5. 🔄 Actualizar Componentes React

#### Componente con Hooks

```javascript
import { useState, useEffect } from 'react';
import { perfilService, ingresoService } from '../services/apiService';

function MisIngresos() {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        setLoading(true);
        const perfilId = localStorage.getItem('perfilActual');
        const data = await ingresoService.getAll(perfilId);
        setIngresos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIngresos();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

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

#### Crear Nuevo Registro

```javascript
import { ingresoService } from '../services/apiService';

function FormularioIngreso() {
  const [formData, setFormData] = useState({
    monto: '',
    descripcion: '',
    categoria: 'Salario',
    frecuencia: 'mensual',
    diaMes: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const perfilId = localStorage.getItem('perfilActual');
      const nuevoIngreso = await ingresoService.create(perfilId, formData);
      
      alert('Ingreso creado exitosamente!');
      console.log(nuevoIngreso);
      
      // Limpiar formulario o redirigir
    } catch (error) {
      alert('Error al crear ingreso: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={formData.monto}
        onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
        placeholder="Monto"
      />
      {/* ... más campos ... */}
      <button type="submit">Guardar</button>
    </form>
  );
}
```

---

### 6. ⚠️ Manejo de Errores

```javascript
import apiService from '../services/apiService';

// Try-catch para cada petición
try {
  const perfiles = await apiService.perfiles.getAll();
} catch (error) {
  if (error.message.includes('401')) {
    // Token expirado, redirigir a login
    window.location.href = '/login';
  } else if (error.message.includes('404')) {
    // Recurso no encontrado
    console.error('Recurso no encontrado');
  } else {
    // Otros errores
    console.error('Error:', error.message);
  }
}
```

---

### 7. 📦 Scripts NPM Útiles

**Backend:**
```powershell
npm run dev          # Iniciar servidor en modo desarrollo
npm run migrate      # Ejecutar migraciones
npm run migrate:undo # Deshacer última migración
npm run seed         # Cargar datos de prueba
npm run seed:undo    # Eliminar datos de prueba
```

**Frontend:**
```powershell
npm run dev          # Iniciar Vite dev server
```

---

### 8. 🧪 Probar la Integración

1. **Iniciar backend:**
   ```powershell
   cd backend
   npm run dev
   ```

2. **Iniciar frontend:**
   ```powershell
   cd React/Proyecto_Finaizen
   npm run dev
   ```

3. **Probar login:**
   - Navega a `http://localhost:5173/login`
   - Ingresa: `maria@example.com` / `maria123`
   - Si el login funciona, verás tu perfil

4. **Verificar datos:**
   - Revisa que se muestren los mismos datos que tenías en mockDatabase
   - Los usuarios de prueba tienen perfiles, ingresos, egresos, etc.

---

### 9. 🔍 Debugging

#### Ver requests en Network

1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Filtra por `Fetch/XHR`
4. Verás todas las peticiones al API

#### Verificar token

```javascript
const token = localStorage.getItem('authToken');
console.log('Token actual:', token);
```

#### Ver datos en PostgreSQL

```sql
-- Ver todos los usuarios
SELECT * FROM users;

-- Ver perfiles
SELECT * FROM perfiles;

-- Ver ingresos de un perfil
SELECT * FROM ingresos WHERE "perfilId" = 'perfil-uuid';
```

---

### 10. ✅ Checklist de Migración

- [ ] Backend instalado y corriendo en puerto 5000
- [ ] Base de datos PostgreSQL creada
- [ ] Migraciones ejecutadas exitosamente
- [ ] Seeders ejecutados (datos de prueba cargados)
- [ ] Variable `VITE_API_URL` configurada en frontend
- [ ] `apiService.js` importado en componentes
- [ ] Login funciona correctamente
- [ ] Se pueden ver datos de perfiles
- [ ] Se pueden crear nuevos registros
- [ ] Notificaciones funcionan

---

## 🎯 Próximos Pasos

Una vez completada la migración:

1. **Eliminar mockDatabase.js** (opcional, mantener como backup)
2. **Actualizar AuthContext** para usar `authService`
3. **Migrar componentes** uno por uno de mockDB a API
4. **Probar funcionalidad** completa de cada módulo
5. **Deploy a producción** cuando esté listo

---

## 📞 Soporte

Si encuentras errores:

1. Revisa el **console.log** del frontend (F12)
2. Revisa la **terminal del backend** para errores del servidor
3. Consulta la [API Documentation](../../../backend/API_DOCUMENTATION.md)
4. Verifica que ambos servidores estén corriendo

---

**¡Listo! Tu aplicación ahora usa una API real con base de datos PostgreSQL** 🎉
