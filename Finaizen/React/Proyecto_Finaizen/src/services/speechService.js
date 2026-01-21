/**
 * Servicio de Speech-to-Text para convertir notas de voz a texto
 * Usa Web Speech API (nativa del navegador) por defecto
 */

import apiConfig from '../config/apiConfig';

/**
 * Verificar si el navegador soporta Web Speech API
 */
export function isSpeechRecognitionSupported() {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

/**
 * Clase para manejar el reconocimiento de voz
 */
export class VoiceRecognition {
  constructor() {
    if (!isSpeechRecognitionSupported()) {
      throw new Error('El navegador no soporta reconocimiento de voz');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configuración
    const config = apiConfig.speech.webSpeech;
    this.recognition.lang = config.lang;
    this.recognition.continuous = config.continuous;
    this.recognition.interimResults = config.interimResults;

    // Callbacks
    this.onResult = null;
    this.onError = null;
    this.onEnd = null;

    // Estado
    this.isListening = false;
    this.finalTranscript = '';
    this.interimTranscript = '';

    // Configurar eventos
    this.setupEvents();
  }

  setupEvents() {
    this.recognition.onresult = (event) => {
      let interim = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          this.finalTranscript += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      this.interimTranscript = interim;

      if (this.onResult) {
        this.onResult({
          final: this.finalTranscript.trim(),
          interim: this.interimTranscript,
          isFinal: event.results[event.results.length - 1].isFinal
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Error de reconocimiento de voz:', event.error);
      this.isListening = false;
      
      if (this.onError) {
        this.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      
      if (this.onEnd) {
        this.onEnd(this.finalTranscript.trim());
      }
    };
  }

  /**
   * Iniciar grabación de voz
   */
  start() {
    if (this.isListening) {
      console.warn('Ya se está escuchando');
      return;
    }

    this.finalTranscript = '';
    this.interimTranscript = '';
    this.isListening = true;

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error al iniciar reconocimiento:', error);
      this.isListening = false;
      throw error;
    }
  }

  /**
   * Detener grabación de voz
   */
  stop() {
    if (!this.isListening) {
      return;
    }

    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Error al detener reconocimiento:', error);
    }
  }

  /**
   * Cancelar y limpiar
   */
  abort() {
    try {
      this.recognition.abort();
      this.isListening = false;
      this.finalTranscript = '';
      this.interimTranscript = '';
    } catch (error) {
      console.error('Error al abortar reconocimiento:', error);
    }
  }
}

/**
 * Función auxiliar para parsear texto de voz y extraer información de gasto
 */
export function parseVoiceExpense(text) {
  const lowerText = text.toLowerCase();
  
  // Patrones para extraer monto (mejorados)
  const montoPatterns = [
    // "50 dólares de McDonald's" - número seguido de moneda
    /(\d+(?:[.,]\d{1,2})?)\s*(?:pesos|dolares|dólares|euros|soles|quetzales|dollars)/i,
    // "gasté 50 en comida"
    /(?:gaste|gasté|gasto|pague|pagué|pago|compre|compré)\s*(\d+(?:[.,]\d{1,2})?)/i,
    // "50 de taxi" o "50 en comida"
    /(\d+(?:[.,]\d{1,2})?)\s*(?:de|en|por)\s/i,
    // "$50" o "$ 50"
    /\$\s*(\d+(?:[.,]\d{1,2})?)/i,
    // Cualquier número al inicio del texto
    /^(\d+(?:[.,]\d{1,2})?)/i,
    // Cualquier número en el texto
    /(\d+(?:[.,]\d{1,2})?)/i
  ];

  let monto = 0;
  for (const pattern of montoPatterns) {
    const match = text.match(pattern);
    if (match) {
      monto = parseFloat(match[1].replace(',', '.'));
      if (monto > 0) break; // Si encontramos un monto válido, salimos
    }
  }

  // Extraer categoría basada en palabras clave
  const categorias = {
    'Alimentación': ['comida', 'restaurante', 'mercado', 'super', 'almuerzo', 'cena', 'desayuno', 'alimento', 'mcdonald', 'burger', 'pizza', 'cafe', 'café', 'tacos', 'pollo'],
    'Transporte': ['taxi', 'uber', 'bus', 'metro', 'gasolina', 'combustible', 'transporte', 'didi', 'cabify'],
    'Entretenimiento': ['cine', 'concierto', 'juego', 'diversión', 'entretenimiento', 'netflix', 'spotify'],
    'Salud': ['farmacia', 'doctor', 'medicina', 'hospital', 'consulta', 'salud', 'medico', 'médico'],
    'Servicios': ['luz', 'agua', 'internet', 'telefono', 'teléfono', 'servicio', 'factura', 'cable'],
    'Educación': ['libro', 'curso', 'escuela', 'universidad', 'clase', 'educación'],
    'Ropa': ['ropa', 'zapatos', 'vestido', 'camisa', 'pantalon', 'pantalón'],
    'Hogar': ['mueble', 'decoracion', 'decoración', 'casa', 'hogar']
  };

  let categoria = 'Otros';
  for (const [cat, keywords] of Object.entries(categorias)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      categoria = cat;
      break;
    }
  }

  console.log(`🎤 Parseado: "${text}" → Monto: ${monto}, Categoría: ${categoria}`);

  return {
    monto: monto || 0,
    descripcion: text,
    categoria: categoria,
    fecha: new Date()
  };
}

export default {
  VoiceRecognition,
  isSpeechRecognitionSupported,
  parseVoiceExpense
};
