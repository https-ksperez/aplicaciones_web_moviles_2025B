import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Card from '../ui/Card';
import { COLORS } from '../../utils/constants';

const MESES = [
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

/**
 * FilterPanel - Panel de filtros para historial
 * @param {object} filters - Objeto con valores de filtros { tipo, mes, anio }
 * @param {function} onFilterChange - Callback cuando cambia un filtro
 * @param {function} onClearFilters - Callback para limpiar todos los filtros
 */
export default function FilterPanel({ filters, onFilterChange, onClearFilters }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Filtros</Text>
      
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
              onPress={() => onFilterChange('tipo', tipo)}
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
            onValueChange={(value) => onFilterChange('mes', value)}
            style={styles.picker}
          >
            {MESES.map(mes => (
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
            onValueChange={(value) => onFilterChange('anio', value)}
            style={styles.picker}
          >
            <Picker.Item label="Todos los años" value="todos" />
            {years.map(year => (
              <Picker.Item key={year} label={year.toString()} value={year.toString()} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Botón limpiar filtros */}
      <TouchableOpacity style={styles.clearButton} onPress={onClearFilters}>
        <Text style={styles.clearButtonText}>🔄 Limpiar filtros</Text>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  filterRow: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  picker: {
    height: 50,
  },
  clearButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
});
