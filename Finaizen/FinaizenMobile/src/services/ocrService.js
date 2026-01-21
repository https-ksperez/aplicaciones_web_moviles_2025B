/**
 * Servicio OCR para extraer texto de imágenes de recibos
 * Usa OCR.space API (Free tier disponible)
 * 
 * Las API keys están precargadas desde apiConfig.js
 */

import API_CONFIG_GLOBAL from '../config/apiConfig';

// Configuración de API (precargada desde apiConfig.js)
const OCR_CONFIG = {
  apiKey: API_CONFIG_GLOBAL.ocr.ocrSpace.apiKey,
  endpoint: API_CONFIG_GLOBAL.ocr.ocrSpace.endpoint
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
 * MEJORADO: Análisis completo de comprobantes bancarios
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
    confianza: 0,
    detalles: {} // Información adicional extraída
  };

  // ============================================
  // ANÁLISIS INTELIGENTE DE COMPROBANTES
  // ============================================
  
  // Detectar si es un comprobante bancario
  const esBancario = /banco|bank|cuenta|ahorro|corriente|transferencia|deposito|depósito/i.test(textLower);
  
  // Extraer información del comprobante bancario
  if (esBancario) {
    // Buscar nombre del banco
    const bancoMatch = text.match(/(?:banco|bank)\s+([a-záéíóúñ\s]+?)(?:\s*[,.\n]|c\.?a\.?|s\.?a\.?)/i);
    if (bancoMatch) {
      result.detalles.banco = bancoMatch[1].trim();
    }
    
    // Buscar nombre del beneficiario/titular
    const nombreMatch = text.match(/(?:nombre|beneficiario|titular)[.:\s]+([a-záéíóúñ\s]+)/i);
    if (nombreMatch) {
      result.detalles.beneficiario = nombreMatch[1].trim();
    }
    
    // Buscar número de cuenta
    const cuentaMatch = text.match(/(?:cuenta|account)[.:\s]*([a-z\-\s]*\d+)/i);
    if (cuentaMatch) {
      result.detalles.cuenta = cuentaMatch[1].trim();
    }
    
    // Buscar tipo de cuenta
    if (textLower.includes('ahorro')) {
      result.detalles.tipoCuenta = 'Ahorro';
      result.categoria = 'Ahorro';
    } else if (textLower.includes('corriente')) {
      result.detalles.tipoCuenta = 'Corriente';
    }
  }
  
  // ============================================
  // DETECCIÓN MEJORADA DE TIPO (INGRESO/EGRESO)
  // ============================================
  
  const esDeposito = /dep[oó]sito|deposito/i.test(textLower);
  const esRetiro = /retiro|withdrawal/i.test(textLower);
  const esTransferencia = /transferencia|transfer/i.test(textLower);
  
  // Palabras que indican INGRESO (dinero que entra)
  const palabrasIngreso = [
    'deposito', 'depósito', // Depósito = dinero entrando a cuenta = INGRESO
    'transferencia recibida', 'transfer recib',
    'abono', 'abono a cuenta', 'abono en cuenta',
    'ingreso', 'ingreso a cuenta',
    'saldo a favor', 'credito', 'crédito',
    'devolucion', 'devolución', 'reembolso',
    'pago recibido', 'cobro realizado',
    'venta', 'ticket de venta',
    'factura cobrada',
    'comision ganada', 'comisión ganada',
    'premio', 'bono recibido',
    'renta cobrada', 'alquiler cobrado',
    'efectivo recibido',
    'ahorro', 'cuentas de ahorro', // Contexto bancario de ahorro
  ];
  
  // Palabras que indican EGRESO (dinero que sale)
  const palabrasEgreso = [
    'compra', 'purchase',
    'pago de', 'pago por', 'pago con', 'payment',
    'cargo', 'charge',
    'debito', 'débito', 'debit',
    'total a pagar', 'importe a pagar',
    'factura por pagar', 'invoice',
    'ticket de compra', 'recibo de compra',
    'consumo', 'comprobante de pago',
    'transferencia enviada', 'transfer env',
    'suscripcion', 'suscripción', 'subscription',
    'cuota mensual', 'fee', 'cargo por servicio',
  ];
  
  // Contar coincidencias
  let puntosIngreso = 0;
  let puntosEgreso = 0;
  
  for (const palabra of palabrasIngreso) {
    if (textLower.includes(palabra)) {
      puntosIngreso += palabra.length > 10 ? 3 : palabra.length > 6 ? 2 : 1;
    }
  }
  
  for (const palabra of palabrasEgreso) {
    if (textLower.includes(palabra)) {
      puntosEgreso += palabra.length > 10 ? 3 : palabra.length > 6 ? 2 : 1;
    }
  }
  
  // Si es un depósito bancario, dar más peso a ingreso
  if (esDeposito && esBancario) {
    puntosIngreso += 5;
  }
  
  // Si es un retiro de cajero, también es ingreso (dinero que sacas para ti)
  if (esRetiro) {
    puntosIngreso += 3;
  }
  
  // Determinar tipo final
  if (puntosIngreso > puntosEgreso) {
    result.tipo = 'ingreso';
  } else if (puntosIngreso === puntosEgreso && esDeposito) {
    // En caso de empate, si es depósito = ingreso
    result.tipo = 'ingreso';
  } else {
    result.tipo = 'egreso';
  }
  
  console.log(`📷 Análisis OCR:`);
  console.log(`   Bancario: ${esBancario}, Depósito: ${esDeposito}, Retiro: ${esRetiro}`);
  console.log(`   Puntos Ingreso: ${puntosIngreso}, Puntos Egreso: ${puntosEgreso}`);
  console.log(`   Tipo detectado: ${result.tipo}`);
  if (result.detalles.beneficiario) {
    console.log(`   Beneficiario: ${result.detalles.beneficiario}`);
  }

  // Buscar monto - mejorado para comprobantes bancarios
  const montoPatterns = [
    /total[.:\s]*\$?\s*(\d+[.,]\d{2})/i,
    /efectivo[.:\s]*\$?\s*(\d+[.,]\d{2})/i,
    /monto[.:\s]*\$?\s*(\d+[.,]\d{2})/i,
    /importe[.:\s]*\$?\s*(\d+[.,]\d{2})/i,
    /valor[.:\s]*\$?\s*(\d+[.,]\d{2})/i,
    /\$\s*(\d+[.,]\d{2})/,
    /(\d+[.,]\d{2})\s*(?:USD|EUR|MXN|COP|PEN|ARS|ECU)/i,
    // Patrón genérico para números grandes que parecen montos
    /(\d{2,}[.,]\d{2})/,
  ];

  for (const pattern of montoPatterns) {
    const match = text.match(pattern);
    if (match) {
      const montoCandidate = parseFloat(match[1].replace(',', '.'));
      // Solo aceptar si el monto es razonable (> 0 y no parece ser una fecha/ID)
      if (montoCandidate > 0 && montoCandidate < 1000000) {
        result.monto = montoCandidate;
        result.confianza += 30;
        break;
      }
    }
  }

  // Buscar comercio/banco (primeras líneas significativas)
  const primerasLineas = lines.slice(0, 5);
  for (const linea of primerasLineas) {
    // Buscar líneas que parecen nombres de comercios/bancos
    if (linea.length > 3 && linea.length < 50 && !/^\d+$/.test(linea) && !/^(rfc|fecha|hora|ticket|control)/i.test(linea)) {
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
