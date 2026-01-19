import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../ui';
import styles from './AchievementCard.module.css';

/**
 * Componente AchievementCard
 * Tarjeta individual para mostrar cada logro con su progreso
 */
function AchievementCard({ logro, onAction }) {
  const isCompleted = logro.desbloqueado;
  const progress = logro.porcentajeProgreso || 0;
  const [imageError, setImageError] = useState(false);

  // Función para obtener un emoji representativo de la empresa
  const getEmpresaEmoji = (empresa) => {
    const emojis = {
      'Starbucks': '☕',
      'McDonald\'s': '🍔',
      'Cinemark': '🎬',
      'Amazon': '📦',
      'Liverpool': '🛍️',
      'Spotify': '🎵',
      'Netflix': '🎬',
      'Uber': '🚗',
    };
    return emojis[empresa] || logro.icono || '🏆';
  };

  return (
    <article 
      className={`${styles.achievementCard} ${isCompleted ? styles.isCompleted : ''}`}
      data-progress={progress}
    >
      {isCompleted && <div className={styles.badge}>Completado</div>}
      
      <div className={styles.achievementCardHeader}>
        {/* Mostrar logo de empresa si existe y no hay error, sino mostrar emoji */}
        {logro.logoEmpresa && !imageError ? (
          <img 
            src={logro.logoEmpresa} 
            alt={logro.empresa || 'Logo'} 
            className={styles.companyLogo}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.achievementIcon}>
            {logro.empresa ? getEmpresaEmoji(logro.empresa) : logro.icono}
          </div>
        )}
        {logro.empresa && (
          <span className={styles.empresaName}>{logro.empresa}</span>
        )}
        <h3>{logro.nombre}</h3>
      </div>

      <div className={styles.achievementCardBody}>
        <p className={styles.description}>{logro.descripcion}</p>
        
        <div className={styles.progressBar}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className={styles.progressText}>
          {logro.progreso} / {logro.meta} {getProgressLabel(logro.tipo)}
        </p>
        
        {logro.recompensa && (
          <div className={styles.reward}>
            <strong>🎁 Recompensa:</strong> {logro.recompensa}
            {logro.valorRecompensa > 0 && (
              <span className={styles.valorRecompensa}>
                ${logro.valorRecompensa} USD
              </span>
            )}
          </div>
        )}

        {/* Mostrar comprobantes subidos */}
        {logro.comprobantes && logro.comprobantes.length > 0 && (
          <div className={styles.comprobantesInfo}>
            <span className={styles.comprobanteIcon}>✓</span>
            {logro.comprobantes.length} comprobante(s) subido(s)
          </div>
        )}
      </div>

      <div className={styles.achievementCardFooter}>
        {isCompleted ? (
          <Button 
            variant="primary" 
            onClick={() => onAction(logro, 'ver')}
          >
            Ver Recompensa
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={() => onAction(logro, 'subir-comprobante')}
          >
            Subir Comprobante
          </Button>
        )}
      </div>
    </article>
  );
}

/**
 * Función auxiliar para obtener la etiqueta del progreso según el tipo
 */
function getProgressLabel(tipo) {
  const labels = {
    ahorro_meta: 'ahorrado',
    transacciones: 'transacciones',
    dias_uso: 'días',
    ingresos: 'ingresos registrados',
    egresos: 'egresos registrados',
    presupuestos: 'presupuestos creados',
    compra: 'compras'
  };
  return labels[tipo] || 'completado';
}

AchievementCard.propTypes = {
  logro: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    icono: PropTypes.string,
    logoEmpresa: PropTypes.string,
    empresa: PropTypes.string,
    tipo: PropTypes.string.isRequired,
    meta: PropTypes.number.isRequired,
    progreso: PropTypes.number.isRequired,
    porcentajeProgreso: PropTypes.number,
    desbloqueado: PropTypes.bool,
    recompensa: PropTypes.string,
    valorRecompensa: PropTypes.number,
    comprobantes: PropTypes.array
  }).isRequired,
  onAction: PropTypes.func.isRequired
};

export default AchievementCard;
