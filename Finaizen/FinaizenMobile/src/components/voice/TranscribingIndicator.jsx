import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Card from '../ui/Card';
import { COLORS } from '../../utils/constants';

/**
 * TranscribingIndicator - Indicador de transcripción en progreso
 * @param {Object} props
 * @param {boolean} props.isTranscribing - Si está transcribiendo
 */
export default function TranscribingIndicator({ isTranscribing }) {
  if (!isTranscribing) return null;

  return (
    <Card style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.title}>Transcribiendo audio...</Text>
      <Text style={styles.subtitle}>Esto puede tomar unos segundos</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
});
