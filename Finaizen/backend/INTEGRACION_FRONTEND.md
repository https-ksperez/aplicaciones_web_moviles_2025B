# Guía de Integración Frontend - Backend

## 📋 Configuración del Frontend

### 1. Configurar URL del Backend

En tu proyecto React, crea o actualiza el archivo de configuración de la API:

**`React/Proyecto_Finaizen/src/config/apiConfig.js`**

```javascript
// Configuración de la API
export const API_CONFIG = {
  BASE_URL: process.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
};

// Helper para headers con autenticación
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};
```

### 2. Crear archivo .env en el Frontend

**`React/Proyecto_Finaizen/.env`**

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Crear Servicio de API

**`React/Proyecto_Finaizen/src/services/api.js`**

```javascript
import { API_CONFIG, getAuthHeaders } from '../config/apiConfig';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Métodos de autenticación
  auth = {
    register: (userData) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    login: (credentials) =>
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    getProfile: () => this.request('/auth/profile'),

    updateProfile: (userData) =>
      this.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),

    changePassword: (passwords) =>
      this.request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(passwords),
      }),
  };

  // Métodos de perfiles
  perfiles = {
    getAll: () => this.request('/perfiles'),
    
    getOne: (id) => this.request(`/perfiles/${id}`),
    
    create: (perfilData) =>
      this.request('/perfiles', {
        method: 'POST',
        body: JSON.stringify(perfilData),
      }),
    
    update: (id, perfilData) =>
      this.request(`/perfiles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(perfilData),
      }),
    
    delete: (id) =>
      this.request(`/perfiles/${id}`, {
        method: 'DELETE',
      }),
    
    getResumen: (id) => this.request(`/perfiles/${id}/resumen`),
  };

  // Métodos de ingresos
  ingresos = {
    getAll: (perfilId) => this.request(`/perfiles/${perfilId}/ingresos`),
    
    getOne: (perfilId, id) =>
      this.request(`/perfiles/${perfilId}/ingresos/${id}`),
    
    create: (perfilId, ingresoData) =>
      this.request(`/perfiles/${perfilId}/ingresos`, {
        method: 'POST',
        body: JSON.stringify(ingresoData),
      }),
    
    update: (perfilId, id, ingresoData) =>
      this.request(`/perfiles/${perfilId}/ingresos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(ingresoData),
      }),
    
    delete: (perfilId, id) =>
      this.request(`/perfiles/${perfilId}/ingresos/${id}`, {
        method: 'DELETE',
      }),
  };

  // Métodos de egresos
  egresos = {
    getAll: (perfilId) => this.request(`/perfiles/${perfilId}/egresos`),
    getOne: (perfilId, id) => this.request(`/perfiles/${perfilId}/egresos/${id}`),
    create: (perfilId, egresoData) =>
      this.request(`/perfiles/${perfilId}/egresos`, {
        method: 'POST',
        body: JSON.stringify(egresoData),
      }),
    update: (perfilId, id, egresoData) =>
      this.request(`/perfiles/${perfilId}/egresos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(egresoData),
      }),
    delete: (perfilId, id) =>
      this.request(`/perfiles/${perfilId}/egresos/${id}`, { method: 'DELETE' }),
  };

  // Métodos de presupuestos
  presupuestos = {
    getAll: (perfilId) => this.request(`/perfiles/${perfilId}/presupuestos`),
    getOne: (perfilId, id) => this.request(`/perfiles/${perfilId}/presupuestos/${id}`),
    create: (perfilId, data) =>
      this.request(`/perfiles/${perfilId}/presupuestos`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (perfilId, id, data) =>
      this.request(`/perfiles/${perfilId}/presupuestos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (perfilId, id) =>
      this.request(`/perfiles/${perfilId}/presupuestos/${id}`, { method: 'DELETE' }),
  };

  // Planes de ahorro
  planesAhorro = {
    getAll: (perfilId) => this.request(`/perfiles/${perfilId}/planes-ahorro`),
    getOne: (perfilId, id) => this.request(`/perfiles/${perfilId}/planes-ahorro/${id}`),
    create: (perfilId, data) =>
      this.request(`/perfiles/${perfilId}/planes-ahorro`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (perfilId, id, data) =>
      this.request(`/perfiles/${perfilId}/planes-ahorro/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (perfilId, id) =>
      this.request(`/perfiles/${perfilId}/planes-ahorro/${id}`, { method: 'DELETE' }),
  };

  // Planes de deuda
  planesDeuda = {
    getAll: (perfilId) => this.request(`/perfiles/${perfilId}/planes-deuda`),
    getOne: (perfilId, id) => this.request(`/perfiles/${perfilId}/planes-deuda/${id}`),
    create: (perfilId, data) =>
      this.request(`/perfiles/${perfilId}/planes-deuda`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (perfilId, id, data) =>
      this.request(`/perfiles/${perfilId}/planes-deuda/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (perfilId, id) =>
      this.request(`/perfiles/${perfilId}/planes-deuda/${id}`, { method: 'DELETE' }),
  };

  // Logros
  logros = {
    getAll: (perfilId) => this.request(`/perfiles/${perfilId}/logros`),
    getOne: (perfilId, id) => this.request(`/perfiles/${perfilId}/logros/${id}`),
    create: (perfilId, data) =>
      this.request(`/perfiles/${perfilId}/logros`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (perfilId, id, data) =>
      this.request(`/perfiles/${perfilId}/logros/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (perfilId, id) =>
      this.request(`/perfiles/${perfilId}/logros/${id}`, { method: 'DELETE' }),
  };

  // Historial
  historial = {
    getAll: (perfilId) => this.request(`/perfiles/${perfilId}/historial`),
    getOne: (perfilId, id) => this.request(`/perfiles/${perfilId}/historial/${id}`),
    create: (perfilId, data) =>
      this.request(`/perfiles/${perfilId}/historial`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (perfilId, id) =>
      this.request(`/perfiles/${perfilId}/historial/${id}`, { method: 'DELETE' }),
  };
}

export default new ApiService();
```

### 4. Actualizar AuthContext

**`React/Proyecto_Finaizen/src/context/AuthContext.jsx`**

```javascript
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await api.auth.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Error loading user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await api.auth.login(credentials);
    const { user, token } = response.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    
    return response;
  };

  const register = async (userData) => {
    const response = await api.auth.register(userData);
    const { user, token } = response.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### 5. Ejemplo de Uso en un Componente

```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function IngresosComponent() {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const perfilId = 'uuid-del-perfil';

  useEffect(() => {
    loadIngresos();
  }, []);

  const loadIngresos = async () => {
    try {
      const response = await api.ingresos.getAll(perfilId);
      setIngresos(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (ingresoData) => {
    try {
      await api.ingresos.create(perfilId, ingresoData);
      loadIngresos(); // Recargar lista
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.ingresos.delete(perfilId, id);
      loadIngresos(); // Recargar lista
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {ingresos.map(ingreso => (
        <div key={ingreso.id}>
          <h3>{ingreso.descripcion}</h3>
          <p>{ingreso.monto}</p>
          <button onClick={() => handleDelete(ingreso.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}
```

## 🔄 Migración de mockDatabase

Para migrar de `mockDatabase.js` al backend real:

1. **Reemplazar todas las importaciones de mockDatabase** por el servicio de API
2. **Actualizar todas las funciones** que usan mockDatabase
3. **Manejar estados de carga** y errores de red
4. **Implementar re-fetch** después de operaciones CRUD

### Antes (con mockDatabase):
```javascript
import { mockDatabase } from '../utils/mockDatabase';

const ingresos = mockDatabase.getIngresos(perfilId);
```

### Después (con API):
```javascript
import api from '../services/api';

const response = await api.ingresos.getAll(perfilId);
const ingresos = response.data;
```

## 🚀 Pasos para la Migración Completa

1. ✅ Backend funcionando en `http://localhost:5000`
2. ✅ Crear servicio de API en el frontend
3. ✅ Actualizar AuthContext
4. ✅ Migrar componentes uno por uno
5. ✅ Probar cada funcionalidad
6. ✅ Eliminar mockDatabase cuando todo funcione

## 📝 Notas Importantes

- El backend usa UUIDs, no números incrementales
- Todas las fechas se manejan en formato ISO
- Los tokens JWT expiran en 7 días (configurable)
- El backend valida todos los datos antes de guardar
- Los errores devuelven objetos estructurados con `success: false`

---

¡Tu backend está listo para ser integrado con el frontend!
