import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import KPICards from '../../../components/users/KPICards';
import UsersFilters from '../../../components/users/UsersFilters';
import UsersTable from '../../../components/users/UsersTable';
import { 
  ViewUserModal, 
  EditRoleModal, 
  InviteUserModal, 
  ConfirmActionModal 
} from '../../../components/users/UserModals';
import apiService from '../../../services/apiService';
import { adminSidebarMenuItems, adminDropdownMenuItems } from '../../../config/adminSidebarConfig';
import styles from './GestionUsuarios.module.css';

// Roles disponibles
const ROLES = ['user', 'admin', 'moderador'];

function GestionUsuarios() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Estado de usuarios
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // Estados de modales
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  
  // Usuario seleccionado
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);

  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    role: 'todos',
    status: 'todos'
  });

  // Proteger ruta
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate('/login');
    }
  }, [currentUser, isAdmin, navigate]);

  // Cargar usuarios desde el backend
  useEffect(() => {
    const loadUsers = async () => {
      if (!currentUser || !isAdmin) return;
      
      try {
        setLoading(true);
        const usersFromBackend = await apiService.users.getAll();
        
        // Transformar datos para el formato esperado por los componentes
        const transformedUsers = usersFromBackend.map(u => ({
          id: u.id,
          name: `${u.nombre || ''} ${u.apellido || ''}`.trim() || u.nombreUsuario,
          email: u.correo,
          role: u.rol || 'user',
          status: u.activo !== false ? 'activo' : 'suspendido',
          date: new Date(u.createdAt).toLocaleDateString('es-ES'),
          isPremium: u.isPremium,
          // Datos adicionales para el modal de ver
          nombre: u.nombre,
          apellido: u.apellido,
          pais: u.pais,
          ciudad: u.ciudad,
          genero: u.genero
        }));
        
        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);
      } catch (error) {
        console.error('Error cargando usuarios:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, [currentUser, isAdmin]);

  // Calcular KPIs
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'activo').length;
  const suspendedUsers = users.filter(u => u.status === 'suspendido').length;

  // Aplicar filtros
  const applyFilters = (searchTerm, role, status) => {
    let filtered = [...users];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por rol
    if (role !== 'todos') {
      filtered = filtered.filter(u => u.role === role);
    }

    // Filtrar por estado
    if (status !== 'todos') {
      filtered = filtered.filter(u => u.status === status);
    }

    setFilteredUsers(filtered);
  };

  // Handlers de filtros
  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    applyFilters(searchTerm, filters.role, filters.status);
  };

  const handleRoleFilter = (role) => {
    setFilters(prev => ({ ...prev, role }));
    applyFilters(filters.search, role, filters.status);
  };

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status }));
    applyFilters(filters.search, filters.role, status);
  };

  // Handlers de acciones
  const handleViewUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleEditRole = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleToggleStatus = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setActionType(user.status === 'activo' ? 'suspend' : 'activate');
    setConfirmModalOpen(true);
  };

  const handleInviteUser = () => {
    setInviteModalOpen(true);
  };

  // Handlers de modales
  const handleSaveRole = async (userId, newRole) => {
    try {
      await apiService.users.update(userId, { rol: newRole });
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      setFilteredUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error actualizando rol:', error);
      alert('Error al actualizar el rol');
    }
  };

  const handleConfirmAction = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      const newStatus = user.status === 'activo' ? false : true;
      await apiService.users.update(userId, { activo: newStatus });
      
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, status: newStatus ? 'activo' : 'suspendido' } 
          : u
      ));
      setFilteredUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, status: newStatus ? 'activo' : 'suspendido' } 
          : u
      ));
      setConfirmModalOpen(false);
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar el estado del usuario');
    }
  };

  const handleInvite = (email, role) => {
    const newUser = {
      id: users.length + 1,
      name: email.split('@')[0],
      email: email,
      role: role,
      status: 'activo',
      date: new Date().toLocaleDateString('es-ES')
    };
    
    setUsers(prev => [...prev, newUser]);
    setFilteredUsers(prev => [...prev, newUser]);
    alert(`Invitación enviada a ${email}`);
  };

  return (
    <div className={styles.container}>
      <Sidebar 
        menuItems={adminSidebarMenuItems}
        userMenuItems={adminDropdownMenuItems}
        variant="admin"
        onCollapsedChange={setIsCollapsed}
      />
      
      <main className={`${styles.mainContent} ${isCollapsed ? styles.expanded : ''}`}>
        <div className={styles.header}>
          <h1>Gestión de Usuarios</h1>
          <button className={styles.btnInvite} onClick={handleInviteUser}>
            Invitar Usuario
          </button>
        </div>

        <KPICards 
          total={totalUsers}
          active={activeUsers}
          suspended={suspendedUsers}
        />

        <UsersFilters
          onSearch={handleSearch}
          onRoleFilter={handleRoleFilter}
          onStatusFilter={handleStatusFilter}
        />

        <UsersTable 
          users={filteredUsers}
          onViewUser={handleViewUser}
          onEditRole={handleEditRole}
          onToggleStatus={handleToggleStatus}
        />

        {/* Modales */}
        <ViewUserModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          user={selectedUser}
        />

        <EditRoleModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          user={selectedUser}
          roles={ROLES}
          onSave={handleSaveRole}
        />

        <InviteUserModal
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          roles={ROLES}
          onInvite={handleInvite}
        />

        <ConfirmActionModal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          user={selectedUser}
          action={actionType}
          onConfirm={handleConfirmAction}
        />
      </main>
    </div>
  );
}

export default GestionUsuarios;
