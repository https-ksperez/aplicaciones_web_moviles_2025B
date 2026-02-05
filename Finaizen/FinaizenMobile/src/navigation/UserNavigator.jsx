import { useState, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Text, View, StyleSheet, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import { COLORS } from '../utils/constants';
import { QuickExpenseModal } from '../components/quick-action';
import { useAuth } from '../context/AuthContext.jsx';
import apiService from '../services/apiService';

// Screens
import { 
  DashboardScreen,
  NuevoIngresoScreen,
  NuevoEgresoScreen,
  HistorialScreen,
  EditarHistorialScreen,
  AdministrarRegistrosScreen,
  PresupuestosScreen,
  PlanAhorroScreen,
  PlanDeudaScreen,
  LogrosScreen,
  NotificacionesScreen,
  RegistroVozScreen,
  RegistroFotoScreen,
} from '../screens/User';

import {
  ConfigCuentaScreen,
  ConfigSeguridadScreen,
  ConfigPerfilesScreen,
  ConfigNotificacionesScreen,
  ConfigAyudaScreen,
} from '../screens/Config';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * TabIcon - Icono para las tabs
 */
function TabIcon({ emoji, focused }) {
  const isFocused = Boolean(focused);
  return (
    <View style={[styles.tabIcon, isFocused ? styles.tabIconFocused : null]}>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
  );
}

/**
 * HomeStack - Stack para pantallas del Dashboard
 */
function HomeStack({ navigationRef }) {
  const navigation = useNavigation();
  
  // Guardar referencia de navegación para uso externo
  if (navigationRef) {
    navigationRef.current = navigation;
  }
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen name="NuevoIngreso" component={NuevoIngresoScreen} />
      <Stack.Screen name="NuevoEgreso" component={NuevoEgresoScreen} />
      <Stack.Screen name="Historial" component={HistorialScreen} />
      <Stack.Screen name="EditarHistorial" component={EditarHistorialScreen} />
      <Stack.Screen name="AdministrarRegistros" component={AdministrarRegistrosScreen} />
      <Stack.Screen name="Notificaciones" component={NotificacionesScreen} />
      <Stack.Screen name="RegistroVoz" component={RegistroVozScreen} />
      <Stack.Screen name="RegistroFoto" component={RegistroFotoScreen} />
    </Stack.Navigator>
  );
}

/**
 * FinanzasStack - Stack para pantallas de finanzas
 */
function FinanzasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="PresupuestosMain" component={PresupuestosScreen} />
      <Stack.Screen name="PlanAhorro" component={PlanAhorroScreen} />
      <Stack.Screen name="PlanDeuda" component={PlanDeudaScreen} />
    </Stack.Navigator>
  );
}

/**
 * ConfigStack - Stack para configuración
 */
function ConfigStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="ConfigCuenta" component={ConfigCuentaScreen} />
      <Stack.Screen name="ConfigSeguridad" component={ConfigSeguridadScreen} />
      <Stack.Screen name="ConfigPerfiles" component={ConfigPerfilesScreen} />
      <Stack.Screen name="ConfigNotificaciones" component={ConfigNotificacionesScreen} />
      <Stack.Screen name="ConfigAyuda" component={ConfigAyudaScreen} />
    </Stack.Navigator>
  );
}

/**
 * UserNavigator - Navegación principal para usuarios autenticados
 * Bottom Tabs: Dashboard, Finanzas, Agregar, Logros, Config
 */
