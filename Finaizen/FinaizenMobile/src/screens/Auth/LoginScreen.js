import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/constants';

/**
 * LoginScreen - Pantalla de inicio de sesión
 * Implementa formulario controlado con validación
 */
export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  // Estado del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Manejo de cambios en inputs
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El correo o nombre de usuario es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo del submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setMessage({ text: '¡Inicio de sesión exitoso!', type: 'success' });
        // La navegación se manejará automáticamente por el AuthContext
      } else {
        setMessage({ 
          text: result.message || 'Credenciales incorrectas', 
          type: 'error' 
        });
      }
    } catch (error) {
      setMessage({ 
        text: 'Error al iniciar sesión. Intenta de nuevo.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>

          <Card style={styles.loginCard}>
            {/* Encabezado */}
            <View style={styles.loginHeader}>
              <Text style={styles.logo}>💰 Finaizen</Text>
              <Text style={styles.title}>Bienvenido de nuevo</Text>
              <Text style={styles.subtitle}>
                Inicia sesión para continuar con Finaizen
              </Text>
            </View>

            {/* Banner de Modo Demo */}
            <View style={styles.demoBanner}>
              <Text style={styles.demoBannerIcon}>🎮</Text>
              <View style={styles.demoBannerContent}>
                <Text style={styles.demoBannerTitle}>Modo Demo Activo</Text>
                <Text style={styles.demoBannerText}>
                  Usa cualquier credencial para probar la app
                </Text>
              </View>
            </View>

            {/* Mensaje de notificación */}
            {message.text ? (
              <View style={[
                styles.messageBanner,
                message.type === 'success' ? styles.successBanner : styles.errorBanner
              ]}>
                <Text style={[
                  styles.messageText,
                  message.type === 'success' ? styles.successText : styles.errorText
                ]}>
                  {message.text}
                </Text>
              </View>
            ) : null}

            {/* Formulario */}
            <View style={styles.form}>
              <Input
                label="Correo electrónico o usuario"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                placeholder="tu@email.com o usuario"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <Input
                label="Contraseña"
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                placeholder="••••••••"
                secureTextEntry
                error={errors.password}
              />

              <TouchableOpacity style={styles.forgotLink}>
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              <Button 
                variant="brand" 
                onPress={handleSubmit}
                loading={loading}
                style={styles.submitButton}
              >
                Iniciar Sesión
              </Button>
            </View>

            {/* Footer */}
            <View style={styles.loginFooter}>
              <Text style={styles.footerText}>
                ¿No tienes una cuenta?{' '}
                <Text 
                  style={styles.registerLink}
                  onPress={() => navigation.navigate('Register')}
                >
                  Regístrate aquí
                </Text>
              </Text>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: '#007A7A',
    fontSize: 16,
    fontWeight: '600',
  },
  loginCard: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 32,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  demoBannerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  demoBannerContent: {
    flex: 1,
  },
  demoBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
  },
  demoBannerText: {
    fontSize: 12,
    color: '#a16207',
    marginTop: 2,
  },
  messageBanner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successBanner: {
    backgroundColor: '#d1fae5',
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
  },
  messageText: {
    textAlign: 'center',
    fontSize: 14,
  },
  successText: {
    color: '#065f46',
  },
  errorText: {
    color: '#991b1b',
  },
  form: {
    gap: 8,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    color: '#007A7A',
    fontSize: 14,
  },
  submitButton: {
    marginTop: 8,
  },
  loginFooter: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  registerLink: {
    color: '#007A7A',
    fontWeight: '600',
  },
});
