import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { Card, Button, Input, Textarea, Toast } from '../../../../components/ui';
import apiService from '../../../../services/apiService';
import styles from './ConfigAyuda.module.css';

/**
 * ConfigAyuda - Página de ayuda y soporte
 * Formulario para enviar tickets de soporte
 */
const ConfigAyuda = () => {
  const { currentUser, currentPerfil } = useAuth();
  const [formData, setFormData] = useState({
    asunto: '',
    problema: ''
  });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.asunto.trim()) {
      showToast('Por favor ingresa un asunto', 'error');
      return;
    }

    if (!formData.problema.trim()) {
      showToast('Por favor describe tu problema', 'error');
      return;
    }

    if (formData.problema.length < 10) {
      showToast('La descripción debe tener al menos 10 caracteres', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Enviar ticket a la API
      const response = await apiService.support.createUserTicket({
        emailUsuario: currentUser?.correo,
        asunto: formData.asunto,
        descripcion: formData.problema,
        prioridad: 'media'
      });

      console.log('Ticket de soporte enviado:', response);

      showToast('✅ Ticket enviado correctamente. Te contactaremos pronto.', 'success');
      
      // Limpiar formulario
      setFormData({
        asunto: '',
        problema: ''
      });
    } catch (error) {
      console.error('Error al enviar ticket:', error);
      showToast('❌ Error al enviar el ticket. Intenta nuevamente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      asunto: '',
      problema: ''
    });
  };

  return (
    <div className={styles.configAyudaPage}>
      <div className={styles.helpContainer}>
        <h1 className={styles.title}>❓ Ayuda y Soporte</h1>
        <p className={styles.subtitle}>
          ¿Tienes algún problema o sugerencia? Envíanos un mensaje y te ayudaremos lo antes posible.
        </p>

        <div className={styles.infoCards}>
          <Card className={styles.infoCard}>
            <div className={styles.infoIcon}>📧</div>
            <h3>Email de Soporte</h3>
            <p>soporte@finaizen.com</p>
          </Card>

          <Card className={styles.infoCard}>
            <div className={styles.infoIcon}>⏰</div>
            <h3>Horario de Atención</h3>
            <p>Lun - Vie: 9:00 AM - 6:00 PM</p>
          </Card>

          <Card className={styles.infoCard}>
            <div className={styles.infoIcon}>⚡</div>
            <h3>Tiempo de Respuesta</h3>
            <p>24-48 horas hábiles</p>
          </Card>
        </div>

        <Card className={styles.formCard}>
          <h2 className={styles.formTitle}>📝 Enviar Ticket de Soporte</h2>
          
          <form onSubmit={handleSubmit} className={styles.helpForm}>
            <div className={styles.userInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Usuario:</span>
                <span className={styles.infoValue}>{currentUser?.nombreCompleto}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{currentUser?.correo}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Perfil:</span>
                <span className={styles.infoValue}>{currentPerfil?.nombre}</span>
              </div>
            </div>

            <Input
              label="Asunto"
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              placeholder="Ej: Error al crear presupuesto"
              required
            />

            <Textarea
              label="Descripción del Problema"
              name="problema"
              value={formData.problema}
              onChange={handleChange}
              placeholder="Describe detalladamente el problema que estás experimentando..."
              rows={8}
              maxLength={1000}
              showCounter={true}
              required
            />

            <div className={styles.formActions}>
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Limpiar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Ticket'}
              </Button>
            </div>
          </form>
        </Card>

        <Card className={styles.faqCard}>
          <h2 className={styles.faqTitle}>💡 Preguntas Frecuentes</h2>
          
          <div className={styles.faqList}>
            <details className={styles.faqItem}>
              <summary>¿Cómo creo un nuevo presupuesto?</summary>
              <p>
                Ve a la sección "Presupuestos" desde el menú principal, haz clic en "Nuevo Presupuesto" 
                y completa los datos solicitados (categoría, monto límite, periodo).
              </p>
            </details>

            <details className={styles.faqItem}>
              <summary>¿Puedo tener múltiples perfiles?</summary>
              <p>
                Sí, puedes crear múltiples perfiles desde "Configuración → Perfiles". Esto te permite 
                separar tus finanzas personales de las empresariales, por ejemplo.
              </p>
            </details>

            <details className={styles.faqItem}>
              <summary>¿Cómo configuro recordatorios?</summary>
              <p>
                Al crear un ingreso o egreso, activa la opción "Notificaciones" y selecciona la 
                frecuencia. Puedes gestionar todas tus notificaciones en "Configuración → Notificaciones".
              </p>
            </details>

            <details className={styles.faqItem}>
              <summary>¿Mis datos están seguros?</summary>
              <p>
                Sí, utilizamos encriptación de datos y seguimos las mejores prácticas de seguridad. 
                Todos tus datos están protegidos y solo tú tienes acceso a ellos.
              </p>
            </details>

            <details className={styles.faqItem}>
              <summary>¿Cómo exporto mis datos?</summary>
              <p>
                Actualmente estamos trabajando en la función de exportación. Próximamente podrás 
                descargar tus datos en formato PDF o Excel desde la sección de Reportes.
              </p>
            </details>
          </div>
        </Card>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default ConfigAyuda;
