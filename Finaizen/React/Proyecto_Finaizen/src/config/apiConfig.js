/**
 * Configuración de APIs para servicios externos
 * Almacena las claves y endpoints de las APIs utilizadas
 */

const apiConfig = {
  // OCR API - Para extraer texto de imágenes de recibos
  // Opciones: Google Cloud Vision, OCR.space, Tesseract.js
  ocr: {
    provider: 'google-vision', // 'google-vision', 'ocr-space', 'tesseract'
    
    // Google Cloud Vision API
    googleVision: {
      apiKey: import.meta.env.VITE_GOOGLE_VISION_API_KEY || '',
      endpoint: 'https://vision.googleapis.com/v1/images:annotate'
    },

    // OCR.space API (Free tier disponible)
    ocrSpace: {
      apiKey: import.meta.env.VITE_OCR_SPACE_API_KEY || 'helloworld', // API key de prueba
      endpoint: 'https://api.ocr.space/parse/image'
    }
  },

  // Speech-to-Text API - Para convertir notas de voz a texto
  // Opciones: Web Speech API (gratis), Google Cloud Speech
  speech: {
    provider: 'web-speech', // 'web-speech', 'google-speech'
    
    // Web Speech API (Nativo del navegador - GRATIS)
    webSpeech: {
      lang: 'es-ES',
      continuous: true,
      interimResults: true
    },

    // Google Cloud Speech-to-Text API
    googleSpeech: {
      apiKey: import.meta.env.VITE_GOOGLE_SPEECH_API_KEY || '',
      endpoint: 'https://speech.googleapis.com/v1/speech:recognize',
      languageCode: 'es-ES'
    }
  },

  // AI Text Processing - Para extraer información estructurada del texto
  // Opciones: OpenAI GPT, Google Gemini, Claude, etc.
  aiProcessor: {
    provider: 'openai', // 'openai', 'gemini', 'claude'
    
    // OpenAI GPT API
    openai: {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-3.5-turbo',
      maxTokens: 500
    },

    // Google Gemini API
    gemini: {
      apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      model: 'gemini-pro'
    }
  }
};

export default apiConfig;
