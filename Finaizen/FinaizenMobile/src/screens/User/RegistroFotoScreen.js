import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';
import { COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

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
        transaccionOrigenId: null,
        fechaEjecucion: new Date().toISOString(),
        mes: new Date().getMonth() + 1,
        anio: new Date().getFullYear()
      };

      if (!isDemoMode) {
        await apiService.historial.create(currentPerfil.id, registroData);
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

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Instrucciones */}
        <Card style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>¿Cómo funciona?</Text>
          <Text style={styles.instructionsText}>
            1. Toma una foto o selecciona una imagen de tu recibo{'\n'}
            2. Presiona "Procesar" para extraer la información{'\n'}
            3. Verifica los datos y guarda el registro
          </Text>
        </Card>

        {/* Área de imagen */}
        <Card style={styles.imageCard}>
          {image ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: image.uri }}
                style={styles.previewImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={handleReset}
              >
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderEmoji}>📄</Text>
              <Text style={styles.placeholderText}>
                Selecciona o toma una foto del recibo
              </Text>
            </View>
          )}
        </Card>

        {/* Botones de captura */}
        {!image && (
          <View style={styles.captureButtons}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePhoto}
            >
              <Text style={styles.captureButtonEmoji}>📷</Text>
              <Text style={styles.captureButtonText}>Tomar Foto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.captureButton}
              onPress={pickImage}
            >
              <Text style={styles.captureButtonEmoji}>🖼️</Text>
              <Text style={styles.captureButtonText}>Galería</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Botón procesar */}
        {image && !parsedData && (
          <TouchableOpacity
            style={[styles.processButton, processing && styles.buttonDisabled]}
            onPress={processImage}
            disabled={processing}
          >
            {processing ? (
              <>
                <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.processButtonText}>Procesando...</Text>
              </>
            ) : (
              <Text style={styles.processButtonText}>🔍 Procesar Imagen</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Error */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Resultado parseado */}
        {parsedData && (
          <Card style={[
            styles.resultCard,
            parsedData.tipo === 'ingreso' ? styles.resultCardIngreso : styles.resultCardEgreso
          ]}>
            <Text style={styles.resultTitle}>Datos Detectados</Text>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Tipo:</Text>
              <Text style={[
                styles.resultValue,
                { color: parsedData.tipo === 'ingreso' ? COLORS.success : COLORS.danger }
              ]}>
                {parsedData.tipo === 'ingreso' ? '💰 Ingreso' : '💸 Egreso'}
              </Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Monto:</Text>
              <Text style={styles.resultValueBig}>
                {formatCurrency(parsedData.monto)}
              </Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Comercio:</Text>
              <Text style={styles.resultValue}>{parsedData.comercio || parsedData.descripcion || '-'}</Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Categoría:</Text>
              <Text style={styles.resultValue}>{parsedData.categoria}</Text>
            </View>
            
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceLabel}>
                Confianza: {parsedData.confianza}%
              </Text>
              <View style={styles.confidenceBar}>
                <View 
                  style={[
                    styles.confidenceFill,
                    { width: `${parsedData.confianza}%` }
                  ]} 
                />
              </View>
            </View>
          </Card>
        )}

        {/* Texto extraído (colapsable) */}
        {rawText && (
          <Card style={styles.rawTextCard}>
            <Text style={styles.rawTextTitle}>Texto Extraído</Text>
            <Text style={styles.rawText} numberOfLines={10}>
              {rawText}
            </Text>
          </Card>
        )}

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
              disabled={saving || parsedData.monto <= 0}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>✓ Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
    paddingBottom: 40,
  },
  instructionsCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 1,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 22,
  },
  imageCard: {
    padding: 16,
    marginBottom: 16,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholderContainer: {
    alignItems: 'center',
    padding: 40,
  },
  placeholderEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  captureButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  captureButton: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  captureButtonEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  captureButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  processButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    marginBottom: 16,
  },
  processButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    textAlign: 'center',
  },
  resultCard: {
    padding: 16,
    marginBottom: 16,
  },
  resultCardIngreso: {
    backgroundColor: '#f0fdf4',
    borderColor: COLORS.success,
    borderWidth: 1,
  },
  resultCardEgreso: {
    backgroundColor: '#fef2f2',
    borderColor: COLORS.danger,
    borderWidth: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  resultLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  resultValueBig: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  confidenceContainer: {
    marginTop: 16,
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  rawTextCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  rawTextTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  rawText: {
    fontSize: 12,
    color: '#374151',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
