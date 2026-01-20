import { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import Card from '../../components/ui/Card';
import { HistorialItem } from '../../components/historial';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';
import { COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

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
        const response = await apiService.historial.getAll(currentPerfil.id);
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
    Alert.alert('Editar', `Editar registro: ${registro.descripcion}`);
    // TODO: Navegar a pantalla de edición
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
                await apiService.historial.delete(currentPerfil.id, registro.id);
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

  // Meses para el filtro
  const meses = [
    { value: 'todos', label: 'Todos los meses' },
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  // Años para el filtro
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const renderItem = ({ item }) => (
    <HistorialItem
      registro={item}
      simboloMoneda={currentPerfil?.simboloMoneda || '$'}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyText}>No se encontraron transacciones</Text>
      <Text style={styles.emptySubtext}>
        {filters.tipo !== 'todos' || filters.mes !== 'todos' || filters.searchTerm
          ? 'Intenta ajustar los filtros'
          : 'Las transacciones ejecutadas aparecerán aquí'}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar por descripción o categoría..."
          value={filters.searchTerm}
          onChangeText={(text) => handleFilterChange('searchTerm', text)}
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity 
          style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterToggleText}>
            {showFilters ? '✕' : '⚙️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtros expandibles */}
      {showFilters && (
        <Card style={styles.filtersCard}>
          <Text style={styles.filtersTitle}>Filtros</Text>
          
          {/* Filtro por tipo */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Tipo:</Text>
            <View style={styles.filterButtons}>
              {['todos', 'ingreso', 'egreso'].map(tipo => (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    styles.filterButton,
                    filters.tipo === tipo && styles.filterButtonActive
                  ]}
                  onPress={() => handleFilterChange('tipo', tipo)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    filters.tipo === tipo && styles.filterButtonTextActive
                  ]}>
                    {tipo === 'todos' ? 'Todos' : tipo === 'ingreso' ? '💰 Ingresos' : '💸 Egresos'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Filtro por mes */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Mes:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.mes}
                onValueChange={(value) => handleFilterChange('mes', value)}
                style={styles.picker}
              >
                {meses.map(mes => (
                  <Picker.Item key={mes.value} label={mes.label} value={mes.value} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Filtro por año */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Año:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.anio}
                onValueChange={(value) => handleFilterChange('anio', value)}
                style={styles.picker}
              >
                {years.map(year => (
                  <Picker.Item key={year} label={year.toString()} value={year} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Botón limpiar filtros */}
          <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
            <Text style={styles.clearButtonText}>🔄 Limpiar filtros</Text>
          </TouchableOpacity>
        </Card>
      )}

      {/* Tarjetas de estadísticas */}
      <View style={styles.statsContainer}>
        <Card style={[styles.statCard, styles.ingresoCard]}>
          <Text style={styles.statLabel}>Ingresos</Text>
          <Text style={[styles.statValue, styles.ingresoValue]}>
            +${formatCurrency(stats.totalIngresos, false)}
          </Text>
        </Card>
        
        <Card style={[styles.statCard, styles.egresoCard]}>
          <Text style={styles.statLabel}>Egresos</Text>
          <Text style={[styles.statValue, styles.egresoValue]}>
            -${formatCurrency(stats.totalEgresos, false)}
          </Text>
        </Card>
        
        <Card style={[styles.statCard, stats.balance >= 0 ? styles.balancePositive : styles.balanceNegative]}>
          <Text style={styles.statLabel}>Balance</Text>
          <Text style={[styles.statValue, stats.balance >= 0 ? styles.ingresoValue : styles.egresoValue]}>
            {stats.balance >= 0 ? '+' : ''}${formatCurrency(stats.balance, false)}
          </Text>
        </Card>
      </View>

      {/* Contador de resultados */}
      <Text style={styles.resultsCount}>
        {filteredHistorial.length} {filteredHistorial.length === 1 ? 'transacción' : 'transacciones'}
      </Text>
    </>
  );

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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterToggle: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterToggleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterToggleText: {
    fontSize: 18,
  },
  filtersCard: {
    marginBottom: 12,
    padding: 16,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 13,
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  clearButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearButtonText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  ingresoCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
  },
  egresoCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.danger,
  },
  balancePositive: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  balanceNegative: {
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  ingresoValue: {
    color: COLORS.success,
  },
  egresoValue: {
    color: COLORS.danger,
  },
  resultsCount: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 10,
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
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
