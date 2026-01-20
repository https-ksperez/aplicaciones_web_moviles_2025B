import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

/**
 * Componente Card reutilizable
 * Tarjeta con sombra y bordes redondeados
 */
export default function Card({ children, style = {} }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});
