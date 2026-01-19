import PropTypes from 'prop-types';
import styles from './ProfileCard.module.css';

/**
 * ProfileCard - Componente reutilizable para mostrar tarjetas de perfil
 * @param {Object} perfil - Datos del perfil
 * @param {boolean} isActive - Si el perfil está activo
 * @param {function} onSwitch - Callback para activar el perfil
 * @param {function} onEdit - Callback para editar el perfil
 * @param {function} onDelete - Callback para eliminar el perfil
 */
const ProfileCard = ({ perfil, isActive, onSwitch, onEdit, onDelete }) => {
  return (
    <article className={`${styles.profileCard} ${isActive ? styles.active : ''}`}>
      <div className={styles.profileCardHeader}>
        <div className={styles.profileIcon}>
          👤
        </div>
        {isActive && (
          <span className={styles.activeBadge}>✓ Activo</span>
        )}
      </div>
      <div className={styles.profileCardBody}>
        <div className={styles.profileInfo}>
          <div className={styles.profileName}>
            <span>Nombre del perfil</span>
            <strong>{perfil.nombre}</strong>
          </div>
          <div className={styles.profileCurrency}>
            <span>Moneda</span>
            <strong>{typeof perfil.moneda === 'object' ? perfil.moneda.codigo : perfil.moneda}</strong>
          </div>
        </div>
        <div className={styles.profileCardActions}>
          {!isActive && (
            <button 
              className={styles.actionLink}
              onClick={() => onSwitch(perfil)}
            >
              Activar
            </button>
          )}
          <button 
            className={styles.actionLink}
            onClick={() => onEdit(perfil)}
          >
            Editar
          </button>
          <button 
            className={`${styles.actionLink} ${styles.deleteLink}`}
            onClick={() => onDelete(perfil)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
};

ProfileCard.propTypes = {
  perfil: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    moneda: PropTypes.string.isRequired
  }).isRequired,
  isActive: PropTypes.bool,
  onSwitch: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

ProfileCard.defaultProps = {
  isActive: false,
  onSwitch: () => {},
  onEdit: () => {},
  onDelete: () => {}
};

export default ProfileCard;
