/**
 * Funciones auxiliares
 */

/**
 * Formatear número como moneda
 * @param {number} amount - Monto a formatear
 * @param {boolean|string} currencyOrShowSymbol - Si es boolean: mostrar símbolo. Si es string: código de moneda
 */
export const formatCurrency = (amount, currencyOrShowSymbol = 'USD') => {
  const num = parseFloat(amount) || 0;
  
  // Si es boolean false, solo formatear número sin símbolo
  if (currencyOrShowSymbol === false) {
    return num.toLocaleString('es-EC', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  
  const currency = typeof currencyOrShowSymbol === 'string' ? currencyOrShowSymbol : 'USD';
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: currency
  }).format(num);
};

/**
 * Formatear fecha
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatear fecha corta
 */
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Calcular porcentaje
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Validar email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Truncar texto
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
