import { View, Text, StyleSheet } from 'react-native';
import Card from '../ui/Card';

/**
 * InstructionsCard - Tarjeta de instrucciones de uso
 * @param {Object} props
 * @param {boolean} props.voiceAvailable - Si hay voz disponible
 */
export default function InstructionsCard({ voiceAvailable = false }) {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>
        💡 {voiceAvailable ? 'Habla o escribe' : 'Escribe'} como hablas
      </Text>
      <Text style={styles.text}>
        {voiceAvailable ? 'Graba un mensaje de voz o escribe' : 'Escribe'} tu gasto o ingreso de forma natural:{'\n'}
        • "Gasté 50 dólares en almuerzo"{'\n'}
        • "Pagué 30 de taxi"{'\n'}
        • "Recibí 1000 de salario"
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#eff6ff',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
});
