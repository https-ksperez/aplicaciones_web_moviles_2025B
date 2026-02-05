import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

/**
 * DateField - Campo de fecha específica
 * @param {string} value - Fecha en formato YYYY-MM-DD
 * @param {function} onChangeText - Callback cuando cambia la fecha
 * @param {string} label - Etiqueta del campo (por defecto "Fecha")
 * @param {string} helperText - Texto de ayuda (opcional)
 */
export default function DateField({ 
  value, 
  onChangeText, 
  label = "Fecha",
  helperText = "Formato: 2026-01-19"
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#9ca3af"
      />
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
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
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  helperText: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 6,
  },
});
