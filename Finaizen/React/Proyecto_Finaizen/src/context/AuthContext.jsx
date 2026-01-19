import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

/**
 * AuthContext - Contexto de Autenticación Global
 * Maneja el estado de autenticación en toda la aplicación
 * Conectado al backend PostgreSQL
 */
const AuthContext = createContext(null);

/**
 * Hook personalizado para usar el contexto de autenticación
 * @returns {Object} Contexto de autenticación
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

/**
 * AuthProvider - Proveedor del contexto de autenticación
 * Envuelve la aplicación para proveer estado global de auth
 */
export const AuthProvider = ({ children }) => {
  // Estados
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPerfil, setCurrentPerfil] = useState(null);
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar sesión guardada al iniciar
  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        const savedSession = sessionStorage.getItem('finaizen_session');
        
        if (token && savedSession) {
          const { userId, perfilId } = JSON.parse(savedSession);
          
          console.log('🔄 Cargando sesión desde backend...');
          
          // Obtener usuario del backend
          const userData = await apiService.auth.me();
          console.log('✅ Usuario cargado desde backend:', userData);
          
          setCurrentUser(userData.user);
          
          // Obtener perfiles del backend
          const perfilesData = await apiService.perfiles.getAll();
          console.log('✅ Perfiles cargados desde backend:', perfilesData);
          
          setPerfiles(perfilesData);
          
          // Establecer perfil activo
          const perfil = perfilesData.find(p => p.id === perfilId) || perfilesData[0];
          if (perfil) {
            setCurrentPerfil(perfil);
            console.log('✅ Perfil activo:', perfil.nombre);
          }
        }
      } catch (error) {
        console.error('❌ Error al cargar sesión:', error);
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('finaizen_session');
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  /**
   * Inicia sesión
   * @param {string} correoOUsername - Correo o nombre de usuario
   * @param {string} contraseña - Contraseña
   * @returns {Object} Resultado del login
   */
  const login = async (correoOUsername, contraseña) => {
    try {
      console.log('🔐 Iniciando sesión con backend...');
      
      // Llamar al API de login con el formato correcto
      const result = await apiService.auth.login({
        correo: correoOUsername,
        contraseña: contraseña
      });
      
      console.log('✅ Login exitoso desde backend:', result);
      
      if (result.user) {
        setCurrentUser(result.user);
        
        // Obtener perfiles del usuario
        const perfilesData = await apiService.perfiles.getAll();
        setPerfiles(perfilesData);
        
        // Establecer primer perfil como activo
        const perfil = perfilesData[0];
        if (perfil) {
          setCurrentPerfil(perfil);
          
          // Guardar sesión (sessionStorage para sesión aislada por pestaña)
          sessionStorage.setItem('finaizen_session', JSON.stringify({
            userId: result.user.id,
            perfilId: perfil.id
          }));
        }
        
        return {
          success: true,
          user: result.user,
          perfil
        };
      }
      
      return {
        success: false,
        message: 'Error al obtener datos del usuario'
      };
    } catch (error) {
      console.error('❌ Error en login:', error);
      return {
        success: false,
        message: error.message || 'Credenciales inválidas'
      };
    }
  };

  /**
   * Cierra sesión
   */
  const logout = () => {
    console.log('👋 Cerrando sesión...');
    
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('finaizen_session');
    
    setCurrentUser(null);
    setCurrentPerfil(null);
    setPerfiles([]);
  };

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Object} Resultado del registro
   */
  const register = async (userData) => {
    try {
      console.log('📝 Registrando nuevo usuario...');
      
      const result = await apiService.auth.register(userData);
      
      console.log('✅ Registro exitoso:', result);
      
      if (result.user) {
        setCurrentUser(result.user);
        
        // Obtener perfiles
        const perfilesData = await apiService.perfiles.getAll();
        setPerfiles(perfilesData);
        
        const perfil = perfilesData[0];
        if (perfil) {
          setCurrentPerfil(perfil);
          
          sessionStorage.setItem('finaizen_session', JSON.stringify({
            userId: result.user.id,
            perfilId: perfil.id
          }));
        }
        
        return {
          success: true,
          user: result.user,
          perfil
        };
      }
      
      return {
        success: false,
        message: 'Error al crear usuario'
      };
    } catch (error) {
      console.error('❌ Error en registro:', error);
      return {
        success: false,
        message: error.message || 'Error al registrar usuario'
      };
    }
  };

  /**
   * Cambia el perfil activo
   * @param {string} perfilId - ID del perfil
   */
  const cambiarPerfil = (perfilId) => {
    const perfil = perfiles.find(p => p.id === perfilId);
    if (perfil && currentUser) {
      setCurrentPerfil(perfil);
      
      console.log('🔄 Perfil cambiado a:', perfil.nombre);

      // Actualizar sesión guardada
      const session = JSON.parse(sessionStorage.getItem('finaizen_session') || '{}');
      session.perfilId = perfilId;
      sessionStorage.setItem('finaizen_session', JSON.stringify(session));
    }
  };

  /**
   * Actualiza la información del usuario actual
   * @param {Object} updatedUser - Datos actualizados del usuario
   */
  const updateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    
    // Actualizar sesión guardada
    const session = JSON.parse(sessionStorage.getItem('finaizen_session') || '{}');
    session.userId = updatedUser.id;
    sessionStorage.setItem('finaizen_session', JSON.stringify(session));
  };

  /**
   * Actualiza la lista de perfiles (útil después de crear uno nuevo)
   */
  const actualizarPerfiles = async () => {
    if (currentUser) {
      try {
        const perfilesData = await apiService.perfiles.getAll();
        setPerfiles(perfilesData);
        console.log('✅ Perfiles actualizados desde backend');
      } catch (error) {
        console.error('❌ Error al actualizar perfiles:', error);
      }
    }
  };

  // Valor del contexto
  const value = {
    // Estado
    currentUser,
    currentPerfil,
    perfiles,
    loading,
    
    // Computed
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.esAdmin || false,
    
    // Métodos
    login,
    logout,
    register,
    cambiarPerfil,
    updateUser,
    actualizarPerfiles
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
