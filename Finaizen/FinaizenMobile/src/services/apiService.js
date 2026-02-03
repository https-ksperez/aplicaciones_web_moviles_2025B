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
      // Puerto 8001 para backend MongoDB
      console.log('🔗 API conectando a:', `http://${host}:8001/api`);
      return `http://${host}:8001/api`;
    }
  }
  
  // Fallback para producción o si no se detecta
  // Puerto 8001 para backend MongoDB
  return 'http://localhost:8001/api';
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
 * También normaliza _id de MongoDB a id
 */
const convertKeysToCamelCase = (obj) => {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item));
  }
  
  return Object.keys(obj).reduce((result, key) => {
    // Convertir _id de MongoDB a id
    if (key === '_id') {
      result['id'] = obj[key];
      return result;
    }
    
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
  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error('Error al procesar respuesta del servidor');
  }
  
  if (!response.ok) {
    if (response.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // Aquí se manejará la redirección al login desde el AuthContext
    }
    // El backend MongoDB usa 'mensaje' en español
    throw new Error(data.mensaje || data.message || 'Error en la petición');
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
  // Auth - Endpoints adaptados para backend MongoDB
  auth: {
    login: (credentials) => request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
    register: (userData) => request('/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    me: () => request('/me'),
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
  
  // Ingresos - Endpoints adaptados para backend MongoDB
  ingresos: {
    getAll: (perfilId) => request(`/ingresos/${perfilId}`),
    getById: (id) => request(`/ingresos/detalle/${id}`),
    create: (perfilId, data) => request('/ingresos', {
      method: 'POST',
      body: JSON.stringify({ ...data, perfilId })
    }),
    update: (perfilId, id, data) => request(`/ingresos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (perfilId, id) => request(`/ingresos/${id}`, {
      method: 'DELETE'
    })
  },
  
  // Egresos - Endpoints adaptados para backend MongoDB
  egresos: {
    getAll: (perfilId) => request(`/egresos/${perfilId}`),
    getById: (id) => request(`/egresos/detalle/${id}`),
    create: (perfilId, data) => request('/egresos', {
      method: 'POST',
      body: JSON.stringify({ ...data, perfilId })
    }),
    update: (perfilId, id, data) => request(`/egresos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (perfilId, id) => request(`/egresos/${id}`, {
      method: 'DELETE'
    })
  },
  
  // Presupuestos - Endpoints adaptados para backend MongoDB
  presupuestos: {
    getAll: (perfilId) => request(`/presupuestos/${perfilId}`),
    getById: (id) => request(`/presupuestos/detalle/${id}`),
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
  
  // Planes de Ahorro - Endpoints adaptados para backend MongoDB
  planesAhorro: {
    getAll: (perfilId) => request(`/planes-ahorro/${perfilId}`),
    getById: (id) => request(`/planes-ahorro/detalle/${id}`),
    create: (data) => request('/planes-ahorro', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/planes-ahorro/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    depositar: (id, monto) => request(`/planes-ahorro/${id}/depositar`, {
      method: 'PUT',
      body: JSON.stringify({ monto })
    }),
    delete: (id) => request(`/planes-ahorro/${id}`, {
      method: 'DELETE'
    })
  },
  
  // Deudas/Planes de Deuda - Endpoints adaptados para backend MongoDB
  deudas: {
    getAll: (perfilId) => request(`/planes-deuda/perfil/${perfilId}`),
    getById: (id) => request(`/planes-deuda/${id}`),
    estadisticas: (perfilId) => request(`/planes-deuda/estadisticas/${perfilId}`),
    create: (data) => request('/planes-deuda', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/planes-deuda/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    registrarPago: (id, monto, nota) => request(`/planes-deuda/${id}/pago`, {
      method: 'POST',
      body: JSON.stringify({ monto, nota })
    }),
    delete: (id) => request(`/planes-deuda/${id}`, {
      method: 'DELETE'
    })
  },

  // Historial - Registro de transacciones
  historial: {
    getAll: (perfilId) => request(`/historial/${perfilId}`),
    getById: (id) => request(`/historial/detalle/${id}`),
    getResumen: (perfilId, mes, anio) => {
      let url = `/historial/${perfilId}/resumen`;
      const params = [];
      if (mes) params.push(`mes=${mes}`);
      if (anio) params.push(`anio=${anio}`);
      if (params.length > 0) url += `?${params.join('&')}`;
      return request(url);
    },
    create: (perfilId, data) => request(`/historial/${perfilId}`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/historial/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: (id) => request(`/historial/${id}`, {
      method: 'DELETE'
    })
  },

  // Logros - Sistema de logros/achievements
  logros: {
    getAll: (perfilId) => request(`/logros/${perfilId}`),
    getById: (id) => request(`/logros/detalle/${id}`),
    create: (data) => request('/logros', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: (id, data) => request(`/logros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    desbloquear: (id) => request(`/logros/${id}/desbloquear`, {
      method: 'PUT'
    }),
    actualizarProgreso: (id, progreso) => request(`/logros/${id}/progreso`, {
      method: 'PUT',
      body: JSON.stringify({ progreso })
    }),
    delete: (id) => request(`/logros/${id}`, {
      method: 'DELETE'
    })
  },

  // Notificaciones
  notificaciones: {
    getAll: () => request('/notificaciones'),
    getNoLeidas: () => request('/notificaciones?leidas=false'),
    getConteoNoLeidas: () => request('/notificaciones/no-leidas/count'),
    getById: (id) => request(`/notificaciones/${id}`),
    create: (data) => request('/notificaciones', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    marcarLeida: (id) => request(`/notificaciones/${id}/leer`, {
      method: 'PUT'
    }),
    marcarTodasLeidas: () => request('/notificaciones/leer-todas', {
      method: 'PUT'
    }),
    deleteLeidas: () => request('/notificaciones/leidas', {
      method: 'DELETE'
    }),
    delete: (id) => request(`/notificaciones/${id}`, {
      method: 'DELETE'
    })
  }
};

export default apiService;
