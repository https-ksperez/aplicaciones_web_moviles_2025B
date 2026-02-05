import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Card from '../ui/Card';

/**
 * ImagePreview - Vista previa de imagen capturada
 * @param {Object} props
 * @param {Object} props.image - Objeto de imagen con uri
 * @param {Function} props.onRemove - Callback al eliminar imagen
 * @param {Function} props.onAnalyze - Callback al analizar imagen
 * @param {boolean} props.processing - Si está procesando
 */
export default function ImagePreview({ image, onRemove, onAnalyze, processing }) {
  if (!image) return null;

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>✅ Imagen capturada</Text>
      
      <Image source={{ uri: image.uri }} style={styles.image} />
      
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          disabled={processing}
        >
          <Text style={styles.removeButtonText}>🗑️ Eliminar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.analyzeButton, processing && styles.buttonDisabled]}
          onPress={onAnalyze}
          disabled={processing}
        >
          <Text style={styles.analyzeButtonText}>
            {processing ? '⏳ Analizando...' : '🔍 Analizar'}
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  removeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  analyzeButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  analyzeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
