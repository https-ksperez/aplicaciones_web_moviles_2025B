import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Card from '../ui/Card';

/**
 * TextInputArea - Área de entrada de texto manual
 * @param {Object} props
 * @param {string} props.value - Valor del texto
 * @param {Function} props.onChangeText - Callback al cambiar texto
 * @param {Function} props.onClear - Callback al limpiar
 * @param {boolean} props.voiceAvailable - Si hay voz disponible
 */
export default function TextInputArea({
  value,
  onChangeText,
  onClear,
  voiceAvailable = false
}) {
  return (
    <Card style={styles.container}>
      <Text style={styles.label}>
        {voiceAvailable ? 'O escribe tu transacción:' : 'Describe tu transacción:'}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Ej: Gasté 25 en café..."
        placeholderTextColor="#9ca3af"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
      {value.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearButtonText}>✕ Limpiar</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 80,
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  clearButtonText: {
    fontSize: 13,
    color: '#6b7280',
  },
});
