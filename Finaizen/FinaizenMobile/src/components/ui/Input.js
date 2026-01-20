import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

/**
 * Componente Input reutilizable
 * Input controlado con label, error y diferentes tipos
 */
export default function Input({
  label,
  value,
  onChangeText,
  placeholder = '',
  required = false,
  error = '',
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style = {},
  ...props
}) {
  // Asegurar que secureTextEntry sea un booleano
  const isSecure = Boolean(secureTextEntry);
  
  return (
    <View style={[styles.inputGroup, style]}>
      {label && (
        <Text style={styles.inputLabel}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        secureTextEntry={isSecure}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[
          styles.inputField,
          error ? styles.inputError : null
        ]}
        {...props}
      />
      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 16,
    width: '100%',
  },
  inputLabel: {
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
    fontSize: 14,
  },
  required: {
    color: '#E57373',
  },
  inputField: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: COLORS.dark,
  },
  inputError: {
    borderColor: '#E57373',
  },
  errorMessage: {
    marginTop: 8,
    fontSize: 13,
    color: '#E57373',
  },
});
