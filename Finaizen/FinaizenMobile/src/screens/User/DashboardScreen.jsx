import { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext.jsx';
import apiService from '../../services/apiService';
import { COLORS } from '../../utils/constants';
import { BalanceCard, QuickActionsGrid, RecentTransactionsList } from '../../components/dashboard';

/**
 * DashboardScreen - Pantalla principal del usuario (Refactorizada)
 * Usa componentes reutilizables para mejorar mantenibilidad
 * Muestra resumen financiero, balance, y accesos rápidos
 */
export default function DashboardScreen({ navigation }) {
  const { currentUser, currentPerfil, isDemoMode, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Estado para datos del dashboard calculados desde el historial
  const [dashboardData, setDashboardData] = useState({
    balance: 0,
    ingresos: 0,
    egresos: 0,
  });

  // Estado para últimos movimientos (del historial real)
  const [ultimosMovimientos, setUltimosMovimientos] = useState([]);

  // Cargar datos del historial
  const loadDashboardData = useCallback(async () => {
    if (!currentPerfil?.id) return;
    
    try {
      let historial = [];
      
      if (isDemoMode) {
        // Datos demo
        historial = [
          { id: 1, tipo: 'ingreso', descripcion: 'Salario Mensual', monto: 1500, categoria: 'Salario', fechaEjecucion: '2026-01-05' },
          { id: 2, tipo: 'egreso', descripcion: 'Alquiler', monto: 300, categoria: 'Vivienda', fechaEjecucion: '2026-01-01' },
          { id: 3, tipo: 'egreso', descripcion: 'Supermercado', monto: 150, categoria: 'Alimentación', fechaEjecucion: '2026-01-08' },
          { id: 4, tipo: 'ingreso', descripcion: 'Freelance', monto: 300, categoria: 'Freelance', fechaEjecucion: '2026-01-15' },
        ];
      } else {
        // Obtener historial real de la API
        const perfilId = currentPerfil?.id || currentPerfil?._id;
        const response = await apiService.historial.getAll(perfilId);
        historial = Array.isArray(response) ? response : [];
      }

      // Calcular totales del mes actual
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      
      const historialMesActual = historial.filter(h => {
        const fecha = new Date(h.fechaEjecucion);
        return fecha.getMonth() + 1 === currentMonth && fecha.getFullYear() === currentYear;
      });

      const ingresos = historialMesActual
        .filter(h => h.tipo === 'ingreso')
        .reduce((sum, h) => sum + parseFloat(h.monto || 0), 0);
      
      const egresos = historialMesActual
        .filter(h => h.tipo === 'egreso')
        .reduce((sum, h) => sum + parseFloat(h.monto || 0), 0);

      setDashboardData({
        balance: ingresos - egresos,
        ingresos,
        egresos,
      });

      // Ordenar por fecha y tomar los últimos 5
      const sortedHistorial = [...historial].sort((a, b) => 
        new Date(b.fechaEjecucion) - new Date(a.fechaEjecucion)
      );
      
      setUltimosMovimientos(sortedHistorial.slice(0, 5));
      
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPerfil, isDemoMode]);

  // Cargar al montar y cuando cambie el perfil
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Recargar al hacer focus en la pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDashboardData();
    });
    return unsubscribe;
  }, [navigation, loadDashboardData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Definir acciones rápidas
  const quickActions = [
    {
      icon: '💵',
      label: 'Ingreso',
      color: COLORS.success,
      onPress: () => navigation.navigate('NuevoIngreso')
    },
    {
      icon: '💸',
      label: 'Egreso',
      color: COLORS.danger,
      onPress: () => navigation.navigate('NuevoEgreso')
    },
    {
      icon: '📋',
      label: 'Historial',
      color: '#6366f1',
      onPress: () => navigation.navigate('Historial')
    },
    {
      icon: '⚙️',
      label: 'Gestionar',
      color: '#8b5cf6',
      onPress: () => navigation.navigate('AdministrarRegistros')
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hola, {currentUser?.nombre || 'Usuario'} 👋
            </Text>
            <Text style={styles.subGreeting}>
              {currentPerfil?.nombre || 'Personal'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationBtn}
            onPress={() => navigation.navigate('Notificaciones')}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Componente de Balance */}
        <BalanceCard
          balance={dashboardData.balance}
          ingresos={dashboardData.ingresos}
          egresos={dashboardData.egresos}
        />

        {/* Componente de Acciones Rápidas */}
        <QuickActionsGrid actions={quickActions} />

        {/* Componente de Transacciones Recientes */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Cargando movimientos...</Text>
          </View>
        ) : (
          <RecentTransactionsList
            transactions={ultimosMovimientos}
            onViewAll={() => navigation.navigate('Historial')}
          />
        )}

        {/* Botón de cerrar sesión */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subGreeting: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationIcon: {
    fontSize: 20,
  },
  balanceCard: {
    backgroundColor: '#0f766e',
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
  },
  balanceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  balanceItemIcon: {
    fontSize: 24,
  },
  balanceItemLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  balanceItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  egresoValue: {
    color: '#fca5a5',
  },
  balanceDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionBtn: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingresoIcon: {
    backgroundColor: '#d1fae5',
  },
  egresoIcon: {
    backgroundColor: '#fee2e2',
  },
  historialIcon: {
    backgroundColor: '#dbeafe',
  },
  adminIcon: {
    backgroundColor: '#f3e8ff',
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  movimientosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verTodo: {
    fontSize: 14,
    color: '#007A7A',
    fontWeight: '600',
  },
  movimientosCard: {
    padding: 16,
    marginBottom: 24,
  },
  movimientoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  movimientoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  movimientoCategoria: {
    fontSize: 28,
  },
  movimientoDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  movimientoFecha: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  movimientoMonto: {
    fontSize: 14,
    fontWeight: '700',
  },
  montoIngreso: {
    color: '#059669',
  },
  montoEgreso: {
    color: '#dc2626',
  },
  movimientoDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  logoutBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
});