export default function UserNavigator() {
  const { currentPerfil, isDemoMode } = useAuth();
  const navigationRef = useRef(null);
  
  // Estados para el menú de acciones rápidas
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  
  // Estados para el modal de registro rápido (ingreso/egreso)
  const [quickModalVisible, setQuickModalVisible] = useState(false);
  const [quickModalTipo, setQuickModalTipo] = useState('egreso');

  // Handler para guardar registro rápido
  const handleQuickSave = async (data) => {
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }
    
    // Los registros rápidos van directo al historial como ocasionales
    const registroData = {
      tipo: data.tipo,
      monto: parseFloat(data.monto),
      descripcion: data.descripcion,
      categoria: data.categoria || (data.tipo === 'ingreso' ? 'Otros' : 'Otros'),
      fechaEjecucion: new Date().toISOString(),
    };
    
    const perfilId = currentPerfil?.id || currentPerfil?._id;
    await apiService.historial.create(perfilId, registroData);
  };

  // Handlers para las opciones del menú rápido
  const handleQuickOption = (option) => {
    setShowQuickMenu(false);
    
    setTimeout(() => {
      switch (option) {
        case 'ingreso':
          // Registro rápido con modal simple
          setQuickModalTipo('ingreso');
          setQuickModalVisible(true);
          break;
        case 'egreso':
          // Registro rápido con modal simple
          setQuickModalTipo('egreso');
          setQuickModalVisible(true);
          break;
        case 'voice':
          // Navegar a pantalla de registro por voz
          navigationRef.current?.navigate('Home', {
            screen: 'RegistroVoz',
          });
          break;
        case 'photo':
          // Navegar a pantalla de registro por foto/OCR
          navigationRef.current?.navigate('Home', {
            screen: 'RegistroFoto',
          });
          break;
      }
    }, 200);
  };

  // Componente del menú de acciones rápidas
  const QuickActionsMenu = () => (
    <Modal
      visible={showQuickMenu}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowQuickMenu(false)}
    >
      <Pressable 
        style={styles.menuOverlay} 
        onPress={() => setShowQuickMenu(false)}
      >
        <View style={styles.quickMenuContainer}>
          <View style={styles.quickMenu}>
            <Text style={styles.quickMenuTitle}>Agregar Registro</Text>
            
            <TouchableOpacity 
              style={styles.quickMenuItem}
              onPress={() => handleQuickOption('ingreso')}
            >
              <View style={[styles.quickMenuIcon, { backgroundColor: '#dcfce7' }]}>
                <Text style={styles.quickMenuEmoji}>💰</Text>
              </View>
              <View style={styles.quickMenuTextContainer}>
                <Text style={styles.quickMenuItemText}>Nuevo Ingreso</Text>
                <Text style={styles.quickMenuItemSubtext}>Registrar dinero recibido</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickMenuItem}
              onPress={() => handleQuickOption('egreso')}
            >
              <View style={[styles.quickMenuIcon, { backgroundColor: '#fee2e2' }]}>
                <Text style={styles.quickMenuEmoji}>💸</Text>
              </View>
              <View style={styles.quickMenuTextContainer}>
                <Text style={styles.quickMenuItemText}>Nuevo Egreso</Text>
                <Text style={styles.quickMenuItemSubtext}>Registrar un gasto</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.quickMenuDivider} />

            <TouchableOpacity 
              style={styles.quickMenuItem}
              onPress={() => handleQuickOption('voice')}
            >
              <View style={[styles.quickMenuIcon, { backgroundColor: '#e0e7ff' }]}>
                <Text style={styles.quickMenuEmoji}>🎤</Text>
              </View>
              <View style={styles.quickMenuTextContainer}>
                <Text style={styles.quickMenuItemText}>Por Voz</Text>
                <Text style={styles.quickMenuItemSubtext}>Dictar el registro</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickMenuItem}
              onPress={() => handleQuickOption('photo')}
            >
              <View style={[styles.quickMenuIcon, { backgroundColor: '#f3e8ff' }]}>
                <Text style={styles.quickMenuEmoji}>📷</Text>
              </View>
              <View style={styles.quickMenuTextContainer}>
                <Text style={styles.quickMenuItemText}>Por Foto</Text>
                <Text style={styles.quickMenuItemSubtext}>Escanear recibo</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowQuickMenu(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );

  // Componente placeholder para la tab "Agregar" (nunca se muestra)
  const EmptyComponent = () => null;

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: '#6b7280',
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tab.Screen 
          name="Home" 
          options={{
            tabBarLabel: 'Inicio',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
          }}
        >
          {() => <HomeStack navigationRef={navigationRef} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Finanzas" 
          component={FinanzasStack}
          options={{
            tabBarLabel: 'Finanzas',
            tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
          }}
        />
        <Tab.Screen 
          name="Agregar" 
          component={EmptyComponent}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setShowQuickMenu(true);
            },
          }}
          options={{
            tabBarLabel: '',
            tabBarIcon: () => (
              <View style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
              </View>
            ),
          }}
        />
        <Tab.Screen 
          name="Logros" 
          component={LogrosScreen}
          options={{
            tabBarLabel: 'Logros',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🏆" focused={focused} />,
          }}
        />
        <Tab.Screen 
          name="Config" 
          component={ConfigStack}
          options={{
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
          }}
        />
      </Tab.Navigator>

      {/* Menú de acciones rápidas */}
      <QuickActionsMenu />

      {/* Modal para registro rápido de ingreso/egreso */}
      <QuickExpenseModal
        visible={quickModalVisible}
        onClose={() => setQuickModalVisible(false)}
        onSave={handleQuickSave}
        tipo={quickModalTipo}
        perfilId={currentPerfil?.id}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    paddingBottom: 8,
    height: 65,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  tabIcon: {
    padding: 4,
  },
  tabIconFocused: {
    backgroundColor: 'rgba(0, 122, 122, 0.1)',
    borderRadius: 8,
  },
  emoji: {
    fontSize: 22,
  },
  addButton: {
    backgroundColor: '#007A7A',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#007A7A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: -2,
  },
  // Estilos del menú de acciones rápidas
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  quickMenuContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Espacio para el tab bar
  },
  quickMenu: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  quickMenuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  quickMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  quickMenuIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  quickMenuEmoji: {
    fontSize: 24,
  },
  quickMenuTextContainer: {
    flex: 1,
  },
  quickMenuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  quickMenuItemSubtext: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  quickMenuDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 10,
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
});
