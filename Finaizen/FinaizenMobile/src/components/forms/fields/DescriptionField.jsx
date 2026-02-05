import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../../../utils/constants';

/**
 * DescriptionField - Campo de texto para descripciones
 * @param {string} value - Valor actual de la descripción
 * @param {function} onChangeText - Callback cuando cambia el texto
 * @param {string} error - Mensaje de error (opcional)
 * @param {string} label - Etiqueta del campo (por defecto "Descripción *")
 * @param {string} placeholder - Texto de placeholder
 * @param {number} maxLength - Longitud máxima (por defecto 100)
 */
export default function DescriptionField({ 
  value, 
  onChangeText, 
  error, 
  label = "Descripción *",
  placeholder = "Ingrese una descripción",
  maxLength = 100
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        maxLength={maxLength}
      />
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
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 6,
  },
});
