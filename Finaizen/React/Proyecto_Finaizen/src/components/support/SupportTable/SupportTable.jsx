import styles from './SupportTable.module.css';

const SupportTable = ({ tickets, onViewClick, onAssignClick }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.supportTable}>
        <thead>
          <tr>
            <th>ID Reporte</th>
            <th>Usuario</th>
            <th>Asunto</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan="6" className={styles.noData}>No se encontraron reportes</td>
            </tr>
          ) : (
            tickets.map(ticket => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.user}</td>
                <td>{ticket.subject}</td>
                <td>{ticket.date}</td>
                <td>
                  <span className={`${styles.status} ${styles[ticket.status]}`}>
                    {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                </td>
                <td>
                  <a 
                    className={styles.actionLink}
                    onClick={() => onViewClick(ticket)}
                  >
                    Ver
                  </a>
                  {ticket.status !== 'resuelto' && (
                    <a 
                      className={styles.actionLink}
                      onClick={() => onAssignClick(ticket)}
                    >
                      Asignar
                    </a>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SupportTable;
