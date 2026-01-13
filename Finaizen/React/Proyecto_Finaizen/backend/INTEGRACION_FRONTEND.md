# 🔗 GUÍA DE INTEGRACIÓN FRONTEND-BACKEND

## Conectar React (Frontend) con Express (Backend)

### 📋 Requisitos Previos
- Backend ejecutándose en `http://localhost:3000`
- Frontend ejecutándose en `http://localhost:5173` (Vite)
- CORS ya está configurado en el backend

---

## 🚀 Ejemplo de Integración

### 1. Crear Servicio API en el Frontend

Crear archivo: `src/services/itemsService.js`

```javascript
const API_URL = 'http://localhost:3000';

export const itemsService = {
  // Obtener todos los items
  async getAll() {
    try {
      const response = await fetch(`${API_URL}/items`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener items:', error);
      throw error;
    }
  },

  // Obtener item por ID
  async getById(id) {
    try {
      const response = await fetch(`${API_URL}/items/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error al obtener item ${id}:`, error);
      throw error;
    }
  },

  // Crear nuevo item
  async create(itemData) {
    try {
      const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear item:', error);
      throw error;
    }
  },

  // Actualizar item
  async update(id, itemData) {
    try {
      const response = await fetch(`${API_URL}/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error al actualizar item ${id}:`, error);
      throw error;
    }
  },

  // Eliminar item
  async delete(id) {
    try {
      const response = await fetch(`${API_URL}/items/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error al eliminar item ${id}:`, error);
      throw error;
    }
  },
};
```

---

### 2. Usar el Servicio en un Componente React

```javascript
import { useState, useEffect } from 'react';
import { itemsService } from '../services/itemsService';

function ItemsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar items al montar el componente
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await itemsService.getAll();
      if (response.success) {
        setItems(response.data);
      }
    } catch (err) {
      setError('Error al cargar los items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo item
  const handleCreate = async () => {
    try {
      const newItem = {
        name: 'Nuevo Item',
        description: 'Descripción del item',
      };
      const response = await itemsService.create(newItem);
      if (response.success) {
        // Recargar la lista
        loadItems();
      }
    } catch (err) {
      console.error('Error al crear item:', err);
    }
  };

  // Eliminar item
  const handleDelete = async (id) => {
    try {
      const response = await itemsService.delete(id);
      if (response.success) {
        // Recargar la lista
        loadItems();
      }
    } catch (err) {
      console.error('Error al eliminar item:', err);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Lista de Items</h2>
      <button onClick={handleCreate}>Crear Nuevo Item</button>
      
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong>: {item.description}
            <button onClick={() => handleDelete(item.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ItemsList;
```

---

### 3. Usando Axios (Alternativa a fetch)

#### Instalar Axios:
```powershell
npm install axios
```

#### Servicio con Axios:
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Configurar instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const itemsService = {
  async getAll() {
    const response = await api.get('/items');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  async create(itemData) {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  async update(id, itemData) {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },
};
```

---

### 4. Custom Hook para Items

```javascript
import { useState, useEffect } from 'react';
import { itemsService } from '../services/itemsService';

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await itemsService.getAll();
      if (response.success) {
        setItems(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData) => {
    try {
      const response = await itemsService.create(itemData);
      if (response.success) {
        setItems([...items, response.data]);
        return response.data;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await itemsService.delete(id);
      if (response.success) {
        setItems(items.filter((item) => item.id !== id));
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateItem = async (id, itemData) => {
    try {
      const response = await itemsService.update(id, itemData);
      if (response.success) {
        setItems(items.map((item) => 
          item.id === id ? response.data : item
        ));
        return response.data;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return {
    items,
    loading,
    error,
    loadItems,
    createItem,
    deleteItem,
    updateItem,
  };
}
```

#### Usar el Hook:
```javascript
function ItemsPage() {
  const { items, loading, error, createItem, deleteItem } = useItems();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Items ({items.length})</h1>
      {/* Renderizar items */}
    </div>
  );
}
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno en el Frontend

Crear archivo `.env` en la raíz del proyecto React:

```env
VITE_API_URL=http://localhost:3000
```

Usar en el código:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## 🚀 Ejecutar Frontend y Backend Simultáneamente

### Opción 1: Dos terminales
**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```

### Opción 2: Script combinado (package.json raíz)

Instalar `concurrently`:
```powershell
npm install --save-dev concurrently
```

Agregar script en `package.json`:
```json
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm start\" \"npm run dev\""
  }
}
```

Ejecutar:
```powershell
npm run dev
```

---

## 📝 Notas Importantes

1. **CORS**: Ya está configurado en el backend para `http://localhost:5173`
2. **Puertos**: Backend en 3000, Frontend en 5173
3. **Manejo de errores**: Siempre usar try-catch en las llamadas a la API
4. **Estado de carga**: Mostrar indicadores mientras se cargan datos
5. **Actualización de UI**: Recargar datos después de crear/eliminar/actualizar

---

## 🎯 Próximos Pasos

- [ ] Implementar autenticación con JWT
- [ ] Agregar paginación para grandes listas
- [ ] Implementar caché de datos
- [ ] Agregar validación de formularios
- [ ] Implementar manejo de errores global
- [ ] Agregar tests con Vitest/Jest

---

**Nota:** Esta es una guía básica de integración. Para el proyecto Finaizen completo, se recomienda adaptar estos patrones a los modelos y servicios existentes (User, Perfil, Ingreso, Egreso, etc.).
