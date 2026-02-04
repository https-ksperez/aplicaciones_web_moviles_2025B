import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Card from '../../components/ui/Card.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import apiService from '../../services/apiService';
import { COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

// Importar el servicio de voz
import {
  parseVoiceExpense,
  isVoiceAvailable,
  initVoiceService,
  startListening,
  stopListening,
  cancelListening,
  transcribeAudio,
  getIsListening
} from '../../services/speechService';

/**
 * RegistroVozScreen - Pantalla para registrar gastos/ingresos con voz o texto
 * 
 * Soporta:
 * - Grabación de audio con expo-av
 * - Transcripción con Google Cloud Speech o OpenAI Whisper
 * - Entrada de texto manual como fallback
 * 
 * Las API keys están precargadas en apiConfig.js
 */
export default function RegistroVozScreen({ navigation }) {
  const { currentPerfil, isDemoMode } = useAuth();
  
  // Estados
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [inputText, setInputText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  // Ya no necesitamos showApiConfig ni apiKey porque están precargados
  
  // Animación del botón de grabación
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  // Verificar disponibilidad al montar
  useEffect(() => {
    const init = async () => {
      await initVoiceService();
      const available = await isVoiceAvailable();
      setVoiceAvailable(available);
    };
    init();
    
    return () => {
      cancelListening();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Animación de pulsación durante grabación
  useEffect(() => {
    if (isRecording) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      
      // Timer de grabación
      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
      
      return () => {
        pulse.stop();
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      pulseAnim.setValue(1);
      setRecordingTime(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isRecording]);

  // Procesar texto cuando cambia
  const handleTextChange = (text) => {
    setInputText(text);
    if (text.trim().length > 3) {
      const parsed = parseVoiceExpense(text);
      setParsedData(parsed);
    } else {
      setParsedData(null);
    }
  };

  // Iniciar grabación (ya no pide API key porque está precargada)
  const handleStartRecording = async () => {
    try {
      await startListening();
      setIsRecording(true);
    } catch (error) {
      console.error('Error iniciando grabación:', error);
      Alert.alert('Error', 'No se pudo iniciar la grabación. Verifica los permisos de micrófono.');
    }
  };

  // Detener grabación y transcribir
  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      setIsTranscribing(true);
      
      const audioUri = await stopListening();
      
      if (audioUri) {
        const transcript = await transcribeAudio(audioUri);
        if (transcript) {
          setInputText(transcript);
          const parsed = parseVoiceExpense(transcript);
          setParsedData(parsed);
        } else {
          Alert.alert('Sin resultado', 'No se detectó texto en el audio.');
        }
      }
    } catch (error) {
      console.error('Error transcribiendo:', error);
      Alert.alert('Error de transcripción', error.message || 'No se pudo transcribir el audio.');
    } finally {
      setIsTranscribing(false);
    }
  };

  // Cancelar grabación
  const handleCancelRecording = async () => {
    await cancelListening();
    setIsRecording(false);
  };

  // Guardar registro
  const handleSave = async () => {
    if (!parsedData || parsedData.monto <= 0) {
      Alert.alert('Error', 'No se detectó un monto válido. Incluye el monto en tu descripción.');
      return;
    }

    setSaving(true);
    try {
      const registroData = {
        tipo: parsedData.tipo,
        monto: parsedData.monto,
        descripcion: parsedData.descripcion,
        categoria: parsedData.categoria,
        fechaEjecucion: new Date().toISOString(),
      };

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

  // Limpiar
  const handleClear = () => {
    setInputText('');
    setParsedData(null);
  };

  // Formatear tiempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Ejemplos rápidos
  const ejemplos = [
    'Gasté 50 en almuerzo',
    'Pagué 30 de taxi',
    'Recibí 1000 de salario',
    'Compré ropa por 80',
  ];

  const usarEjemplo = (ejemplo) => {
    setInputText(ejemplo);
    const parsed = parseVoiceExpense(ejemplo);
    setParsedData(parsed);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Volver</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>🎤 Registro por Voz</Text>
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
          {/* Botón de grabación de voz */}
          {voiceAvailable && !isTranscribing && (
            <View style={styles.voiceSection}>
              <Text style={styles.voiceSectionTitle}>
                {isRecording ? '🔴 Grabando...' : '🎙️ Toca para grabar'}
              </Text>
              
              {isRecording && (
                <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
              )}
              
              <View style={styles.voiceButtonContainer}>
                {!isRecording ? (
                  <TouchableOpacity
                    style={styles.voiceButton}
                    onPress={handleStartRecording}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.voiceButtonIcon}>🎤</Text>
                    <Text style={styles.voiceButtonText}>Iniciar Grabación</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.recordingButtons}>
                    <TouchableOpacity
                      style={styles.cancelRecordButton}
                      onPress={handleCancelRecording}
                    >
                      <Text style={styles.cancelRecordButtonText}>✕ Cancelar</Text>
                    </TouchableOpacity>
                    
                    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                      <TouchableOpacity
                        style={styles.stopRecordButton}
                        onPress={handleStopRecording}
                      >
                        <Text style={styles.stopRecordIcon}>⏹️</Text>
                        <Text style={styles.stopRecordText}>Detener</Text>
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
          )}

          {/* Indicador de transcripción */}
          {isTranscribing && (
            <Card style={styles.transcribingCard}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.transcribingText}>Transcribiendo audio...</Text>
              <Text style={styles.transcribingSubtext}>Esto puede tomar unos segundos</Text>
            </Card>
          )}

          {/* Instrucciones */}
          <Card style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>💡 {voiceAvailable ? 'Habla o escribe' : 'Escribe'} como hablas</Text>
            <Text style={styles.instructionsText}>
              {voiceAvailable ? 'Graba un mensaje de voz o escribe' : 'Escribe'} tu gasto o ingreso de forma natural:{'\n'}
              • "Gasté 50 dólares en almuerzo"{'\n'}
              • "Pagué 30 de taxi"{'\n'}
              • "Recibí 1000 de salario"
            </Text>
          </Card>

          {/* Entrada de texto */}
          <Card style={styles.inputCard}>
            <Text style={styles.inputLabel}>
              {voiceAvailable ? 'O escribe tu transacción:' : 'Describe tu transacción:'}
            </Text>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={handleTextChange}
              placeholder="Ej: Gasté 25 en café..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            {inputText.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                <Text style={styles.clearButtonText}>✕ Limpiar</Text>
              </TouchableOpacity>
            )}
          </Card>

          {/* Ejemplos rápidos */}
          {!inputText && !isRecording && (
            <View style={styles.ejemplosContainer}>
              <Text style={styles.ejemplosTitle}>Ejemplos rápidos:</Text>
              <View style={styles.ejemplosRow}>
                {ejemplos.map((ej, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.ejemploChip}
                    onPress={() => usarEjemplo(ej)}
                  >
                    <Text style={styles.ejemploText}>{ej}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Resultado parseado */}
          {parsedData && (
            <Card style={[
              styles.resultCard,
              parsedData.tipo === 'ingreso' ? styles.resultCardIngreso : styles.resultCardEgreso
            ]}>
              <Text style={styles.resultTitle}>📋 Datos Detectados</Text>
              
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
                <Text style={[
                  styles.resultValueBig,
                  { color: parsedData.monto > 0 ? '#111827' : COLORS.danger }
                ]}>
                  {parsedData.monto > 0 ? formatCurrency(parsedData.monto) : 'No detectado'}
                </Text>
              </View>
              
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Descripción:</Text>
                <Text style={styles.resultValue}>{parsedData.descripcion}</Text>
              </View>
              
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Categoría:</Text>
                <Text style={styles.resultValue}>{parsedData.categoria}</Text>
              </View>

              {parsedData.monto === 0 && (
                <Text style={styles.warningText}>
                  ⚠️ Incluye el monto en tu descripción (ej: "50 dólares")
                </Text>
              )}
            </Card>
          )}
        </ScrollView>

        {/* Botones de acción */}
        {parsedData && !isRecording && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClear}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.saveButton, 
                (saving || parsedData.monto <= 0) && styles.buttonDisabled
              ]}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    fontSize: 16,
    color: COLORS.primary,
  },
  configButton: {
    fontSize: 20,
    padding: 4,
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
  // Sección de grabación de voz
  voiceSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  voiceSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  recordingTime: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.danger,
    marginBottom: 16,
  },
  voiceButtonContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  voiceButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  voiceButtonIcon: {
    fontSize: 24,
  },
  voiceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  recordingButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  cancelRecordButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  cancelRecordButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  stopRecordButton: {
    backgroundColor: COLORS.danger,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  stopRecordIcon: {
    fontSize: 28,
  },
  stopRecordText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#9ca3af',
  },
  // Tarjeta de transcripción
  transcribingCard: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f0f9ff',
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  transcribingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 16,
  },
  transcribingSubtext: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  // Instrucciones
  instructionsCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f0fdfa',
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  configHint: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },
  configHintText: {
    fontSize: 13,
    color: '#92400e',
    textAlign: 'center',
  },
  noteText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  // Entrada de texto
  inputCard: {
    padding: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    minHeight: 100,
  },
  clearButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  // Ejemplos
  ejemplosContainer: {
    marginBottom: 16,
  },
  ejemplosTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  ejemplosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ejemploChip: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  ejemploText: {
    fontSize: 13,
    color: '#374151',
  },
  // Resultado
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
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
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
    fontSize: 24,
    fontWeight: '700',
  },
  warningText: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.danger,
    textAlign: 'center',
  },
  // Botones de acción
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
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  cancelButtonText: {
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
  // Modal de configuración
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  apiKeyInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
