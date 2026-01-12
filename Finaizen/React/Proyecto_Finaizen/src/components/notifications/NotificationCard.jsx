import PropTypes from 'prop-types';
import { Card } from '../ui';
import styles from './NotificationCard.module.css';

/**
 * Componente NotificationCard
 * Tarjeta reutilizable para mostrar una notificación individual
 */
function NotificationCard({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}) {
  return (
    <Card 
      className={`${styles.notificationCard} ${!notification.leida ? styles.unread : ''}`}
    >
      <div className={styles.notifIcon}>
        {notification.icono}
      </div>
      
      <div className={styles.notifContent}>
        <div className={styles.notifHeader}>
          <h3 className={styles.notifTitle}>{notification.titulo}</h3>
          <span className={styles.notifType}>
            {getTypeBadge(notification.tipo)}
          </span>
          <span className={styles.notifTime}>
            {getTimeAgo(notification.createdAt)}
          </span>
        </div>
        
        <p className={styles.notifMessage}>{notification.mensaje}</p>
        
        {notification.accionUrl && (
          <a href={notification.accionUrl} className={styles.notifAction}>
            Ver detalles →
          </a>
        )}
      </div>

      <div className={styles.notifActions}>
        {!notification.leida && onMarkAsRead && (
          <button
            className={styles.actionBtn}
            onClick={() => onMarkAsRead(notification.id)}
            title="Marcar como leída"
          >
            ✓
          </button>
        )}
        {onDelete && (
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={() => onDelete(notification.id)}
            title="Eliminar"
          >
            🗑️
          </button>
        )}
      </div>
    </Card>
  );
}

// Funciones auxiliares
function getTimeAgo(date) {
  const now = new Date();
  const notifDate = new Date(date);
  const diffMs = now - notifDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  
  return notifDate.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short',
    year: 'numeric'
  });
}

function getTypeBadge(tipo) {
  const badges = {
    warning: '⚠️ Alerta',
    info: 'ℹ️ Info',
    success: '✅ Éxito',
    error: '❌ Error',
    logro: '🏆 Logro',
    presupuesto: '💰 Presupuesto',
    transaccion: '💳 Transacción'
  };
  return badges[tipo] || 'ℹ️ Info';
}

NotificationCard.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    titulo: PropTypes.string.isRequired,
    mensaje: PropTypes.string.isRequired,
    tipo: PropTypes.string.isRequired,
    icono: PropTypes.string,
    leida: PropTypes.bool,
    createdAt: PropTypes.string.isRequired,
    accionUrl: PropTypes.string
  }).isRequired,
  onMarkAsRead: PropTypes.func,
  onDelete: PropTypes.func
};

export default NotificationCard;
