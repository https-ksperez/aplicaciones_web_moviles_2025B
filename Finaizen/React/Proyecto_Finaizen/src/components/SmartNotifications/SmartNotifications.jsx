import { useEffect, useState } from 'react';
import { SmartMessageGenerator } from '../../utils/smartMessages';
import apiService from '../../services/apiService';
import styles from './SmartNotifications.module.css';

/**
 * Componente de Notificaciones Inteligentes
 * Muestra mensajes contextuales basados en la actividad financiera del usuario
 */
export default function SmartNotifications({ userId, perfilId }) {
  const [messages, setMessages] = useState([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (perfilId) {
      generateContextualMessages();
    }
    
    // Rotar mensajes cada 8 segundos
    const interval = setInterval(() => {
      if (messages.length > 0) {
        setCurrentMessageIndex(prev => (prev + 1) % messages.length);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [userId, perfilId, messages.length]);

  const generateContextualMessages = async () => {
    try {
      // Obtener datos del backend
      const [historial, logros, presupuestos] = await Promise.all([
        apiService.historial.getAll(perfilId),
        apiService.logros.getAll(perfilId),
        apiService.presupuestos.getAll(perfilId)
      ]);

      // Calcular métricas
      const ingresos = historial.filter(h => h.tipo === 'ingreso');
      const egresos = historial.filter(h => h.tipo === 'egreso');
      const totalIngresos = ingresos.reduce((sum, i) => sum + parseFloat(i.monto || 0), 0);
      const totalEgresos = egresos.reduce((sum, e) => sum + parseFloat(e.monto || 0), 0);
      const balanceActual = totalIngresos - totalEgresos;
      const porcentajeGastado = totalIngresos > 0 ? (totalEgresos / totalIngresos * 100) : 0;

      // Analizar gastos por categoría
      const gastosPorCategoria = {};
      egresos.forEach(egreso => {
        if (!gastosPorCategoria[egreso.categoria]) {
          gastosPorCategoria[egreso.categoria] = 0;
        }
        gastosPorCategoria[egreso.categoria] += parseFloat(egreso.monto || 0);
      });

      const generatedMessages = [];

      // 1. MENSAJE DE BIENVENIDA SEGÚN HORA
      generatedMessages.push(SmartMessageGenerator.generateMessage({ 
        tipo: 'contextual_tiempo' 
      }));

      // 2. ALERTAS DE GASTOS EXCESIVOS (si aplica)
      if (porcentajeGastado > 80) {
        generatedMessages.push(SmartMessageGenerator.generateMessage({
          tipo: 'alerta_gasto',
          monto: totalEgresos,
          porcentaje: porcentajeGastado
        }));
      }

      // 3. ALERTAS POR CATEGORÍA (si alguna supera el 30% del total)
      if (totalEgresos > 0) {
        Object.keys(gastosPorCategoria).forEach(categoria => {
          const porcentajeCategoria = (gastosPorCategoria[categoria] / totalEgresos) * 100;
          if (porcentajeCategoria > 30) {
            generatedMessages.push(SmartMessageGenerator.generateMessage({
              tipo: 'alerta_gasto',
              categoria: categoria,
              monto: gastosPorCategoria[categoria],
              porcentaje: porcentajeCategoria
            }));
          }
        });
      }

      // 4. SUGERENCIAS DE AHORRO (si el balance es positivo pero bajo)
      if (balanceActual > 0 && balanceActual < totalIngresos * 0.2) {
        const ahorroSugerido = totalIngresos * 0.2 - balanceActual;
        generatedMessages.push(SmartMessageGenerator.generateMessage({
          tipo: 'sugerencia',
          monto: ahorroSugerido,
          porcentaje: 20
        }));
      }

      // 5. LOGROS PRÓXIMOS (80% o más completados)
      logros.forEach(logro => {
        const porcentajeLogro = (logro.progresoActual / logro.meta) * 100;
        if (porcentajeLogro >= 80 && porcentajeLogro < 100) {
          const faltante = logro.meta - logro.progresoActual;
          generatedMessages.push(SmartMessageGenerator.generateMessage({
            tipo: 'logro_proximo',
            logro: logro.titulo,
            numero: faltante,
            porcentaje: porcentajeLogro.toFixed(0),
            recompensa: logro.recompensa || 'recompensa especial'
          }));
        }
      });

      // 6. FELICITACIONES (si el usuario está gastando menos del 70%)
      if (porcentajeGastado < 70 && totalIngresos > 0) {
        generatedMessages.push(SmartMessageGenerator.generateMessage({
          tipo: 'motivacion',
          porcentaje: 100 - porcentajeGastado,
          monto: balanceActual
        }));
      }

      // 7. EDUCACIÓN FINANCIERA (siempre incluir 1-2)
      generatedMessages.push(SmartMessageGenerator.generateMessage({
        tipo: 'educacion'
      }));

      // 8. RECORDATORIOS (según día de la semana)
      const diaSemana = new Date().getDay();
      if (diaSemana === 1) { // Lunes
        generatedMessages.push(SmartMessageGenerator.generateMessage({
          tipo: 'recordatorio'
        }));
      } else if (diaSemana === 5) { // Viernes
        generatedMessages.push(SmartMessageGenerator.generateMessage({
          tipo: 'recordatorio'
        }));
      } else if (diaSemana === 0) { // Domingo
        generatedMessages.push(SmartMessageGenerator.generateMessage({
          tipo: 'recordatorio'
        }));
      }

      // 9. ALERTAS INTELIGENTES (predicciones y anomalías)
      // Predicción de gasto mensual
      const diasDelMes = new Date().getDate();
      const diasTotalesMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      const gastoProyectado = (totalEgresos / diasDelMes) * diasTotalesMes;
      
      if (gastoProyectado > totalIngresos * 1.1) {
        generatedMessages.push(SmartMessageGenerator.generateMessage({
          tipo: 'inteligente',
          monto: gastoProyectado,
          porcentaje: ((gastoProyectado - totalIngresos) / totalIngresos) * 100
        }));
      }

      // 10. MENSAJE MOTIVACIONAL ALEATORIO (siempre)
      generatedMessages.push(SmartMessageGenerator.generateMessage({
        tipo: 'motivacion'
      }));

      setMessages(generatedMessages);
      console.log('📨 Mensajes inteligentes generados:', generatedMessages.length);
    } catch (error) {
      console.error('Error generando mensajes:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Ocultar por 1 hora
    setTimeout(() => setIsVisible(true), 3600000);
  };

  const handleNext = () => {
    setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
  };

  const handlePrev = () => {
    setCurrentMessageIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  if (!isVisible || messages.length === 0) return null;

  const currentMessage = messages[currentMessageIndex];
  const tipoClasses = {
    'alerta_gasto': styles.alert,
    'sugerencia': styles.suggestion,
    'logro_proximo': styles.achievement,
    'motivacion': styles.motivation,
    'educacion': styles.education,
    'recordatorio': styles.reminder,
    'contextual_tiempo': styles.contextual,
    'inteligente': styles.intelligent
  };

  return (
    <div className={`${styles.container} ${tipoClasses[currentMessage.tipo] || ''}`}>
      <div className={styles.content}>
        <div className={styles.messageText}>
          {currentMessage.mensaje}
        </div>
        
        <div className={styles.controls}>
          <button 
            onClick={handlePrev} 
            className={styles.navButton}
            aria-label="Mensaje anterior"
          >
            ◀
          </button>
          
          <span className={styles.counter}>
            {currentMessageIndex + 1} / {messages.length}
          </span>
          
          <button 
            onClick={handleNext} 
            className={styles.navButton}
            aria-label="Siguiente mensaje"
          >
            ▶
          </button>
          
          <button 
            onClick={handleDismiss} 
            className={styles.dismissButton}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progress} 
          style={{ width: `${((currentMessageIndex + 1) / messages.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
