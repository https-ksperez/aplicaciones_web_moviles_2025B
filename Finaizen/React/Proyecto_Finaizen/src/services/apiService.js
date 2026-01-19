/**
 * apiService.js
 * Servicio centralizado para todas las llamadas al backend API
 */

// Configuración base del API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
 * Usa sessionStorage para que cada pestaña tenga su propia sesión
 */
const getHeaders = () => {
  const token = sessionStorage.getItem('authToken');
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
    // Manejar errores específicos
    if (response.status === 401) {
      // Token expirado o inválido
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'Error en la petición');
  }
  
  // Convertir snake_case a camelCase
  const result = data.data || data;
  return convertKeysToCamelCase(result);
};

/**
 * Wrapper para peticiones HTTP
 */
const request = async (endpoint, options = {}) => {
  const config = {
    headers: getHeaders(),
    ...options
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`Error en petición a ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Transformar usuario para compatibilidad con frontend
 * Añade premiumActivo para compatibilidad con código existente
 */
const transformUser = (user) => {
  if (!user) return user;
  
  // Calcular si el usuario tiene premium activo
  const now = new Date();
  const fechaFinPremium = user.subscriptionEndDate ? new Date(user.subscriptionEndDate) : null;
  const premiumActivo = user.isPremium && (!fechaFinPremium || fechaFinPremium > now);
  
  return {
    ...user,
    premiumActivo,
    // Nombre completo para mostrar en UI
    nombreCompleto: `${user.nombre || ''} ${user.apellido || ''}`.trim() || user.nombreUsuario || 'Usuario',
    // Verificar si es admin
    esAdmin: user.rol === 'admin',
    // Alias para compatibilidad
    fechaInicioPremium: user.premiumSince,
    fechaFinPremium: user.subscriptionEndDate,
    tipoSuscripcion: user.subscriptionType
  };
};

// =====================================================
// AUTENTICACIÓN
// =====================================================

export const authService = {
  /**
   * Registrar nuevo usuario
   */
  register: async (userData) => {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  /**
   * Iniciar sesión
   */
  login: async (credentials) => {
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    // Guardar token en sessionStorage (cada pestaña tiene su propia sesión)
    if (response.token) {
      sessionStorage.setItem('authToken', response.token);
    }
    
    // Transformar usuario para compatibilidad
    if (response.user) {
      response.user = transformUser(response.user);
    }
    
    return response;
  },

  /**
   * Cerrar sesión
   */
  logout: () => {
    sessionStorage.removeItem('authToken');
    window.location.href = '/login';
  },

  /**
   * Obtener usuario autenticado (verificar token)
   */
  me: async () => {
    const response = await request('/auth/me');
    // Transformar usuario para compatibilidad
    if (response.user) {
      response.user = transformUser(response.user);
    }
    return response;
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  getProfile: async () => {
    return await request('/auth/profile');
  },

  /**
   * Actualizar perfil del usuario
   */
  updateProfile: async (profileData) => {
    return await request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  /**
   * Cambiar contraseña
   */
  changePassword: async (passwords) => {
    return await request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwords)
    });
  },

  /**
   * Cambiar contraseña (alias)
   */
  cambiarContrasena: async (passwords) => {
    return await request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwords)
    });
  },

  /**
   * Activar suscripción premium
   */
  activarPremium: async (suscripcionData) => {
    return await request('/auth/activar-premium', {
      method: 'POST',
      body: JSON.stringify(suscripcionData)
    });
  }
};

// =====================================================
// PERFILES
// =====================================================

/**
 * Transformar perfil para compatibilidad con frontend
 * Añade objeto moneda con simbolo para compatibilidad
 */
const transformPerfil = (perfil) => {
  if (!perfil) return perfil;
  return {
    ...perfil,
    // Añadir objeto moneda para compatibilidad
    moneda: {
      codigo: perfil.moneda || 'USD',
      simbolo: perfil.simboloMoneda || '$'
    }
  };
};

export const perfilService = {
  /**
   * Listar todos los perfiles del usuario
   */
  getAll: async () => {
    const perfiles = await request('/perfiles');
    return Array.isArray(perfiles) ? perfiles.map(transformPerfil) : [];
  },

  /**
   * Obtener un perfil por ID
   */
  getById: async (id) => {
    const perfil = await request(`/perfiles/${id}`);
    return transformPerfil(perfil);
  },

  /**
   * Crear nuevo perfil
   */
  create: async (perfilData) => {
    const perfil = await request('/perfiles', {
      method: 'POST',
      body: JSON.stringify(perfilData)
    });
    return transformPerfil(perfil);
  },

  /**
   * Actualizar perfil
   */
  update: async (id, perfilData) => {
    const perfil = await request(`/perfiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(perfilData)
    });
    return transformPerfil(perfil);
  },

  /**
   * Eliminar perfil
   */
  delete: async (id) => {
    return await request(`/perfiles/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Obtener resumen financiero del perfil
   */
  getResumen: async (id) => {
    return await request(`/perfiles/${id}/resumen`);
  }
};

// =====================================================
// INGRESOS
// =====================================================

export const ingresoService = {
  /**
   * Listar ingresos de un perfil
   */
  getAll: async (perfilId) => {
    return await request(`/perfiles/${perfilId}/ingresos`);
  },

  /**
   * Obtener ingreso por ID
   */
  getById: async (perfilId, id) => {
    return await request(`/perfiles/${perfilId}/ingresos/${id}`);
  },

  /**
   * Crear nuevo ingreso
   */
  create: async (perfilId, ingresoData) => {
    return await request(`/perfiles/${perfilId}/ingresos`, {
      method: 'POST',
      body: JSON.stringify(ingresoData)
    });
  },

  /**
   * Actualizar ingreso
   */
  update: async (perfilId, id, ingresoData) => {
    return await request(`/perfiles/${perfilId}/ingresos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ingresoData)
    });
  },

  /**
   * Eliminar ingreso
   */
  delete: async (perfilId, id) => {
    return await request(`/perfiles/${perfilId}/ingresos/${id}`, {
      method: 'DELETE'
    });
  }
};

