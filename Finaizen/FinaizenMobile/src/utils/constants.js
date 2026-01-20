/**
 * Constantes de la aplicación
 */

// Colores del tema
export const COLORS = {
  primary: '#6C63FF',
  primaryDark: '#5A52D5',
  secondary: '#4ECDC4',
  success: '#28A745',
  danger: '#DC3545',
  warning: '#FFC107',
  info: '#17A2B8',
  light: '#F8F9FA',
  dark: '#343A40',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6C757D',
  grayLight: '#E9ECEF',
  background: '#F5F7FA',
};

// Tipografía
export const FONTS = {
  regular: 'System',
  bold: 'System',
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
  }
};

// Espaciado
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Categorías de gastos
export const CATEGORIAS_EGRESO = [
  { id: 'alimentacion', nombre: 'Alimentación', icono: '🍔' },
  { id: 'transporte', nombre: 'Transporte', icono: '🚗' },
  { id: 'entretenimiento', nombre: 'Entretenimiento', icono: '🎮' },
  { id: 'salud', nombre: 'Salud', icono: '🏥' },
  { id: 'educacion', nombre: 'Educación', icono: '📚' },
  { id: 'servicios', nombre: 'Servicios', icono: '💡' },
  { id: 'compras', nombre: 'Compras', icono: '🛒' },
  { id: 'otros', nombre: 'Otros', icono: '📦' },
];

// Categorías de ingresos
export const CATEGORIAS_INGRESO = [
  { id: 'salario', nombre: 'Salario', icono: '💰' },
  { id: 'freelance', nombre: 'Freelance', icono: '💻' },
  { id: 'inversiones', nombre: 'Inversiones', icono: '📈' },
  { id: 'regalo', nombre: 'Regalo', icono: '🎁' },
  { id: 'otros', nombre: 'Otros', icono: '📦' },
];
