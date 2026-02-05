import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * EmptyState - Estado vacío para cuando no hay transacciones
 * @param {boolean} hasFilters - Indica si hay filtros activos
 */
export default function EmptyState({ hasFilters = false }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📭</Text>
      <Text style={styles.text}>No se encontraron transacciones</Text>
      <Text style={styles.subtext}>
        {hasFilters
          ? 'Intenta ajustar los filtros'
          : 'Las transacciones ejecutadas aparecerán aquí'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
