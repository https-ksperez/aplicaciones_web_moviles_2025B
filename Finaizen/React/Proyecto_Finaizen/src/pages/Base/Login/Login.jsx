import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Navbar, Footer } from '../../../components/layout';
import { Button, Input, SocialButton } from '../../../components/ui';
import styles from './Login.module.css';

/**
 * Página de Login
 * Implementa:
 * - useState para manejo de estado del formulario
 * - Formularios controlados (inputs vinculados al estado)
 * - Manejo de eventos onChange/onSubmit
 * - Validación básica
 */
function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Estado del formulario (useState)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  // Estado para errores
  const [errors, setErrors] = useState({});

  // Estado para mensaje de éxito/error
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success'); // 'success' | 'error'

  // Manejo de cambios en inputs (onChange)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo al escribir
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
    // Permitir tanto correo como nombre de usuario (sin validar formato)

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo del submit (onSubmit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Login con backend API
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          setMessageType('success');
          setMessage('¡Inicio de sesión exitoso! Redirigiendo...');
          
          // Redirigir según el rol del usuario
          setTimeout(() => {
            if (result.user.rol === 'admin') {
              navigate('/admin/dashboard');
            } else {
              navigate('/user/dashboard');
            }
          }, 1000);
        } else {
          setMessageType('error');
          setMessage(result.message || 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.');
        }
      } catch (error) {
        setMessageType('error');
        setMessage('Error al iniciar sesión. Por favor, intenta de nuevo.');
        console.error('Error en login:', error);
      }
    }
  };

  // Manejo de login social
  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    setMessage(`Iniciando sesión con ${provider}...`);
  };

  return (
    <div className={styles.loginPage}>
      <Navbar />
      
      <section className={styles.loginContainer}>
        <div className={styles.loginCard}>
          {/* Encabezado */}
          <div className={styles.loginHeader}>
            <h1>Bienvenido de nuevo</h1>
            <p>Inicia sesión para continuar con Finaizen</p>
          </div>

          {/* Mensaje de notificación */}
          {message && (
            <div className={`${styles.messageBanner} ${styles[messageType]}`}>
              {message}
            </div>
          )}

          {/* Formulario de Login */}
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            {/* Campo de Email o Usuario */}
            <Input
              label="Correo electrónico o nombre de usuario"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com o usuario"
              required
              error={errors.email}
            />

            {/* Campo de Contraseña */}
            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              error={errors.password}
              autoComplete="current-password"
            />

            {/* Recordarme y Olvidé contraseña */}
            <div className={styles.loginOptions}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                Recordarme
              </label>
              <Link to="/forgot-password" className={styles.forgotLink}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón de Submit */}
            <Button type="submit" variant="brand" className={styles.wFull}>
              Iniciar Sesión
            </Button>

            {/* Divisor */}
            <div className={styles.divider}>
              <span>O continúa con</span>
            </div>

            {/* Botones de Redes Sociales */}
            <div className={styles.socialButtons}>
              <SocialButton 
                provider="google" 
                onClick={() => handleSocialLogin('Google')}
              />
              <SocialButton 
                provider="facebook" 
                onClick={() => handleSocialLogin('Facebook')}
              />
            </div>
          </form>

          {/* Enlace para Registrarse */}
          <div className={styles.loginFooter}>
            <p>
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className={styles.registerLink}>
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Mensaje de Ayuda */}
        <div className={styles.helpText}>
          <p>
            ¿Necesitas ayuda?{' '}
            <a href="#" className={styles.helpLink}>Contacta con soporte</a>
          </p>
        </div>
      </section>

      <Footer simple />
    </div>
  );
}

export default Login;
