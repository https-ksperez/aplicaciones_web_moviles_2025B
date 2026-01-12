import PropTypes from 'prop-types';
import { Card } from '../ui';
import styles from './NotificationStats.module.css';

/**
 * Componente NotificationStats
 * Muestra estadísticas de notificaciones en tarjetas
 */
function NotificationStats({ stats }) {
  return (
    <div className={styles.statsGrid}>
      <Card className={styles.statCard}>
        <div className={styles.statIcon}>📊</div>
        <div className={styles.statContent}>
          <span className={styles.statLabel}>Total</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
      </Card>

      <Card className={styles.statCard}>
        <div className={styles.statIcon}>🔴</div>
        <div className={styles.statContent}>
          <span className={styles.statLabel}>Sin leer</span>
          <span className={styles.statValue}>{stats.unread}</span>
        </div>
      </Card>

      <Card className={styles.statCard}>
        <div className={styles.statIcon}>✅</div>
        <div className={styles.statContent}>
          <span className={styles.statLabel}>Leídas</span>
          <span className={styles.statValue}>{stats.read}</span>
        </div>
      </Card>

      <Card className={styles.statCard}>
        <div className={styles.statIcon}>🏆</div>
        <div className={styles.statContent}>
          <span className={styles.statLabel}>Logros</span>
          <span className={styles.statValue}>{stats.byType?.logro || 0}</span>
        </div>
      </Card>
    </div>
  );
}

NotificationStats.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    unread: PropTypes.number.isRequired,
    read: PropTypes.number.isRequired,
    byType: PropTypes.shape({
      logro: PropTypes.number,
      warning: PropTypes.number,
      info: PropTypes.number,
      success: PropTypes.number,
      error: PropTypes.number
    })
  }).isRequired
};

export default NotificationStats;
