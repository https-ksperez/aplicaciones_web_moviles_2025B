import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../../../utils/constants';

/**
 * AmountField - Campo de entrada para montos monetarios
 * @param {string} value - Valor actual del monto
 * @param {function} onChangeText - Callback cuando cambia el texto
 * @param {string} error - Mensaje de error (opcional)
 * @param {string} label - Etiqueta del campo (por defecto "Monto *")
 * @param {string} currency - Símbolo de moneda (por defecto "$")
 */
export default function AmountField({ 
  value, 
  onChangeText, 
  error, 
  label = "Monto *",
  currency = "$"
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Text style={styles.currencySymbol}>{currency}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="0.00"
          keyboardType="decimal-pad"
          placeholderTextColor="#9ca3af"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
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
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6b7280',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    paddingVertical: 16,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 6,
  },
});
