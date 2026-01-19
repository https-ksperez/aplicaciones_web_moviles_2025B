import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import AdminSummaryCards from '../../../components/dashboard/AdminSummaryCards';
import UserGrowthChart from '../../../components/dashboard/UserGrowthChart';
import { adminSidebarMenuItems, adminDropdownMenuItems } from '../../../config/adminSidebarConfig';
import apiService from '../../../services/apiService';
import styles from './DashboardAdmin.module.css';

/**
 * DashboardAdmin - Dashboard principal para administradores
 * Muestra estadísticas generales y gráficos de usuarios
 */
function DashboardAdmin() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    usuariosActivos: 0,
    cuentasCreadas: 0,
    reportes: 0
  });
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Proteger la ruta - solo admins
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate('/login');
    }
  }, [currentUser, isAdmin, navigate]);

  // Cargar estadísticas
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Obtener todos los usuarios del backend
        const allUsers = await apiService.users.getAll();
        
        // Calcular estadísticas
        const usuariosActivos = allUsers.filter(u => u.activo !== false).length;
        const cuentasCreadas = allUsers.length;
        
        // Reportes (ejemplo fijo por ahora)
        const reportes = 12;

        setStats({
          usuariosActivos,
          cuentasCreadas,
          reportes
        });

        // Generar datos de crecimiento (ejemplo)
        const growthData = [
          { mes: 'Ene', usuarios: 125 },
          { mes: 'Feb', usuarios: 150 },
          { mes: 'Mar', usuarios: 210 },
          { mes: 'Abr', usuarios: 250 },
          { mes: 'May', usuarios: 325 },
          { mes: 'Jun', usuarios: 400 }
        ];
        setUserGrowthData(growthData);
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      }
    };

    if (currentUser && isAdmin) {
      loadStats();
    }
  }, [currentUser, isAdmin]);

  if (!currentUser || !isAdmin) {
    return null; // No mostrar nada mientras redirige
  }

  return (
    <div className={styles.container}>
      <Sidebar 
        menuItems={adminSidebarMenuItems}
        userMenuItems={adminDropdownMenuItems}
        variant="admin"
        onCollapsedChange={setIsCollapsed}
      />

      <main className={`${styles.dashboardAdmin} ${isCollapsed ? styles.expanded : ''}`}>
        <AdminSummaryCards stats={stats} />
        <UserGrowthChart data={userGrowthData} title="Crecimiento de Usuarios" />
      </main>
    </div>
  );
}

export default DashboardAdmin;
