import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../../utils/constants';

const CLASSIFICATIONS = [
  { value: 'prioritario', label: '⭐ Prioritario' },
  { value: 'necesario', label: '✓ Necesario' },
  { value: 'prescindible', label: '○ Prescindible' },
];

/**
 * ClassificationSelector - Selector de clasificación de gastos
 * @param {string} value - Clasificación seleccionada
 * @param {function} onChange - Callback cuando cambia la clasificación
 * @param {string} label - Etiqueta del selector (por defecto "Clasificación")
 */
export default function ClassificationSelector({ 
  value, 
  onChange, 
  label = "Clasificación" 
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.classificationRow}>
        {CLASSIFICATIONS.map(cls => (
          <TouchableOpacity
            key={cls.value}
            style={[
              styles.classificationBtn,
              value === cls.value && styles.classificationBtnActive
            ]}
            onPress={() => onChange(cls.value)}
          >
            <Text style={[
              styles.classificationText,
              value === cls.value && styles.classificationTextActive
            ]}>
              {cls.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  classificationRow: {
    gap: 10,
  },
  classificationBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  classificationBtnActive: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  classificationText: {
    fontSize: 14,
    color: '#6b7280',
  },
  classificationTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
