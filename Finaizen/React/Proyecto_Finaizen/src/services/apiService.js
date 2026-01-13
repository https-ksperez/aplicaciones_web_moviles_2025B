/**
 * API Service - Cliente para consumir el backend JSON Server
 * Centraliza todas las llamadas HTTP al backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  constructor(baseURL = API_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Método genérico para hacer peticiones HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ==================== CRUD Genérico ====================

  /**
   * GET - Obtener todos los recursos
   */
  async getAll(resource) {
    return this.request(`/${resource}`);
  }

  /**
   * GET - Obtener recurso por ID
   */
  async getById(resource, id) {
    return this.request(`/${resource}/${id}`);
  }

  /**
   * POST - Crear nuevo recurso
   */
  async create(resource, data) {
    return this.request(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT - Actualizar recurso completo
   */
  async update(resource, id, data) {
    return this.request(`/${resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH - Actualizar recurso parcialmente
   */
  async patch(resource, id, data) {
    return this.request(`/${resource}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE - Eliminar recurso
   */
  async delete(resource, id) {
    return this.request(`/${resource}/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * GET con query params - Filtrar recursos
   * Ejemplo: getWithQuery('users', { rol: 'admin', isPremium: true })
   */
  async getWithQuery(resource, queryParams = {}) {
    const queryString = new URLSearchParams(queryParams).toString();
    const endpoint = queryString ? `/${resource}?${queryString}` : `/${resource}`;
    return this.request(endpoint);
  }

  // ==================== USERS ====================

  async getUsers() {
    return this.getAll('users');
  }

  async getUserById(id) {
    return this.getById('users', id);
  }

  async createUser(userData) {
    return this.create('users', userData);
  }

  async updateUser(id, userData) {
    return this.update('users', id, userData);
  }

  async deleteUser(id) {
    return this.delete('users', id);
  }

  async getUserByUsername(username) {
    const users = await this.getWithQuery('users', { nombreUsuario: username });
    return users[0] || null;
  }

  async login(nombreUsuario, contraseña) {
    const users = await this.getWithQuery('users', { nombreUsuario, contraseña });
    return users[0] || null;
  }

  // ==================== PERFILES ====================

  async getPerfiles() {
    return this.getAll('perfiles');
  }

  async getPerfilById(id) {
    return this.getById('perfiles', id);
  }

  async getPerfilByUserId(userId) {
    const perfiles = await this.getWithQuery('perfiles', { userId });
    return perfiles[0] || null;
  }

  async createPerfil(perfilData) {
    return this.create('perfiles', perfilData);
  }

  async updatePerfil(id, perfilData) {
    return this.update('perfiles', id, perfilData);
  }

  async deletePerfil(id) {
    return this.delete('perfiles', id);
  }

  // ==================== INGRESOS ====================

  async getIngresos() {
    return this.getAll('ingresos');
  }

  async getIngresoById(id) {
    return this.getById('ingresos', id);
  }

  async getIngresosByUserId(userId) {
    return this.getWithQuery('ingresos', { userId });
  }

  async createIngreso(ingresoData) {
    return this.create('ingresos', ingresoData);
  }

  async updateIngreso(id, ingresoData) {
    return this.update('ingresos', id, ingresoData);
  }

  async deleteIngreso(id) {
    return this.delete('ingresos', id);
  }

  // ==================== EGRESOS ====================

  async getEgresos() {
    return this.getAll('egresos');
  }

  async getEgresoById(id) {
    return this.getById('egresos', id);
  }

  async getEgresosByUserId(userId) {
    return this.getWithQuery('egresos', { userId });
  }

  async createEgreso(egresoData) {
    return this.create('egresos', egresoData);
  }

  async updateEgreso(id, egresoData) {
    return this.update('egresos', id, egresoData);
  }

  async deleteEgreso(id) {
    return this.delete('egresos', id);
  }

  // ==================== HISTORIAL ====================

  async getHistorial() {
    return this.getAll('historial');
  }

  async getHistorialById(id) {
    return this.getById('historial', id);
  }

  async getHistorialByUserId(userId) {
    return this.getWithQuery('historial', { userId });
  }

  async createHistorial(historialData) {
    return this.create('historial', historialData);
  }

  async updateHistorial(id, historialData) {
    return this.update('historial', id, historialData);
  }

  async deleteHistorial(id) {
    return this.delete('historial', id);
  }

  // ==================== PRESUPUESTOS ====================

  async getPresupuestos() {
    return this.getAll('presupuestos');
  }

  async getPresupuestoById(id) {
    return this.getById('presupuestos', id);
  }

  async getPresupuestosByUserId(userId) {
    return this.getWithQuery('presupuestos', { userId });
  }

  async createPresupuesto(presupuestoData) {
    return this.create('presupuestos', presupuestoData);
  }

  async updatePresupuesto(id, presupuestoData) {
    return this.update('presupuestos', id, presupuestoData);
  }

  async deletePresupuesto(id) {
    return this.delete('presupuestos', id);
  }

  // ==================== LOGROS ====================

  async getLogros() {
    return this.getAll('logros');
  }

  async getLogroById(id) {
    return this.getById('logros', id);
  }

  async getLogrosByUserId(userId) {
    return this.getWithQuery('logros', { userId });
  }

  async createLogro(logroData) {
    return this.create('logros', logroData);
  }

  async updateLogro(id, logroData) {
    return this.update('logros', id, logroData);
  }

  async deleteLogro(id) {
    return this.delete('logros', id);
  }

  // ==================== NOTIFICACIONES ====================

  async getNotificaciones() {
    return this.getAll('notificaciones');
  }

  async getNotificacionById(id) {
    return this.getById('notificaciones', id);
  }

  async getNotificacionesByUserId(userId) {
    return this.getWithQuery('notificaciones', { userId });
  }

  async createNotificacion(notificacionData) {
    return this.create('notificaciones', notificacionData);
  }

  async updateNotificacion(id, notificacionData) {
    return this.update('notificaciones', id, notificacionData);
  }

  async deleteNotificacion(id) {
    return this.delete('notificaciones', id);
  }

  // ==================== PLANES DE AHORRO ====================

  async getPlanesAhorro() {
    return this.getAll('planesAhorro');
  }

  async getPlanAhorroById(id) {
    return this.getById('planesAhorro', id);
  }

  async getPlanesAhorroByUserId(userId) {
    return this.getWithQuery('planesAhorro', { userId });
  }

  async createPlanAhorro(planData) {
    return this.create('planesAhorro', planData);
  }

  async updatePlanAhorro(id, planData) {
    return this.update('planesAhorro', id, planData);
  }

  async deletePlanAhorro(id) {
    return this.delete('planesAhorro', id);
  }

  // ==================== PLANES DE DEUDA ====================

  async getPlanesDeuda() {
    return this.getAll('planesDeuda');
  }

  async getPlanDeudaById(id) {
    return this.getById('planesDeuda', id);
  }

  async getPlanesDeudaByUserId(userId) {
    return this.getWithQuery('planesDeuda', { userId });
  }

  async createPlanDeuda(planData) {
    return this.create('planesDeuda', planData);
  }

  async updatePlanDeuda(id, planData) {
    return this.update('planesDeuda', id, planData);
  }

  async deletePlanDeuda(id) {
    return this.delete('planesDeuda', id);
  }

  // ==================== SECURITY LOGS ====================

  async getSecurityLogs() {
    return this.getAll('securityLogs');
  }

  async getSecurityLogById(id) {
    return this.getById('securityLogs', id);
  }

  async createSecurityLog(logData) {
    return this.create('securityLogs', logData);
  }

  // ==================== CONFIG ====================

  async getConfig() {
    return this.getById('config', 1);
  }

  async updateConfig(configData) {
    return this.update('config', 1, configData);
  }
}

// Exportar instancia única (Singleton)
const apiService = new ApiService();
export default apiService;
