import { View, Text, StyleSheet } from 'react-native';
import Card from '../ui/Card';
import { COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

/**
 * ParsedDataCard - Tarjeta con los datos detectados del texto/voz
 * @param {Object} props
 * @param {Object} props.data - Datos parseados {tipo, monto, descripcion, categoria}
 */
export default function ParsedDataCard({ data }) {
  if (!data) return null;

  return (
    <Card style={[
      styles.container,
      data.tipo === 'ingreso' ? styles.containerIngreso : styles.containerEgreso
    ]}>
      <Text style={styles.title}>📋 Datos Detectados</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Tipo:</Text>
        <Text style={[
          styles.value,
          { color: data.tipo === 'ingreso' ? COLORS.success : COLORS.danger }
        ]}>
          {data.tipo === 'ingreso' ? '💰 Ingreso' : '💸 Egreso'}
        </Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Monto:</Text>
        <Text style={[
          styles.valueBig,
          { color: data.monto > 0 ? '#111827' : COLORS.danger }
        ]}>
          {data.monto > 0 ? formatCurrency(data.monto) : 'No detectado'}
        </Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Descripción:</Text>
        <Text style={styles.value}>{data.descripcion}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Categoría:</Text>
        <Text style={styles.value}>{data.categoria}</Text>
      </View>

      {data.monto === 0 && (
        <View style={styles.warning}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            No se detectó un monto. Asegúrate de incluir una cantidad.
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  containerIngreso: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  containerEgreso: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  valueBig: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
  },
});
