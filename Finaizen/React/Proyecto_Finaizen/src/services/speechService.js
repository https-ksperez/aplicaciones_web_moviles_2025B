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
  
  // Patrones para extraer monto
  const montoPatterns = [
    /(\d+(?:[.,]\d{1,2})?)\s*(?:pesos|dolares|euros|soles|quetzales)/i,
    /(?:gaste|gasto|pague|pago)\s*(\d+(?:[.,]\d{1,2})?)/i,
    /(\d+(?:[.,]\d{1,2})?)\s*(?:de|en)/i
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
  const categorias = {
    'alimentacion': ['comida', 'restaurante', 'mercado', 'super', 'almuerzo', 'cena', 'desayuno', 'alimento'],
    'transporte': ['taxi', 'uber', 'bus', 'metro', 'gasolina', 'combustible', 'transporte'],
    'entretenimiento': ['cine', 'concierto', 'juego', 'diversión', 'entretenimiento'],
    'salud': ['farmacia', 'doctor', 'medicina', 'hospital', 'consulta', 'salud'],
    'servicios': ['luz', 'agua', 'internet', 'telefono', 'servicio', 'factura'],
    'educacion': ['libro', 'curso', 'escuela', 'universidad', 'clase', 'educación'],
    'ropa': ['ropa', 'zapatos', 'vestido', 'camisa', 'pantalon'],
    'hogar': ['mueble', 'decoracion', 'casa', 'hogar']
  };

  let categoria = 'otros';
  for (const [cat, keywords] of Object.entries(categorias)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      categoria = cat;
      break;
    }
  }

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
