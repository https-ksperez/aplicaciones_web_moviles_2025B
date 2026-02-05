import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../../utils/constants';

/**
 * CategorySelector - Selector horizontal de categorías
 * @param {string} value - Categoría seleccionada
 * @param {function} onChange - Callback cuando cambia la categoría
 * @param {array} categories - Array de categorías disponibles
 * @param {string} label - Etiqueta del selector (por defecto "Categoría")
 */
export default function CategorySelector({ 
  value, 
  onChange, 
  categories = [], 
  label = "Categoría" 
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.categoriesRow}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                value === category && styles.categoryChipActive
              ]}
              onPress={() => onChange(category)}
            >
              <Text style={[
                styles.categoryText,
                value === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    color: '#6b7280',
  },
  categoryTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
