import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * EmptyRegistros - Estado vacío para lista de registros
 * @param {Object} props
 * @param {string} props.tipo - 'ingresos' o 'egresos'
 * @param {Function} props.onAdd - Callback al agregar nuevo
 */
export default function EmptyRegistros({ tipo, onAdd }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>
        {tipo === 'ingresos' ? '💰' : '💸'}
      </Text>
      <Text style={styles.text}>
        No hay {tipo} programados
      </Text>
      <TouchableOpacity style={styles.button} onPress={onAdd}>
        <Text style={styles.buttonText}>+ Agregar {tipo.slice(0, -1)}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
