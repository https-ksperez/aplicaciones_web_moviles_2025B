import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../../utils/constants';

/**
 * MonthDaySelector - Selector de día del mes
 * @param {number} selectedDay - Día seleccionado (1-31)
 * @param {function} onChange - Callback cuando cambia el día
 * @param {string} label - Etiqueta del selector (por defecto "Día del mes")
 */
export default function MonthDaySelector({ 
  selectedDay, 
  onChange, 
  label = "Día del mes" 
}) {
  const diasMes = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.monthDaysRow}>
          {diasMes.map(dia => (
            <TouchableOpacity
              key={dia}
              style={[
                styles.monthDayBtn,
                selectedDay === dia && styles.monthDayBtnActive
              ]}
              onPress={() => onChange(dia)}
            >
              <Text style={[
                styles.monthDayText,
                selectedDay === dia && styles.monthDayTextActive
              ]}>
                {dia}
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
  monthDaysRow: {
    flexDirection: 'row',
    gap: 8,
  },
  monthDayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthDayBtnActive: {
    backgroundColor: COLORS.primary,
  },
  monthDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  monthDayTextActive: {
    color: '#fff',
  },
});
