import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import SupervisionKPIs from '../../../components/supervision/SupervisionKPIs';
import AITestField from '../../../components/supervision/AITestField';
import SupervisionCharts from '../../../components/supervision/SupervisionCharts';
import SupervisionFilters from '../../../components/supervision/SupervisionFilters';
import SupervisionTable from '../../../components/supervision/SupervisionTable';
import CorrectionModal from '../../../components/supervision/CorrectionModal';
import apiService from '../../../services/apiService';
import styles from './SupervisionCategorias.module.css';

function SupervisionCategorias() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Estados
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [kpiData, setKpiData] = useState({ precision: 0, corrections: 0, problematicCategories: [] });
  const [chartData, setChartData] = useState({ confidence: [], corrections: [] });
  const [categories, setCategories] = useState([]);
  
  // Filtros
  const [confidenceFilter, setConfidenceFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Proteger ruta
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
        const [transactionsRes, kpisRes] = await Promise.all([
          apiService.supervision.getAll(),
          apiService.supervision.getKPIs()
        ]);
        
        setTransactions(transactionsRes.data || []);
        setKpiData(kpisRes.data?.kpis || { precision: 0, corrections: 0, problematicCategories: [] });
        setChartData(kpisRes.data?.charts || { confidence: [], corrections: [] });
        setCategories(kpisRes.data?.categories || [
          'Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 
          'Servicios', 'Educación', 'Hogar', 'Otros'
        ]);
      } catch (error) {
        console.error('Error al cargar datos de supervisión:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && isAdmin) {
      loadData();
    }
  }, [currentUser, isAdmin]);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...transactions];

    // Filtrar por confianza
    if (confidenceFilter !== 'todos') {
      filtered = filtered.filter(t => t.confianza === confidenceFilter || t.confidence === confidenceFilter);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        (t.descripcion || t.desc || '').toLowerCase().includes(term) ||
        (t.palabraClave || t.keyword || '').toLowerCase().includes(term)
      );
    }

    setFilteredTransactions(filtered);
  }, [confidenceFilter, searchTerm, transactions]);

  // Handlers
  const handleValidate = async (transactionId) => {
    try {
      await apiService.supervision.validate(transactionId);
      setTransactions(prev => prev.map(t =>
        t.id === transactionId ? { ...t, estado: 'Validado', status: 'Validado' } : t
      ));
    } catch (error) {
      console.error('Error al validar:', error);
    }
  };

  const handleCorrect = (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    setSelectedTransaction(transaction);
    setCorrectionModalOpen(true);
  };

  const handleSaveCorrection = async (transactionId, formData) => {
    try {
      await apiService.supervision.correct(transactionId, formData);
      setTransactions(prev => prev.map(t =>
        t.id === transactionId
          ? { ...t, palabraClave: formData.keyword, categoriaDetectada: formData.category, estado: 'Validado', keyword: formData.keyword, category: formData.category, status: 'Validado' }
          : t
      ));
      
      if (formData.createRule) {
        await apiService.supervision.createRule({ 
          palabraClave: formData.keyword, 
          categoria: formData.category 
        });
        alert(`Regla creada: "${formData.keyword}" → "${formData.category}"`);
      }
    } catch (error) {
      console.error('Error al corregir:', error);
    }
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
        <h1>Supervisión de Categorías</h1>

        {loading ? (
          <div className={styles.loading}>
            <p>Cargando datos de supervisión...</p>
          </div>
        ) : (
          <>
            <SupervisionKPIs
              precision={kpiData.precision}
              corrections={kpiData.corrections}
              problematicCategories={kpiData.problematicCategories}
            />

            <AITestField />

            <SupervisionCharts
              confidenceData={chartData.confidence}
              correctionsData={chartData.corrections}
              isCollapsed={isCollapsed}
            />

            <section className={styles.tableSection}>
              <SupervisionFilters
                onConfidenceFilter={setConfidenceFilter}
                onSearch={setSearchTerm}
              />

              <SupervisionTable
                transactions={filteredTransactions}
                onValidate={handleValidate}
                onCorrect={handleCorrect}
              />
            </section>

            <CorrectionModal
              isOpen={correctionModalOpen}
              onClose={() => setCorrectionModalOpen(false)}
              transaction={selectedTransaction}
              categories={categories}
              onSave={handleSaveCorrection}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default SupervisionCategorias;
