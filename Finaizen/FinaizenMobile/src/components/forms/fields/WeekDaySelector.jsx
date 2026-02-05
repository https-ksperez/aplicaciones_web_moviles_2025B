import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../../utils/constants';

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * WeekDaySelector - Selector de días de la semana
 * @param {array} selectedDays - Array de índices de días seleccionados (0-6)
 * @param {function} onToggle - Callback cuando se selecciona/deselecciona un día
 * @param {string} error - Mensaje de error (opcional)
 * @param {string} label - Etiqueta del selector (por defecto "Días de la semana")
 */
export default function WeekDaySelector({ 
  selectedDays = [], 
  onToggle, 
  error,
  label = "Días de la semana"
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.daysRow}>
        {DIAS_SEMANA.map((dia, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.dayBtn,
              selectedDays.includes(idx) && styles.dayBtnActive
            ]}
            onPress={() => onToggle(idx)}
          >
            <Text style={[
              styles.dayText,
              selectedDays.includes(idx) && styles.dayTextActive
            ]}>
              {dia}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
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
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayBtnActive: {
    backgroundColor: COLORS.primary,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  dayTextActive: {
    color: '#fff',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 6,
  },
});
