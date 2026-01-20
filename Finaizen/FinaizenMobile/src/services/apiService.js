/**
 * apiService.js
 * Servicio centralizado para todas las llamadas al backend API
 * Adaptado para React Native (usa AsyncStorage en lugar de sessionStorage)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Configuración base del API - Detección dinámica de IP
const getApiBaseUrl = () => {
  // En desarrollo con Expo, obtener la IP del servidor de metro
  if (__DEV__) {
    // Intentar obtener la IP del debugger host de Expo
    const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
    if (debuggerHost) {
      const host = debuggerHost.split(':')[0]; // Obtener solo la IP sin el puerto
      console.log('🔗 API conectando a:', `http://${host}:5000/api`);
      return `http://${host}:5000/api`;
    }
  }
  
  // Fallback para producción o si no se detecta
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Convertir snake_case a camelCase
 */
const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

/**
 * Convertir objeto de snake_case a camelCase recursivamente
 */
const convertKeysToCamelCase = (obj) => {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item));
  }
  
  return Object.keys(obj).reduce((result, key) => {
    const camelKey = toCamelCase(key);
    result[camelKey] = convertKeysToCamelCase(obj[key]);
    return result;
  }, {});
};

/**
 * Configuración de headers con autenticación
 */
const getHeaders = async () => {
  const token = await AsyncStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Manejo de respuestas del API
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // Aquí se manejará la redirección al login desde el AuthContext
    }
    throw new Error(data.message || 'Error en la petición');
  }
  
  const result = data.data || data;
  return convertKeysToCamelCase(result);
};

/**
 * Wrapper para peticiones HTTP
 */
const request = async (endpoint, options = {}) => {
  const headers = await getHeaders();
  const config = {
    headers,
    ...options
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// API Service exportado
const apiService = {
  // Auth
  auth: {
    login: (credentials) => request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
    register: (userData) => request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    me: () => request('/auth/me'),
    logout: async () => {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('finaizen_session');
    }
  },
  
  // Perfiles
  perfiles: {
    getAll: () => request('/perfiles'),
    create: (data) => request('/perfiles', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/perfiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => request(`/perfiles/${id}`, {
      method: 'DELETE'
    })
  },
  
  // Registros (Ingresos/Egresos)
  registros: {
    getAll: (perfilId) => request(`/registros?perfil_id=${perfilId}`),
    create: (data) => request('/registros', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/registros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => request(`/registros/${id}`, {
      method: 'DELETE'
    })
  },
  
  // Presupuestos
  presupuestos: {
    getAll: (perfilId) => request(`/presupuestos?perfil_id=${perfilId}`),
    create: (data) => request('/presupuestos', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/presupuestos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => request(`/presupuestos/${id}`, {
      method: 'DELETE'
    })
  },
  
  // Planes de Ahorro
  planesAhorro: {
    getAll: (perfilId) => request(`/planes-ahorro?perfil_id=${perfilId}`),
    create: (data) => request('/planes-ahorro', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/planes-ahorro/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => request(`/planes-ahorro/${id}`, {
      method: 'DELETE'
    })
  },
  
  // Deudas
  deudas: {
    getAll: (perfilId) => request(`/deudas?perfil_id=${perfilId}`),
    create: (data) => request('/deudas', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/deudas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => request(`/deudas/${id}`, {
      method: 'DELETE'
    })
  },
  
  // Logros
  logros: {
    getAll: (perfilId) => request(`/logros?perfil_id=${perfilId}`)
  },
  
  // Notificaciones
  notificaciones: {
    getAll: () => request('/notificaciones'),
    markAsRead: (id) => request(`/notificaciones/${id}/read`, {
      method: 'PUT'
    })
  },
  
  // Historial de transacciones ejecutadas (ruta anidada en perfil)
  historial: {
    getAll: (perfilId) => request(`/perfiles/${perfilId}/historial`),
    create: (perfilId, data) => request(`/perfiles/${perfilId}/historial`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    delete: (perfilId, id) => request(`/perfiles/${perfilId}/historial/${id}`, {
      method: 'DELETE'
    })
  },
  
  // Ingresos programados (ruta anidada en perfil)
  ingresos: {
    getAll: (perfilId) => request(`/perfiles/${perfilId}/ingresos`),
    create: (perfilId, data) => request(`/perfiles/${perfilId}/ingresos`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (perfilId, id, data) => request(`/perfiles/${perfilId}/ingresos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (perfilId, id) => request(`/perfiles/${perfilId}/ingresos/${id}`, {
      method: 'DELETE'
    })
  },
  
  // Egresos programados (ruta anidada en perfil)
  egresos: {
    getAll: (perfilId) => request(`/perfiles/${perfilId}/egresos`),
    create: (perfilId, data) => request(`/perfiles/${perfilId}/egresos`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (perfilId, id, data) => request(`/perfiles/${perfilId}/egresos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (perfilId, id) => request(`/perfiles/${perfilId}/egresos/${id}`, {
      method: 'DELETE'
    })
  }
};

export default apiService;
