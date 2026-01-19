import { useState } from 'react';
import styles from './ModalSuscripcion.module.css';
import apiService from '../../services/apiService';

/**
 * Modal de Suscripción Premium
 * Permite al usuario suscribirse a Finaizen Premium
 */
export default function ModalSuscripcion({ isOpen, onClose, currentUser, onSuccess }) {
  const [plan, setPlan] = useState('mensual'); // 'mensual' o 'anual'
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const planes = {
    mensual: {
      precio: 9.99,
      duracion: '1 mes',
      ahorro: 0
    },
    anual: {
      precio: 99.99,
      duracion: '1 año',
      ahorro: 19.89 // 12 meses a $9.99 = $119.88 - $99.99 = $19.89
    }
  };

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    // Formatear número de tarjeta (####-####-####-####)
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) value = value.substring(0, 19);
    }

    // Formatear fecha de expiración (MM/YY)
    if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      if (value.length > 5) value = value.substring(0, 5);
    }

    // Limitar CVV a 3-4 dígitos
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      setError('Número de tarjeta inválido');
      return false;
    }
    if (!formData.cardName || formData.cardName.trim().length < 3) {
      setError('Nombre del titular requerido');
      return false;
    }
    if (!formData.expiry || formData.expiry.length !== 5) {
      setError('Fecha de expiración inválida');
      return false;
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      setError('CVV inválido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);
    setError('');

    // Simular procesamiento de pago
    setTimeout(async () => {
      try {
        // Actualizar usuario a premium en el backend
        await apiService.auth.activarPremium({
          plan,
          metodoPago: {
            type: 'tarjeta',
            brand: detectCardBrand(formData.cardNumber),
            last4: formData.cardNumber.replace(/\s/g, '').slice(-4),
            expiry: formData.expiry,
            holderName: formData.cardName
          }
        });

        setIsProcessing(false);
        if (onSuccess) onSuccess();
        onClose();
        
        // Recargar página para mostrar cambios
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (err) {
        console.error('Error al activar premium:', err);
        setError('Error al procesar el pago. Intenta nuevamente.');
        setIsProcessing(false);
      }
    }, 2000);
  };

  const detectCardBrand = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    return 'Desconocida';
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.premiumIcon}>👑</span>
            Hazte Premium
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Planes */}
        <div className={styles.plans}>
          <button
            className={`${styles.planCard} ${plan === 'mensual' ? styles.active : ''}`}
            onClick={() => setPlan('mensual')}
          >
            <div className={styles.planHeader}>
              <span className={styles.planName}>Mensual</span>
              {plan === 'mensual' && <span className={styles.checkmark}>✓</span>}
            </div>
            <div className={styles.planPrice}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>9.99</span>
              <span className={styles.period}>/mes</span>
            </div>
          </button>

          <button
            className={`${styles.planCard} ${plan === 'anual' ? styles.active : ''} ${styles.recommended}`}
            onClick={() => setPlan('anual')}
          >
            <div className={styles.badge}>Recomendado</div>
            <div className={styles.planHeader}>
              <span className={styles.planName}>Anual</span>
              {plan === 'anual' && <span className={styles.checkmark}>✓</span>}
            </div>
            <div className={styles.planPrice}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>99.99</span>
              <span className={styles.period}>/año</span>
            </div>
            <div className={styles.savings}>Ahorra $19.89 al año</div>
          </button>
        </div>

        {/* Beneficios */}
        <div className={styles.benefits}>
          <h3>✨ Beneficios Premium:</h3>
          <ul>
            <li><span>🤖</span> ChatBot con Inteligencia Artificial</li>
            <li><span>📊</span> Análisis financieros avanzados</li>
            <li><span>🎯</span> Recomendaciones personalizadas</li>
            <li><span>📈</span> Reportes detallados ilimitados</li>
            <li><span>🔔</span> Notificaciones prioritarias</li>
            <li><span>💎</span> Acceso anticipado a nuevas funciones</li>
          </ul>
        </div>

        {/* Formulario de Pago */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>Información de Pago</h3>

          <div className={styles.formGroup}>
            <label>Número de Tarjeta</label>
            <input
              type="text"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Titular de la Tarjeta</label>
            <input
              type="text"
              name="cardName"
              placeholder="NOMBRE COMPLETO"
              value={formData.cardName}
              onChange={handleInputChange}
              required
              className={styles.input}
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Fecha de Expiración</label>
              <input
                type="text"
                name="expiry"
                placeholder="MM/AA"
                value={formData.expiry}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>CVV</label>
              <input
                type="text"
                name="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {/* Resumen */}
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Plan {plan === 'mensual' ? 'Mensual' : 'Anual'}</span>
              <span>${planes[plan].precio}</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total a Pagar</span>
              <span className={styles.totalAmount}>${planes[plan].precio}</span>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className={styles.spinner}>Procesando...</span>
            ) : (
              `Pagar $${planes[plan].precio} ${plan === 'mensual' ? 'USD/mes' : 'USD/año'}`
            )}
          </button>

          <p className={styles.disclaimer}>
            🔒 Pago seguro. Puedes cancelar en cualquier momento.
          </p>
        </form>
      </div>
    </div>
  );
}
