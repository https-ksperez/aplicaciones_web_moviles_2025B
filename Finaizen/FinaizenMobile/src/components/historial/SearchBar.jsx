import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

/**
 * SearchBar - Barra de búsqueda con botón de filtros
 * @param {string} value - Valor de búsqueda
 * @param {function} onChangeText - Callback cuando cambia el texto
 * @param {boolean} showFilters - Estado de filtros visibles
 * @param {function} onToggleFilters - Callback para mostrar/ocultar filtros
 * @param {string} placeholder - Texto de placeholder
 */
export default function SearchBar({ 
  value, 
  onChangeText, 
  showFilters, 
  onToggleFilters,
  placeholder = "🔍 Buscar..."
}) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#9ca3af"
      />
      <TouchableOpacity 
        style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
        onPress={onToggleFilters}
      >
        <Text style={styles.filterToggleText}>
          {showFilters ? '✕' : '⚙️'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterToggle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
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
    fontSize: 20,
  },
});
