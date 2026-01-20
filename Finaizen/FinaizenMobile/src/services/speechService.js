/**
 * Servicio de Speech-to-Text para React Native
 * 
 * Usa expo-av para grabar audio y envía a APIs de Speech-to-Text:
 * - Google Cloud Speech-to-Text API
 * - OpenAI Whisper API
 * 
 * Funciona con Expo Go - no requiere build nativo
 */

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// Configuración de APIs
const API_CONFIG = {
  // Google Cloud Speech-to-Text
  googleSpeech: {
    apiKey: '', // Agregar tu API key de Google Cloud
    endpoint: 'https://speech.googleapis.com/v1/speech:recognize',
  },
  // OpenAI Whisper
  openai: {
    apiKey: '', // Agregar tu API key de OpenAI
    endpoint: 'https://api.openai.com/v1/audio/transcriptions',
  },
  // Proveedor activo: 'google' o 'openai'
  provider: 'openai', // Cambiar según el proveedor que quieras usar
};

// Estado de grabación
let recording = null;
let isListening = false;

/**
 * Verificar si el reconocimiento de voz está disponible
 */
export async function isVoiceAvailable() {
  try {
    const { granted } = await Audio.requestPermissionsAsync();
    return granted;
  } catch (error) {
    console.error('Error verificando permisos de audio:', error);
    return false;
  }
}

/**
 * Inicializar el servicio de voz
 */
export async function initVoiceService() {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    console.log('🎤 Servicio de voz inicializado con grabación de audio');
    return true;
  } catch (error) {
    console.error('Error inicializando servicio de voz:', error);
    return false;
  }
}

/**
 * Iniciar grabación de audio
 */
export async function startListening() {
  try {
    // Verificar permisos
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      throw new Error('Permisos de micrófono denegados');
    }

    // Configurar modo de audio
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    // Iniciar grabación
    const { recording: newRecording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    
    recording = newRecording;
    isListening = true;
    console.log('🎙️ Grabación iniciada');
    
    return true;
  } catch (error) {
    console.error('Error iniciando grabación:', error);
    isListening = false;
    throw error;
  }
}

/**
 * Detener grabación y obtener transcripción
 */
export async function stopListening() {
  if (!recording) {
    isListening = false;
    return null;
  }

  try {
    console.log('⏹️ Deteniendo grabación...');
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    recording = null;
    isListening = false;
    
    console.log('📁 Audio guardado en:', uri);
    return uri;
  } catch (error) {
    console.error('Error deteniendo grabación:', error);
    recording = null;
    isListening = false;
    throw error;
  }
}

/**
 * Cancelar grabación sin obtener resultado
 */
export async function cancelListening() {
  if (recording) {
    try {
      await recording.stopAndUnloadAsync();
    } catch (error) {
      console.error('Error cancelando grabación:', error);
    }
    recording = null;
  }
  isListening = false;
}

/**
 * Destruir el servicio
 */
export async function destroyVoiceService() {
  await cancelListening();
}

/**
 * Obtener estado actual
 */
export function getIsListening() {
  return isListening;
}

/**
 * Transcribir audio usando Google Cloud Speech-to-Text
 */
