import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../../utils/constants';

/**
 * Componente Button reutilizable
 * Soporta diferentes variantes según el diseño de Finaizen
 */
export default function Button({ 
  children, 
  variant = 'brand', 
  onPress, 
  disabled = false,
  loading = false,
  style = {},
  textStyle = {},
}) {
  // Asegurar que disabled y loading sean booleanos
  const isDisabled = Boolean(disabled);
  const isLoading = Boolean(loading);

  const getButtonStyle = () => {
    switch (variant) {
      case 'brand':
        return styles.btnBrand;
      case 'outline':
        return styles.btnOutline;
      case 'danger':
        return styles.btnDanger;
      case 'primary':
        return styles.btnPrimary;
      default:
        return styles.btnBrand;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.textOutline;
      default:
        return styles.textDefault;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        getButtonStyle(),
        isDisabled && styles.btnDisabled,
        style
      ]}
      onPress={onPress}
      disabled={isDisabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.dark : COLORS.white} />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnBrand: {
    backgroundColor: '#007A7A',
  },
  btnPrimary: {
    backgroundColor: '#1a2a3a',
  },
  btnOutline: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#dee2e6',
  },
  btnDanger: {
    backgroundColor: '#E57373',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textDefault: {
    color: COLORS.white,
  },
  textOutline: {
    color: '#495057',
  },
});
