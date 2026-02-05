import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../../utils/constants';

const DEFAULT_FREQUENCIES = [
  { value: 'ocasional', label: 'Una vez', icon: '📅' },
  { value: 'diario', label: 'Diario', icon: '🔄' },
  { value: 'semanal', label: 'Semanal', icon: '📆' },
  { value: 'mensual', label: 'Mensual', icon: '🗓️' },
  { value: 'anual', label: 'Anual', icon: '📊' },
];

/**
 * FrequencySelector - Selector de frecuencia de transacciones
 * @param {string} value - Frecuencia seleccionada
 * @param {function} onChange - Callback cuando cambia la frecuencia
 * @param {array} frequencies - Array de frecuencias (opcional, usa DEFAULT_FREQUENCIES si no se provee)
 * @param {string} label - Etiqueta del selector (por defecto "Frecuencia")
 */
export default function FrequencySelector({ 
  value, 
  onChange, 
  frequencies = DEFAULT_FREQUENCIES, 
  label = "Frecuencia" 
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.frequencyContainer}>
        {frequencies.map(freq => (
          <TouchableOpacity
            key={freq.value}
            style={[
              styles.frequencyBtn,
              value === freq.value && styles.frequencyBtnActive
            ]}
            onPress={() => onChange(freq.value)}
          >
            <Text style={styles.frequencyIcon}>{freq.icon}</Text>
            <Text style={[
              styles.frequencyText,
              value === freq.value && styles.frequencyTextActive
            ]}>
              {freq.label}
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
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  frequencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  frequencyBtnActive: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  frequencyIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  frequencyText: {
    fontSize: 14,
    color: '#6b7280',
  },
  frequencyTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
