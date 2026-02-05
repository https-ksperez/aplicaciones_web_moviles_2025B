import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { COLORS } from '../../../utils/constants';

/**
 * NotificationSwitch - Switch para activar/desactivar notificaciones
 * @param {boolean} value - Estado del switch
 * @param {function} onValueChange - Callback cuando cambia el estado
 * @param {string} label - Etiqueta principal (por defecto "🔔 Notificación")
 * @param {string} subLabel - Etiqueta secundaria (por defecto "Recibir recordatorio")
 */
export default function NotificationSwitch({ 
  value, 
  onValueChange, 
  label = "🔔 Notificación",
  subLabel = "Recibir recordatorio"
}) {
  return (
    <View style={styles.container}>
      <View style={styles.switchRow}>
        <View>
          <Text style={styles.switchLabel}>{label}</Text>
          <Text style={styles.switchSubLabel}>{subLabel}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#e5e7eb', true: COLORS.primary + '60' }}
          thumbColor={value ? COLORS.primary : '#9ca3af'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  switchSubLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
});
