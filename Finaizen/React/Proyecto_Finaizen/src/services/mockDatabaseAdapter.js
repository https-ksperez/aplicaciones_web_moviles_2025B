/**
 * MockDatabase Adapter - Adaptador para migrar de localStorage a API
 * Mantiene la misma interfaz que mockDatabase.js pero usa el backend
 */

import apiService from './apiService';
import User from '../models/User';
import Perfil from '../models/Perfil';
import Ingreso from '../models/Ingreso';
import Egreso from '../models/Egreso';
import RegistroHistorial from '../models/RegistroHistorial';
import Presupuesto from '../models/Presupuesto';
import Logro from '../models/Logro';
import Notificacion from '../models/Notificacion';
import PlanAhorro from '../models/PlanAhorro';
import PlanDeuda from '../models/PlanDeuda';
import SecurityLog from '../models/SecurityLog';

class MockDatabaseAdapter {
  constructor() {
    this.currentUser = null;
    this.currentPerfil = null;
    this._cache = {
      users: [],
      perfiles: [],
      ingresos: [],
      egresos: [],
      historial: [],
      presupuestos: [],
      logros: [],
      notificaciones: [],
      planesAhorro: [],
      planesDeuda: [],
      securityLogs: [],
    };
    this._initialized = false;
  }

  /**
   * Inicializar - Cargar datos del backend
   */
  async initialize() {
    if (this._initialized) return;
    
    try {
      // Cargar todos los datos en paralelo
      const [
        users,
        perfiles,
        ingresos,
        egresos,
        historial,
        presupuestos,
        logros,
        notificaciones,
        planesAhorro,
        planesDeuda,
        securityLogs,
      ] = await Promise.all([
        apiService.getUsers(),
        apiService.getPerfiles(),
        apiService.getIngresos(),
        apiService.getEgresos(),
        apiService.getHistorial(),
        apiService.getPresupuestos(),
        apiService.getLogros(),
        apiService.getNotificaciones(),
        apiService.getPlanesAhorro(),
        apiService.getPlanesDeuda(),
        apiService.getSecurityLogs(),
      ]);

      this._cache = {
        users: users.map(u => new User(u)),
        perfiles: perfiles.map(p => new Perfil(p)),
        ingresos: ingresos.map(i => Ingreso.fromJSON ? Ingreso.fromJSON(i) : new Ingreso(i)),
        egresos: egresos.map(e => new Egreso(e)),
        historial: historial.map(h => new RegistroHistorial(h)),
        presupuestos: presupuestos.map(p => new Presupuesto(p)),
        logros: logros.map(l => new Logro(l)),
        notificaciones: notificaciones.map(n => new Notificacion(n)),
        planesAhorro: planesAhorro.map(p => PlanAhorro.fromJSON ? PlanAhorro.fromJSON(p) : new PlanAhorro(p)),
        planesDeuda: planesDeuda.map(p => PlanDeuda.fromJSON ? PlanDeuda.fromJSON(p) : new PlanDeuda(p)),
        securityLogs: securityLogs.map(s => new SecurityLog(s)),
      };

      this._initialized = true;
      console.log('✓ MockDatabaseAdapter inicializado desde API');
    } catch (error) {
      console.error('Error inicializando adapter:', error);
      // Fallback a arrays vacíos
      this._initialized = true;
    }
  }

  /**
   * Getters compatibles con mockDatabase original
   */
  get users() {
    return this._cache.users;
  }

  get perfiles() {
    return this._cache.perfiles;
  }

  get ingresos() {
    return this._cache.ingresos;
  }

  get egresos() {
    return this._cache.egresos;
  }

  get historial() {
    return this._cache.historial;
  }

  get presupuestos() {
    return this._cache.presupuestos;
  }

  get logros() {
    return this._cache.logros;
  }

  get notificaciones() {
    return this._cache.notificaciones;
  }

  get planesAhorro() {
    return this._cache.planesAhorro;
  }

  get planesDeuda() {
    return this._cache.planesDeuda;
  }

