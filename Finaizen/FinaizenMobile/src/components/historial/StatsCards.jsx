import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../ui/Card';
import { COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

/**
 * StatsCards - Tarjetas de estadísticas (Ingresos, Egresos, Balance)
 * @param {number} ingresos - Total de ingresos
 * @param {number} egresos - Total de egresos
 * @param {number} balance - Balance (ingresos - egresos)
 */
export default function StatsCards({ ingresos = 0, egresos = 0, balance = 0 }) {
  return (
    <View style={styles.container}>
      <Card style={[styles.statCard, styles.ingresoCard]}>
        <Text style={styles.statLabel}>Ingresos</Text>
        <Text style={[styles.statValue, styles.ingresoValue]}>
          +${formatCurrency(ingresos, false)}
        </Text>
      </Card>
      
      <Card style={[styles.statCard, styles.egresoCard]}>
        <Text style={styles.statLabel}>Egresos</Text>
        <Text style={[styles.statValue, styles.egresoValue]}>
          -${formatCurrency(egresos, false)}
        </Text>
      </Card>
      
      <Card style={[styles.statCard, styles.balanceCard]}>
        <Text style={styles.statLabel}>Balance</Text>
        <Text style={[
          styles.statValue, 
          balance >= 0 ? styles.balancePositive : styles.balanceNegative
        ]}>
          ${formatCurrency(balance, false)}
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  ingresoCard: {
    backgroundColor: '#d1fae5',
  },
  egresoCard: {
    backgroundColor: '#fee2e2',
  },
  balanceCard: {
    backgroundColor: '#dbeafe',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  ingresoValue: {
    color: COLORS.success,
  },
  egresoValue: {
    color: COLORS.danger,
  },
  balancePositive: {
    color: COLORS.success,
  },
  balanceNegative: {
    color: COLORS.danger,
  },
});
