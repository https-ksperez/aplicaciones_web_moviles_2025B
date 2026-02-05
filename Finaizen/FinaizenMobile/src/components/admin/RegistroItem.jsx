import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Card from '../ui/Card';
import { COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

/**
 * RegistroItem - Tarjeta de un registro (ingreso o egreso)
 * @param {Object} props
 * @param {Object} props.item - Registro
 * @param {boolean} props.isIngreso - Si es ingreso (true) o egreso (false)
 * @param {Function} props.onToggleActivo - Callback al cambiar switch
 * @param {Function} props.onEdit - Callback al editar
 * @param {Function} props.onDelete - Callback al eliminar
 * @param {Function} props.formatFrecuencia - Función para formatear frecuencia
 */
export default function RegistroItem({
  item,
  isIngreso,
  onToggleActivo,
  onEdit,
  onDelete,
  formatFrecuencia
}) {
  return (
    <Card style={[styles.container, !item.activo && styles.containerInactive]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[
            styles.typeIndicator,
            { backgroundColor: isIngreso ? COLORS.success + '20' : COLORS.danger + '20' }
          ]}>
            <Text style={styles.typeEmoji}>{isIngreso ? '💰' : '💸'}</Text>
          </View>
          <View style={styles.info}>
            <Text style={[styles.title, !item.activo && styles.textInactive]}>
              {item.descripcion}
            </Text>
            <Text style={styles.category}>{item.categoria}</Text>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[
            styles.amount,
            { color: isIngreso ? COLORS.success : COLORS.danger },
            !item.activo && styles.textInactive
          ]}>
            {isIngreso ? '+' : '-'}${formatCurrency(item.monto, false)}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.frecuenciaContainer}>
          <Text style={styles.frecuenciaIcon}>🔄</Text>
          <Text style={styles.frecuenciaText}>{formatFrecuencia(item)}</Text>
        </View>
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Activo</Text>
          <Switch
            value={Boolean(item.activo)}
            onValueChange={onToggleActivo}
            trackColor={{ false: '#e5e7eb', true: COLORS.primary + '60' }}
            thumbColor={item.activo ? COLORS.primary : '#9ca3af'}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
          <Text style={styles.actionBtnText}>✏️ Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={onDelete}
        >
          <Text style={[styles.actionBtnText, styles.deleteBtnText]}>🗑️ Eliminar</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    padding: 16,
  },
  containerInactive: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  typeIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeEmoji: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  category: {
    fontSize: 13,
    color: '#6b7280',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
  textInactive: {
    opacity: 0.5,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  frecuenciaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frecuenciaIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  frecuenciaText: {
    fontSize: 13,
    color: '#6b7280',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#fee2e2',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  deleteBtnText: {
    color: '#991b1b',
  },
});