async function transcribeWithGoogle(audioUri) {
  const { apiKey, endpoint } = API_CONFIG.googleSpeech;
  
  if (!apiKey) {
    throw new Error('API Key de Google Cloud no configurada');
  }

  // Leer archivo de audio y convertir a base64
  const audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const response = await fetch(`${endpoint}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 44100,
        languageCode: 'es-ES',
        enableAutomaticPunctuation: true,
      },
      audio: {
        content: audioBase64,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Error en Google Speech API');
  }

  const data = await response.json();
  const transcript = data.results?.[0]?.alternatives?.[0]?.transcript || '';
  
  return transcript;
}

/**
 * Transcribir audio usando OpenAI Whisper
 */
async function transcribeWithOpenAI(audioUri) {
  const { apiKey, endpoint } = API_CONFIG.openai;
  
  if (!apiKey) {
    throw new Error('API Key de OpenAI no configurada');
  }

  // Crear FormData con el archivo de audio
  const formData = new FormData();
  formData.append('file', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'audio.m4a',
  });
  formData.append('model', 'whisper-1');
  formData.append('language', 'es');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Error en OpenAI Whisper API');
  }

  const data = await response.json();
  return data.text || '';
}

/**
 * Transcribir audio usando el proveedor configurado
 */
export async function transcribeAudio(audioUri) {
  console.log('🔄 Transcribiendo audio con:', API_CONFIG.provider);
  
  try {
    if (API_CONFIG.provider === 'google') {
      return await transcribeWithGoogle(audioUri);
    } else {
      return await transcribeWithOpenAI(audioUri);
    }
  } catch (error) {
    console.error('Error transcribiendo audio:', error);
    throw error;
  }
}

/**
 * Configurar API Key
 */
export function setApiKey(provider, apiKey) {
  if (provider === 'google') {
    API_CONFIG.googleSpeech.apiKey = apiKey;
  } else if (provider === 'openai') {
    API_CONFIG.openai.apiKey = apiKey;
  }
}

/**
 * Configurar proveedor de transcripción
 */
export function setProvider(provider) {
  if (provider === 'google' || provider === 'openai') {
    API_CONFIG.provider = provider;
  }
}

/**
 * Parsear texto (de entrada manual o voz) para extraer información de gasto/ingreso
 * Esta función SÍ funciona y es útil independientemente del origen del texto
 */
export function parseVoiceExpense(text) {
  const lowerText = text.toLowerCase();
  
  // Detectar si es ingreso o egreso
  const esIngreso = lowerText.includes('recibi') || 
                    lowerText.includes('gane') || 
                    lowerText.includes('cobr') ||
                    lowerText.includes('ingres') ||
                    lowerText.includes('me pagaron') ||
                    lowerText.includes('me dieron');
  
  const tipo = esIngreso ? 'ingreso' : 'egreso';
  
  // Patrones para extraer monto
  const montoPatterns = [
    /(\d+(?:[.,]\d{1,2})?)\s*(?:pesos|dolares|dólares|euros|soles|quetzales)/i,
    /(?:gaste|gasto|gasté|pague|pagué|pago|recibi|recibí|gane|gané|cobr[eé])\s*(\d+(?:[.,]\d{1,2})?)/i,
    /(\d+(?:[.,]\d{1,2})?)\s*(?:de|en|por)/i,
    /\$?\s*(\d+(?:[.,]\d{1,2})?)/i
  ];

  let monto = 0;
  for (const pattern of montoPatterns) {
    const match = text.match(pattern);
    if (match) {
      monto = parseFloat(match[1].replace(',', '.'));
      break;
    }
  }

  // Extraer categoría basada en palabras clave
  const categoriasEgreso = {
    'Alimentación': ['comida', 'restaurante', 'mercado', 'super', 'almuerzo', 'cena', 'desayuno', 'alimento', 'cafe', 'café'],
    'Transporte': ['taxi', 'uber', 'bus', 'metro', 'gasolina', 'combustible', 'transporte', 'pasaje'],
    'Entretenimiento': ['cine', 'concierto', 'juego', 'diversión', 'entretenimiento', 'netflix', 'spotify'],
    'Salud': ['farmacia', 'doctor', 'medicina', 'hospital', 'consulta', 'salud', 'medico', 'médico'],
    'Servicios': ['luz', 'agua', 'internet', 'telefono', 'teléfono', 'servicio', 'factura', 'cable'],
    'Educación': ['libro', 'curso', 'escuela', 'universidad', 'clase', 'educación'],
    'Ropa': ['ropa', 'zapatos', 'vestido', 'camisa', 'pantalon', 'pantalón'],
    'Vivienda': ['alquiler', 'renta', 'arriendo', 'hipoteca'],
    'Tecnología': ['celular', 'computadora', 'laptop', 'tablet', 'electrónico'],
  };

  const categoriasIngreso = {
    'Salario': ['salario', 'sueldo', 'quincena', 'nomina', 'nómina'],
    'Freelance': ['freelance', 'proyecto', 'trabajo', 'cliente'],
    'Bonos': ['bono', 'extra', 'aguinaldo'],
    'Inversiones': ['inversión', 'dividendo', 'rendimiento', 'interés'],
    'Ventas': ['venta', 'vendí', 'vendi'],
    'Regalos': ['regalo', 'me dieron', 'me regalaron'],
  };

  const categorias = tipo === 'ingreso' ? categoriasIngreso : categoriasEgreso;
  let categoria = 'Otros';
  
  for (const [cat, keywords] of Object.entries(categorias)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      categoria = cat;
      break;
    }
  }

  // Limpiar descripción (remover palabras de monto y acción)
  let descripcion = text
    .replace(/gaste|gasto|gasté|pague|pagué|pago|recibi|recibí|gane|gané|cobré/gi, '')
    .replace(/\d+(?:[.,]\d{1,2})?\s*(?:pesos|dolares|dólares|euros|soles|quetzales)?/gi, '')
    .replace(/\$\s*\d+(?:[.,]\d{1,2})?/gi, '')
    .replace(/en|de|por/gi, '')
    .trim();

  // Si la descripción quedó vacía, usar la categoría
  if (!descripcion || descripcion.length < 3) {
    descripcion = categoria;
  }

  // Capitalizar primera letra
  descripcion = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);

  return {
    tipo,
    monto: monto || 0,
    descripcion,
    categoria,
    fecha: new Date()
  };
}

export default {
  initVoiceService,
  isVoiceAvailable,
  startListening,
  stopListening,
  cancelListening,
  destroyVoiceService,
  getIsListening,
  parseVoiceExpense
};