// =====================================================
// EGRESOS
// =====================================================

export const egresoService = {
  getAll: async (perfilId) => {
    return await request(`/perfiles/${perfilId}/egresos`);
  },

  getById: async (perfilId, id) => {
    return await request(`/perfiles/${perfilId}/egresos/${id}`);
  },

  create: async (perfilId, egresoData) => {
    return await request(`/perfiles/${perfilId}/egresos`, {
      method: 'POST',
      body: JSON.stringify(egresoData)
    });
  },

  update: async (perfilId, id, egresoData) => {
    return await request(`/perfiles/${perfilId}/egresos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(egresoData)
    });
  },

  delete: async (perfilId, id) => {
    return await request(`/perfiles/${perfilId}/egresos/${id}`, {
      method: 'DELETE'
    });
  }
};

// =====================================================
// PRESUPUESTOS
// =====================================================

export const presupuestoService = {
  getAll: async (perfilId) => {
    return await request(`/perfiles/${perfilId}/presupuestos`);
  },

  getById: async (perfilId, id) => {
    return await request(`/perfiles/${perfilId}/presupuestos/${id}`);
  },

  create: async (perfilId, presupuestoData) => {
    return await request(`/perfiles/${perfilId}/presupuestos`, {
      method: 'POST',
      body: JSON.stringify(presupuestoData)
    });
  },

  update: async (perfilId, id, presupuestoData) => {
    return await request(`/perfiles/${perfilId}/presupuestos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(presupuestoData)
    });
  },

  delete: async (perfilId, id) => {
    return await request(`/perfiles/${perfilId}/presupuestos/${id}`, {
      method: 'DELETE'
    });
  }
};

// =====================================================
// PLANES DE AHORRO
// =====================================================

export const planAhorroService = {
  getAll: async (perfilId) => {
    return await request(`/perfiles/${perfilId}/planes-ahorro`);
  },

  getById: async (perfilId, id) => {
    return await request(`/perfiles/${perfilId}/planes-ahorro/${id}`);
  },

  create: async (perfilId, planData) => {
    return await request(`/perfiles/${perfilId}/planes-ahorro`, {
      method: 'POST',
      body: JSON.stringify(planData)
    });
  },

  update: async (perfilId, id, planData) => {
    return await request(`/perfiles/${perfilId}/planes-ahorro/${id}`, {
      method: 'PUT',
      body: JSON.stringify(planData)
    });
  },

  delete: async (perfilId, id) => {
    return await request(`/perfiles/${perfilId}/planes-ahorro/${id}`, {
      method: 'DELETE'
    });
  }
};

// =====================================================
// PLANES DE DEUDA
// =====================================================

export const planDeudaService = {
  getAll: async (perfilId) => {
    return await request(`/perfiles/${perfilId}/planes-deuda`);
  },

  getById: async (perfilId, id) => {
    return await request(`/perfiles/${perfilId}/planes-deuda/${id}`);
  },

  create: async (perfilId, planData) => {
    return await request(`/perfiles/${perfilId}/planes-deuda`, {
      method: 'POST',
      body: JSON.stringify(planData)
    });
  },

  update: async (perfilId, id, planData) => {
    return await request(`/perfiles/${perfilId}/planes-deuda/${id}`, {
      method: 'PUT',
      body: JSON.stringify(planData)
    });
  },

  delete: async (perfilId, id) => {
    return await request(`/perfiles/${perfilId}/planes-deuda/${id}`, {
      method: 'DELETE'
    });
  }
};

