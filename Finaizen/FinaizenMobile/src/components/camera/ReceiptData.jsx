import { View, Text, StyleSheet } from 'react-native';
import Card from '../ui/Card';
import { COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

/**
 * ReceiptData - Datos extraídos del recibo
 * @param {Object} props
 * @param {Object} props.data - Datos parseados {monto, descripcion, comercio, fecha}
 * @param {string} props.rawText - Texto raw extraído (opcional)
 */
export default function ReceiptData({ data, rawText }) {
  if (!data) return null;

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>📋 Datos Extraídos</Text>
      
      {data.monto > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Monto Total:</Text>
          <Text style={styles.amount}>
            ${formatCurrency(data.monto, false)}
          </Text>
        </View>
      )}
      
      {data.descripcion && (
        <View style={styles.row}>
          <Text style={styles.label}>Descripción:</Text>
          <Text style={styles.value}>{data.descripcion}</Text>
        </View>
      )}
      
      {data.comercio && (
        <View style={styles.row}>
          <Text style={styles.label}>Comercio:</Text>
          <Text style={styles.value}>{data.comercio}</Text>
        </View>
      )}
      
      {data.fecha && (
        <View style={styles.row}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>
            {data.fecha instanceof Date 
              ? data.fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
              : String(data.fecha)}
          </Text>
        </View>
      )}

      {data.monto === 0 && (
        <View style={styles.warning}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            No se detectó un monto claro. Intenta con una imagen más nítida.
          </Text>
        </View>
      )}

      {rawText && (
        <View style={styles.rawTextContainer}>
          <Text style={styles.rawTextLabel}>Texto detectado:</Text>
          <Text style={styles.rawText}>{rawText}</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
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
    paddingVertical: 10,
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
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.danger,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
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
  rawTextContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  rawTextLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 6,
  },
  rawText: {
    fontSize: 12,
    color: '#9ca3af',
    lineHeight: 18,
  },
});
