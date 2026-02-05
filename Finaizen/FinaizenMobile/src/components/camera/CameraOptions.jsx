import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '../ui/Card';
import { COLORS } from '../../utils/constants';

/**
 * CameraOptions - Opciones para cámara o galería
 * @param {Object} props
 * @param {Function} props.onTakePhoto - Callback al tomar foto
 * @param {Function} props.onPickImage - Callback al seleccionar imagen
 */
export default function CameraOptions({ onTakePhoto, onPickImage }) {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>📸 Escanea tu recibo</Text>
      <Text style={styles.subtitle}>
        Toma una foto clara del recibo o ticket para extraer automáticamente el monto y descripción
      </Text>
      
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cameraButton} onPress={onTakePhoto}>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.cameraButtonText}>Tomar Foto</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.galleryButton} onPress={onPickImage}>
          <Text style={styles.galleryIcon}>🖼️</Text>
          <Text style={styles.galleryButtonText}>Galería</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cameraButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  galleryButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  galleryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  galleryButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
});
