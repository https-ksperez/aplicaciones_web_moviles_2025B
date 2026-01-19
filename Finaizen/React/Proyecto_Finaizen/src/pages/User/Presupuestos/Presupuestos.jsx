import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Toast from '../../../components/ui/Toast';
import PresupuestoCard from '../../../components/ui/PresupuestoCard';
import BudgetModal from '../../../components/modals/BudgetModal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import Button from '../../../components/ui/Button';
import apiService from '../../../services/apiService';
import styles from './Presupuestos.module.css';

/**
 * Página de gestión de presupuestos
 */
export default function Presupuestos() {
  const { currentPerfil } = useAuth();
  const location = useLocation();

  const [presupuestos, setPresupuestos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPresupuesto, setEditingPresupuesto] = useState(null);
  const [deletingPresupuesto, setDeletingPresupuesto] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'mensual', 'semanal', 'anual'

  const cargarPresupuestos = useCallback(async () => {
    if (!currentPerfil) return;

    try {
      const [todosPresupuestos, historial] = await Promise.all([
        apiService.presupuestos.getAll(currentPerfil.id),
        apiService.historial.getAll(currentPerfil.id)
      ]);

      // Filtrar presupuestos del perfil actual y del mes/año actual
      const fecha = new Date();
      const mesActual = fecha.getMonth() + 1;
      const anioActual = fecha.getFullYear();

      const presupuestosPerfil = todosPresupuestos.filter(
        p => p.mes === mesActual && 
             p.anio === anioActual &&
             p.activo
      );

      // Calcular el gasto real de cada presupuesto basado en el historial del mes actual
      const presupuestosConGastoReal = presupuestosPerfil.map(presupuesto => {
        const gastosCategoria = historial.filter(h =>
          h.tipo === 'egreso' &&
          h.categoria === presupuesto.categoria &&
          h.mes === mesActual &&
          h.anio === anioActual
        );

        const montoGastadoReal = gastosCategoria.reduce((sum, h) => sum + parseFloat(h.monto || 0), 0);
        const montoLimite = parseFloat(presupuesto.montoLimite || 0);
        const porcentajeGastado = montoLimite > 0 
          ? Math.round((montoGastadoReal / montoLimite) * 100)
          : 0;

        let estado;
        if (porcentajeGastado >= 100) {
          estado = 'danger';
        } else if (porcentajeGastado >= presupuesto.alertaEn) {
          estado = 'warning';
        } else if (porcentajeGastado >= 50) {
          estado = 'neutral';
        } else {
          estado = 'ok';
        }

        return {
          ...presupuesto,
          montoLimite,
          montoGastado: montoGastadoReal,
          porcentajeGastado,
          estado
        };
      });

      setPresupuestos(presupuestosConGastoReal);
    } catch (error) {
      console.error('Error al cargar presupuestos:', error);
      setToast({
        show: true,
        message: 'Error al cargar presupuestos',
        type: 'error'
      });
    }
  }, [currentPerfil]);

  useEffect(() => {
    cargarPresupuestos();
  }, [currentPerfil, cargarPresupuestos]);

  // Mostrar toast si viene de otra página
  useEffect(() => {
    if (location.state?.message) {
      showToast(location.state.message, location.state.type || 'success');
      // Limpiar el state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleAddNew = () => {
    setEditingPresupuesto(null);
    setShowModal(true);
  };

  const handleEdit = (presupuesto) => {
    setEditingPresupuesto(presupuesto);
    setShowModal(true);
  };

  const handleDelete = (presupuesto) => {
    setDeletingPresupuesto(presupuesto);
  };

  const confirmDelete = async () => {
    if (!deletingPresupuesto) return;

    try {
      // Marcar como inactivo en lugar de eliminar
      await apiService.presupuestos.update(currentPerfil.id, deletingPresupuesto.id, { activo: false });
      await cargarPresupuestos();
      showToast('Presupuesto eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar presupuesto:', error);
      showToast('Error al eliminar presupuesto', 'error');
    }

    setDeletingPresupuesto(null);
  };

  const handleSave = async (budgetData) => {
    const fecha = new Date();
    const mesActual = fecha.getMonth() + 1;
    const anioActual = fecha.getFullYear();

    try {
      if (editingPresupuesto) {
        // Modo edición
        await apiService.presupuestos.update(currentPerfil.id, editingPresupuesto.id, {
          ...budgetData,
          fechaModificacion: new Date().toISOString()
        });
        await cargarPresupuestos();
        showToast('Presupuesto actualizado correctamente', 'success');
      } else {
        // Modo creación
        // Verificar si ya existe un presupuesto activo para esta categoría en este mes
        const presupuestosExistentes = await apiService.presupuestos.getAll(currentPerfil.id);
        const existente = presupuestosExistentes.find(
          p => p.categoria === budgetData.categoria &&
               p.mes === mesActual &&
               p.anio === anioActual &&
               p.activo
        );

        if (existente) {
          showToast(`Ya existe un presupuesto activo para la categoría "${budgetData.categoria}" este mes`, 'error');
          return;
        }

        const nuevoPresupuesto = {
          ...budgetData,
          mes: mesActual,
          anio: anioActual,
          montoGastado: 0,
          porcentajeGastado: 0,
          estado: 'ok',
          activo: true,
          fechaCreacion: new Date().toISOString()
        };

        await apiService.presupuestos.create(currentPerfil.id, nuevoPresupuesto);
        await cargarPresupuestos();
        showToast('Presupuesto creado correctamente', 'success');
      }

      setShowModal(false);
      setEditingPresupuesto(null);
    } catch (error) {
      console.error('Error al guardar presupuesto:', error);
      showToast('Error al guardar presupuesto', 'error');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPresupuesto(null);
  };

  // Filtrar presupuestos por periodo
  const presupuestosFiltrados = presupuestos.filter(p => {
    if (filtro === 'todos') return true;
    return p.periodo === filtro;
  });

  return (
    <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>💰 Presupuestos</h1>
            <p className={styles.subtitle}>
              Gestiona tus presupuestos por categoría
            </p>
          </div>
          <Button 
            variant="primary" 
            onClick={handleAddNew}
            className={styles.addButton}
          >
            ➕ Agregar Presupuesto
          </Button>
        </div>

        {/* Filtros */}
        <div className={styles.filters}>
          <button 
            className={`${styles.filterButton} ${filtro === 'todos' ? styles.active : ''}`}
            onClick={() => setFiltro('todos')}
          >
            Todos
          </button>
          <button 
            className={`${styles.filterButton} ${filtro === 'mensual' ? styles.active : ''}`}
            onClick={() => setFiltro('mensual')}
          >
            Mensuales
          </button>
          <button 
            className={`${styles.filterButton} ${filtro === 'semanal' ? styles.active : ''}`}
            onClick={() => setFiltro('semanal')}
          >
            Semanales
          </button>
          <button 
            className={`${styles.filterButton} ${filtro === 'anual' ? styles.active : ''}`}
            onClick={() => setFiltro('anual')}
          >
            Anuales
          </button>
        </div>

        {/* Lista de presupuestos */}
        <div className={styles.budgetList}>
          {presupuestosFiltrados.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📊</div>
              <h3>No hay presupuestos {filtro !== 'todos' ? `${filtro}es` : ''}</h3>
              <p>{filtro === 'todos' ? 'Comienza agregando un presupuesto para controlar tus gastos' : `No tienes presupuestos ${filtro}es configurados`}</p>
              <Button variant="primary" onClick={handleAddNew}>
                ➕ Crear presupuesto
              </Button>
            </div>
          ) : (
            <div className={styles.budgetGrid}>
              {presupuestosFiltrados.map(presupuesto => (
                <PresupuestoCard
                  key={presupuesto.id}
                  presupuesto={presupuesto}
                  simboloMoneda={currentPerfil?.moneda?.simbolo || currentPerfil?.simboloMoneda || '$'}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  showActions={true}
                  compact={false}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal de creación/edición */}
        <BudgetModal
          isOpen={showModal}
          presupuesto={editingPresupuesto}
          onSave={handleSave}
          onCancel={handleCloseModal}
          simboloMoneda={currentPerfil?.moneda?.simbolo || currentPerfil?.simboloMoneda || '$'}
        />

        {/* Diálogo de confirmación para eliminar */}
        <ConfirmDialog
          isOpen={deletingPresupuesto !== null}
          title="Eliminar Presupuesto"
          message={`¿Estás seguro de que deseas eliminar el presupuesto de "${deletingPresupuesto?.categoria}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          confirmVariant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingPresupuesto(null)}
        />

        {/* Toast de notificaciones */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: '', type: 'success' })}
          />
        )}
      </div>
  );
}
