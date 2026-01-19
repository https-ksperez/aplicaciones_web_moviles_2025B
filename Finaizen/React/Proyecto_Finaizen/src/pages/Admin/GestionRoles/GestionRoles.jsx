import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import RoleCard from '../../../components/roles/RoleCard';
import RoleModal from '../../../components/roles/RoleModal';
import DeleteRoleModal from '../../../components/roles/DeleteRoleModal';
import apiService from '../../../services/apiService';
import { adminSidebarMenuItems, adminDropdownMenuItems } from '../../../config/adminSidebarConfig';
import styles from './GestionRoles.module.css';

/**
 * GestionRoles - Página de gestión de roles y permisos
 * Migrado para usar backend API
 */
function GestionRoles() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Proteger ruta
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate('/login');
    }
  }, [currentUser, isAdmin, navigate]);

  // Cargar roles y permisos desde el backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [rolesData, permisosData] = await Promise.all([
          apiService.roles.getAll(),
          apiService.roles.getPermisos()
        ]);
        setRoles(rolesData || []);
        setAllPermissions(permisosData || []);
      } catch (error) {
        console.error('Error cargando roles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && isAdmin) {
      loadData();
    }
  }, [currentUser, isAdmin]);

  const handleAddRole = () => {
    setSelectedRole(null);
    setIsRoleModalOpen(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setIsRoleModalOpen(true);
  };

  const handleDeleteRole = (role) => {
    if (role.protected) return;
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleSaveRole = async (roleData) => {
    try {
      if (roleData.id) {
        // Editar rol existente
        const updated = await apiService.roles.update(roleData.id, roleData);
        setRoles(prevRoles =>
          prevRoles.map(role =>
            role.id === roleData.id ? { ...role, ...updated } : role
          )
        );
      } else {
        // Agregar nuevo rol
        const newRole = await apiService.roles.create(roleData);
        setRoles(prevRoles => [...prevRoles, newRole]);
      }
      setIsRoleModalOpen(false);
    } catch (error) {
      console.error('Error guardando rol:', error);
      alert('Error al guardar el rol');
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedRole) {
      try {
        await apiService.roles.delete(selectedRole.id);
        setRoles(prevRoles => prevRoles.filter(role => role.id !== selectedRole.id));
        setIsDeleteModalOpen(false);
        setSelectedRole(null);
      } catch (error) {
        console.error('Error eliminando rol:', error);
        alert('Error al eliminar el rol');
      }
    }
  };

  if (!currentUser || !isAdmin) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Sidebar
        menuItems={adminSidebarMenuItems}
        userMenuItems={adminDropdownMenuItems}
        variant="admin"
        onCollapsedChange={setIsCollapsed}
      />

      <main className={`${styles.mainContent} ${isCollapsed ? styles.expanded : ''}`}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Roles</h2>
            <button className={styles.btnAddRole} onClick={handleAddRole}>
              Agregar Rol
            </button>
          </div>

          {loading ? (
            <div className={styles.loading}>Cargando roles...</div>
          ) : (
            <div className={styles.rolesList}>
              {roles.map(role => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={handleEditRole}
                  onDelete={handleDeleteRole}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSave={handleSaveRole}
        role={selectedRole}
        allPermissions={allPermissions}
      />

      <DeleteRoleModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        roleName={selectedRole?.name}
      />
    </div>
  );
}

export default GestionRoles;
