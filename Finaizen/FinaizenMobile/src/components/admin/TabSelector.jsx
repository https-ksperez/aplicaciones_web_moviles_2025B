import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * TabSelector - Selector de pestañas para ingresos/egresos
 * @param {Object} props
 * @param {string} props.activeTab - Pestaña activa ('ingresos' o 'egresos')
 * @param {Function} props.onTabChange - Callback al cambiar pestaña
 */
export default function TabSelector({ activeTab, onTabChange }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'ingresos' && styles.tabActiveIngreso]}
        onPress={() => onTabChange('ingresos')}
      >
        <Text style={[
          styles.tabText,
          activeTab === 'ingresos' && styles.tabTextActiveIngreso
        ]}>
          💰 Ingresos
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'egresos' && styles.tabActiveEgreso]}
        onPress={() => onTabChange('egresos')}
      >
        <Text style={[
          styles.tabText,
          activeTab === 'egresos' && styles.tabTextActiveEgreso
        ]}>
          💸 Egresos
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  tabActiveIngreso: {
    backgroundColor: '#dcfce7',
  },
  tabActiveEgreso: {
    backgroundColor: '#fee2e2',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActiveIngreso: {
    color: '#166534',
  },
  tabTextActiveEgreso: {
    color: '#991b1b',
  },
});
