import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import SupportKPIs from '../../../components/support/SupportKPIs';
import SupportFilters from '../../../components/support/SupportFilters';
import SupportTable from '../../../components/support/SupportTable';
import AssignModal from '../../../components/support/AssignModal';
import ViewModal from '../../../components/support/ViewModal';
import apiService from '../../../services/apiService';
import styles from './ReportesSoporte.module.css';

const ReportesSoporte = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [kpiData, setKpiData] = useState({ abiertos: 0, resueltos: 0, tiempoPromedio: '0h', agentes: 0 });
  const [assignOptions, setAssignOptions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchValue, setSearchValue] = useState('');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Proteger ruta - redirigir si no es admin
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate('/login');
    }
  }, [currentUser, isAdmin, navigate]);

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

  // Cargar datos del backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [ticketsRes, kpisRes, agentsRes] = await Promise.all([
          apiService.support.getAll(),
          apiService.support.getKPIs(),
          apiService.support.getAgents()
        ]);
        
        setTickets(ticketsRes.data || ticketsRes || []);
        setKpiData(kpisRes.data || kpisRes || { abiertos: 0, resueltos: 0, tiempoPromedio: '0h', agentes: 0 });
        
        // Transformar agentes a opciones de asignación
        const agents = agentsRes.data || agentsRes || [];
        setAssignOptions(agents.map(a => ({ 
          value: a.id, 
          label: `${a.nombre} (Nivel ${a.nivel})` 
        })));
      } catch (error) {
        console.error('Error al cargar datos de soporte:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && isAdmin) {
      loadData();
    }
  }, [currentUser, isAdmin]);

  // Filtrar tickets
  const filteredTickets = tickets.filter(ticket => {
    const status = ticket.estado || ticket.status;
    const user = ticket.emailUsuario || ticket.user || '';
    const subject = ticket.asunto || ticket.subject || '';
    
    const matchesStatus = statusFilter === 'todos' || status === statusFilter;
    const matchesSearch = 
      user.toLowerCase().includes(searchValue.toLowerCase()) ||
      subject.toLowerCase().includes(searchValue.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleViewClick = async (ticket) => {
    try {
      const response = await apiService.support.getById(ticket.id);
      setSelectedTicket(response.data || ticket);
    } catch (error) {
      console.error('Error al obtener ticket:', error);
      setSelectedTicket(ticket);
    }
    setViewModalOpen(true);
  };

  const handleAssignClick = (ticket) => {
    setSelectedTicket(ticket);
    setAssignModalOpen(true);
  };

  const handleAssignSave = async (ticketId, assignTo) => {
    try {
      await apiService.support.assign(ticketId, assignTo);
      setTickets(prev => prev.map(t =>
        t.id === ticketId ? { ...t, asignadoA: assignTo } : t
      ));
      console.log(`Ticket ${ticketId} asignado a: ${assignTo}`);
    } catch (error) {
      console.error('Error al asignar ticket:', error);
    }
    setAssignModalOpen(false);
    setSelectedTicket(null);
  };

  const handleCloseAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedTicket(null);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedTicket(null);
  };

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
            <p>Cargando datos de soporte...</p>
          </div>
        ) : (
          <>
            <SupportKPIs data={kpiData} />
            
            <section className={styles.card}>
              <SupportFilters
                statusFilter={statusFilter}
                searchValue={searchValue}
                onStatusChange={setStatusFilter}
                onSearchChange={setSearchValue}
              />
              <SupportTable 
                tickets={filteredTickets}
                onViewClick={handleViewClick}
                onAssignClick={handleAssignClick}
              />
            </section>
          </>
        )}
      </main>

      <AssignModal
        isOpen={assignModalOpen}
        ticket={selectedTicket}
        assignOptions={assignOptions}
        onSave={handleAssignSave}
        onCancel={handleCloseAssignModal}
      />

      <ViewModal
        isOpen={viewModalOpen}
        ticket={selectedTicket}
        onClose={handleCloseViewModal}
      />
    </div>
  );
};

export default ReportesSoporte;