// =====================================================
// LOGROS
// =====================================================

export const logroService = {
  getAll: async (perfilId) => {
    return await request(`/perfiles/${perfilId}/logros`);
  },

  getById: async (perfilId, id) => {
    return await request(`/perfiles/${perfilId}/logros/${id}`);
  },

  create: async (perfilId, logroData) => {
    return await request(`/perfiles/${perfilId}/logros`, {
      method: 'POST',
      body: JSON.stringify(logroData)
    });
  },

  update: async (perfilId, id, logroData) => {
    return await request(`/perfiles/${perfilId}/logros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(logroData)
    });
  },

  delete: async (perfilId, id) => {
    return await request(`/perfiles/${perfilId}/logros/${id}`, {
      method: 'DELETE'
    });
  }
};

// =====================================================
// HISTORIAL
// =====================================================

export const historialService = {
  getAll: async (perfilId, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/perfiles/${perfilId}/historial${queryParams ? `?${queryParams}` : ''}`;
    return await request(endpoint);
  },

  getById: async (perfilId, id) => {
    return await request(`/perfiles/${perfilId}/historial/${id}`);
  },

  create: async (perfilId, registroData) => {
    return await request(`/perfiles/${perfilId}/historial`, {
      method: 'POST',
      body: JSON.stringify(registroData)
    });
  },

  update: async (perfilId, id, registroData) => {
    return await request(`/perfiles/${perfilId}/historial/${id}`, {
      method: 'PUT',
      body: JSON.stringify(registroData)
    });
  },

  delete: async (perfilId, id) => {
    return await request(`/perfiles/${perfilId}/historial/${id}`, {
      method: 'DELETE'
    });
  }
};

// =====================================================
// NOTIFICACIONES
// =====================================================

export const notificacionService = {
  /**
   * Obtener todas las notificaciones (con filtro opcional)
   */
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/notificaciones${queryParams ? `?${queryParams}` : ''}`;
    return await request(endpoint);
  },

  /**
   * Marcar notificación como leída
   */
  markAsRead: async (id) => {
    return await request(`/notificaciones/${id}/leer`, {
      method: 'PUT'
    });
  },

  /**
   * Marcar todas las notificaciones como leídas
   */
  markAllAsRead: async () => {
    return await request('/notificaciones/leer-todas', {
      method: 'PUT'
    });
  },

  /**
   * Eliminar notificación
   */
  delete: async (id) => {
    return await request(`/notificaciones/${id}`, {
      method: 'DELETE'
    });
  }
};

// =====================================================
// USUARIOS (para admin y configuración)
// =====================================================

export const userService = {
  /**
   * Obtener todos los usuarios (solo admin)
   */
  getAll: async () => {
    return await request('/users');
  },

  /**
   * Obtener un usuario por ID
   */
  getById: async (id) => {
    return await request(`/users/${id}`);
  },

  /**
   * Actualizar usuario
   */
  update: async (id, userData) => {
    return await request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  /**
   * Eliminar usuario (solo admin)
   */
  delete: async (id) => {
    return await request(`/users/${id}`, {
      method: 'DELETE'
    });
  }
};

// =====================================================
// ADMIN - ROLES Y PERMISOS
// =====================================================

export const rolesService = {
  /**
   * Obtener todos los roles
   */
  getAll: async () => {
    return await request('/admin/roles');
  },

  /**
   * Obtener todos los permisos disponibles
   */
  getPermisos: async () => {
    return await request('/admin/roles/permisos');
  },

  /**
   * Crear un rol
   */
  create: async (roleData) => {
    return await request('/admin/roles', {
      method: 'POST',
      body: JSON.stringify(roleData)
    });
  },

  /**
   * Actualizar un rol
   */
  update: async (id, roleData) => {
    return await request(`/admin/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData)
    });
  },

  /**
   * Eliminar un rol
   */
  delete: async (id) => {
    return await request(`/admin/roles/${id}`, {
      method: 'DELETE'
    });
  }
};

// =====================================================
// ADMIN - INTELIGENCIA DE MERCADO
// =====================================================

