import styles from './SecurityTable.module.css';

const SecurityTable = ({ logs, onActionClick }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.securityLogTable}>
        <thead>
          <tr>
            <th>Fecha y Hora</th>
            <th>Evento</th>
            <th>Dirección IP</th>
            <th>Usuario Afectado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="5" className={styles.noData}>No se encontraron registros</td>
            </tr>
          ) : (
            logs.map(log => {
              const actionText = log.blocked ? 'Desbloquear' : 'Bloquear';
              const actionClass = log.blocked ? styles.unblock : styles.block;
              
              return (
                <tr key={log.id}>
                  <td>{log.datetime}</td>
                  <td>
                    <span className={`${styles.eventType} ${styles[log.type]}`}>
                      {log.event}
                    </span>
                  </td>
                  <td>{log.ip}</td>
                  <td>{log.user}</td>
                  <td>
                    <a 
                      className={`${styles.actionLink} ${actionClass}`}
                      onClick={() => onActionClick(log.id, log.user, actionText.toLowerCase())}
                    >
                      {actionText}
                    </a>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SecurityTable;
