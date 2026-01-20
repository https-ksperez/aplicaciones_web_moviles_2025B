import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/helpers';

/**
 * HistorialItem - Componente para mostrar un registro del historial
 * Muestra: fecha, tipo, descripción, categoría, monto y acciones
 */
export default function HistorialItem({ 
  registro, 
  simboloMoneda = '$',
  onEdit,
  onDelete 
}) {
  const esIngreso = registro.tipo === 'ingreso';
  
  return (
    <View style={styles.container}>
      {/* Indicador de tipo */}
      <View style={[styles.tipoIndicator, esIngreso ? styles.ingresoIndicator : styles.egresoIndicator]} />
      
      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Fila superior: Descripción y Monto */}
        <View style={styles.topRow}>
          <View style={styles.infoContainer}>
            <Text style={styles.descripcion} numberOfLines={1}>
              {registro.descripcion}
            </Text>
            <View style={styles.metaRow}>
              <View style={[styles.tipoBadge, esIngreso ? styles.ingresoBadge : styles.egresoBadge]}>
                <Text style={styles.tipoBadgeText}>
                  {esIngreso ? '💰 Ingreso' : '💸 Egreso'}
                </Text>
              </View>
              <Text style={styles.categoria}>
                🏷️ {registro.categoria}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.monto, esIngreso ? styles.montoIngreso : styles.montoEgreso]}>
            {esIngreso ? '+' : '-'}{simboloMoneda}{formatCurrency(registro.monto, false)}
          </Text>
        </View>
        
        {/* Fila inferior: Fecha y Acciones */}
        <View style={styles.bottomRow}>
          <Text style={styles.fecha}>
            📅 {formatDate(registro.fechaEjecucion)}
          </Text>
          
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => onEdit(registro)}
              >
                <Text style={styles.actionIcon}>✏️</Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => onDelete(registro)}
              >
                <Text style={styles.actionIcon}>🗑️</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  tipoIndicator: {
    width: 4,
  },
  ingresoIndicator: {
    backgroundColor: COLORS.success,
  },
  egresoIndicator: {
    backgroundColor: COLORS.danger,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  descripcion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  tipoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ingresoBadge: {
    backgroundColor: '#d1fae5',
  },
  egresoBadge: {
    backgroundColor: '#fee2e2',
  },
  tipoBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  categoria: {
    fontSize: 12,
    color: '#6b7280',
  },
  monto: {
    fontSize: 18,
    fontWeight: '700',
  },
  montoIngreso: {
    color: COLORS.success,
  },
  montoEgreso: {
    color: COLORS.danger,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8,
  },
  fecha: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  actionIcon: {
    fontSize: 14,
  },
});
