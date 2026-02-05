import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import {
  CameraOptions,
  ImagePreview,
  ReceiptData
} from '../../components/camera';
import { useAuth } from '../../context/AuthContext.jsx';
import apiService from '../../services/apiService';
import { COLORS } from '../../utils/constants';

// Importar el servicio OCR
import { processReceiptImage, parseReceiptText } from '../../services/ocrService';

/**
 * RegistroFotoScreen - Pantalla para registrar gastos escaneando recibos
 */
export default function RegistroFotoScreen({ navigation }) {
  const { currentPerfil, isDemoMode } = useAuth();
  
  // Estados
  const [image, setImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [rawText, setRawText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Solicitar permisos de cámara
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la cámara para tomar fotos de recibos');
      return false;
    }
    return true;
  };

  // Solicitar permisos de galería
  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la galería para seleccionar fotos');
      return false;
    }
    return true;
  };

  // Tomar foto con cámara
  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0]);
        setParsedData(null);
        setRawText('');
        setError(null);
      }
    } catch (err) {
      console.error('Error tomando foto:', err);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  // Seleccionar de galería
  const pickImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0]);
        setParsedData(null);
        setRawText('');
        setError(null);
      }
    } catch (err) {
      console.error('Error seleccionando imagen:', err);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  // Procesar imagen con OCR
  const processImage = async () => {
    if (!image) {
      Alert.alert('Error', 'Primero selecciona o toma una foto');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Crear URI base64 para la API
      const base64Image = `data:image/jpeg;base64,${image.base64}`;
      
      console.log('📷 Procesando imagen...');
      const result = await processReceiptImage(base64Image);
      
      setParsedData(result);
      setRawText(result.textoOriginal || '');
      
      if (result.monto === 0) {
        setError('No se pudo detectar el monto. Puedes editarlo manualmente.');
      }
    } catch (err) {
      console.error('Error procesando imagen:', err);
      setError(err.message || 'No se pudo procesar la imagen');
    } finally {
      setProcessing(false);
    }
  };

  // Guardar registro
  const handleSave = async () => {
    if (!parsedData || parsedData.monto <= 0) {
      Alert.alert('Error', 'No se detectó un monto válido');
      return;
    }

    setSaving(true);
    try {
      const registroData = {
        tipo: parsedData.tipo,
        monto: parsedData.monto,
        descripcion: parsedData.descripcion || parsedData.comercio || 'Compra',
        categoria: parsedData.categoria,
        fechaEjecucion: new Date().toISOString(),
      };

      console.log('📤 Enviando registro:', registroData);
      console.log('📋 Perfil ID:', currentPerfil?.id || currentPerfil?._id);

      if (!isDemoMode) {
        const perfilId = currentPerfil?.id || currentPerfil?._id;
        await apiService.historial.create(perfilId, registroData);
      }

      Alert.alert(
        '✅ Guardado',
        `${parsedData.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'} registrado correctamente`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.error('Error guardando:', err);
      Alert.alert('Error', 'No se pudo guardar el registro');
    } finally {
      setSaving(false);
    }
  };

  // Limpiar y reintentar
  const handleReset = () => {
    setImage(null);
    setParsedData(null);
    setRawText('');
    setError(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📷 Escanear Recibo</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Opciones de cámara */}
          {!image && (
            <CameraOptions
              onTakePhoto={takePhoto}
              onPickImage={pickImage}
            />
          )}

          {/* Vista previa de imagen */}
          <ImagePreview
            image={image}
            onRemove={handleReset}
            onAnalyze={processImage}
            processing={processing}
          />

          {/* Error */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          {/* Datos del recibo */}
          <ReceiptData data={parsedData} rawText={rawText} />
        </ScrollView>

        {/* Botones de acción */}
        {parsedData && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleReset}
              disabled={saving}
            >
              <Text style={styles.retryButtonText}>🔄 Nueva Foto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={saving || (parsedData && parsedData.monto <= 0)}
            >
              <Text style={styles.saveButtonText}>
                {saving ? '⏳ Guardando...' : '✓ Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  backButton: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  retryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
