import { useState, useEffect, useRef } from 'react';
import { SmartMessageGenerator } from '../../utils/smartMessages';
import apiService from '../../services/apiService';
import styles from './NotificationBell.module.css';

/**
 * Componente de Campanita de Notificaciones
 * Muestra notificaciones inteligentes en un dropdown desplegable
 */
export default function NotificationBell({ userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (userId) {
      loadNotifications();
    }
  }, [userId]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      const notifs = await apiService.notificaciones.getAll();
      setNotifications(notifs);
      
      const unread = notifs.filter(n => !n.leida).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  const mapTipoToNotificationType = (tipo) => {
    // Tipos válidos del enum que no necesitan mapeo
    const validTypes = ['info', 'warning', 'success', 'error', 'logro', 'presupuesto', 'transaccion'];
    if (validTypes.includes(tipo)) {
      return tipo;
    }
    // Mapeo de tipos legacy para retrocompatibilidad
    const map = {
      'alerta_gasto': 'warning',
      'sugerencia': 'info',
      'logro_proximo': 'logro',
      'motivacion': 'success',
      'educacion': 'info',
      'recordatorio': 'presupuesto',
      'contextual_tiempo': 'info',
      'inteligente': 'warning'
    };
    return map[tipo] || 'info';
  };

  const getTituloByTipo = (tipo) => {
    const map = {
      // Tipos nuevos del enum
      'info': 'Información',
      'warning': 'Alerta',
      'success': '¡Bien Hecho!',
      'error': 'Error',
      'logro': 'Logro',
      'presupuesto': 'Presupuesto',
      'transaccion': 'Transacción',
      // Tipos legacy para retrocompatibilidad
      'alerta_gasto': 'Alerta de Gastos',
      'sugerencia': 'Sugerencia de Ahorro',
      'logro_proximo': 'Logro Cercano',
      'motivacion': '¡Bien Hecho!',
      'educacion': 'Tip Financiero',
      'recordatorio': 'Recordatorio',
      'contextual_tiempo': 'Mensaje del Día',
      'inteligente': 'Análisis Inteligente'
    };
    return map[tipo] || 'Notificación';
  };

  const getIconoByTipo = (tipo) => {
    const map = {
      // Tipos nuevos del enum
      'info': '💡',
      'warning': '⚠️',
      'success': '🎉',
      'error': '❌',
      'logro': '🏆',
      'presupuesto': '💰',
      'transaccion': '💳',
      // Tipos legacy para retrocompatibilidad
      'alerta_gasto': '⚠️',
      'sugerencia': '💡',
      'logro_proximo': '🏆',
      'motivacion': '🎉',
      'educacion': '📚',
      'recordatorio': '⏰',
      'contextual_tiempo': '🌅',
      'inteligente': '🤖'
    };
    return map[tipo] || '🔔';
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      loadNotifications(); // Recargar al abrir
    }
  };

  const handleMarkAsRead = async (notifId) => {
    try {
      await apiService.notificaciones.markAsRead(notifId);
      await loadNotifications();
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiService.notificaciones.markAllAsRead();
      await loadNotifications();
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  const handleDeleteNotification = async (notifId) => {
    try {
      await apiService.notificaciones.delete(notifId);
      await loadNotifications();
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };

  return (
    <div className={styles.bellContainer} ref={dropdownRef}>
      {/* Campanita */}
      <button 
        className={styles.bellButton}
        onClick={handleToggle}
        aria-label="Notificaciones"
      >
        <span className={styles.bellIcon}>🔔</span>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {/* Dropdown de Notificaciones */}
      {isOpen && (
        <div className={styles.dropdown}>
          {/* Header */}
          <div className={styles.dropdownHeader}>
            <h3>Notificaciones</h3>
            {unreadCount > 0 && (
              <button 
                className={styles.markAllBtn}
                onClick={handleMarkAllAsRead}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {/* Lista de Notificaciones */}
          <div className={styles.notificationList}>
            {notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>📭</span>
                <p>No hay notificaciones</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif.id}
                  className={`${styles.notificationItem} ${!notif.leida ? styles.unread : ''}`}
                >
                  <div className={styles.notifIcon}>
                    {notif.icono}
                  </div>
                  <div className={styles.notifContent}>
                    <div className={styles.notifHeader}>
                      <span className={styles.notifTitle}>{notif.titulo}</span>
                      <span className={styles.notifTime}>
                        {getTimeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className={styles.notifMessage}>{notif.mensaje}</p>
                  </div>
                  <div className={styles.notifActions}>
                    {!notif.leida && (
                      <button
                        className={styles.markReadBtn}
                        onClick={() => handleMarkAsRead(notif.id)}
                        title="Marcar como leída"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteNotification(notif.id)}
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className={styles.dropdownFooter}>
              <button 
                className={styles.viewAllBtn}
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = '/user/notificaciones';
                }}
              >
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Función auxiliar para mostrar tiempo relativo
function getTimeAgo(date) {
  try {
    if (!date) return 'Reciente';
    
    const now = new Date();
    const notifDate = new Date(date);
    
    // Validar que la fecha sea válida
    if (isNaN(notifDate.getTime())) {
      return 'Reciente';
    }
    
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return notifDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  } catch (error) {
    console.error('Error en getTimeAgo:', error);
    return 'Reciente';
  }
}
