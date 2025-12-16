/**
 * Servicio OCR para extraer texto de imágenes de recibos
 * Soporta múltiples proveedores de OCR
 */

import apiConfig from '../config/apiConfig';

/**
 * Extraer texto de imagen usando OCR.space (Free tier)
 */
async function extractTextOCRSpace(imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('language', 'spa');
  formData.append('isOverlayRequired', false);
  formData.append('detectOrientation', true);
  formData.append('scale', true);
  formData.append('OCREngine', 2); // Engine 2 es mejor para recibos

  try {
    const response = await fetch(apiConfig.ocr.ocrSpace.endpoint, {
      method: 'POST',
      headers: {
        'apikey': apiConfig.ocr.ocrSpace.apiKey
      },
      body: formData
    });

    const data = await response.json();

    if (data.IsErroredOnProcessing) {
      throw new Error(data.ErrorMessage || 'Error procesando imagen');
    }

    return data.ParsedResults[0]?.ParsedText || '';
  } catch (error) {
    console.error('Error OCR.space:', error);
    throw new Error('No se pudo procesar la imagen del recibo');
  }
}

/**
 * Extraer texto usando Tesseract.js (Cliente, sin API key)
 */
async function extractTextTesseract(imageFile) {
  // Nota: Requiere instalar tesseract.js
  // npm install tesseract.js
  try {
    const Tesseract = await import('tesseract.js');
    
    const result = await Tesseract.recognize(
      imageFile,
      'spa', // Español
      {
        logger: m => console.log(m)
      }
    );

    return result.data.text;
  } catch (error) {
    console.error('Error Tesseract:', error);
    throw new Error('No se pudo procesar la imagen con Tesseract');
  }
}

/**
 * Extraer texto usando Google Vision API
 */
async function extractTextGoogleVision(imageFile) {
  try {
    // Convertir imagen a base64
    const base64Image = await fileToBase64(imageFile);

    const requestBody = {
      requests: [{
        image: {
          content: base64Image.split(',')[1] // Remover el prefijo data:image
        },
        features: [{
          type: 'TEXT_DETECTION',
          maxResults: 1
        }]
      }]
    };

    const response = await fetch(
      `${apiConfig.ocr.googleVision.endpoint}?key=${apiConfig.ocr.googleVision.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    const data = await response.json();

    if (data.responses[0].error) {
      throw new Error(data.responses[0].error.message);
    }

    return data.responses[0].textAnnotations?.[0]?.description || '';
  } catch (error) {
    console.error('Error Google Vision:', error);
    throw new Error('No se pudo procesar la imagen con Google Vision');
  }
}

/**
 * Convertir archivo a base64
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * Función principal para extraer texto de imagen
 * Usa el proveedor configurado
 */
export async function extractTextFromImage(imageFile) {
  const provider = apiConfig.ocr.provider;

  console.log(`Usando proveedor OCR: ${provider}`);

  switch (provider) {
    case 'google-vision':
      return await extractTextGoogleVision(imageFile);
    
    case 'tesseract':
      return await extractTextTesseract(imageFile);
    
    case 'ocr-space':
    default:
      return await extractTextOCRSpace(imageFile);
  }
}

/**
 * Parsear texto del recibo para extraer información relevante
 * Detecta si es ingreso o egreso
 */
export function parseReceiptText(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  const textLower = text.toLowerCase();
  
  // Patrones para detectar tipo de transacción
  const ingresoKeywords = ['deposito', 'depósito', 'deposit', 'ingreso', 'abono', 
                          'transferencia recibida', 'pago recibido', 'salario',
                          'cuentas de ahorro', 'cuenta de ahorro'];
  const egresoKeywords = ['compra', 'pago', 'retiro', 'gasto', 'cargo',
                         'transferencia enviada', 'debito', 'débito'];
  
  // Detectar tipo de transacción
  let tipoTransaccion = 'egreso'; // Por defecto
  let confianza = 0;
  
  for (const keyword of ingresoKeywords) {
    if (textLower.includes(keyword)) {
      tipoTransaccion = 'ingreso';
      confianza++;
    }
  }
  
  for (const keyword of egresoKeywords) {
    if (textLower.includes(keyword) && tipoTransaccion !== 'ingreso') {
      tipoTransaccion = 'egreso';
      confianza++;
    }
  }
  
  // Patrones para extraer información
  const montoPattern = /(\$|USD|€|EUR|MXN|COP|ARS)?\s*(\d+[.,]\d{2})/g;
  const fechaPattern = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/;
  const horaPattern = /(\d{1,2}):(\d{2})/;

  // Extraer montos
  const montos = [];
  let match;
  while ((match = montoPattern.exec(text)) !== null) {
    const monto = parseFloat(match[2].replace(',', '.'));
    if (!isNaN(monto)) {
      montos.push(monto);
    }
  }

  // El monto total suele ser el más grande
  const montoTotal = montos.length > 0 ? Math.max(...montos) : 0;

  // Extraer fecha
  const fechaMatch = text.match(fechaPattern);
  let fecha = new Date();
  if (fechaMatch) {
    const [, dia, mes, anio] = fechaMatch;
    const anioCompleto = anio.length === 2 ? `20${anio}` : anio;
    fecha = new Date(anioCompleto, mes - 1, dia);
  }

  // Extraer hora
  const horaMatch = text.match(horaPattern);
  let hora = '';
  if (horaMatch) {
    hora = `${horaMatch[1].padStart(2, '0')}:${horaMatch[2]}`;
  }

  // Intentar identificar el establecimiento/origen
  const establecimiento = lines.find(line => 
    line.length > 3 && 
    !montoPattern.test(line) && 
    !fechaPattern.test(line) &&
    !line.match(/^\d+$/) // No es solo números
  ) || 'Desconocido';

  // Generar descripción según tipo
  let descripcion = '';
  if (tipoTransaccion === 'ingreso') {
    if (textLower.includes('deposito') || textLower.includes('depósito')) {
      descripcion = `Depósito en ${establecimiento}`;
    } else if (textLower.includes('transferencia')) {
      descripcion = `Transferencia recibida - ${establecimiento}`;
    } else {
      descripcion = `Ingreso - ${establecimiento}`;
    }
  } else {
    descripcion = `Compra en ${establecimiento}`;
  }

  return {
    monto: montoTotal,
    descripcion: descripcion,
    tipo: tipoTransaccion, // 'ingreso' o 'egreso'
    fecha: fecha,
    hora: hora,
    establecimiento: establecimiento,
    confianza: confianza, // Nivel de confianza en la detección
    textoCompleto: text
  };
}

export default {
  extractTextFromImage,
  parseReceiptText
};
