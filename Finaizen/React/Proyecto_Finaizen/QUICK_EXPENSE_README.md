# 📱 Registro Rápido de Gastos - Finaizen

## 🎯 Descripción

Sistema de registro rápido de gastos que permite a los usuarios agregar transacciones mediante:

1. **📷 Escaneo de Recibos** - Toma una foto del recibo y extrae automáticamente la información
2. **🎤 Notas de Voz** - Di tu gasto y el sistema lo registra automáticamente
3. **✏️ Entrada Manual** - Formulario rápido tradicional

## 🚀 Características

### Botón Flotante
- Aparece en la esquina inferior derecha en dispositivos móviles
- Menú expandible con 3 opciones de registro
- Animación de pulso para llamar la atención
- Oculto automáticamente en desktop

### Escaneo de Recibos (OCR)
- Captura desde cámara o galería
- Extracción automática de:
  - Monto total
  - Fecha de compra
  - Nombre del establecimiento
  - Hora de transacción
- Previsualización de imagen capturada
- Edición manual de datos extraídos

### Notas de Voz
- Reconocimiento de voz en tiempo real
- Transcripción automática
- Extracción inteligente de:
  - Monto del gasto
  - Categoría (basada en palabras clave)
  - Descripción
- Indicador visual de grabación

### Confirmación y Edición
- Vista de confirmación antes de guardar
- Todos los campos editables
- Selección de categoría
- Ajuste de fecha

## 📦 Instalación

### 1. Instalar Dependencias

```bash
# No requiere dependencias adicionales obligatorias
# El sistema usa Web Speech API nativa del navegador

# OPCIONAL: Para OCR offline con Tesseract
npm install tesseract.js
```

### 2. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env
```

### 3. Configurar API Keys (Opcional)

#### Opción 1: Configuración Básica (GRATIS) ✅
**No requiere configuración adicional**
- OCR: OCR.space con API key de prueba incluida
- Speech: Web Speech API (nativa del navegador)

#### Opción 2: Configuración Avanzada (Mejor precisión)

**Google Cloud Vision (OCR)**
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear/seleccionar proyecto
3. Habilitar "Cloud Vision API"
4. Crear credenciales (API Key)
5. Agregar a `.env`:
```
VITE_GOOGLE_VISION_API_KEY=tu_api_key_aqui
```

**OpenAI GPT (Análisis de texto)**
1. Ir a [OpenAI Platform](https://platform.openai.com/)
2. Crear API key
3. Agregar a `.env`:
```
VITE_OPENAI_API_KEY=tu_api_key_aqui
```

## 🔧 Configuración

### Archivo: `src/config/apiConfig.js`

```javascript
const apiConfig = {
  ocr: {
    provider: 'ocr-space', // 'google-vision', 'tesseract', 'ocr-space'
    // ... configuraciones
  },
  speech: {
    provider: 'web-speech', // Gratis y nativo
    // ... configuraciones
  }
};
```

### Cambiar Proveedor de OCR

```javascript
// En apiConfig.js, cambiar:
ocr: {
  provider: 'google-vision', // o 'tesseract' para offline
}
```

## 💻 Uso

### Integrar en Página

```jsx
import QuickExpenseButton from '../components/QuickExpenseButton';

function MiPagina() {
  return (
    <div>
      {/* Tu contenido */}
      
      {/* Botón flotante - solo visible en móvil */}
      <QuickExpenseButton />
    </div>
  );
}
```

### Ejemplo Completo

```jsx
import { useState } from 'react';
import QuickExpenseButton from '../components/QuickExpenseButton';
import QuickExpenseModal from '../components/QuickExpenseModal';

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <h1>Mi Dashboard</h1>
      
      {/* Botón flotante automático */}
      <QuickExpenseButton />
      
      {/* O usar modal directamente */}
      <button onClick={() => setModalOpen(true)}>
        Agregar Gasto
      </button>
      
      <QuickExpenseModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
