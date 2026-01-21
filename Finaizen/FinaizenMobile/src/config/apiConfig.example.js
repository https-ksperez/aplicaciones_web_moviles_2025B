/**
 * Configuración de APIs para FinaizenMobile - EJEMPLO
 * 
 * INSTRUCCIONES:
 * 1. Copia este archivo como apiConfig.js (mismo directorio)
 * 2. Reemplaza las API keys con tus propias claves
 * 3. El archivo apiConfig.js está en .gitignore para proteger tus claves
 * 
 * Para obtener las API keys:
 * - OCR.space: https://ocr.space/ocrapi (gratuito)
 * - Google Cloud: https://console.cloud.google.com/apis/credentials
 * - OpenAI: https://platform.openai.com/api-keys
 * - Google Gemini: https://makersuite.google.com/app/apikey
 */

const API_CONFIG = {
  // ===============================================
  // BACKEND API URL
  // ===============================================
  apiUrl: 'http://localhost:5000/api',

  // ===============================================
  // OCR API - Para escaneo de recibos
  // ===============================================
  ocr: {
    // OCR.space API (Free tier - 25,000 requests/month)
    ocrSpace: {
      apiKey: 'TU_OCR_SPACE_API_KEY_AQUI',
      endpoint: 'https://api.ocr.space/parse/image'
    },
    // Google Cloud Vision API
    googleVision: {
      apiKey: 'TU_GOOGLE_VISION_API_KEY_AQUI',
      endpoint: 'https://vision.googleapis.com/v1/images:annotate'
    }
  },

  // ===============================================
  // Speech-to-Text API - Para notas de voz
  // ===============================================
  speech: {
    // Google Cloud Speech-to-Text API
    google: {
      apiKey: 'TU_GOOGLE_SPEECH_API_KEY_AQUI',
      endpoint: 'https://speech.googleapis.com/v1/speech:recognize'
    },
    // OpenAI Whisper (recomendado para mejor precisión)
    openai: {
      apiKey: 'TU_OPENAI_API_KEY_AQUI',
      endpoint: 'https://api.openai.com/v1/audio/transcriptions'
    },
    // Proveedor activo: 'google' o 'openai'
    defaultProvider: 'openai'
  },

  // ===============================================
  // AI Processing API - Para análisis de texto
  // ===============================================
  ai: {
    // OpenAI GPT API
    openai: {
      apiKey: 'TU_OPENAI_API_KEY_AQUI',
      endpoint: 'https://api.openai.com/v1/chat/completions'
    },
    // Google Gemini API
    gemini: {
      apiKey: 'TU_GEMINI_API_KEY_AQUI',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
    }
  }
};

export default API_CONFIG;
