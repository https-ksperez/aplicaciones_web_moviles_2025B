import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../../context/AuthContext';
import styles from './FloatingActionButton.module.css';

/**
 * FloatingActionButton (FAB)
 * Botón flotante circular con menú desplegable de acciones rápidas
 * 
 * @param {Array} menuItems - Array de objetos con { icon, label, path }
 * @param {string} position - Posición del FAB: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
 * @param {string} color - Color del botón: 'primary' | 'success' | 'danger' | 'warning'
 */
function FloatingActionButton({ 
  menuItems = [], 
  position = 'bottom-right',
  color = 'primary'
}) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (item) => {
    setIsOpen(false);
    if (item.action) {
      // Ejecutar acción personalizada (como abrir ChatBot)
      item.action();
    } else if (item.path) {
      // Navegar a ruta
      navigate(item.path);
    }
  };

  // Clases CSS dinámicas basadas en props
  const fabClasses = [
    styles.fab,
    styles[color],
    currentUser?.isPremium ? styles.premium : '',
    isOpen ? styles.open : ''
  ].filter(Boolean).join(' ');

  const containerClasses = [
    styles.fabContainer,
    styles[position.replace('-', '_')]
  ].join(' ');

  return (
    <div className={containerClasses}>
      {/* Overlay para cerrar el menú */}
      {isOpen && (
        <div 
          className={styles.fabOverlay} 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Menú de opciones */}
      {isOpen && menuItems.length > 0 && (
        <div className={styles.fabMenu}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`${styles.fabMenuItem} ${item.isPremium ? styles.premiumItem : ''}`}
              onClick={() => handleMenuItemClick(item)}
              disabled={item.disabled}
            >
              <span className={styles.fabMenuIcon}>{item.icon}</span>
              <span className={styles.fabMenuLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Botón principal FAB */}
      <button
        className={fabClasses}
        onClick={toggleMenu}
        aria-label="Acciones rápidas"
        aria-expanded={isOpen}
      >
        <span className={styles.fabIcon}>
          {isOpen ? '✕' : '+'}
        </span>
      </button>
    </div>
  );
}

FloatingActionButton.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
      disabled: PropTypes.bool
    })
  ),
  position: PropTypes.oneOf([
    'bottom-right',
    'bottom-left',
    'top-right',
    'top-left'
  ]),
  color: PropTypes.oneOf([
    'primary',
    'success',
    'danger',
    'warning'
  ])
};

export default FloatingActionButton;
