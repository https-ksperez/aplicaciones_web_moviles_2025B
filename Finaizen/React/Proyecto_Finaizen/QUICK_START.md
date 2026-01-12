# 🚀 Guía Rápida de Integración - Registro Rápido de Gastos

## ✅ Instalación Completada

Se han creado los siguientes archivos:

### Servicios y Configuración
- ✅ `src/config/apiConfig.js` - Configuración de APIs
- ✅ `src/services/ocrService.js` - Servicio de escaneo OCR
- ✅ `src/services/speechService.js` - Servicio de reconocimiento de voz

### Componentes
- ✅ `src/components/QuickExpenseButton/` - Botón flotante
- ✅ `src/components/QuickExpenseModal/` - Modal de registro
- ✅ `src/components/UserPageLayout/` - Layout con botón integrado

### Documentación
- ✅ `.env.example` - Plantilla de variables de entorno
- ✅ `QUICK_EXPENSE_README.md` - Documentación completa

## 📝 Pasos para Activar

### 1. Configurar Variables de Entorno (Opcional)

```bash
# El sistema funciona SIN configuración adicional usando:
# - OCR.space (API key de prueba incluida)
# - Web Speech API (nativa del navegador)

# Para producción, copiar .env.example:
cp .env.example .env

# Luego editar .env y agregar tus API keys
```

### 2. Verificar Integración

El botón ya está integrado en:
- ✅ **DashboardUser** - Ya agregado automáticamente

### 3. Agregar en Otras Páginas (Opcional)

**Opción A: Usar el componente directo**
```jsx
import QuickExpenseButton from '../../../components/QuickExpenseButton';

function MiPagina() {
  return (
    <div>
      {/* Tu contenido */}
      <QuickExpenseButton />
    </div>
  );
}
```

**Opción B: Usar el Layout (recomendado)**
```jsx
import UserPageLayout from '../../../components/UserPageLayout';

function MiPagina() {
  return (
    <UserPageLayout>
      {/* Tu contenido */}
    </UserPageLayout>
  );
}
```

## 🎯 Páginas Sugeridas para Agregar el Botón

```jsx
// src/pages/User/Historial/Historial.jsx
import QuickExpenseButton from '../../../components/QuickExpenseButton';
// ... agregar <QuickExpenseButton /> al final

// src/pages/User/Presupuestos/Presupuestos.jsx
import QuickExpenseButton from '../../../components/QuickExpenseButton';
// ... agregar <QuickExpenseButton /> al final

// src/pages/User/Logros/Logros.jsx
import QuickExpenseButton from '../../../components/QuickExpenseButton';
// ... agregar <QuickExpenseButton /> al final

// src/pages/User/PlanAhorro/PlanAhorro.jsx
import QuickExpenseButton from '../../../components/QuickExpenseButton';
// ... agregar <QuickExpenseButton /> al final

// src/pages/User/PlanDeuda/PlanDeuda.jsx
import QuickExpenseButton from '../../../components/QuickExpenseButton';
// ... agregar <QuickExpenseButton /> al final
```

## 🧪 Probar Funcionalidad

### 1. Iniciar Servidor
```bash
npm run dev
```

### 2. Abrir en Móvil o Modo Responsive

1. Abre Chrome DevTools (F12)
2. Haz clic en "Toggle device toolbar" (Ctrl+Shift+M)
3. Selecciona un dispositivo móvil
4. Navega a `/user/dashboard`

### 3. Probar Funciones

**📷 Escaneo de Recibo:**
1. Clic en botón flotante (+)
2. Seleccionar "Foto de recibo"
3. Tomar/seleccionar foto de un recibo
4. Esperar extracción automática
5. Confirmar y editar si es necesario

**🎤 Nota de Voz:**
1. Clic en botón flotante (+)
2. Seleccionar "Nota de voz"
3. Permitir acceso al micrófono
4. Decir: "Gasté 50 pesos en comida"
5. Detener grabación
6. Confirmar datos

**✏️ Manual:**
1. Clic en botón flotante (+)
2. Seleccionar "Manual"
3. Llenar formulario rápido
4. Confirmar

## 📱 Comportamiento del Botón

- **Móvil (< 769px)**: ✅ Visible (esquina inferior derecha)
- **Tablet (769-1024px)**: ❌ Oculto
- **Desktop (> 1024px)**: ❌ Oculto

## 🔧 Personalización

### Cambiar Posición del Botón

```css
/* src/components/QuickExpenseButton/QuickExpenseButton.module.css */
.fabContainer {
  bottom: 80px;  /* Ajustar altura */
  right: 20px;   /* Ajustar posición horizontal */
}
```

### Cambiar Proveedor de OCR

```javascript
// src/config/apiConfig.js
ocr: {
  provider: 'ocr-space', // Cambiar a 'google-vision' o 'tesseract'
}
```

### Personalizar Categorías

```javascript
// src/services/speechService.js
// Editar el objeto 'categorias' en la función parseVoiceExpense
```

## 🐛 Solución de Problemas Comunes

### El botón no aparece
```javascript
// Verificar que estás en modo móvil (< 769px)
// Verificar en consola: console.log(window.innerWidth)
```

### OCR no funciona
```javascript
// Verificar consola del navegador
// Asegurarse de que la imagen es JPG o PNG
// Verificar tamaño de imagen (< 5MB)
```

### Reconocimiento de voz no funciona
```javascript
// Debe usar HTTPS (o localhost)
// Verificar permisos del navegador
// Probar en Chrome (mejor compatibilidad)
```

### No se guarda el gasto
```javascript
// Verificar que hay un perfil seleccionado
// Revisar consola para errores
// Verificar que mockDB está funcionando
```

## 📊 Verificar que Funciona

### Consola del Navegador

Deberías ver logs como:
```
✅ Gasto rápido registrado: { id: 123, tipo: 'egreso', ... }
Usando proveedor OCR: ocr-space
```

### Verificar en Base de Datos

```javascript
// En consola del navegador:
const mockDB = require('./utils/mockDatabase');
console.log('Historial:', mockDB.historial);
// Deberías ver tu gasto con metadata.source: 'camera' o 'voice'
```

## 🎉 ¡Listo!

El sistema de registro rápido está instalado y funcionando con:
- ✅ Botón flotante en móvil
- ✅ Escaneo de recibos (OCR)
- ✅ Notas de voz (Speech-to-Text)
- ✅ Entrada manual rápida
- ✅ Guardado automático

Para más detalles, consulta: `QUICK_EXPENSE_README.md`

## 📞 Soporte

Si encuentras problemas:
1. Revisa la consola del navegador
2. Verifica que estás en modo móvil (< 769px)
3. Asegúrate de estar usando HTTPS o localhost
4. Consulta la documentación completa en QUICK_EXPENSE_README.md
