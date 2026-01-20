import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

export default function ConfigCuentaScreen({ navigation }) {
  const { currentUser, logout } = useAuth();

  const menuItems = [
    { id: 'cuenta', icon: '👤', title: 'Mi Cuenta', screen: 'ConfigCuenta' },
    { id: 'seguridad', icon: '🔒', title: 'Seguridad', screen: 'ConfigSeguridad' },
    { id: 'perfiles', icon: '👥', title: 'Perfiles', screen: 'ConfigPerfiles' },
    { id: 'notificaciones', icon: '🔔', title: 'Notificaciones', screen: 'ConfigNotificaciones' },
    { id: 'ayuda', icon: '❓', title: 'Ayuda', screen: 'ConfigAyuda' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Configuración</Text>
        
        {/* Perfil */}
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentUser?.nombre?.[0] || '?'}
            </Text>
          </View>
          <Text style={styles.userName}>
            {currentUser?.nombre} {currentUser?.apellido}
          </Text>
          <Text style={styles.userEmail}>{currentUser?.correo}</Text>
        </Card>

        {/* Menu */}
        <Card style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={item.id}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder
              ]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 24 },
  profileCard: { alignItems: 'center', marginBottom: 24 },
  avatar: { 
    width: 80, height: 80, borderRadius: 40, 
    backgroundColor: '#0f766e', justifyContent: 'center', 
    alignItems: 'center', marginBottom: 12 
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  userName: { fontSize: 18, fontWeight: '700', color: '#111827' },
  userEmail: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  menuCard: { padding: 0, overflow: 'hidden' },
  menuItem: { 
    flexDirection: 'row', alignItems: 'center', 
    padding: 16, gap: 12 
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  menuIcon: { fontSize: 24 },
  menuTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#111827' },
  menuArrow: { fontSize: 16, color: '#6b7280' },
  logoutBtn: { 
    marginTop: 24, padding: 16, 
    backgroundColor: '#fee2e2', borderRadius: 12, 
    alignItems: 'center' 
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#dc2626' },
});
