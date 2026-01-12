import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import mockDB from '../../../utils/mockDatabase';
import { Button, Toast, ConfirmDialog } from '../../../components/ui';
import { RecordCard } from '../../../components/records';
import styles from './AdministrarRegistros.module.css';

/**
 * Página de Administrador de Registros
 * Permite visualizar, editar y eliminar ingresos y egresos
 */
function AdministrarRegistros() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, currentPerfil, loading: authLoading } = useAuth();
  
  // Estados
  const [ingresos, setIngresos] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Estados de filtros
  const [filterBy, setFilterBy] = useState('todos'); // 'todos' | 'mensual' | 'semanal' | 'diario' | 'ocasional'
  const [sortBy, setSortBy] = useState('fecha'); // 'fecha' | 'monto-asc' | 'monto-desc'

  // Estados para diálogo de confirmación
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // Estado para vista móvil (switch entre ingresos/egresos)
  const [mobileView, setMobileView] = useState('ingresos'); // 'ingresos' | 'egresos'

  // Estado para detectar si es desktop
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

  /**
   * Carga los ingresos y egresos del perfil actual
   */
  const loadRecords = useCallback(() => {
    try {
      // Filtrar ingresos del perfil (excluyendo ocasionales)
      const perfilIngresos = mockDB.ingresos.filter(
        ing => currentPerfil.ingresos.includes(ing.id) && ing.frecuencia !== 'ocasional'
      );

      // Filtrar egresos del perfil (excluyendo ocasionales)
      const perfilEgresos = mockDB.egresos.filter(
        eg => currentPerfil.egresos.includes(eg.id) && eg.frecuencia !== 'ocasional'
      );

      setIngresos(perfilIngresos);
      setEgresos(perfilEgresos);
    } catch (error) {
      console.error('Error al cargar registros:', error);
      setToast({
        type: 'error',
        message: 'Error al cargar los registros'
      });
    } finally {
      setLoading(false);
    }
  }, [currentPerfil]);

  // Detectar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    if (authLoading) return;

    if (!currentUser || !currentPerfil) {
      navigate('/login');
      return;
    }

    loadRecords();
  }, [currentPerfil, authLoading, currentUser, navigate, loadRecords]);

  /**
   * Aplica filtros y ordenamiento a una lista de registros
   */
  const applyFiltersAndSort = (records) => {
    let filtered = [...records];

    // Aplicar filtro por frecuencia
    if (filterBy !== 'todos') {
      filtered = filtered.filter(rec => rec.frecuencia === filterBy);
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case 'fecha':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'monto-asc':
        filtered.sort((a, b) => a.monto - b.monto);
        break;
      case 'monto-desc':
        filtered.sort((a, b) => b.monto - a.monto);
        break;
      default:
        break;
    }

    return filtered;
  };

  /**
   * Obtiene el texto descriptivo de la frecuencia
   */
  const getFrequencyText = (record) => {
    if (!record || !record.frecuencia) return '';

    switch (record.frecuencia) {
      case 'mensual':
        return record.diaMes ? `El día ${record.diaMes} de cada mes` : 'Mensual';
      case 'semanal': {
        if (!record.diasSemana || !Array.isArray(record.diasSemana)) return 'Semanal';
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const dias = record.diasSemana.map(d => diasSemana[d]).join(', ');
        return `Cada ${dias}`;
      }
      case 'diario':
        return 'Todos los días';
      case 'ocasional':
        return 'Ocasional';
      case 'anual':
        if (!record.diaAnio || !record.diaAnio.dia || !record.diaAnio.mes) return 'Anual';
        return `El ${record.diaAnio.dia}/${record.diaAnio.mes} de cada año`;
      default:
        return '';
    }
  };

  /**
   * Maneja la eliminación de un registro
   */
  const handleDelete = (record, tipo) => {
    setRecordToDelete({ record, tipo });
    setShowConfirmDialog(true);
  };

  /**
   * Confirma la eliminación de un registro
   */
  const confirmDelete = () => {
    if (!recordToDelete) return;

    const { record, tipo } = recordToDelete;

    try {
      if (tipo === 'ingreso') {
        // Eliminar del array de ingresos
        const index = mockDB.ingresos.findIndex(i => i.id === record.id);
        if (index > -1) {
          mockDB.ingresos.splice(index, 1);
        }
        // Eliminar del perfil
        currentPerfil.eliminarIngreso(record.id);
        
        // Actualizar estado local inmediatamente
        setIngresos(prev => prev.filter(i => i.id !== record.id));
      } else {
        // Eliminar del array de egresos
        const index = mockDB.egresos.findIndex(e => e.id === record.id);
        if (index > -1) {
          mockDB.egresos.splice(index, 1);
        }
        // Eliminar del perfil
        currentPerfil.eliminarEgreso(record.id);
        
        // Actualizar estado local inmediatamente
        setEgresos(prev => prev.filter(e => e.id !== record.id));
      }

      // Guardar en localStorage
      mockDB.saveToLocalStorage();

      setToast({
        type: 'success',
        message: `${tipo === 'ingreso' ? 'Ingreso' : 'Egreso'} eliminado exitosamente`
      });
    } catch (error) {
      console.error('Error al eliminar registro:', error);
      setToast({
        type: 'error',
        message: 'Error al eliminar el registro'
      });
    } finally {
      setShowConfirmDialog(false);
      setRecordToDelete(null);
    }
  };

  /**
   * Maneja la edición de un registro
   */
  const handleEdit = (record, tipo) => {
    // Redirigir a la página de edición correspondiente con el ID
    if (tipo === 'ingreso') {
      navigate(`/user/nuevo-ingreso?edit=${record.id}`);
    } else {
      navigate(`/user/nuevo-egreso?edit=${record.id}`);
    }
  };

  // Aplicar filtros y ordenamiento
  const filteredIngresos = applyFiltersAndSort(ingresos);
  const filteredEgresos = applyFiltersAndSort(egresos);

  if (authLoading || loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Cargando registros...</p>
      </div>
    );
  }

  if (!currentUser || !currentPerfil) {
    return null;
  }

  return (
    <div className={styles.mainContent}>
      <div className={styles.recordsManager}>
        <h1>Administrar registros</h1>

          {/* Filtros y Ordenamiento */}
          <div className={styles.filtersContainer}>
            <div className={styles.filterGroup}>
              <label htmlFor="filter-by">Filtrar por:</label>
              <select 
                id="filter-by" 
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="mensual">Mensual</option>
                <option value="semanal">Semanal</option>
                <option value="diario">Diario</option>
                <option value="ocasional">Ocasional</option>
                <option value="anual">Anual</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label htmlFor="sort-by">Ordenar por:</label>
              <select 
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="fecha">Fecha</option>
                <option value="monto-asc">Monto (menor a mayor)</option>
                <option value="monto-desc">Monto (mayor a menor)</option>
              </select>
            </div>
          </div>

          {/* Switch para vista móvil */}
          <div className={styles.mobileSwitch}>
            <button
              className={`${styles.switchButton} ${mobileView === 'ingresos' ? styles.active : ''}`}
              onClick={() => setMobileView('ingresos')}
            >
              💰 Ingresos
            </button>
            <button
              className={`${styles.switchButton} ${mobileView === 'egresos' ? styles.active : ''}`}
              onClick={() => setMobileView('egresos')}
            >
              💸 Egresos
            </button>
          </div>

          {/* Columnas de Ingresos y Egresos */}
          <div className={styles.recordsColumns}>
            {/* Columna de Ingresos */}
            <div className={`${styles.column} ${styles.ingresosColumn} ${mobileView === 'ingresos' ? styles.mobileActive : ''}`}>
              <h2>Ingresos:</h2>
              <div className={styles.recordsList}>
                {filteredIngresos.length === 0 ? (
                  <p className={styles.emptyMessage}>No hay ingresos registrados</p>
                ) : (
                  filteredIngresos.map(ingreso => (
                    <RecordCard
                      key={ingreso.id}
                      record={ingreso}
                      tipo="ingreso"
                      simboloMoneda={currentPerfil.simboloMoneda}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
              
            </div> 

            {/* Columna de Egresos */}
            <div className={`${styles.column} ${styles.egresosColumn} ${mobileView === 'egresos' ? styles.mobileActive : ''}`}>
              <h2>Egresos:</h2>
              <div className={styles.recordsList}>
                {filteredEgresos.length === 0 ? (
                  <p className={styles.emptyMessage}>No hay egresos registrados</p>
                ) : (
                  filteredEgresos.map(egreso => (
                    <RecordCard
                      key={egreso.id}
                      record={egreso}
                      tipo="egreso"
                      simboloMoneda={currentPerfil.simboloMoneda}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
              
            </div>
          </div>

          {/* Botones de Acción */}
          <div className={styles.actionButtons}>
            {(isDesktop || mobileView === 'ingresos') && (
              <Button
                variant="primary"
                onClick={() => navigate('/user/nuevo-ingreso')}
                className={styles.btnIncome}
              >
                Crear nuevo ingreso
              </Button>
            )}
            {(isDesktop || mobileView === 'egresos') && (
              <Button
                variant="danger"
                onClick={() => navigate('/user/nuevo-egreso')}
                className={styles.btnExpense}
              >
                Crear nuevo egreso
              </Button>
            )}
          </div>
        </div>

        {/* Diálogo de Confirmación */}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          title="Confirmar eliminación"
          message={`¿Estás seguro de que quieres eliminar "${recordToDelete?.record?.descripcion}"?`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          confirmVariant="danger"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowConfirmDialog(false);
            setRecordToDelete(null);
          }}
        />

        {/* Toast Notification */}
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
            duration={5000}
          />
        )}
      </div>
    );
}

export default AdministrarRegistros;
