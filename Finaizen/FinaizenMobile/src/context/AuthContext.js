/**
 * AuthContext - Contexto de Autenticación Global
 * Adaptado para React Native (usa AsyncStorage)
 * Incluye modo DEMO para pruebas sin backend
 */

import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/apiService';

const AuthContext = createContext(null);

// ⚠️ MODO DEMO - Cambiar a false cuando el backend esté disponible
const DEMO_MODE = false;

// Datos de prueba para modo demo
const DEMO_USER = {
  id: 1,
  nombre: 'Usuario',
  apellido: 'Demo',
  correo: 'demo@finaizen.com',
  username: 'demo',
  isPremium: false,
  createdAt: new Date().toISOString()
};

const DEMO_PERFILES = [
  {
    id: 1,
    nombre: 'Personal',
    tipo: 'personal',
    moneda: 'USD',
    balance: 2500.00,
    ingresos: 3500.00,
    egresos: 1000.00
  },
  {
    id: 2,
    nombre: 'Negocio',
    tipo: 'negocio',
    moneda: 'USD',
    balance: 8500.00,
    ingresos: 12000.00,
    egresos: 3500.00
  }
];

/**
 * Hook personalizado para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

/**
 * AuthProvider - Proveedor del contexto de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPerfil, setCurrentPerfil] = useState(null);
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode] = useState(DEMO_MODE);

  // Cargar sesión guardada al iniciar
  useEffect(() => {
    const loadSession = async () => {
      try {
        // En modo demo, verificar si hay sesión demo guardada
        if (DEMO_MODE) {
          const demoSession = await AsyncStorage.getItem('finaizen_demo_session');
          if (demoSession) {
            console.log('🎮 Modo DEMO - Cargando sesión demo...');
            setCurrentUser(DEMO_USER);
            setPerfiles(DEMO_PERFILES);
            setCurrentPerfil(DEMO_PERFILES[0]);
          }
          setLoading(false);
          return;
        }

        const token = await AsyncStorage.getItem('authToken');
        const savedSession = await AsyncStorage.getItem('finaizen_session');
        
        if (token && savedSession) {
          const { perfilId } = JSON.parse(savedSession);
          
          console.log('🔄 Cargando sesión desde backend...');
          
          // Obtener usuario del backend
          const userData = await apiService.auth.me();
          console.log('✅ Usuario cargado:', userData);
          
          setCurrentUser(userData.user);
          
          // Obtener perfiles del backend
          const perfilesData = await apiService.perfiles.getAll();
          console.log('✅ Perfiles cargados:', perfilesData);
          
          setPerfiles(perfilesData);
          
          // Establecer perfil activo
          const perfil = perfilesData.find(p => p.id === perfilId) || perfilesData[0];
          if (perfil) {
            setCurrentPerfil(perfil);
          }
        }
      } catch (error) {
        console.error('❌ Error al cargar sesión:', error);
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('finaizen_session');
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  /**
   * Inicia sesión
   */
  const login = async (correoOUsername, contraseña) => {
    try {
      console.log('🔐 Iniciando sesión...');
      
      // MODO DEMO - Login simulado
      if (DEMO_MODE) {
        console.log('🎮 Modo DEMO - Login simulado');
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Aceptar cualquier credencial en modo demo
        setCurrentUser(DEMO_USER);
        setPerfiles(DEMO_PERFILES);
        setCurrentPerfil(DEMO_PERFILES[0]);
        
        await AsyncStorage.setItem('finaizen_demo_session', JSON.stringify({
          userId: DEMO_USER.id,
          perfilId: DEMO_PERFILES[0].id
        }));
        
        return { success: true, user: DEMO_USER };
      }
      
      const result = await apiService.auth.login({
        correo: correoOUsername,
        contraseña: contraseña
      });
      
      console.log('✅ Login exitoso:', result);
      
      if (result.user) {
        setCurrentUser(result.user);
        
        // Guardar token
        if (result.token) {
          await AsyncStorage.setItem('authToken', result.token);
        }
        
        // Obtener perfiles del usuario
        const perfilesData = await apiService.perfiles.getAll();
        setPerfiles(perfilesData);
        
        if (perfilesData.length > 0) {
          setCurrentPerfil(perfilesData[0]);
          
          await AsyncStorage.setItem('finaizen_session', JSON.stringify({
            userId: result.user.id,
            perfilId: perfilesData[0].id
          }));
        }
        
        return { success: true, user: result.user };
      }
      
      return { success: false, message: 'Error al iniciar sesión' };
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { success: false, message: error.message };
    }
  };

  /**
   * Registra un nuevo usuario
   */
  const register = async (userData) => {
    try {
      console.log('📝 Registrando usuario...');
      
      // MODO DEMO - Registro simulado
      if (DEMO_MODE) {
        console.log('🎮 Modo DEMO - Registro simulado');
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const newUser = {
          ...DEMO_USER,
          nombre: userData.nombre || 'Usuario',
          apellido: userData.apellido || 'Nuevo',
          correo: userData.correo,
          username: userData.username
        };
        
        return { success: true, user: newUser };
      }
      
      const result = await apiService.auth.register(userData);
      console.log('✅ Registro exitoso:', result);
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('❌ Error en registro:', error);
      return { success: false, message: error.message };
    }
  };

  /**
   * Cierra sesión
   */
  const logout = async () => {
    try {
      if (!DEMO_MODE) {
        await apiService.auth.logout();
      }
      
      // Limpiar estado y storage
      setCurrentUser(null);
      setCurrentPerfil(null);
      setPerfiles([]);
      
      await AsyncStorage.removeItem('finaizen_demo_session');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('finaizen_session');
      
      console.log('👋 Sesión cerrada');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  /**
   * Cambiar perfil activo
   */
  const cambiarPerfil = async (perfilId) => {
    const perfil = perfiles.find(p => p.id === perfilId);
    if (perfil) {
      setCurrentPerfil(perfil);
      
      const session = await AsyncStorage.getItem('finaizen_session');
      if (session) {
        const data = JSON.parse(session);
        data.perfilId = perfilId;
        await AsyncStorage.setItem('finaizen_session', JSON.stringify(data));
      }
    }
  };

  const value = {
    currentUser,
    currentPerfil,
    perfiles,
    loading,
    isAuthenticated: !!currentUser,
    isDemoMode,
    login,
    register,
    logout,
    cambiarPerfil
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