export const marketService = {
  /**
   * Obtener todos los datos de mercado
   */
  getAll: async () => {
    return await request('/admin/market');
  },

  /**
   * Obtener opciones de filtros
   */
  getOptions: async () => {
    return await request('/admin/market/options');
  },

  /**
   * Obtener datos por filtros
   */
  getData: async (ubicacion, rangoEdad) => {
    return await request(`/admin/market/data?ubicacion=${ubicacion}&rangoEdad=${rangoEdad}`);
  },

  /**
   * Actualizar datos de mercado
   */
  update: async (data) => {
    return await request('/admin/market', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
};

// =====================================================
// ADMIN - SUPERVISIÓN IA
// =====================================================

export const supervisionService = {
  /**
   * Obtener todas las transacciones para supervisión
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return await request(`/admin/supervision${params ? `?${params}` : ''}`);
  },

  /**
   * Obtener KPIs de supervisión
   */
  getKPIs: async () => {
    return await request('/admin/supervision/kpis');
  },

  /**
   * Validar una transacción
   */
  validate: async (id) => {
    return await request(`/admin/supervision/${id}/validate`, {
      method: 'PUT'
    });
  },

  /**
   * Corregir categoría de una transacción
   */
  correct: async (id, data) => {
    return await request(`/admin/supervision/${id}/correct`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  /**
   * Obtener reglas de IA
   */
  getRules: async () => {
    return await request('/admin/supervision/rules');
  },

  /**
   * Crear regla de IA
   */
  createRule: async (ruleData) => {
    return await request('/admin/supervision/rules', {
      method: 'POST',
      body: JSON.stringify(ruleData)
    });
  },

  /**
   * Eliminar regla de IA
   */
  deleteRule: async (id) => {
    return await request(`/admin/supervision/rules/${id}`, {
      method: 'DELETE'
    });
  }
};

// =====================================================
// ADMIN - SOPORTE
// =====================================================

export const supportService = {
  /**
   * Obtener todos los tickets
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return await request(`/admin/support${params ? `?${params}` : ''}`);
  },

  /**
   * Obtener KPIs de soporte
   */
  getKPIs: async () => {
    return await request('/admin/support/kpis');
  },

  /**
   * Obtener agentes de soporte
   */
  getAgents: async () => {
    return await request('/admin/support/agents');
  },

  /**
   * Obtener un ticket por ID
   */
  getById: async (id) => {
    return await request(`/admin/support/${id}`);
  },

  /**
   * Actualizar un ticket
   */
  update: async (id, data) => {
    return await request(`/admin/support/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  /**
   * Asignar ticket a un agente
   */
  assign: async (id, asignadoA) => {
    return await request(`/admin/support/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ asignadoA })
    });
  },

  /**
   * Crear un ticket (admin)
   */
  create: async (ticketData) => {
    return await request('/admin/support', {
      method: 'POST',
      body: JSON.stringify(ticketData)
    });
  },

  /**
   * Crear un ticket de soporte desde la página de usuario
   * Esta función es para usuarios normales (no admin)
   */
  createUserTicket: async (ticketData) => {
    return await request('/admin/support/ticket', {
      method: 'POST',
      body: JSON.stringify(ticketData)
    });
  }
};

// =====================================================
// ADMIN - SEGURIDAD
// =====================================================

export const securityService = {
  /**
   * Obtener todos los logs de seguridad
   */
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return await request(`/admin/security${params ? `?${params}` : ''}`);
  },

  /**
   * Obtener KPIs de seguridad
   */
  getKPIs: async () => {
    return await request('/admin/security/kpis');
  },

  /**
   * Bloquear/desbloquear IP
   */
  toggleBlock: async (id, blocked) => {
    return await request(`/admin/security/${id}/toggle-block`, {
      method: 'PUT',
      body: JSON.stringify({ blocked })
    });
  },

  /**
   * Exportar logs a CSV
   */
  exportLogs: async () => {
    const token = sessionStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/admin/security/export`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al exportar logs');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'security_logs.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
};

// =====================================================
// SCHEDULER SERVICE (Tareas programadas)
// =====================================================

export const schedulerService = {
  /**
   * Obtener estado del scheduler
   */
  getStatus: async () => {
    return await request('/scheduler/status');
  },

  /**
   * Ejecutar todas las transacciones pendientes de hoy
   */
  ejecutarPendientes: async () => {
    return await request('/scheduler/ejecutar', {
      method: 'POST'
    });
  },

  /**
   * Procesar transacciones de la hora actual
   */
  procesar: async () => {
    return await request('/scheduler/procesar', {
      method: 'POST'
    });
  },

  /**
   * Obtener lista de transacciones pendientes de hoy
   */
  getPendientes: async () => {
    return await request('/scheduler/pendientes');
  }
};

// =====================================================
// EXPORTAR OBJETO CON TODOS LOS SERVICIOS
// =====================================================

const apiService = {
  auth: authService,
  users: userService,
  perfiles: perfilService,
  ingresos: ingresoService,
  egresos: egresoService,
  presupuestos: presupuestoService,
  planesAhorro: planAhorroService,
  planesDeuda: planDeudaService,
  logros: logroService,
  historial: historialService,
  notificaciones: notificacionService,
  // Admin services
  roles: rolesService,
  market: marketService,
  supervision: supervisionService,
  support: supportService,
  security: securityService,
  // Scheduler service
  scheduler: schedulerService
};

export default apiService;
