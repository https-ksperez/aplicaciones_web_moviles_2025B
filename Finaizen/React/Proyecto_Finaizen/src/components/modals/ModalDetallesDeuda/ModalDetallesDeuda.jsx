import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../../context/AuthContext';
import apiService from '../../../services/apiService';
import Button from '../../ui/Button';
import styles from './ModalDetallesDeuda.module.css';

/**
 * ModalDetallesDeuda - Modal para ver detalles completos y gestionar una deuda
 */
function ModalDetallesDeuda({ isOpen, plan, onClose, onPausar, onReactivar, onRefresh, simboloMoneda }) {
  const { currentPerfil } = useAuth();
  const [modoPago, setModoPago] = useState(false);
  const [montoPago, setMontoPago] = useState('');
  const [descripcionPago, setDescripcionPago] = useState('');

  if (!isOpen || !plan) return null;

  const handleAgregarPago = async () => {
    const monto = parseFloat(montoPago);
    if (monto <= 0) {
      alert('Ingresa un monto válido');
      return;
    }

    try {
      const nuevoMontoPagado = parseFloat(plan.montoPagado || 0) + monto;
      await apiService.planesDeuda.update(currentPerfil.id, plan.id, {
        montoPagado: nuevoMontoPagado,
        estado: nuevoMontoPagado >= parseFloat(plan.montoTotal) ? 'completado' : plan.estado
      });
      
      setMontoPago('');
      setDescripcionPago('');
      setModoPago(false);
      onRefresh();
    } catch (error) {
      console.error('Error al agregar pago:', error);
      alert('Error al agregar pago');
    }
  };

  const colorEstado = {
    activo: '#FF6B6B',
    pausado: '#FF9800',
    completado: '#4CAF50',
    cancelado: '#F44336'
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header} style={{ borderLeftColor: plan.color }}>
          <div className={styles.headerContent}>
            <div>
              <span className={styles.icono}>{plan.icono}</span>
              <h2 className={styles.titulo}>{plan.nombre}</h2>
              <p className={styles.acreedor}>{plan.acreedor}</p>
            </div>
            <button className={styles.btnCerrar} onClick={onClose}>✕</button>
          </div>
          <span className={styles.estado} style={{ backgroundColor: colorEstado[plan.estado] }}>
            {plan.estado.toUpperCase()}
          </span>
        </div>

        {/* Contenido */}
        <div className={styles.content}>
          {/* Progreso visual */}
          <div className={styles.seccion}>
            <div className={styles.progresoBarra}>
              <div className={styles.barraFondo}>
                <div
                  className={styles.barraProgreso}
                  style={{
                    width: `${Math.min(plan.progreso, 100)}%`,
                    backgroundColor: plan.color
                  }}
                />
              </div>
              <div className={styles.info}>
                <span className={styles.porcentaje}>{Math.round(plan.progreso)}% pagado</span>
                <span className={styles.fechas}>
                  {plan.diasRestantes > 0 
                    ? `Vencimiento en ${plan.diasRestantes} días`
                    : 'Vencimiento alcanzado'}
                </span>
              </div>
            </div>
          </div>

          {/* Datos principales */}
          <div className={styles.seccion}>
            <h3 className={styles.seccionTitulo}>Información Financiera</h3>
            <div className={styles.datos}>
              <div className={styles.dato}>
                <label>Deuda Total</label>
                <p className={styles.valor}>{simboloMoneda}{(plan.montoDeuda || 0).toLocaleString()}</p>
              </div>
              <div className={styles.dato}>
                <label>Pagado</label>
                <p className={styles.valor}>{simboloMoneda}{(plan.montoPagado || 0).toLocaleString()}</p>
              </div>
              <div className={styles.dato}>
                <label>Faltante</label>
                <p className={styles.valor}>{simboloMoneda}{(plan.montoFaltante || 0).toLocaleString()}</p>
              </div>
              <div className={styles.dato}>
                <label>Cuota Mensual</label>
                <p className={styles.valor}>{simboloMoneda}{(plan.cuotaMensual || 0).toFixed(2)}</p>
              </div>
              {(plan.tasaInteres || 0) > 0 && (
                <div className={styles.dato}>
                  <label>Tasa de Interés</label>
                  <p className={styles.valor}>{plan.tasaInteres}% anual</p>
                </div>
              )}
              {(plan.interesGenerado || 0) > 0 && (
                <div className={styles.dato}>
                  <label>Interés Generado</label>
                  <p className={styles.valor}>{simboloMoneda}{(plan.interesGenerado || 0).toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Configuración */}
          <div className={styles.seccion}>
            <h3 className={styles.seccionTitulo}>Configuración</h3>
            <div className={styles.configs}>
              <div className={styles.config}>
                <span className={styles.label}>Acreedor:</span>
                <span className={styles.value}>{plan.acreedor}</span>
              </div>
              <div className={styles.config}>
                <span className={styles.label}>Prioridad:</span>
                <span className={styles.value}>{plan.prioridad}</span>
              </div>
              <div className={styles.config}>
                <span className={styles.label}>Estrategia:</span>
                <span className={styles.value}>{plan.estrategia}</span>
              </div>
              {plan.numeroContrato && (
                <div className={styles.config}>
                  <span className={styles.label}>Contrato:</span>
                  <span className={styles.value}>{plan.numeroContrato}</span>
                </div>
              )}
              <div className={styles.config}>
                <span className={styles.label}>Notificaciones:</span>
                <span className={styles.value}>{plan.notificacionActiva ? '✅ Activas' : '❌ Desactivas'}</span>
              </div>
            </div>
          </div>

          {/* Historial de pagos */}
          {(plan.historialPagos || []).length > 0 && (
            <div className={styles.seccion}>
              <h3 className={styles.seccionTitulo}>Historial de Pagos</h3>
              <div className={styles.historial}>
                {(plan.historialPagos || []).slice(-5).reverse().map((pago, idx) => (
                  <div
                    key={idx}
                    className={`${styles.movimiento} ${pago.monto > 0 ? styles.pago : styles.retiro}`}
                  >
                    <div className={styles.movInfo}>
                      <p className={styles.movTipo}>
                        {pago.monto > 0 ? '✓ Pago' : '↩ Retiro'}
                      </p>
                      {pago.descripcion && (
                        <p className={styles.movDesc}>{pago.descripcion}</p>
                      )}
                    </div>
                    <div className={styles.movMonto}>
                      <p className={styles.movValor}>
                        {pago.monto > 0 ? '-' : '+'}{simboloMoneda}{Math.abs(pago.monto).toFixed(2)}
                      </p>
                      <p className={styles.movFecha}>
                        {new Date(pago.fecha).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sección de pago */}
          {plan.estado === 'activo' && !modoPago && (
            <div className={styles.seccion}>
              <button
                className={styles.btnPago}
                onClick={() => setModoPago(true)}
              >
                💳 Realizar Pago
              </button>
            </div>
          )}

          {modoPago && (
            <div className={styles.seccion}>
              <h3 className={styles.seccionTitulo}>Realizar Pago</h3>
              <input
                type="number"
                value={montoPago}
                onChange={(e) => setMontoPago(e.target.value)}
                placeholder="Monto a pagar"
                className={styles.input}
                step="0.01"
              />
              <input
                type="text"
                value={descripcionPago}
                onChange={(e) => setDescripcionPago(e.target.value)}
                placeholder="Descripción (opcional)"
                className={styles.input}
              />
              <div className={styles.btnGroup}>
                <Button variant="brand" onClick={handleAgregarPago}>
                  Confirmar Pago
                </Button>
                <Button variant="outline" onClick={() => {
                  setModoPago(false);
                  setMontoPago('');
                  setDescripcionPago('');
                }}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className={styles.acciones}>
          {plan.estado === 'activo' && (
            <Button
              variant="outline"
              onClick={() => {
                onPausar(plan);
                onClose();
              }}
            >
              ⏸️ Pausar Deuda
            </Button>
          )}

          {plan.estado === 'pausado' && (
            <Button
              variant="brand"
              onClick={() => {
                onReactivar(plan);
                onClose();
              }}
            >
              ▶️ Reactivar Deuda
            </Button>
          )}

          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

ModalDetallesDeuda.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  plan: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onPausar: PropTypes.func.isRequired,
  onReactivar: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  simboloMoneda: PropTypes.string.isRequired
};

export default ModalDetallesDeuda;
