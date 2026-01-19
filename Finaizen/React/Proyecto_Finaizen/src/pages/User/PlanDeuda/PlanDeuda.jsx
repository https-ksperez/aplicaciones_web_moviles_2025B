import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import apiService from '../../../services/apiService';
import { Button, Toast } from '../../../components/ui';
import DeudaCard from '../../../components/cards/DeudaCard';
import PlanDeudaModal from '../../../components/modals/PlanDeudaModal';
import ConsejoDeuda from '../../../components/deudas/ConsejoDeuda';
import ModalDetallesDeuda from '../../../components/modals/ModalDetallesDeuda';
import EstadisticasDeuda from '../../../components/deudas/EstadisticasDeuda';
import styles from './PlanDeuda.module.css';

/**
 * PlanDeuda - Página principal del Planificador de Deudas
 * Herramienta inteligente para gestionar y eliminar deudas
 */
function PlanDeuda() {
  const { currentPerfil } = useAuth();

  // Estado
  const [deudas, setDeudas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDeuda, setEditingDeuda] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDeuda, setSelectedDeuda] = useState(null);
  const [toast, setToast] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const [consejos, setConsejos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);

  const simboloMoneda = currentPerfil?.moneda?.simbolo || '$';

  const cargarDatos = useCallback(async () => {
    if (!currentPerfil) return;

    setLoading(true);
    try {
      const deudasDelPerfil = await apiService.planesDeuda.getAll(currentPerfil.id);
      
      // Transformar datos para que tengan todos los campos necesarios
      const hoy = new Date();
      const deudasTransformadas = deudasDelPerfil.map(d => {
        const montoDeuda = parseFloat(d.montoDeuda || 0);
        const montoPagado = parseFloat(d.montoPagado || 0);
        const montoFaltante = Math.max(0, montoDeuda - montoPagado);
        const progreso = montoDeuda > 0 ? (montoPagado / montoDeuda) * 100 : 0;
        
        // Calcular días restantes para próximo pago
        let diasRestantes = 0;
        if (d.fechaPago) {
          const fechaPago = new Date(d.fechaPago);
          diasRestantes = Math.ceil((fechaPago - hoy) / (1000 * 60 * 60 * 24));
        }

        // Calcular cuota mensual e interés generado
        const mesesRestantes = Math.max(1, Math.ceil(diasRestantes / 30));
        const tasaInteres = parseFloat(d.tasaInteres || 0);
        const interesGenerado = (montoDeuda * tasaInteres / 100) * (mesesRestantes / 12);
        const cuotaMensual = montoFaltante > 0 ? montoFaltante / mesesRestantes : 0;

        return {
          ...d,
          montoDeuda,
          montoPagado,
          montoFaltante,
          progreso,
          diasRestantes,
          tasaInteres,
          cuotaMensual,
          interesGenerado,
          historialPagos: d.historialPagos || [],
          icono: d.icono || '💳',
          color: d.color || '#FF6B6B'
        };
      });

      setDeudas(deudasTransformadas);

      // Calcular estadísticas con campos correctos para EstadisticasDeuda
      const deudasActivas = deudasTransformadas.filter(d => d.estado === 'activo');
      const deudasCompletadas = deudasTransformadas.filter(d => d.estado === 'completado');
      const deudasAtrasadas = deudasTransformadas.filter(d => d.estado === 'activo' && d.diasRestantes < 0);
      const totalDeuda = deudasTransformadas.reduce((sum, d) => sum + d.montoDeuda, 0);
      const totalPagado = deudasTransformadas.reduce((sum, d) => sum + d.montoPagado, 0);
      const totalFaltante = deudasTransformadas.reduce((sum, d) => sum + d.montoFaltante, 0);
      const promedioProgreso = deudasTransformadas.length > 0
        ? deudasTransformadas.reduce((sum, d) => sum + d.progreso, 0) / deudasTransformadas.length
        : 0;

      // Próximo vencimiento
      const deudasConVencimiento = deudasActivas
        .filter(d => d.diasRestantes > 0)
        .sort((a, b) => a.diasRestantes - b.diasRestantes);
      const proximoVencimiento = deudasConVencimiento.length > 0 ? deudasConVencimiento[0] : null;

      // Deuda más prioritaria
      const prioridadOrden = { urgente: 4, alta: 3, normal: 2, baja: 1 };
      const deudaMasPrioritaria = deudasActivas.length > 0
        ? deudasActivas.sort((a, b) => (prioridadOrden[b.prioridad] || 0) - (prioridadOrden[a.prioridad] || 0))[0]
        : null;

      setEstadisticas({
        totalDeudas: deudasTransformadas.length,
        deudasActivas: deudasActivas.length,
        deudasCompletadas: deudasCompletadas.length,
        deudasAtrasadas: deudasAtrasadas.length,
        totalDeuda,
        totalPagado,
        totalFaltante,
        promedioProgreso,
        proximoVencimiento,
        deudaMasPrioritaria
      });

      // Generar consejos basados en las deudas
      if (deudasTransformadas.length > 0) {
        const consejosGenerados = [];
        deudasTransformadas.forEach(deuda => {
          if (deuda.progreso < 25) {
            consejosGenerados.push({
              id: `consejo-${deuda.id}-1`,
              tipo: 'motivacion',
              mensaje: `¡Ánimo con "${deuda.nombre}"! Cada pago te acerca a la libertad financiera.`,
              deudaId: deuda.id
            });
          } else if (deuda.progreso >= 75 && deuda.progreso < 100) {
            consejosGenerados.push({
              id: `consejo-${deuda.id}-2`,
              tipo: 'felicitacion',
              mensaje: `¡Excelente! Estás muy cerca de liquidar "${deuda.nombre}".`,
              deudaId: deuda.id
            });
          }
        });
        setConsejos(consejosGenerados.slice(0, 3));
      }
    } catch (error) {
      console.error('Error al cargar deudas:', error);
      setToast({
        type: 'error',
        message: 'Error al cargar las deudas'
      });
    } finally {
      setLoading(false);
    }
  }, [currentPerfil]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleCrearDeuda = async (deudaData) => {
    try {
      const nuevaDeuda = await apiService.planesDeuda.create(currentPerfil.id, {
        ...deudaData,
        montoPagado: 0,
        estado: 'activo'
      });

      setToast({
        type: 'success',
        message: `Deuda "${nuevaDeuda.nombre}" creada exitosamente 🎉`
      });
      setShowModal(false);
      await cargarDatos();
    } catch (error) {
      console.error('Error al crear deuda:', error);
      setToast({
        type: 'error',
        message: 'Error al crear la deuda'
      });
    }
  };

  const handleEditarDeuda = (deuda) => {
    setEditingDeuda(deuda);
    setShowModal(true);
  };

  const handleGuardarEdicion = async (deudaData) => {
    try {
      await apiService.planesDeuda.update(currentPerfil.id, editingDeuda.id, deudaData);

      setToast({
        type: 'success',
        message: 'Deuda actualizada exitosamente ✓'
      });
      setShowModal(false);
      setEditingDeuda(null);
      await cargarDatos();
    } catch (error) {
      console.error('Error al actualizar deuda:', error);
      setToast({
        type: 'error',
        message: 'Error al actualizar la deuda'
      });
    }
  };

  const handleEliminarDeuda = async (deudaId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta deuda?')) {
      try {
        await apiService.planesDeuda.delete(currentPerfil.id, deudaId);

        setToast({
          type: 'success',
          message: 'Deuda eliminada exitosamente'
        });
        await cargarDatos();
      } catch (error) {
        console.error('Error al eliminar deuda:', error);
        setToast({
          type: 'error',
          message: 'Error al eliminar la deuda'
        });
      }
    }
  };

  const handleVerDetalles = (deuda) => {
    setSelectedDeuda(deuda);
    setShowDetails(true);
  };

  const handleCerrarDetalles = () => {
    setShowDetails(false);
    setTimeout(() => {
      cargarDatos();
    }, 300);
  };

  const handlePausarDeuda = async (deuda) => {
    try {
      await apiService.planesDeuda.update(currentPerfil.id, deuda.id, { estado: 'pausado' });

      setToast({
        type: 'info',
        message: 'Deuda pausada'
      });
      await cargarDatos();
    } catch (error) {
      console.error('Error al pausar deuda:', error);
    }
  };

  const handleReactivarDeuda = async (deuda) => {
    try {
      await apiService.planesDeuda.update(currentPerfil.id, deuda.id, { estado: 'activo' });

      setToast({
        type: 'success',
        message: 'Deuda reactivada'
      });
      await cargarDatos();
    } catch (error) {
      console.error('Error al reactivar deuda:', error);
    }
  };

  // Filtrar deudas
  const deudasFiltradas = useMemo(() => {
    let resultado = deudas;

    switch (filtro) {
      case 'activas':
        resultado = deudas.filter(d => d.estado === 'activo');
        break;
      case 'completadas':
        resultado = deudas.filter(d => d.estado === 'completado');
        break;
      case 'pausadas':
        resultado = deudas.filter(d => d.estado === 'pausado');
        break;
      default:
        resultado = deudas;
    }

    return resultado;
  }, [deudas, filtro]);

  if (loading && deudas.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Cargando deudas...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.titulo}>💳 Planificador de Deudas</h1>
          <p className={styles.subtitulo}>
            Gestiona tus deudas de forma inteligente y elimínalas estratégicamente
          </p>
        </div>
        <Button
          variant="brand"
          onClick={() => {
            setEditingDeuda(null);
            setShowModal(true);
          }}
        >
          ➕ Agregar Deuda
        </Button>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <EstadisticasDeuda 
          estadisticas={estadisticas} 
          simboloMoneda={simboloMoneda}
        />
      )}

      {/* Consejos */}
      {consejos.length > 0 && (
        <ConsejoDeuda consejos={consejos} />
      )}

      {/* Filtros */}
      {deudas.length > 0 && (
        <div className={styles.filtros}>
          <button
            className={`${styles.filtro} ${filtro === 'todos' ? styles.activo : ''}`}
            onClick={() => setFiltro('todos')}
          >
            Todos ({deudas.length})
          </button>
          <button
            className={`${styles.filtro} ${filtro === 'activas' ? styles.activo : ''}`}
            onClick={() => setFiltro('activas')}
          >
            Activas ({deudas.filter(d => d.estado === 'activo').length})
          </button>
          <button
            className={`${styles.filtro} ${filtro === 'completadas' ? styles.activo : ''}`}
            onClick={() => setFiltro('completadas')}
          >
            Completadas ({deudas.filter(d => d.estado === 'completado').length})
          </button>
          <button
            className={`${styles.filtro} ${filtro === 'pausadas' ? styles.activo : ''}`}
            onClick={() => setFiltro('pausadas')}
          >
            Pausadas ({deudas.filter(d => d.estado === 'pausado').length})
          </button>
        </div>
      )}

      {/* Grid de deudas */}
      {deudasFiltradas.length > 0 ? (
        <div className={styles.grid}>
          {deudasFiltradas.map(deuda => (
            <DeudaCard
              key={deuda.id}
              plan={deuda}
              onEdit={handleEditarDeuda}
              onDelete={handleEliminarDeuda}
              onViewDetails={handleVerDetalles}
              simboloMoneda={simboloMoneda}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          {deudas.length === 0 ? (
            <>
              <p className={styles.emptyIcon}>💪</p>
              <h3>¡Excelente! No tienes deudas registradas</h3>
              <p>Comienza agregando deudas para gestionarlas de forma inteligente</p>
              <Button
                variant="brand"
                onClick={() => {
                  setEditingDeuda(null);
                  setShowModal(true);
                }}
              >
                Crear Mi Primer Plan
              </Button>
            </>
          ) : (
            <>
              <p className={styles.emptyIcon}>🔍</p>
              <h3>Sin deudas en este filtro</h3>
              <p>Prueba cambiando el filtro para ver otras deudas</p>
            </>
          )}
        </div>
      )}

      {/* Modal de crear/editar */}
      <PlanDeudaModal
        isOpen={showModal}
        plan={editingDeuda}
        onSave={editingDeuda ? handleGuardarEdicion : handleCrearDeuda}
        onCancel={() => {
          setShowModal(false);
          setEditingDeuda(null);
        }}
        simboloMoneda={simboloMoneda}
      />

      {/* Modal de detalles */}
      {selectedDeuda && (
        <ModalDetallesDeuda
          isOpen={showDetails}
          plan={selectedDeuda}
          onClose={handleCerrarDetalles}
          onPausar={handlePausarDeuda}
          onReactivar={handleReactivarDeuda}
          onRefresh={cargarDatos}
          simboloMoneda={simboloMoneda}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default PlanDeuda;
