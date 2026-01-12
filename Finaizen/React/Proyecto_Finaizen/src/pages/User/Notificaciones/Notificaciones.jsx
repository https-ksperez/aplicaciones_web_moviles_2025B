import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import mockDB from '../../../utils/mockDatabase';
import { Card } from '../../../components/ui';
import { NotificationCard, NotificationStats } from '../../../components/notifications';
import styles from './Notificaciones.module.css';

/**
 * Página de Notificaciones
 * Muestra todas las notificaciones del usuario con filtros y acciones
 */
export default function Notificaciones() {
  const { currentUser, currentPerfil } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all'); // all, warning, info, success, logro

  useEffect(() => {
    if (currentUser) {
      loadNotifications();
    }
  }, [currentUser]);

  const loadNotifications = () => {
    if (!currentUser) return;
    
    const notifs = mockDB.getNotificacionesDeUsuario(currentUser.id);
    setNotifications(notifs);
  };

  const handleMarkAsRead = (notifId) => {
    const notif = mockDB.notificaciones.find(n => n.id === notifId);
    if (notif) {
      notif.marcarComoLeida();
      mockDB.saveToLocalStorage();
      loadNotifications();
    }
  };

  const handleMarkAllAsRead = () => {
    mockDB.notificaciones.forEach(n => {
      if (n.userId === currentUser.id && !n.leida) {
        n.marcarComoLeida();
      }
    });
    mockDB.saveToLocalStorage();
    loadNotifications();
  };

  const handleDeleteNotification = (notifId) => {
    mockDB.notificaciones = mockDB.notificaciones.filter(n => n.id !== notifId);
    mockDB.saveToLocalStorage();
    loadNotifications();
  };

  const handleDeleteAll = () => {
    if (confirm('¿Estás seguro de eliminar TODAS las notificaciones?')) {
      mockDB.notificaciones = mockDB.notificaciones.filter(n => n.userId !== currentUser.id);
      mockDB.saveToLocalStorage();
      loadNotifications();
    }
  };

  // Filtrar notificaciones
  const filteredNotifications = notifications.filter(notif => {
    // Filtro por estado (leída/no leída)
    if (filter === 'unread' && notif.leida) return false;
    if (filter === 'read' && !notif.leida) return false;
    
    // Filtro por tipo
    if (typeFilter !== 'all' && notif.tipo !== typeFilter) return false;
    
    return true;
  });

  // Estadísticas
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.leida).length,
    read: notifications.filter(n => n.leida).length,
    byType: {
      warning: notifications.filter(n => n.tipo === 'warning').length,
      info: notifications.filter(n => n.tipo === 'info').length,
      success: notifications.filter(n => n.tipo === 'success').length,
      logro: notifications.filter(n => n.tipo === 'logro').length,
      error: notifications.filter(n => n.tipo === 'error').length,
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>📬 Notificaciones</h1>
          <p className={styles.subtitle}>
            Gestiona todas tus notificaciones y alertas financieras
          </p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.btnSecondary}
            onClick={handleMarkAllAsRead}
            disabled={stats.unread === 0}
          >
            Marcar todas como leídas
          </button>
          <button 
            className={styles.btnDanger}
            onClick={handleDeleteAll}
            disabled={stats.total === 0}
          >
            Eliminar todas
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <NotificationStats stats={stats} />

      {/* Filtros */}
      <Card className={styles.filtersCard}>
        <div className={styles.filtersSection}>
          <div className={styles.filterGroup}>
            <label>Estado:</label>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                onClick={() => setFilter('all')}
              >
                Todas ({stats.total})
              </button>
              <button
                className={`${styles.filterBtn} ${filter === 'unread' ? styles.active : ''}`}
                onClick={() => setFilter('unread')}
              >
                Sin leer ({stats.unread})
              </button>
              <button
                className={`${styles.filterBtn} ${filter === 'read' ? styles.active : ''}`}
                onClick={() => setFilter('read')}
              >
                Leídas ({stats.read})
              </button>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Tipo:</label>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterBtn} ${typeFilter === 'all' ? styles.active : ''}`}
                onClick={() => setTypeFilter('all')}
              >
                Todas
              </button>
              <button
                className={`${styles.filterBtn} ${typeFilter === 'warning' ? styles.active : ''}`}
                onClick={() => setTypeFilter('warning')}
              >
                ⚠️ Alertas ({stats.byType.warning})
              </button>
              <button
                className={`${styles.filterBtn} ${typeFilter === 'info' ? styles.active : ''}`}
                onClick={() => setTypeFilter('info')}
              >
                💡 Info ({stats.byType.info})
              </button>
              <button
                className={`${styles.filterBtn} ${typeFilter === 'success' ? styles.active : ''}`}
                onClick={() => setTypeFilter('success')}
              >
                🎉 Éxito ({stats.byType.success})
              </button>
              <button
                className={`${styles.filterBtn} ${typeFilter === 'logro' ? styles.active : ''}`}
                onClick={() => setTypeFilter('logro')}
              >
                🏆 Logros ({stats.byType.logro})
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de Notificaciones */}
      <div className={styles.notificationsList}>
        {filteredNotifications.length === 0 ? (
          <Card className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h3>No hay notificaciones</h3>
            <p>
              {filter === 'unread' && 'No tienes notificaciones sin leer'}
              {filter === 'read' && 'No tienes notificaciones leídas'}
              {filter === 'all' && typeFilter !== 'all' && 'No hay notificaciones de este tipo'}
              {filter === 'all' && typeFilter === 'all' && 'Aún no tienes notificaciones'}
            </p>
          </Card>
        ) : (
          filteredNotifications.map(notif => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteNotification}
            />
          ))
        )}
      </div>
    </div>
  );
}
