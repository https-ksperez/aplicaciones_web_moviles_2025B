import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import apiService from '../../../services/apiService';
import { Button, Toast } from '../../../components/ui';
import PlanCard from '../../../components/cards/PlanCard';
import PlanAhorroModal from '../../../components/modals/PlanAhorroModal';
import ConsejoAhorro from '../../../components/savings/ConsejoAhorro';
import ModalDetallesPlan from '../../../components/modals/ModalDetallesPlan';
import EstadisticasAhorro from '../../../components/savings/EstadisticasAhorro';
import styles from './PlanAhorro.module.css';

/**
 * PlanAhorro - Página principal del Planificador de Ahorro
 * Herramienta innovadora para planificar y gestionar ahorros
 */
function PlanAhorro() {
  const { currentPerfil } = useAuth();
  
  // Estado
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [toast, setToast] = useState(null);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'activos', 'completados', 'pausados'
  const [consejos, setConsejos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);

  // Ref para acceder al selectedPlan actual sin causar re-renders
  const selectedPlanRef = useRef(null);
  selectedPlanRef.current = selectedPlan;

  const cargarDatos = useCallback(async () => {
    if (!currentPerfil) return;

    setLoading(true);
    try {
      const planesDelPerfil = await apiService.planesAhorro.getAll(currentPerfil.id);
      
      // Transformar planes con campos calculados para PlanCard
      const hoy = new Date();
      const planesTransformados = planesDelPerfil.map(p => {
        const montoActual = parseFloat(p.montoActual || 0);
        const montoMeta = parseFloat(p.montoMeta || 0);
        const montoFaltante = Math.max(0, montoMeta - montoActual);
        const progreso = montoMeta > 0 ? (montoActual / montoMeta) * 100 : 0;
        
        let diasRestantes = 0;
        if (p.fechaObjetivo) {
          const fechaObjetivo = new Date(p.fechaObjetivo);
          diasRestantes = Math.ceil((fechaObjetivo - hoy) / (1000 * 60 * 60 * 24));
        }

        // Calcular monto a ahorrar mensual estimado
        const mesesRestantes = Math.max(1, Math.ceil(diasRestantes / 30));
        const montoAhorrarMensualEstimado = montoFaltante > 0 ? montoFaltante / mesesRestantes : 0;

        return {
          ...p,
          montoActual,
          montoMeta,
          montoFaltante,
          progreso,
          diasRestantes,
          montoAhorrarMensualEstimado,
          historialAhorros: p.historialAhorros || [],
          icono: p.icono || '💰',
          color: p.color || '#4CAF50'
        };
      });

      setPlanes(planesTransformados);

      // Si hay un plan seleccionado, actualizarlo con los datos frescos
      if (selectedPlanRef.current) {
        const planActualizado = planesTransformados.find(p => p.id === selectedPlanRef.current.id);
        if (planActualizado) {
          setSelectedPlan(planActualizado);
        }
      }

      // Calcular estadísticas con los campos que espera EstadisticasAhorro
      const planesActivos = planesTransformados.filter(p => p.estado === 'activo');
      const planesCompletados = planesTransformados.filter(p => p.estado === 'completado');
      const montoAhorradoTotal = planesTransformados.reduce((sum, p) => sum + p.montoActual, 0);
      const montoMetaTotal = planesTransformados.reduce((sum, p) => sum + p.montoMeta, 0);
      
      const porcentajePromedioCompletitud = planesTransformados.length > 0
        ? planesTransformados.reduce((sum, p) => sum + p.progreso, 0) / planesTransformados.length
        : 0;

      // Planes en peligro: activos con menos de 30 días y progreso bajo
      const planesEnPeligro = planesTransformados
        .filter(p => p.estado === 'activo' && p.diasRestantes < 30 && p.diasRestantes > 0 && p.progreso < 70);

      // Próximos a completar: planes con progreso >= 70%
      const proximosPlanesACompletar = planesTransformados
        .filter(p => p.estado === 'activo' && p.progreso >= 70 && p.progreso < 100)
        .sort((a, b) => b.progreso - a.progreso)
        .slice(0, 3);
      
      setEstadisticas({
        totalPlanes: planesTransformados.length,
        planesActivos: planesActivos.length,
        planesCompletados: planesCompletados.length,
        montoAhorradoTotal,
        montoMetaTotal,
        porcentajePromedioCompletitud,
        planesEnPeligro,
        proximosPlanesACompletar
      });

      // Generar consejos basados en los planes
      if (planesTransformados.length > 0) {
        const consejosGenerados = [];
        planesTransformados.forEach(plan => {
          if (plan.progreso < 25) {
            consejosGenerados.push({
              id: `consejo-${plan.id}-1`,
              tipo: 'motivacion',
              mensaje: `¡Ánimo con "${plan.nombre}"! Cada pequeño aporte cuenta.`,
              planId: plan.id
            });
          } else if (plan.progreso >= 75 && plan.progreso < 100) {
            consejosGenerados.push({
              id: `consejo-${plan.id}-2`,
              tipo: 'felicitacion',
              mensaje: `¡Excelente! Estás muy cerca de completar "${plan.nombre}".`,
              planId: plan.id
            });
          }
        });
        setConsejos(consejosGenerados.slice(0, 3));
      }
    } catch (error) {
      console.error('Error al cargar planes de ahorro:', error);
      setToast({
        type: 'error',
        message: 'Error al cargar los planes de ahorro'
      });
    } finally {
      setLoading(false);
    }
  }, [currentPerfil]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleCrearPlan = async (planData) => {
    try {
      const nuevoPlan = await apiService.planesAhorro.create(currentPerfil.id, {
        ...planData,
        montoActual: 0,
        estado: 'activo'
      });

      setToast({
        type: 'success',
        message: `Plan "${nuevoPlan.nombre}" creado exitosamente 🎉`
      });
      setShowModal(false);
      await cargarDatos();
    } catch (error) {
      console.error('Error al crear plan:', error);
      setToast({
        type: 'error',
        message: 'Error al crear el plan'
      });
    }
  };

  const handleEditarPlan = (plan) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleGuardarEdicion = async (planData) => {
    try {
      await apiService.planesAhorro.update(currentPerfil.id, editingPlan.id, planData);

      setToast({
        type: 'success',
        message: 'Plan actualizado exitosamente ✓'
      });
      setShowModal(false);
      setEditingPlan(null);
      await cargarDatos();
    } catch (error) {
      console.error('Error al actualizar plan:', error);
      setToast({
        type: 'error',
        message: 'Error al actualizar el plan'
      });
    }
  };

  const handleEliminarPlan = async (planId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este plan?')) {
      try {
        await apiService.planesAhorro.delete(currentPerfil.id, planId);

        setToast({
          type: 'success',
          message: 'Plan eliminado exitosamente'
        });
        await cargarDatos();
      } catch (error) {
        console.error('Error al eliminar plan:', error);
        setToast({
          type: 'error',
          message: 'Error al eliminar el plan'
        });
      }
    }
  };

  const handleVerDetalles = (plan) => {
    setSelectedPlan(plan);
    setShowDetails(true);
  };

  const handleCerrarDetalles = () => {
    setShowDetails(false);
    // Recargar datos para actualizar el montoActual en las tarjetas
    setTimeout(() => {
      cargarDatos();
    }, 300);
  };

  const handlePausarPlan = async (plan) => {
    try {
      await apiService.planesAhorro.update(currentPerfil.id, plan.id, { estado: 'pausado' });

      setToast({
        type: 'info',
        message: 'Plan pausado'
      });
      await cargarDatos();
    } catch (error) {
      console.error('Error al pausar plan:', error);
    }
  };

  const handleReactivarPlan = async (plan) => {
    try {
      await apiService.planesAhorro.update(currentPerfil.id, plan.id, { estado: 'activo' });

      setToast({
        type: 'success',
        message: 'Plan reactivado'
      });
      await cargarDatos();
    } catch (error) {
      console.error('Error al reactivar plan:', error);
    }
  };

  // Filtrar planes
  const planesFiltrados = planes.filter(p => {
    if (filtro === 'activos') return p.estado === 'activo';
    if (filtro === 'completados') return p.estado === 'completado';
    if (filtro === 'pausados') return p.estado === 'pausado';
    return true;
  });

  const simboloMoneda = currentPerfil?.moneda?.simbolo || currentPerfil?.simboloMoneda || '$';

  if (loading) {
    return <div className={styles.loading}>Cargando planes de ahorro...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.titulo}>📊 Planificador de Ahorro</h1>
          <p className={styles.subtitle}>
            Crea y gestiona tus planes de ahorro con metas inteligentes y consejos personalizados
          </p>
        </div>
        <Button
          variant="brand"
          onClick={() => {
            setEditingPlan(null);
            setShowModal(true);
          }}
        >
          + Crear Nuevo Plan
        </Button>
      </div>

      {/* Consejos */}
      {consejos.length > 0 && (
        <div className={styles.seccionConsejos}>
          <h2 className={styles.seccionTitulo}>💡 Consejos Personalizados</h2>
          <ConsejoAhorro consejos={consejos} />
        </div>
      )}

      {/* Estadísticas */}
      {estadisticas && (
        <EstadisticasAhorro estadisticas={estadisticas} simboloMoneda={simboloMoneda} />
      )}

      {/* Filtros */}
      <div className={styles.filtros}>
        {['todos', 'activos', 'completados', 'pausados'].map(f => (
          <button
            key={f}
            className={`${styles.filtroBtn} ${filtro === f ? styles.active : ''}`}
            onClick={() => setFiltro(f)}
          >
            {f === 'todos' && 'Todos'}
            {f === 'activos' && '✅ Activos'}
            {f === 'completados' && '🎉 Completados'}
            {f === 'pausados' && '⏸️ Pausados'}
          </button>
        ))}
      </div>

      {/* Planes */}
      {planesFiltrados.length > 0 ? (
        <div className={styles.planesGrid}>
          {planesFiltrados.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={handleEditarPlan}
              onDelete={handleEliminarPlan}
              onViewDetails={handleVerDetalles}
              simboloMoneda={simboloMoneda}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>🎯</p>
          <p className={styles.emptyText}>
            {planes.length === 0
              ? 'Aún no tienes planes de ahorro. ¡Crea uno para comenzar!'
              : 'No hay planes en esta categoría.'}
          </p>
          {planes.length === 0 && (
            <Button
              variant="brand"
              onClick={() => {
                setEditingPlan(null);
                setShowModal(true);
              }}
            >
              Crear Mi Primer Plan
            </Button>
          )}
        </div>
      )}

      {/* Modal de crear/editar */}
      <PlanAhorroModal
        isOpen={showModal}
        plan={editingPlan}
        onSave={editingPlan ? handleGuardarEdicion : handleCrearPlan}
        onCancel={() => {
          setShowModal(false);
          setEditingPlan(null);
        }}
        simboloMoneda={simboloMoneda}
      />

      {/* Modal de detalles */}
      {selectedPlan && (
        <ModalDetallesPlan
          isOpen={showDetails}
          plan={selectedPlan}
          onClose={handleCerrarDetalles}
          onPausar={handlePausarPlan}
          onReactivar={handleReactivarPlan}
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

export default PlanAhorro;
