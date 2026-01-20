/**
 * Servicio OCR para extraer texto de imágenes de recibos
 * Usa OCR.space API (Free tier disponible)
 */

// Configuración de API
const OCR_CONFIG = {
  apiKey: 'helloworld', // API key de prueba de OCR.space
  endpoint: 'https://api.ocr.space/parse/image'
};

/**
 * Extraer texto de imagen usando OCR.space
 * @param {string} imageUri - URI de la imagen (file:// o base64)
 */
export async function extractTextFromImage(imageUri) {
  try {
    const formData = new FormData();
    
    // Si es base64, enviarlo directamente
    if (imageUri.startsWith('data:')) {
      formData.append('base64Image', imageUri);
    } else {
      // Si es una URI de archivo, convertir a objeto de archivo
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('file', {
        uri: imageUri,
        name: filename,
        type,
      });
    }
    
    formData.append('language', 'spa');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2'); // Engine 2 es mejor para recibos

    console.log('📷 Enviando imagen a OCR.space...');

    const response = await fetch(OCR_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'apikey': OCR_CONFIG.apiKey,
      },
      body: formData
    });

    const data = await response.json();
    console.log('📷 Respuesta OCR:', data);

    if (data.IsErroredOnProcessing) {
      throw new Error(data.ErrorMessage || 'Error procesando imagen');
    }

    const parsedText = data.ParsedResults?.[0]?.ParsedText || '';
    console.log('📷 Texto extraído:', parsedText);
    
    return parsedText;
  } catch (error) {
    console.error('Error OCR:', error);
    throw new Error('No se pudo procesar la imagen del recibo: ' + error.message);
  }
}

/**
 * Parsear texto del recibo para extraer información relevante
 */
export function parseReceiptText(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  const textLower = text.toLowerCase();
  
  // Resultado inicial
  const result = {
    tipo: 'egreso', // Por defecto los recibos son egresos
    monto: 0,
    descripcion: '',
    categoria: 'Otros',
    comercio: '',
    fecha: new Date(),
    confianza: 0
  };

  // Detectar si es un comprobante de ingreso
  const palabrasIngreso = ['deposito', 'depósito', 'transferencia recibida', 'abono', 'ingreso'];
  if (palabrasIngreso.some(p => textLower.includes(p))) {
    result.tipo = 'ingreso';
  }

  // Buscar monto total
  const montoPatterns = [
    /total[:\s]*\$?\s*(\d+[.,]\d{2})/i,
    /total\s+a\s+pagar[:\s]*\$?\s*(\d+[.,]\d{2})/i,
    /importe[:\s]*\$?\s*(\d+[.,]\d{2})/i,
    /monto[:\s]*\$?\s*(\d+[.,]\d{2})/i,
    /\$\s*(\d+[.,]\d{2})/,
    /(\d+[.,]\d{2})\s*(?:USD|EUR|MXN|COP|PEN|ARS)/i,
  ];

  for (const pattern of montoPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.monto = parseFloat(match[1].replace(',', '.'));
      result.confianza += 30;
      break;
    }
  }

  // Buscar comercio/establecimiento (usualmente está en las primeras líneas)
  const primerasLineas = lines.slice(0, 5);
  for (const linea of primerasLineas) {
    // Buscar líneas que parecen nombres de comercios
    if (linea.length > 3 && linea.length < 50 && !/^\d+$/.test(linea) && !/^(rfc|fecha|hora|ticket)/i.test(linea)) {
      result.comercio = linea;
      result.descripcion = linea;
      result.confianza += 20;
      break;
    }
  }

  // Detectar categoría basada en palabras clave
  const categoriaKeywords = {
    'Supermercado': ['walmart', 'soriana', 'chedraui', 'aurrera', 'oxxo', 'seven', '7-eleven', 'tienda', 'abarrotes', 'super', 'mercado'],
    'Alimentación': ['restaurante', 'comida', 'cafe', 'café', 'tacos', 'pizza', 'burger', 'subway', 'starbucks', 'mcdonald'],
    'Transporte': ['uber', 'didi', 'cabify', 'gasolinera', 'pemex', 'shell', 'estacionamiento', 'parking'],
    'Salud': ['farmacia', 'guadalajara', 'benavides', 'ahorro', 'similares', 'hospital', 'clinica', 'laboratorio'],
    'Tecnología': ['apple', 'samsung', 'telcel', 'att', 'movistar', 'elektra', 'coppel', 'liverpool'],
    'Entretenimiento': ['cine', 'cinepolis', 'cinemex', 'netflix', 'spotify', 'xbox', 'playstation'],
    'Servicios': ['cfe', 'luz', 'agua', 'gas', 'telmex', 'izzi', 'totalplay'],
    'Ropa': ['zara', 'h&m', 'bershka', 'pull', 'mango', 'ropa', 'calzado', 'andrea', 'flexi'],
  };

  for (const [categoria, keywords] of Object.entries(categoriaKeywords)) {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      result.categoria = categoria;
      result.confianza += 25;
      break;
    }
  }

  // Buscar fecha en el recibo
  const fechaPatterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
    /(\d{1,2})\s+(?:de\s+)?(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)[a-z]*\s+(?:de\s+)?(\d{2,4})/i,
  ];

  for (const pattern of fechaPatterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        // Intentar parsear la fecha
        const fecha = new Date(match[0]);
        if (!isNaN(fecha.getTime())) {
          result.fecha = fecha;
          result.confianza += 15;
        }
      } catch (e) {
        // Ignorar error de fecha
      }
      break;
    }
  }

  // Si no encontramos descripción, usar categoría
  if (!result.descripcion) {
    result.descripcion = result.categoria !== 'Otros' ? `Compra en ${result.categoria}` : 'Compra';
  }

  // Normalizar confianza
  result.confianza = Math.min(result.confianza, 100);

  return result;
}

/**
 * Función completa: extraer y parsear imagen de recibo
 */
export async function processReceiptImage(imageUri) {
  const text = await extractTextFromImage(imageUri);
  const result = parseReceiptText(text);
  result.textoOriginal = text;
  return result;
}

export default {
  extractTextFromImage,
  parseReceiptText,
  processReceiptImage
};
