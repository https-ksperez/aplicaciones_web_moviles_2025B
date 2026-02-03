import { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';
import { COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

/**
 * AdministrarRegistrosScreen - Pantalla para administrar ingresos/egresos programados
 */
export default function AdministrarRegistrosScreen({ navigation }) {
  const { currentPerfil, isDemoMode } = useAuth();
  
  // Estados
  const [registros, setRegistros] = useState({ ingresos: [], egresos: [] });
  const [activeTab, setActiveTab] = useState('ingresos');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Datos demo
  const demoRegistros = {
    ingresos: [
      { id: 1, descripcion: 'Salario Mensual', monto: 1500, categoria: 'Salario', frecuencia: 'mensual', diaMes: 1, activo: true },
      { id: 2, descripcion: 'Freelance Web', monto: 300, categoria: 'Freelance', frecuencia: 'ocasional', activo: true },
      { id: 3, descripcion: 'Alquiler Departamento', monto: 200, categoria: 'Alquiler', frecuencia: 'mensual', diaMes: 5, activo: true },
    ],
    egresos: [
      { id: 1, descripcion: 'Alquiler', monto: 300, categoria: 'Vivienda', frecuencia: 'mensual', diaMes: 1, activo: true },
      { id: 2, descripcion: 'Internet', monto: 30, categoria: 'Servicios', frecuencia: 'mensual', diaMes: 10, activo: true },
      { id: 3, descripcion: 'Netflix', monto: 15, categoria: 'Suscripciones', frecuencia: 'mensual', diaMes: 15, activo: true },
      { id: 4, descripcion: 'Gimnasio', monto: 40, categoria: 'Salud', frecuencia: 'mensual', diaMes: 5, activo: false },
    ],
  };

  // Cargar registros
  const loadRegistros = useCallback(async () => {
    try {
      setLoading(true);
      
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setRegistros(demoRegistros);
      } else {
        const perfilId = currentPerfil?.id || currentPerfil?._id;
        const [ingresos, egresos] = await Promise.all([
          apiService.ingresos.getAll(perfilId),
          apiService.egresos.getAll(perfilId)
        ]);
        setRegistros({ ingresos: ingresos || [], egresos: egresos || [] });
      }
    } catch (error) {
      console.error('Error al cargar registros:', error);
      Alert.alert('Error', 'No se pudieron cargar los registros');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPerfil, isDemoMode]);

  useEffect(() => {
    loadRegistros();
  }, [loadRegistros]);

  // Handlers
  const handleRefresh = () => {
    setRefreshing(true);
    loadRegistros();
  };

  const handleToggleActivo = async (registro, tipo) => {
    try {
      if (!isDemoMode) {
        const api = tipo === 'ingresos' ? apiService.ingresos : apiService.egresos;
        const perfilId = currentPerfil?.id || currentPerfil?._id;
        const registroId = registro?.id || registro?._id;
        await api.update(perfilId, registroId, { activo: !registro.activo });
      }
      
      setRegistros(prev => ({
        ...prev,
        [tipo]: prev[tipo].map(r => 
          r.id === registro.id ? { ...r, activo: !r.activo } : r
        )
      }));
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el registro');
    }
  };

  const handleDelete = (registro, tipo) => {
    Alert.alert(
      'Eliminar Registro',
      `¿Eliminar "${registro.descripcion}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!isDemoMode) {
                const api = tipo === 'ingresos' ? apiService.ingresos : apiService.egresos;
                const perfilId = currentPerfil?.id || currentPerfil?._id;
                const registroId = registro?.id || registro?._id;
                await api.delete(perfilId, registroId);
              }
              setRegistros(prev => ({
                ...prev,
                [tipo]: prev[tipo].filter(r => r.id !== registro.id)
              }));
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (registro, tipo) => {
    Alert.alert('Editar', `Editar ${tipo.slice(0, -1)}: ${registro.descripcion}`);
  };

  const handleAddNew = () => {
    Alert.alert('Nuevo', `Crear nuevo ${activeTab.slice(0, -1)}`);
  };

  // Formatear frecuencia
  const formatFrecuencia = (registro) => {
    switch (registro.frecuencia) {
      case 'diario':
        return 'Diario';
      case 'semanal':
        return 'Semanal';
      case 'mensual':
        return `Día ${registro.diaMes || 1} de cada mes`;
      case 'anual':
        return 'Anual';
      case 'ocasional':
        return 'Una vez';
      default:
        return registro.frecuencia;
    }
  };

  // Calcular totales
  const totalIngresos = registros.ingresos
    .filter(r => r.activo)
    .reduce((sum, r) => sum + parseFloat(r.monto || 0), 0);
  
  const totalEgresos = registros.egresos
    .filter(r => r.activo)
    .reduce((sum, r) => sum + parseFloat(r.monto || 0), 0);

  const renderItem = ({ item }) => {
    const isIngreso = activeTab === 'ingresos';
    
    return (
      <Card style={[styles.itemCard, !item.activo && styles.itemCardInactive]}>
        <View style={styles.itemHeader}>
          <View style={styles.itemTitleRow}>
            <View style={[
              styles.typeIndicator,
              { backgroundColor: isIngreso ? COLORS.success + '20' : COLORS.danger + '20' }
            ]}>
              <Text style={styles.typeEmoji}>{isIngreso ? '💰' : '💸'}</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemTitle, !item.activo && styles.textInactive]}>
                {item.descripcion}
              </Text>
              <Text style={styles.itemCategory}>{item.categoria}</Text>
            </View>
          </View>
          <View style={styles.itemAmountContainer}>
            <Text style={[
              styles.itemAmount,
              { color: isIngreso ? COLORS.success : COLORS.danger },
              !item.activo && styles.textInactive
            ]}>
              {isIngreso ? '+' : '-'}${formatCurrency(item.monto, false)}
            </Text>
          </View>
        </View>

        <View style={styles.itemDetails}>
          <View style={styles.frecuenciaContainer}>
            <Text style={styles.frecuenciaIcon}>🔄</Text>
            <Text style={styles.frecuenciaText}>{formatFrecuencia(item)}</Text>
          </View>
          
          <View style={styles.itemActions}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Activo</Text>
              <Switch
                value={Boolean(item.activo)}
                onValueChange={() => handleToggleActivo(item, activeTab)}
                trackColor={{ false: '#e5e7eb', true: COLORS.primary + '60' }}
                thumbColor={item.activo ? COLORS.primary : '#9ca3af'}
              />
            </View>
          </View>
        </View>

        <View style={styles.itemFooter}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => handleEdit(item, activeTab)}
          >
            <Text style={styles.actionBtnText}>✏️ Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => handleDelete(item, activeTab)}
          >
            <Text style={[styles.actionBtnText, styles.deleteBtnText]}>🗑️ Eliminar</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>
        {activeTab === 'ingresos' ? '💰' : '💸'}
      </Text>
      <Text style={styles.emptyText}>
        No hay {activeTab} programados
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleAddNew}>
        <Text style={styles.emptyButtonText}>+ Agregar {activeTab.slice(0, -1)}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ingresos' && styles.tabActiveIngreso]}
          onPress={() => setActiveTab('ingresos')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'ingresos' && styles.tabTextActiveIngreso
          ]}>
            💰 Ingresos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'egresos' && styles.tabActiveEgreso]}
          onPress={() => setActiveTab('egresos')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'egresos' && styles.tabTextActiveEgreso
          ]}>
            💸 Egresos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Resumen */}
      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Ingresos Activos</Text>
            <Text style={[styles.summaryValue, { color: COLORS.success }]}>
              +${formatCurrency(totalIngresos, false)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Egresos Activos</Text>
            <Text style={[styles.summaryValue, { color: COLORS.danger }]}>
              -${formatCurrency(totalEgresos, false)}
            </Text>
          </View>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Balance Proyectado</Text>
          <Text style={[
            styles.balanceValue,
            { color: totalIngresos - totalEgresos >= 0 ? COLORS.success : COLORS.danger }
          ]}>
            ${formatCurrency(totalIngresos - totalEgresos, false)}
          </Text>
        </View>
      </Card>

      {/* Contador */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          {activeTab === 'ingresos' ? 'Ingresos' : 'Egresos'} programados
        </Text>
        <Text style={styles.listCount}>
          {registros[activeTab].length} {registros[activeTab].length === 1 ? 'registro' : 'registros'}
        </Text>
      </View>
    </>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando registros...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Administrar Registros</Text>
        <Text style={styles.subtitle}>
          Gestiona tus ingresos y egresos programados
        </Text>
      </View>

      <FlatList
        data={registros[activeTab]}
        renderItem={renderItem}
        keyExtractor={item => `${activeTab}-${item.id}`}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
      />

      {/* FAB para agregar */}
      <TouchableOpacity style={styles.fab} onPress={handleAddNew}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6b7280',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  listContent: {
    padding: 16,
    paddingTop: 10,
    paddingBottom: 100,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActiveIngreso: {
    backgroundColor: COLORS.success + '15',
  },
  tabActiveEgreso: {
    backgroundColor: COLORS.danger + '15',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabTextActiveIngreso: {
    color: COLORS.success,
    fontWeight: '700',
  },
  tabTextActiveEgreso: {
    color: COLORS.danger,
    fontWeight: '700',
  },
  summaryCard: {
    marginBottom: 16,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  listCount: {
    fontSize: 13,
    color: '#9ca3af',
  },
  itemCard: {
    marginBottom: 12,
    padding: 16,
  },
  itemCardInactive: {
    opacity: 0.7,
    backgroundColor: '#f9fafb',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIndicator: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeEmoji: {
    fontSize: 20,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 13,
    color: '#6b7280',
  },
  textInactive: {
    color: '#9ca3af',
  },
  itemAmountContainer: {
    marginLeft: 10,
  },
  itemAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  frecuenciaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frecuenciaIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  frecuenciaText: {
    fontSize: 13,
    color: '#6b7280',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginRight: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  deleteBtn: {
    backgroundColor: COLORS.danger + '15',
  },
  actionBtnText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  deleteBtnText: {
    color: COLORS.danger,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
    marginTop: -2,
  },
});