  get securityLogs() {
    return this._cache.securityLogs;
  }

  /**
   * Métodos de compatibilidad
   */
  async saveToLocalStorage() {
    // Ya no se usa localStorage, pero mantenemos para compatibilidad
    console.log('⚠️ saveToLocalStorage() está deprecado - Los datos se guardan automáticamente en el backend');
  }

  loadFromLocalStorage() {
    // Ya no se usa localStorage
    console.log('⚠️ loadFromLocalStorage() está deprecado - Usa initialize() en su lugar');
    return false;
  }

  /**
   * Login
   */
  async login(nombreUsuario, contraseña) {
    try {
      const user = await apiService.login(nombreUsuario, contraseña);
      
      if (user) {
        this.currentUser = new User(user);
        
        // Obtener perfil del usuario
        const perfil = await apiService.getPerfilByUserId(user.id);
        if (perfil) {
          this.currentPerfil = new Perfil(perfil);
        }
        
        return this.currentUser;
      }
      
      return null;
    } catch (error) {
      console.error('Error en login:', error);
      return null;
    }
  }

  /**
   * Logout
   */
  logout() {
    this.currentUser = null;
    this.currentPerfil = null;
  }

  /**
   * Métodos CRUD para Ingresos (compatibilidad)
   */
  async addIngreso(ingresoData) {
    const newIngreso = await apiService.createIngreso(ingresoData);
    const ingreso = Ingreso.fromJSON ? Ingreso.fromJSON(newIngreso) : new Ingreso(newIngreso);
    this._cache.ingresos.push(ingreso);
    return ingreso;
  }

  async updateIngreso(id, ingresoData) {
    const updated = await apiService.updateIngreso(id, ingresoData);
    const index = this._cache.ingresos.findIndex(i => i.id === id);
    if (index !== -1) {
      this._cache.ingresos[index] = Ingreso.fromJSON ? Ingreso.fromJSON(updated) : new Ingreso(updated);
    }
    return this._cache.ingresos[index];
  }

  async deleteIngreso(id) {
    await apiService.deleteIngreso(id);
    this._cache.ingresos = this._cache.ingresos.filter(i => i.id !== id);
  }

  /**
   * Métodos CRUD para Egresos (compatibilidad)
   */
  async addEgreso(egresoData) {
    const newEgreso = await apiService.createEgreso(egresoData);
    const egreso = new Egreso(newEgreso);
    this._cache.egresos.push(egreso);
    return egreso;
  }

  async updateEgreso(id, egresoData) {
    const updated = await apiService.updateEgreso(id, egresoData);
    const index = this._cache.egresos.findIndex(e => e.id === id);
    if (index !== -1) {
      this._cache.egresos[index] = new Egreso(updated);
    }
    return this._cache.egresos[index];
  }

  async deleteEgreso(id) {
    await apiService.deleteEgreso(id);
    this._cache.egresos = this._cache.egresos.filter(e => e.id !== id);
  }

  /**
   * Métodos CRUD para Historial (compatibilidad)
   */
  async addHistorial(historialData) {
    const newHistorial = await apiService.createHistorial(historialData);
    const historial = new RegistroHistorial(newHistorial);
    this._cache.historial.push(historial);
    return historial;
  }

  async updateHistorial(id, historialData) {
    const updated = await apiService.updateHistorial(id, historialData);
    const index = this._cache.historial.findIndex(h => h.id === id);
    if (index !== -1) {
      this._cache.historial[index] = new RegistroHistorial(updated);
    }
    return this._cache.historial[index];
  }

  async deleteHistorial(id) {
    await apiService.deleteHistorial(id);
    this._cache.historial = this._cache.historial.filter(h => h.id !== id);
  }

  /**
   * Métodos adicionales según sea necesario
   */
  async refreshCache() {
    this._initialized = false;
    await this.initialize();
  }
}

// Exportar instancia única
const mockDatabaseAdapter = new MockDatabaseAdapter();

// Inicializar automáticamente
mockDatabaseAdapter.initialize();

export default mockDatabaseAdapter;
