import { View, Text, StyleSheet } from 'react-native';
import Card from '../ui/Card';
import { COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

/**
 * SummaryCard - Tarjeta con resumen de totales
 * @param {Object} props
 * @param {number} props.totalIngresos - Total de ingresos activos
 * @param {number} props.totalEgresos - Total de egresos activos
 */
export default function SummaryCard({ totalIngresos, totalEgresos }) {
  const balance = totalIngresos - totalEgresos;

  return (
    <Card style={styles.container}>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Total Ingresos Activos</Text>
          <Text style={[styles.value, { color: COLORS.success }]}>
            +${formatCurrency(totalIngresos, false)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.item}>
          <Text style={styles.label}>Total Egresos Activos</Text>
          <Text style={[styles.value, { color: COLORS.danger }]}>
            -${formatCurrency(totalEgresos, false)}
          </Text>
        </View>
      </View>
      <View style={styles.balanceRow}>
        <Text style={styles.balanceLabel}>Balance Proyectado</Text>
        <Text style={[
          styles.balanceValue,
          { color: balance >= 0 ? COLORS.success : COLORS.danger }
        ]}>
          ${formatCurrency(balance, false)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  item: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 12,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: '700',
  },
});
