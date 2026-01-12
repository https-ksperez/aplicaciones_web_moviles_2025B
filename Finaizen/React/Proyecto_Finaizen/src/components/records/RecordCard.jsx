import PropTypes from 'prop-types';
import styles from './RecordCard.module.css';

/**
 * Componente RecordCard
 * Tarjeta reutilizable para mostrar un registro (ingreso o egreso)
 */
function RecordCard({ 
  record, 
  tipo,
  simboloMoneda, 
  onEdit, 
  onDelete 
}) {
  const getFrequencyText = () => {
    const frecuencias = {
      diario: 'Diario',
      semanal: 'Semanal',
      mensual: 'Mensual',
      anual: 'Anual',
      ocasional: 'Ocasional'
    };
    return frecuencias[record.frecuencia] || record.frecuencia;
  };

  const getFrequencyDetails = () => {
    switch (record.frecuencia) {
      case 'semanal':
        return ` • ${getDiaSemana(record.diaSemana)}`;
      case 'mensual':
        return ` • Día ${record.diaMes}`;
      case 'anual':
        return ` • ${record.mes}/${record.diaMes}`;
      default:
        return '';
    }
  };

  return (
    <div className={`${styles.recordCard} ${styles[tipo]}`}>
      <div className={styles.recordInfo}>
        <h3>{record.descripcion}</h3>
        <p className={styles.frequency}>
          {getFrequencyText()}
          {getFrequencyDetails()}
        </p>
        {record.categoria && (
          <p className={styles.category}>
            <span className={styles.categoryIcon}>🏷️</span>
            {record.categoria}
          </p>
        )}
      </div>
      
      <div className={styles.recordDetails}>
        <span className={`${styles.amount} ${tipo === 'ingreso' ? styles.positive : styles.negative}`}>
          {tipo === 'ingreso' ? '+' : '-'} {simboloMoneda}{record.monto.toFixed(2)}
        </span>
        
        <div className={styles.actions}>
          {onEdit && (
            <button
              className={styles.editButton}
              onClick={() => onEdit(record, tipo)}
              title="Editar"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              className={styles.deleteButton}
              onClick={() => onDelete(record, tipo)}
              title="Eliminar"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Función auxiliar para obtener el nombre del día de la semana
function getDiaSemana(dia) {
  const dias = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
    0: 'Domingo'
  };
  return dias[dia] || dia;
}

RecordCard.propTypes = {
  record: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    descripcion: PropTypes.string.isRequired,
    monto: PropTypes.number.isRequired,
    frecuencia: PropTypes.string.isRequired,
    categoria: PropTypes.string,
    diaSemana: PropTypes.number,
    diaMes: PropTypes.number,
    mes: PropTypes.number
  }).isRequired,
  tipo: PropTypes.oneOf(['ingreso', 'egreso']).isRequired,
  simboloMoneda: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default RecordCard;
