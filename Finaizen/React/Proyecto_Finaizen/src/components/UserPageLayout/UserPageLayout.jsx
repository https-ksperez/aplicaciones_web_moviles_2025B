import { useLocation } from 'react-router-dom';
import QuickExpenseButton from '../QuickExpenseButton';

/**
 * Layout para páginas de usuario que incluye el botón flotante de registro rápido
 * Se aplica automáticamente en rutas de usuario
 */
function UserPageLayout({ children }) {
  const location = useLocation();
  
  // Páginas donde NO mostrar el botón (ej: cuando ya están en formulario de registro)
  const excludePages = [
    '/user/nuevo-ingreso',
    '/user/nuevo-egreso',
    '/login',
    '/register'
  ];

  const shouldShowButton = !excludePages.some(page => 
    location.pathname.startsWith(page)
  );

  return (
    <>
      {children}
      
      {/* Mostrar botón flotante solo en páginas permitidas */}
      {shouldShowButton && <QuickExpenseButton />}
    </>
  );
}

export default UserPageLayout;
