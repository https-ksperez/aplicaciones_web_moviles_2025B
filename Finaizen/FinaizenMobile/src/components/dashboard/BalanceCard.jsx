import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../ui/Card';
import { COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

/**
 * BalanceCard - Tarjeta de balance principal del dashboard
 * @param {number} balance - Balance total
 * @param {number} ingresos - Total de ingresos
 * @param {number} egresos - Total de egresos
 */
export default function BalanceCard({ balance, ingresos, egresos }) {
  return (
    <Card style={styles.balanceCard}>
      <Text style={styles.balanceLabel}>Balance Total</Text>
      <Text style={[
        styles.balanceAmount, 
        { color: balance >= 0 ? COLORS.success : COLORS.danger }
      ]}>
        {formatCurrency(balance)}
      </Text>
      
      <View style={styles.balanceDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Ingresos</Text>
          <Text style={[styles.detailAmount, { color: COLORS.success }]}>
            +{formatCurrency(ingresos)}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Egresos</Text>
          <Text style={[styles.detailAmount, { color: COLORS.danger }]}>
            -{formatCurrency(egresos)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    marginBottom: 20,
    padding: 20,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  balanceLabel: {
    fontSize: 13,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  balanceDetails: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  detailLabel: {
    fontSize: 11,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 4,
  },
  detailAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
