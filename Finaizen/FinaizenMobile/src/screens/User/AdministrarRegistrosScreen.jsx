import { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  TabSelector,
  SummaryCard,
  RegistroItem,
  EmptyRegistros
} from '../../components/admin';
import { useAuth } from '../../context/AuthContext.jsx';
import apiService from '../../services/apiService';
import { COLORS } from '../../utils/constants';

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

  const renderItem = ({ item }) => (
    <RegistroItem
      item={item}
      isIngreso={activeTab === 'ingresos'}
      onToggleActivo={() => handleToggleActivo(item, activeTab)}
      onEdit={() => handleEdit(item, activeTab)}
      onDelete={() => handleDelete(item, activeTab)}
      formatFrecuencia={formatFrecuencia}
    />
  );

  const renderEmpty = () => (
    <EmptyRegistros tipo={activeTab} onAdd={handleAddNew} />
  );

  const renderHeader = () => (
    <>
      <TabSelector
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <SummaryCard
        totalIngresos={totalIngresos}
        totalEgresos={totalEgresos}
      />

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
