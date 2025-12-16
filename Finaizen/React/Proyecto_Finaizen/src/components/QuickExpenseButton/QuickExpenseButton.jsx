import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './QuickExpenseButton.module.css';
import QuickExpenseModal from '../QuickExpenseModal';

/**
 * Botón flotante para agregar gastos rápidamente y acciones rápidas
 * Aparece en la esquina inferior derecha
 * @param {Array} additionalItems - Items adicionales para el menú FAB
 */
function QuickExpenseButton({ additionalItems = [] }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpenModal = (mode) => {
    setIsExpanded(false);
    setIsModalOpen(true);
  };

  const handleItemClick = (item) => {
    setIsExpanded(false);
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      {/* Botón flotante principal */}
      <div className={styles.fabContainer}>
        {isExpanded && (
          <div className={styles.fabMenu}>
            {/* Opciones adicionales (ChatBot, Historial, etc.) */}
            {additionalItems.map((item, index) => (
              <button
                key={index}
                className={`${styles.fabOption} ${item.isPremium ? styles.premium : ''}`}
                onClick={() => handleItemClick(item)}
                title={item.label}
              >
                {item.icon}
                <span className={styles.fabLabel}>{item.label}</span>
              </button>
            ))}

            {/* Divisor si hay items adicionales */}
            {additionalItems.length > 0 && <div className={styles.fabDivider}></div>}

            {/* Opciones de gasto rápido */}
            <button
              className={`${styles.fabOption} ${styles.camera}`}
              onClick={() => handleOpenModal('camera')}
              title="Escanear recibo"
            >
              📷
              <span className={styles.fabLabel}>Foto de recibo</span>
            </button>
            <button
              className={`${styles.fabOption} ${styles.voice}`}
              onClick={() => handleOpenModal('voice')}
              title="Nota de voz"
            >
              🎤
              <span className={styles.fabLabel}>Nota de voz</span>
            </button>
            <button
              className={`${styles.fabOption} ${styles.manual}`}
              onClick={() => handleOpenModal('manual')}
              title="Entrada manual"
            >
              ✏️
              <span className={styles.fabLabel}>Manual</span>
            </button>
          </div>
        )}

        <button
          className={`${styles.fabButton} ${isExpanded ? styles.expanded : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Agregar gasto rápido"
        >
          {isExpanded ? '✕' : '+'}
        </button>
      </div>

      {/* Modal para registrar gasto */}
      <QuickExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default QuickExpenseButton;