```

## 🎨 Personalización CSS

### Cambiar Posición del Botón

```css
/* En QuickExpenseButton.module.css */
.fabContainer {
  bottom: 80px;  /* Cambiar altura */
  right: 20px;   /* Cambiar posición horizontal */
}
```

### Cambiar Colores

```css
.fabButton {
  background: linear-gradient(135deg, #tu-color-1, #tu-color-2);
}

.fabOption.camera {
  background: linear-gradient(135deg, #tu-color-azul-1, #tu-color-azul-2);
}
```

## 📱 Compatibilidad

### OCR (Escaneo de Recibos)
- ✅ Todos los navegadores modernos (usando OCR.space API)
- ✅ Chrome, Firefox, Safari, Edge

### Speech-to-Text (Notas de Voz)
- ✅ Chrome (Desktop y Android)
- ✅ Edge (Desktop)
- ✅ Safari (iOS 14.5+)
- ⚠️ Firefox (limitado, requiere configuración)
- ❌ Navegadores antiguos

### Verificar Compatibilidad

```javascript
import { isSpeechRecognitionSupported } from './services/speechService';

if (isSpeechRecognitionSupported()) {
  console.log('✅ Reconocimiento de voz disponible');
} else {
  console.log('❌ Reconocimiento de voz no disponible');
}
```

## 🔍 Categorías Automáticas

El sistema reconoce palabras clave para categorizar gastos automáticamente:

| Categoría | Palabras Clave |
|-----------|----------------|
| Alimentación | comida, restaurante, mercado, super, almuerzo, cena |
| Transporte | taxi, uber, bus, metro, gasolina, combustible |
| Entretenimiento | cine, concierto, juego, diversión |
| Salud | farmacia, doctor, medicina, hospital |
| Servicios | luz, agua, internet, teléfono |
| Educación | libro, curso, escuela, universidad |
| Ropa | ropa, zapatos, vestido, camisa |
| Hogar | mueble, decoración, casa |

## 🐛 Solución de Problemas

### OCR no funciona
```javascript
// Verificar configuración en apiConfig.js
// Asegurarse de tener API key válida
// Revisar consola para errores específicos
```

### Reconocimiento de voz no funciona
```javascript
// 1. Verificar permisos del navegador
// 2. Usar HTTPS (requerido para micrófono)
// 3. Verificar compatibilidad del navegador
```

### Imagen no se procesa
```javascript
// 1. Verificar tamaño de imagen (< 5MB recomendado)
// 2. Usar formatos JPG o PNG
// 3. Asegurar buena iluminación en la foto
```

## 📊 Estructura de Datos

### Metadata Guardada

```javascript
{
  id: 123,
  tipo: 'egreso',
  monto: 150.50,
  descripcion: 'Compra en SuperMercado',
  categoria: 'alimentacion',
  fecha: '2025-12-16',
  metadata: {
    source: 'camera', // 'camera', 'voice', 'manual'
    extractedText: 'Texto completo del recibo...',
    voiceTranscript: 'Gasté ciento cincuenta pesos...'
  }
}
```

## 🚀 Próximas Mejoras

- [ ] Detección de productos individuales en recibos
- [ ] Análisis de tendencias de gastos por voz
- [ ] OCR multiidioma
- [ ] Integración con IA para sugerencias de ahorro
- [ ] Escaneo de múltiples recibos simultáneos
- [ ] Reconocimiento de códigos QR en facturas
- [ ] Exportación de recibos escaneados

## 📝 Notas Importantes

1. **HTTPS Requerido**: El reconocimiento de voz requiere HTTPS en producción
2. **Permisos**: Se solicitarán permisos de cámara y micrófono
3. **Privacidad**: Las imágenes y audio se procesan pero no se almacenan
4. **Límites API**: OCR.space free tier: 25,000 requests/mes
5. **Precisión**: La extracción de datos puede variar según calidad de la imagen

## 📄 Licencia

Este componente es parte del proyecto Finaizen.
