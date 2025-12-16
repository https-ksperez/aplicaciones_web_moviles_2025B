// Script de ayuda para agregar QuickExpenseButton en páginas de usuario
// NO EJECUTAR - Solo referencia para copiar/pegar

/* ========================================
   EJEMPLO 1: Historial.jsx
   ======================================== */

// 1. Agregar import al inicio del archivo:
import QuickExpenseButton from '../../../components/QuickExpenseButton';

// 2. Agregar el componente antes del cierre del return:
return (
  <div className={styles.container}>
    {/* ... contenido existente ... */}
    
    {/* Botón flotante para registro rápido (solo móvil) */}
    <QuickExpenseButton />
  </div>
);

/* ========================================
   EJEMPLO 2: Presupuestos.jsx
   ======================================== */

// 1. Import
import QuickExpenseButton from '../../../components/QuickExpenseButton';

// 2. Componente
return (
  <div className={styles.container}>
    {/* ... contenido existente ... */}
    
    <QuickExpenseButton />
  </div>
);

/* ========================================
   EJEMPLO 3: Logros.jsx
   ======================================== */

// 1. Import
import QuickExpenseButton from '../../../components/QuickExpenseButton';

// 2. Componente
return (
  <div className={styles.container}>
    {/* ... contenido existente ... */}
    
    <QuickExpenseButton />
  </div>
);

/* ========================================
   EJEMPLO 4: PlanAhorro.jsx
   ======================================== */

// 1. Import
import QuickExpenseButton from '../../../components/QuickExpenseButton';

// 2. Componente
return (
  <div className={styles.container}>
    {/* ... contenido existente ... */}
    
    <QuickExpenseButton />
  </div>
);

/* ========================================
   EJEMPLO 5: PlanDeuda.jsx
   ======================================== */

// 1. Import
import QuickExpenseButton from '../../../components/QuickExpenseButton';

// 2. Componente
return (
  <div className={styles.container}>
    {/* ... contenido existente ... */}
    
    <QuickExpenseButton />
  </div>
);

/* ========================================
   EJEMPLO 6: AdministrarRegistros.jsx
   ======================================== */

// 1. Import
import QuickExpenseButton from '../../../components/QuickExpenseButton';

// 2. Componente
return (
  <div className={styles.container}>
    {/* ... contenido existente ... */}
    
    <QuickExpenseButton />
  </div>
);

/* ========================================
   EJEMPLO 7: Notificaciones.jsx
   ======================================== */

// 1. Import
import QuickExpenseButton from '../../../components/QuickExpenseButton';

// 2. Componente
return (
  <div className={styles.container}>
    {/* ... contenido existente ... */}
    
    <QuickExpenseButton />
  </div>
);

/* ========================================
   NOTAS IMPORTANTES
   ======================================== */

/*
 * 1. El botón SOLO es visible en móvil (< 769px)
 * 2. Se oculta automáticamente en:
 *    - /user/nuevo-ingreso
 *    - /user/nuevo-egreso
 *    - /login
 *    - /register
 * 
 * 3. Si quieres ocultar en más páginas, edita:
 *    src/components/UserPageLayout/UserPageLayout.jsx
 *    y agrega la ruta en excludePages
 * 
 * 4. El botón está completamente funcional sin configuración adicional
 *    usando APIs gratuitas
 */

/* ========================================
   ALTERNATIVA: Usar UserPageLayout
   ======================================== */

// Opción más elegante - envolver toda la página:

import UserPageLayout from '../../../components/UserPageLayout';

function MiPagina() {
  return (
    <UserPageLayout>
      <div className={styles.container}>
        {/* Tu contenido aquí */}
      </div>
    </UserPageLayout>
  );
}

export default MiPagina;

/*
 * Con UserPageLayout no necesitas agregar QuickExpenseButton
 * manualmente, se agrega automáticamente
 */
