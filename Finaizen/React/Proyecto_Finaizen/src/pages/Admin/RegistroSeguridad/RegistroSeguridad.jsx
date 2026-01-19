import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import SecurityKPIs from '../../../components/security/SecurityKPIs';
import SecurityFilters from '../../../components/security/SecurityFilters';
import SecurityTable from '../../../components/security/SecurityTable';
import ConfirmModal from '../../../components/security/ConfirmModal';
import apiService from '../../../services/apiService';
import styles from './RegistroSeguridad.module.css';

const RegistroSeguridad = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [kpiData, setKpiData] = useState({ totalLogs: 0, sesionesActivas: 0, alertas: 0, bloqueados: 0 });
  const [eventFilter, setEventFilter] = useState('todos');
  const [searchValue, setSearchValue] = useState('');
  const [modalState, setModalState] = useState({
    isOpen: false,
    logId: null,
    user: '',
    action: ''
  });

  // Configuración del menú
  const adminMenuItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Gestión de Usuarios', path: '/admin/gestion-usuarios' },
    { label: 'Gestión de Roles', path: '/admin/gestion-roles' },
    { label: 'Supervisión de Categorías', path: '/admin/supervision-categorias' },
    { label: 'Registro de Seguridad', path: '/admin/registro-seguridad' },
    { label: 'Inteligencia de Mercado', path: '/admin/inteligencia-mercado' },
    { label: 'Reportes y Soporte', path: '/admin/reportes-soporte' }
  ];

  const userMenuItems = [
    { label: 'Mi Perfil', path: '/user/config/cuenta', icon: '👤' },
    { label: 'Configuración', path: '/user/config/seguridad', icon: '⚙️' }
  ];

  // Proteger ruta - redirigir si no es admin
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate('/login');
    }
  }, [currentUser, isAdmin, navigate]);

  // Cargar datos del backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [logsRes, kpisRes] = await Promise.all([
          apiService.security.getAll(),
          apiService.security.getKPIs()
        ]);
        
        setLogs(logsRes.data || logsRes || []);
        setKpiData(kpisRes.data || kpisRes || { totalLogs: 0, sesionesActivas: 0, alertas: 0, bloqueados: 0 });
      } catch (error) {
        console.error('Error al cargar logs de seguridad:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && isAdmin) {
      loadData();
    }
  }, [currentUser, isAdmin]);

  // Filtrar logs
  const filteredLogs = logs.filter(log => {
    const type = log.tipoEvento || log.type;
    const user = log.usuario || log.user || '';
    const ip = log.ipAddress || log.ip || '';
    
    const matchesFilter = eventFilter === 'todos' || type === eventFilter;
    const matchesSearch = 
      user.toLowerCase().includes(searchValue.toLowerCase()) ||
      ip.toLowerCase().includes(searchValue.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleActionClick = (logId, user, action) => {
    setModalState({
      isOpen: true,
      logId,
      user,
      action
    });
  };

  const handleConfirm = async () => {
    try {
      const log = logs.find(l => l.id === modalState.logId);
      const newBlockedState = !log?.blocked;
      
      await apiService.security.toggleBlock(modalState.logId, newBlockedState);
      
      setLogs(prevLogs => 
        prevLogs.map(log => 
          log.id === modalState.logId 
            ? { ...log, blocked: newBlockedState }
            : log
        )
      );
      console.log(`Usuario ${modalState.action === 'bloquear' ? 'bloqueado' : 'desbloqueado'}.`);
    } catch (error) {
      console.error('Error al cambiar estado de bloqueo:', error);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      logId: null,
      user: '',
      action: ''
    });
  };

  const modalTitle = `Confirmar ${modalState.action.charAt(0).toUpperCase() + modalState.action.slice(1)}`;
  const modalMessage = `¿Estás seguro de que quieres <strong>${modalState.action}</strong> al usuario <strong>${modalState.user}</strong>?`;

  return (
    <div className={styles.container}>
      <Sidebar
        menuItems={adminMenuItems}
        userMenuItems={userMenuItems}
        variant="admin"
        onCollapsedChange={setIsCollapsed}
      />
      <main className={`${styles.mainContent} ${isCollapsed ? styles.expanded : ''}`}>
        {loading ? (
          <div className={styles.loading}>
            <p>Cargando registros de seguridad...</p>
          </div>
        ) : (
          <>
            <SecurityKPIs data={kpiData} />
            
            <section className={styles.card}>
              <SecurityFilters
                eventFilter={eventFilter}
                searchValue={searchValue}
                onEventFilterChange={setEventFilter}
                onSearchChange={setSearchValue}
              />
              <SecurityTable 
                logs={filteredLogs}
                onActionClick={handleActionClick}
              />
            </section>
          </>
        )}
      </main>

      <ConfirmModal
        isOpen={modalState.isOpen}
        title={modalTitle}
        message={modalMessage}
        action={modalState.action}
        onConfirm={handleConfirm}
        onCancel={handleCloseModal}
      />
    </div>
  );
};

export default RegistroSeguridad;
