import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * QuickExamples - Chips de ejemplos rápidos
 * @param {Object} props
 * @param {Function} props.onSelectExample - Callback al seleccionar ejemplo
 * @param {boolean} props.show - Si se deben mostrar (solo si no hay texto ni grabación)
 */
export default function QuickExamples({ onSelectExample, show = true }) {
  if (!show) return null;

  const ejemplos = [
    'Gasté 50 en almuerzo',
    'Pagué 30 de taxi',
    'Recibí 1000 de salario',
    'Compré ropa por 80',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejemplos rápidos:</Text>
      <View style={styles.row}>
        {ejemplos.map((ejemplo, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.chip}
            onPress={() => onSelectExample(ejemplo)}
          >
            <Text style={styles.chipText}>{ejemplo}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipText: {
    fontSize: 13,
    color: '#374151',
  },
});
