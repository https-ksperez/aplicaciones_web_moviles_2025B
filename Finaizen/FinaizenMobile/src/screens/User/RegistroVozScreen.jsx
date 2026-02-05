import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  VoiceRecorder,
  TextInputArea,
  ParsedDataCard,
  QuickExamples,
  TranscribingIndicator,
  InstructionsCard
} from '../../components/voice';
import { useAuth } from '../../context/AuthContext.jsx';
import apiService from '../../services/apiService';
import { COLORS } from '../../utils/constants';

// Importar el servicio de voz
import {
  parseVoiceExpense,
  isVoiceAvailable,
  initVoiceService,
  startListening,
  stopListening,
  cancelListening,
  transcribeAudio
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

  // Usar ejemplo
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
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
          {/* Grabación de voz */}
          {voiceAvailable && !isTranscribing && (
            <VoiceRecorder
              isRecording={isRecording}
              recordingTime={recordingTime}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onCancelRecording={handleCancelRecording}
              pulseAnim={pulseAnim}
            />
          )}

          {/* Indicador de transcripción */}
          <TranscribingIndicator isTranscribing={isTranscribing} />

          {/* Instrucciones */}
          <InstructionsCard voiceAvailable={voiceAvailable} />

          {/* Entrada de texto */}
          <TextInputArea
            value={inputText}
            onChangeText={handleTextChange}
            onClear={handleClear}
            voiceAvailable={voiceAvailable}
          />

          {/* Ejemplos rápidos */}
          <QuickExamples
            onSelectExample={usarEjemplo}
            show={!inputText && !isRecording}
          />

          {/* Resultado parseado */}
          <ParsedDataCard data={parsedData} />
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
});
