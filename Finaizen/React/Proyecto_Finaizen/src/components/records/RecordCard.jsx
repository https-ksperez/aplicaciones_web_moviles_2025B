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
        // diasSemana es un array de números [0-6], 0=Domingo
        if (record.diasSemana && Array.isArray(record.diasSemana) && record.diasSemana.length > 0) {
          const diasLabels = record.diasSemana.map(dia => getDiaSemanaCorto(dia)).join(', ');
          return ` • ${diasLabels}`;
        }
        return '';
      case 'mensual':
        return record.diaMes ? ` • Día ${record.diaMes}` : '';
      case 'anual':
        if (record.fechaEspecifica) {
          const fecha = new Date(record.fechaEspecifica);
          return ` • ${fecha.getDate()}/${fecha.getMonth() + 1}`;
        }
        return '';
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
          {tipo === 'ingreso' ? '+' : '-'} {simboloMoneda}{parseFloat(record.monto || 0).toFixed(2)}
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

// Función auxiliar para obtener el nombre corto del día de la semana
function getDiaSemanaCorto(dia) {
  const dias = {
    0: 'Dom',
    1: 'Lun',
    2: 'Mar',
    3: 'Mié',
    4: 'Jue',
    5: 'Vie',
    6: 'Sáb'
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
