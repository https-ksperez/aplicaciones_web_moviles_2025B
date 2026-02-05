import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS } from '../../utils/constants';

/**
 * VoiceRecorder - Componente para grabar audio
 * @param {Object} props
 * @param {boolean} props.isRecording - Si está grabando
 * @param {number} props.recordingTime - Tiempo de grabación en segundos
 * @param {Function} props.onStartRecording - Callback al iniciar
 * @param {Function} props.onStopRecording - Callback al detener
 * @param {Function} props.onCancelRecording - Callback al cancelar
 * @param {Animated.Value} props.pulseAnim - Animación de pulsación
 */
export default function VoiceRecorder({
  isRecording,
  recordingTime,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  pulseAnim
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRecording ? '🔴 Grabando...' : '🎙️ Toca para grabar'}
      </Text>
      
      {isRecording && (
        <Text style={styles.time}>{formatTime(recordingTime)}</Text>
      )}
      
      <View style={styles.buttonContainer}>
        {!isRecording ? (
          <TouchableOpacity
            style={styles.recordButton}
            onPress={onStartRecording}
            activeOpacity={0.8}
          >
            <Text style={styles.recordIcon}>🎤</Text>
            <Text style={styles.recordText}>Iniciar Grabación</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.recordingButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancelRecording}
            >
              <Text style={styles.cancelButtonText}>✕ Cancelar</Text>
            </TouchableOpacity>
            
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={styles.stopButton}
                onPress={onStopRecording}
              >
                <Text style={styles.stopIcon}>⏹️</Text>
                <Text style={styles.stopText}>Detener</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>
      
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>o escribe manualmente</Text>
        <View style={styles.dividerLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  time: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  recordButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  recordText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recordingButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    maxWidth: 150,
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  stopButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    maxWidth: 150,
    alignItems: 'center',
  },
  stopIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  stopText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: '#9ca3af',
  },
});
