import PropTypes from 'prop-types';
import styles from './HistorialTable.module.css';

/**
 * Componente HistorialTable
 * Tabla reutilizable para mostrar transacciones del historial
 */
function HistorialTable({ 
  registros, 
  simboloMoneda,
  onEdit,
  onDelete,
  emptyMessage = "No se encontraron transacciones"
}) {
  if (!registros || registros.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>📭 {emptyMessage}</p>
      </div>
    );
  }

  return (
    <table className={styles.historialTable}>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Tipo</th>
          <th>Descripción</th>
          <th>Categoría</th>
          <th>Monto</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {registros.map(registro => (
          <tr key={registro.id}>
            <td className={styles.dateColumn} data-label="Fecha">
              {new Date(registro.fechaEjecucion).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </td>
            <td data-label="Tipo">
              <span className={`${styles.badge} ${styles[registro.tipo]}`}>
                {registro.tipo === 'ingreso' ? '💰 Ingreso' : '💸 Egreso'}
              </span>
            </td>
            <td className={styles.descriptionColumn} data-label="Descripción">
              {registro.descripcion}
            </td>
            <td className={styles.categoryColumn} data-label="Categoría">
              {registro.categoria}
            </td>
            <td className={`${styles.montoColumn} ${styles[registro.tipo]}`} data-label="Monto">
              {registro.tipo === 'ingreso' ? '+' : '-'}
              {simboloMoneda}{registro.monto.toLocaleString()}
            </td>
            <td className={styles.actionsColumn}>
              {onEdit && (
                <button
                  className={styles.editButton}
                  onClick={() => onEdit(registro)}
                  title="Editar"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  className={styles.deleteButton}
                  onClick={() => onDelete(registro)}
                  title="Eliminar"
                >
                  🗑️
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

HistorialTable.propTypes = {
  registros: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      fechaEjecucion: PropTypes.string.isRequired,
      tipo: PropTypes.oneOf(['ingreso', 'egreso']).isRequired,
      descripcion: PropTypes.string.isRequired,
      categoria: PropTypes.string.isRequired,
      monto: PropTypes.number.isRequired
    })
  ).isRequired,
  simboloMoneda: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  emptyMessage: PropTypes.string
};

export default HistorialTable;
