import { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { 
  HistorialItem, 
  SearchBar, 
  FilterPanel, 
  StatsCards, 
  EmptyState 
} from '../../components/historial';
import { useAuth } from '../../context/AuthContext.jsx';
import apiService from '../../services/apiService';
import { COLORS } from '../../utils/constants';

/**
 * HistorialScreen - Pantalla de Historial de Transacciones
 * Muestra todas las transacciones ejecutadas con filtros y paginación
 */
export default function HistorialScreen({ navigation }) {
  const { currentPerfil, isDemoMode } = useAuth();
  
  // Estados
  const [historial, setHistorial] = useState([]);
  const [filteredHistorial, setFilteredHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estados de filtros
  const [filters, setFilters] = useState({
    tipo: 'todos',
    mes: 'todos',
    anio: 'todos',
    searchTerm: ''
  });

  // Estado para mostrar/ocultar filtros
  const [showFilters, setShowFilters] = useState(false);

  // Datos demo
  const demoHistorial = [
    { id: 1, tipo: 'ingreso', descripcion: 'Salario Mensual', monto: 1500, categoria: 'Salario', fechaEjecucion: '2026-01-05', mes: 1, anio: 2026 },
    { id: 2, tipo: 'egreso', descripcion: 'Alquiler', monto: 300, categoria: 'Vivienda', fechaEjecucion: '2026-01-01', mes: 1, anio: 2026 },
    { id: 3, tipo: 'egreso', descripcion: 'Supermercado', monto: 150, categoria: 'Alimentación', fechaEjecucion: '2026-01-08', mes: 1, anio: 2026 },
    { id: 4, tipo: 'egreso', descripcion: 'Luz y Agua', monto: 80, categoria: 'Servicios', fechaEjecucion: '2026-01-10', mes: 1, anio: 2026 },
    { id: 5, tipo: 'ingreso', descripcion: 'Freelance', monto: 300, categoria: 'Freelance', fechaEjecucion: '2026-01-15', mes: 1, anio: 2026 },
    { id: 6, tipo: 'egreso', descripcion: 'Internet', monto: 30, categoria: 'Servicios', fechaEjecucion: '2026-01-05', mes: 1, anio: 2026 },
    { id: 7, tipo: 'egreso', descripcion: 'Cena con amigos', monto: 50, categoria: 'Entretenimiento', fechaEjecucion: '2026-01-12', mes: 1, anio: 2026 },
    { id: 8, tipo: 'ingreso', descripcion: 'Bono', monto: 100, categoria: 'Bonos', fechaEjecucion: '2025-12-20', mes: 12, anio: 2025 },
  ];

  // Cargar historial
  const loadHistorial = useCallback(async () => {
    try {
      setLoading(true);
      
      let registros;
      if (isDemoMode) {
        // Modo demo: usar datos de prueba
        await new Promise(resolve => setTimeout(resolve, 500));
        registros = demoHistorial;
      } else {
        // Modo real: obtener del backend
        // Usar id o _id como fallback para compatibilidad con MongoDB
        const perfilId = currentPerfil?.id || currentPerfil?._id;
        console.log('🔍 Perfil actual:', JSON.stringify(currentPerfil, null, 2));
        console.log('🔑 Perfil ID para historial:', perfilId);
        
        if (!perfilId) {
          console.error('❌ No se encontró ID del perfil');
          throw new Error('No se pudo obtener el ID del perfil');
        }
        
        const response = await apiService.historial.getAll(perfilId);
        console.log('📦 Respuesta historial:', response);
        
        // Asegurar que sea un array
        registros = Array.isArray(response) ? response : [];
      }

      // Ordenar por fecha más reciente
      if (registros.length > 0) {
        registros.sort((a, b) => 
          new Date(b.fechaEjecucion) - new Date(a.fechaEjecucion)
        );
      }

      console.log('📊 Total registros:', registros.length);
      setHistorial(registros);
      setFilteredHistorial(registros);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      Alert.alert('Error', 'No se pudo cargar el historial: ' + error.message);
      setHistorial([]);
      setFilteredHistorial([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPerfil, isDemoMode]);

  useEffect(() => {
    loadHistorial();
  }, [loadHistorial]);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    let result = [...historial];

    // Filtro por tipo
    if (filters.tipo !== 'todos') {
      result = result.filter(reg => reg.tipo === filters.tipo);
    }

    // Filtro por mes
    if (filters.mes !== 'todos') {
      result = result.filter(reg => reg.mes === parseInt(filters.mes));
    }

    // Filtro por año
    if (filters.anio !== 'todos') {
      result = result.filter(reg => reg.anio === parseInt(filters.anio));
    }

    // Filtro por búsqueda
    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(reg => 
        reg.descripcion.toLowerCase().includes(searchLower) ||
        reg.categoria.toLowerCase().includes(searchLower)
      );
    }

    setFilteredHistorial(result);
  }, [filters, historial]);

  // Calcular estadísticas
  const stats = {
    totalIngresos: filteredHistorial
      .filter(r => r.tipo === 'ingreso')
      .reduce((sum, r) => sum + parseFloat(r.monto || 0), 0),
    totalEgresos: filteredHistorial
      .filter(r => r.tipo === 'egreso')
      .reduce((sum, r) => sum + parseFloat(r.monto || 0), 0),
  };
  stats.balance = stats.totalIngresos - stats.totalEgresos;

  // Handlers
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      tipo: 'todos',
      mes: 'todos',
      anio: 'todos',
      searchTerm: ''
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadHistorial();
  };

  const handleEdit = (registro) => {
    navigation.navigate('EditarHistorial', { registro });
  };

  const handleDelete = (registro) => {
    Alert.alert(
      'Eliminar Registro',
      `¿Estás seguro de eliminar "${registro.descripcion}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (!isDemoMode) {
                const registroId = registro?.id || registro?._id;
                await apiService.historial.delete(registroId);
              }
              setHistorial(prev => prev.filter(r => r.id !== registro.id));
              Alert.alert('Éxito', 'Registro eliminado');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el registro');
            }
          }
        }
      ]
    );
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = filters.tipo !== 'todos' || 
                          filters.mes !== 'todos' || 
                          filters.anio !== 'todos' ||
                          filters.searchTerm.trim() !== '';

  const renderItem = ({ item }) => (
    <HistorialItem
      registro={item}
      simboloMoneda={currentPerfil?.simboloMoneda || '$'}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );

  const renderHeader = () => (
    <>
      {/* Componente de búsqueda */}
      <SearchBar
        value={filters.searchTerm}
        onChangeText={(text) => handleFilterChange('searchTerm', text)}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        placeholder="🔍 Buscar por descripción o categoría..."
      />

      {/* Panel de filtros */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Tarjetas de estadísticas */}
      <StatsCards
        ingresos={stats.totalIngresos}
        egresos={stats.totalEgresos}
        balance={stats.balance}
      />

      {/* Contador de resultados */}
      <Text style={styles.resultsCount}>
        {filteredHistorial.length} {filteredHistorial.length === 1 ? 'transacción' : 'transacciones'}
      </Text>
    </>
  );

  const renderEmpty = () => <EmptyState hasFilters={hasActiveFilters} />;

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando historial...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📋 Historial</Text>
        <Text style={styles.subtitle}>
          {currentPerfil?.nombre || 'Personal'}
        </Text>
      </View>

      <FlatList
        data={filteredHistorial}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
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
    fontSize: 28,
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
  },
  resultsCount: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 10,
  },
});
