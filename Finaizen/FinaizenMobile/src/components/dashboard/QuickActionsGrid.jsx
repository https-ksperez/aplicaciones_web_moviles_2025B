import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * QuickActionsGrid - Grid de acciones rápidas
 * @param {array} actions - Array de acciones { icon, label, onPress, color }
 */
export default function QuickActionsGrid({ actions = [] }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
      <View style={styles.grid}>
        {actions.map((action, index) => (
          <TouchableOpacity 
            key={index}
            style={[styles.actionButton, { backgroundColor: action.color || '#6366f1' }]}
            onPress={action.onPress}
          >
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
});
