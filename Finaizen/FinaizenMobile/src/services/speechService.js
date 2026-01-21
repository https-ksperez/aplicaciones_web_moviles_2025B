/**
 * Servicio de Speech-to-Text para React Native
 * 
 * Usa expo-av para grabar audio y envía a APIs de Speech-to-Text:
 * - Google Cloud Speech-to-Text API
 * - OpenAI Whisper API
 * 
 * Funciona con Expo Go - no requiere build nativo
 * 
 * Las API keys están precargadas desde apiConfig.js
 */

import { Audio } from 'expo-av';
// Usar la API legacy de expo-file-system para compatibilidad con SDK 54
import * as FileSystem from 'expo-file-system/legacy';
import API_CONFIG_GLOBAL from '../config/apiConfig';

// Configuración de APIs (precargada desde apiConfig.js)
const API_CONFIG = {
  // Google Cloud Speech-to-Text
  googleSpeech: {
    apiKey: API_CONFIG_GLOBAL.speech.google.apiKey,
    endpoint: API_CONFIG_GLOBAL.speech.google.endpoint,
  },
  // OpenAI Whisper
  openai: {
    apiKey: API_CONFIG_GLOBAL.speech.openai.apiKey,
    endpoint: API_CONFIG_GLOBAL.speech.openai.endpoint,
  },
  // Proveedor activo: 'google' o 'openai'
  provider: API_CONFIG_GLOBAL.speech.defaultProvider,
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

    // Configuración de grabación compatible con Google Speech API
    // Usando AMR_NB que Google soporta nativamente
    const recordingOptions = {
      android: {
        extension: '.amr',
        outputFormat: Audio.AndroidOutputFormat.AMR_NB,
        audioEncoder: Audio.AndroidAudioEncoder.AMR_NB,
        sampleRate: 8000,
        numberOfChannels: 1,
        bitRate: 12200,
      },
      ios: {
        extension: '.amr',
        outputFormat: Audio.IOSOutputFormat.AMR,
        audioQuality: Audio.IOSAudioQuality.LOW,
        sampleRate: 8000,
        numberOfChannels: 1,
        bitRate: 12200,
      },
      web: {
        mimeType: 'audio/webm',
        bitsPerSecond: 128000,
      },
    };

    const { recording: newRecording } = await Audio.Recording.createAsync(
      recordingOptions
    );
    
    recording = newRecording;
    isListening = true;
    console.log('🎙️ Grabación iniciada (formato AMR para Google Speech)');
    
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

  console.log('📤 Leyendo archivo de audio:', audioUri);
  
  // Leer archivo de audio y convertir a base64
  const audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
    encoding: 'base64',
  });
  
  console.log('📤 Audio en base64, tamaño:', audioBase64.length, 'caracteres');

  const requestBody = {
    config: {
      // Formato AMR-NB compatible con la grabación
      encoding: 'AMR',
      sampleRateHertz: 8000,
      languageCode: 'es-ES',
      enableAutomaticPunctuation: true,
    },
    audio: {
      content: audioBase64,
    },
  };

  console.log('📤 Enviando a Google Speech API...');

  const response = await fetch(`${endpoint}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();
  console.log('📥 Respuesta de Google Speech:', JSON.stringify(data, null, 2));

  if (!response.ok) {
    throw new Error(data.error?.message || 'Error en Google Speech API');
  }

  const transcript = data.results?.[0]?.alternatives?.[0]?.transcript || '';
  console.log('📝 Transcripción:', transcript || '(vacía)');
  
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

  console.log('📤 Enviando audio a OpenAI Whisper:', audioUri);

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

  const data = await response.json();
  console.log('📥 Respuesta de OpenAI Whisper:', JSON.stringify(data, null, 2));

  if (!response.ok) {
    throw new Error(data.error?.message || 'Error en OpenAI Whisper API');
  }

  const transcript = data.text || '';
  console.log('📝 Transcripción:', transcript || '(vacía)');
  
  return transcript;
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
 * 
 * MEJORADO: Detección más precisa de ingreso vs egreso
 */
export function parseVoiceExpense(text) {
  const lowerText = text.toLowerCase();
  
  // ============================================
  // DETECCIÓN MEJORADA DE TIPO (INGRESO/EGRESO)
  // ============================================
  
  // Palabras clave que indican INGRESO
  const palabrasIngreso = [
    'recibi', 'recibí', 'recibido',
    'gane', 'gané', 'ganado', 'ganancia',
    'cobr', 'cobré', 'cobrado',
    'ingres', 'ingresé', 'ingresado', 'ingreso',
    'me pagaron', 'me pago', 'me pagó',
    'me dieron', 'me dio',
    'me depositaron', 'deposito a favor', 'depósito a favor',
    'deposito de', 'depósito de', 'deposito en', 'depósito en', // Depósito DE/EN = ingreso
    'me transfirieron', 'transferencia recibida',
    'sueldo', 'salario', 'quincena', 'nomina', 'nómina',
    'bono', 'aguinaldo', 'comisión', 'comision',
    'vendi', 'vendí', 'venta de',
    'devolucion', 'devolución', 'reembolso',
    'premio', 'loteria', 'lotería',
    'herencia', 'regalo recibido',
    'renta cobrada', 'alquiler cobrado',
    'dividendo', 'rendimiento', 'interés ganado', 'interes ganado',
    'banco', 'cuenta bancaria' // Depósitos bancarios generalmente son ingresos
  ];
  
  // Palabras clave que indican EGRESO
  const palabrasEgreso = [
    'gaste', 'gasté', 'gastado', 'gasto de',
    'pague', 'pagué', 'pagado', 'pago de', 'pago por',
    'compre', 'compré', 'comprado', 'compra de',
    'costo', 'costó', 'me costó',
    'invertí', 'inverti', 'inversión en',
    'di', 'dí', 'le di',
    'presté', 'preste', 'préstamo a',
    'doné', 'done', 'donación',
    'transferí', 'transferi', 'transferencia a',
    'deposité', 'deposite', 'depósito a', // Yo deposité A alguien = egreso
    'debito', 'débito', 'cargo',
    'factura', 'cuenta de', 'recibo de',
    'multa', 'impuesto', 'cuota',
    'subscripcion', 'suscripción', 'membresía', 'membresia',
    'pedí', 'pedi', 'ordené', 'ordene'
  ];
  
  // Contar coincidencias
  let puntosIngreso = 0;
  let puntosEgreso = 0;
  
  for (const palabra of palabrasIngreso) {
    if (lowerText.includes(palabra)) {
      puntosIngreso += palabra.length > 5 ? 2 : 1; // Palabras más largas dan más peso
    }
  }
  
  for (const palabra of palabrasEgreso) {
    if (lowerText.includes(palabra)) {
      puntosEgreso += palabra.length > 5 ? 2 : 1;
    }
  }
  
  // Determinar tipo basado en puntos
  // Por defecto es egreso (los gastos son más comunes)
  let tipo = 'egreso';
  if (puntosIngreso > puntosEgreso) {
    tipo = 'ingreso';
  } else if (puntosIngreso === puntosEgreso && puntosIngreso > 0) {
    // Si hay empate y hay puntos, revisar contexto adicional
    // Palabras como "me" + verbo positivo suelen indicar ingreso
    if (lowerText.includes('me ') && (lowerText.includes('pag') || lowerText.includes('di'))) {
      tipo = 'ingreso';
    }
  }
  
  console.log(`🔍 Detección de tipo: "${text.substring(0, 50)}..." → Ingreso: ${puntosIngreso}, Egreso: ${puntosEgreso} → ${tipo}`);
  
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

