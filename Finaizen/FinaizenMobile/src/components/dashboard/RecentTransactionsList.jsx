import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Card from '../ui/Card';
import { COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

// Mapeo de categorías a emojis
const CATEGORIA_EMOJI = {
  'Salario': '💰',
  'Freelance': '💻',
  'Bonos': '🎁',
  'Inversiones': '📈',
  'Ventas': '🛍️',
  'Regalos': '🎀',
  'Alimentación': '🍽️',
  'Transporte': '🚗',
  'Vivienda': '🏠',
  'Servicios': '📱',
  'Entretenimiento': '🎬',
  'Salud': '💊',
  'Educación': '📚',
  'Ropa': '👕',
  'Tecnología': '💻',
  'Marketing': '📣',
  'Otros': '📋',
};

/**
 * RecentTransactionsList - Lista de transacciones recientes
 * @param {array} transactions - Array de transacciones
 * @param {function} onViewAll - Callback para ver todas las transacciones
 */
export default function RecentTransactionsList({ transactions = [], onViewAll }) {
  const getCategoriaEmoji = (categoria) => {
    return CATEGORIA_EMOJI[categoria] || '📋';
  };

  const formatFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  if (transactions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Últimos Movimientos</Text>
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>No hay movimientos registrados</Text>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Últimos Movimientos</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAllLink}>Ver todos</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Card style={styles.listCard}>
        {transactions.map((item, index) => (
          <View key={item.id || index}>
            <View style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Text style={styles.emoji}>{getCategoriaEmoji(item.categoria)}</Text>
              </View>
              
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>{item.descripcion}</Text>
                <Text style={styles.transactionCategory}>{item.categoria} • {formatFecha(item.fechaEjecucion)}</Text>
              </View>
              
              <Text style={[
                styles.transactionAmount,
                { color: item.tipo === 'ingreso' ? COLORS.success : COLORS.danger }
              ]}>
                {item.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(item.monto)}
              </Text>
            </View>
            
            {index < transactions.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  listCard: {
    padding: 0,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 13,
    color: '#6b7280',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginLeft: 68,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
