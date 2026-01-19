import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import apiService from '../../../../services/apiService';
import { Toast, Toggle } from '../../../../components/ui';
import styles from './ConfigNotificaciones.module.css';

/**
 * ConfigNotificaciones - Administrador de notificaciones de ingresos y egresos
 * Permite activar/desactivar notificaciones para cada transacción
 */
const ConfigNotificaciones = () => {
  const { currentPerfil } = useAuth();
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [ingresos, setIngresos] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos'); // 'todos', 'activas', 'inactivas'
  const [mobileView, setMobileView] = useState('ingresos'); // 'ingresos' o 'egresos'

  // Cargar datos
  useEffect(() => {
    const cargarDatos = async () => {
      if (currentPerfil) {
        try {
          const [ingresosData, egresosData] = await Promise.all([
            apiService.ingresos.getAll(currentPerfil.id),
            apiService.egresos.getAll(currentPerfil.id)
          ]);
          // Filtrar solo registros NO ocasionales (frecuentes)
          setIngresos(ingresosData.filter(i => i.frecuencia !== 'ocasional'));
          setEgresos(egresosData.filter(e => e.frecuencia !== 'ocasional'));
        } catch (error) {
          console.error('Error al cargar datos:', error);
        }
      }
    };
    cargarDatos();
  }, [currentPerfil]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Filtrar por estado de notificación
  const filtrarPorEstado = (items) => {
    if (filtroEstado === 'activas') {
      return items.filter(item => item.notificacionActiva);
    } else if (filtroEstado === 'inactivas') {
      return items.filter(item => !item.notificacionActiva);
    }
    return items;
  };

  const ingresosFiltrados = filtrarPorEstado(ingresos);
  const egresosFiltrados = filtrarPorEstado(egresos);

  // Toggle notificación
  const handleToggleNotificacion = async (tipo, id) => {
    try {
      if (tipo === 'ingreso') {
        const ingreso = ingresos.find(i => i.id === id);
        if (ingreso) {
          const nuevoEstado = !ingreso.notificacionActiva;
          await apiService.ingresos.update(id, { notificacionActiva: nuevoEstado });
          
          ingreso.notificacionActiva = nuevoEstado;
          setIngresos([...ingresos]);
          
          showToast(
            nuevoEstado 
              ? '✅ Notificación activada' 
              : '🔕 Notificación desactivada',
            'success'
          );
        }
      } else {
        const egreso = egresos.find(e => e.id === id);
        if (egreso) {
          const nuevoEstado = !egreso.notificacionActiva;
          await apiService.egresos.update(id, { notificacionActiva: nuevoEstado });
          
          egreso.notificacionActiva = nuevoEstado;
          setEgresos([...egresos]);
          
          showToast(
            nuevoEstado 
              ? '✅ Notificación activada' 
              : '🔕 Notificación desactivada',
            'success'
          );
        }
      }
    } catch (error) {
      console.error('Error al cambiar notificación:', error);
      showToast('Error al cambiar notificación', 'error');
    }
  };

  // Renderizar tarjeta de transacción
  const renderTransaccionCard = (item, tipo) => {
    const icono = tipo === 'ingreso' ? '💰' : '💸';
    const colorClase = tipo === 'ingreso' ? styles.positive : styles.negative;

    return (
      <div key={item.id} className={styles.notificationCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardInfo}>
            <span className={styles.cardIcon}>{icono}</span>
            <div className={styles.cardTextInfo}>
              <h3 className={styles.cardTitle}>{item.descripcion}</h3>
              <p className={styles.cardCategory}>{item.categoria}</p>
            </div>
          </div>
          <div className={styles.cardRight}>
            <span className={`${styles.amount} ${colorClase}`}>
              ${parseFloat(item.monto || 0).toFixed(2)}
            </span>
            <div className={styles.toggleWrapper}>
              <Toggle
                label=""
                checked={item.notificacionActiva || false}
                onChange={() => handleToggleNotificacion(tipo, item.id)}
              />
            </div>
          </div>
        </div>
        
        <div className={styles.cardDetails}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Frecuencia:</span>
            <span className={styles.detailValue}>{item.frecuencia}</span>
          </div>
          {item.horaNotificacion && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Hora:</span>
              <span className={styles.detailValue}>{item.horaNotificacion}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.configNotificacionesPage}>
      <div className={styles.notificationsManager}>
        <h1 className={styles.title}>🔔 Gestión de Notificaciones</h1>
        <p className={styles.subtitle}>
          Activa o desactiva las notificaciones para tus ingresos y egresos programados
        </p>

        {/* Filtros */}
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label>Estado:</label>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="todos">Todas</option>
              <option value="activas">Activas</option>
              <option value="inactivas">Inactivas</option>
            </select>
          </div>

          <div className={styles.statsInfo}>
            <span>
              ✅ Activas: {ingresos.filter(i => i.notificacionActiva).length + egresos.filter(e => e.notificacionActiva).length}
            </span>
            <span>
              🔕 Inactivas: {ingresos.filter(i => !i.notificacionActiva).length + egresos.filter(e => !e.notificacionActiva).length}
            </span>
          </div>
        </div>

        {/* Switch móvil */}
        <div className={styles.mobileSwitch}>
          <button
            className={`${styles.switchButton} ${mobileView === 'ingresos' ? styles.active : ''}`}
            onClick={() => setMobileView('ingresos')}
          >
            💰 Ingresos ({ingresosFiltrados.length})
          </button>
          <button
            className={`${styles.switchButton} ${mobileView === 'egresos' ? styles.active : ''}`}
            onClick={() => setMobileView('egresos')}
          >
            💸 Egresos ({egresosFiltrados.length})
          </button>
        </div>

        {/* Columnas */}
        <div className={styles.notificationsColumns}>
          {/* Columna Ingresos */}
          <div className={`${styles.column} ${mobileView === 'ingresos' ? styles.mobileActive : ''}`}>
            <h2 className={styles.columnTitle}>💰 Ingresos</h2>
            <div className={styles.notificationsList}>
              {ingresosFiltrados.length > 0 ? (
                ingresosFiltrados.map(ingreso => renderTransaccionCard(ingreso, 'ingreso'))
              ) : (
                <div className={styles.emptyMessage}>
                  {filtroEstado === 'todos' 
                    ? 'No hay ingresos programados' 
                    : `No hay ingresos con notificaciones ${filtroEstado}`}
                </div>
              )}
            </div>
          </div>

          {/* Columna Egresos */}
          <div className={`${styles.column} ${mobileView === 'egresos' ? styles.mobileActive : ''}`}>
            <h2 className={styles.columnTitle}>💸 Egresos</h2>
            <div className={styles.notificationsList}>
              {egresosFiltrados.length > 0 ? (
                egresosFiltrados.map(egreso => renderTransaccionCard(egreso, 'egreso'))
              ) : (
                <div className={styles.emptyMessage}>
                  {filtroEstado === 'todos' 
                    ? 'No hay egresos programados' 
                    : `No hay egresos con notificaciones ${filtroEstado}`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default ConfigNotificaciones;
