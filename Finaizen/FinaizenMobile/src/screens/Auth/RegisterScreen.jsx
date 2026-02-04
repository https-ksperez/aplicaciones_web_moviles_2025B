import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Card from '../../components/ui/Card.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { COLORS } from '../../utils/constants';

/**
 * RegisterScreen - Pantalla de registro
 * Implementa formulario controlado con validación completa
 */
export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  // Estado del formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    country: 'Ecuador',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Países disponibles
  const countries = [
    { label: '🇪🇨 Ecuador', value: 'Ecuador' },
    { label: '🇲🇽 México', value: 'México' },
    { label: '🇨🇴 Colombia', value: 'Colombia' },
    { label: '🇵🇪 Perú', value: 'Perú' },
    { label: '🇦🇷 Argentina', value: 'Argentina' },
    { label: '🇨🇱 Chile', value: 'Chile' },
    { label: '🇻🇪 Venezuela', value: 'Venezuela' },
    { label: '🇪🇸 España', value: 'España' },
    { label: '🇺🇸 Estados Unidos', value: 'Estados Unidos' },
  ];

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

    if (!formData.firstName) newErrors.firstName = 'El nombre es requerido';
    if (!formData.lastName) newErrors.lastName = 'El apellido es requerido';
    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }
    if (!formData.username) newErrors.username = 'El usuario es requerido';
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
      const result = await register({
        nombre: formData.firstName,
        apellido: formData.lastName,
        correo: formData.email,
        nombreUsuario: formData.username,
        contraseña: formData.password,
        pais: formData.country,
      });
      
      if (result.success) {
        setMessage({ text: '¡Registro exitoso!', type: 'success' });
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);
      } else {
        setMessage({ 
          text: result.message || 'Error al registrar', 
          type: 'error' 
        });
      }
    } catch (error) {
      setMessage({ 
        text: 'Error al registrar. Intenta de nuevo.', 
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

          <Card style={styles.registerCard}>
            {/* Encabezado */}
            <View style={styles.registerHeader}>
              <Text style={styles.logo}>💰 Finaizen</Text>
              <Text style={styles.title}>Crea tu cuenta</Text>
              <Text style={styles.subtitle}>
                Únete y comienza a organizar tus finanzas
              </Text>
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
              <View style={styles.row}>
                <Input
                  label="Nombre"
                  value={formData.firstName}
                  onChangeText={(value) => handleChange('firstName', value)}
                  placeholder="Tu nombre"
                  error={errors.firstName}
                  style={styles.halfInput}
                />
                <Input
                  label="Apellido"
                  value={formData.lastName}
                  onChangeText={(value) => handleChange('lastName', value)}
                  placeholder="Tu apellido"
                  error={errors.lastName}
                  style={styles.halfInput}
                />
              </View>

              <Input
                label="Correo electrónico"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                placeholder="tu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <Input
                label="Nombre de usuario"
                value={formData.username}
                onChangeText={(value) => handleChange('username', value)}
                placeholder="usuario123"
                autoCapitalize="none"
                error={errors.username}
              />

              <Input
                label="Contraseña"
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                placeholder="••••••••"
                secureTextEntry
                error={errors.password}
              />

              <Input
                label="Confirmar contraseña"
                value={formData.confirmPassword}
                onChangeText={(value) => handleChange('confirmPassword', value)}
                placeholder="••••••••"
                secureTextEntry
                error={errors.confirmPassword}
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>País</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={formData.country}
                    onValueChange={(value) => handleChange('country', value)}
                    style={styles.picker}
                  >
                    {countries.map((country) => (
                      <Picker.Item 
                        key={country.value} 
                        label={country.label} 
                        value={country.value} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <Button 
                variant="brand" 
                onPress={handleSubmit}
                loading={loading}
                style={styles.submitButton}
              >
                Crear Cuenta
              </Button>
            </View>

            {/* Footer */}
            <View style={styles.registerFooter}>
              <Text style={styles.footerText}>
                ¿Ya tienes una cuenta?{' '}
                <Text 
                  style={styles.loginLink}
                  onPress={() => navigation.navigate('Login')}
                >
                  Inicia sesión aquí
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
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: '#007A7A',
    fontSize: 16,
    fontWeight: '600',
  },
  registerCard: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  registerHeader: {
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
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
    fontSize: 14,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    marginTop: 8,
  },
  registerFooter: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loginLink: {
    color: '#007A7A',
    fontWeight: '600',
  },
});
