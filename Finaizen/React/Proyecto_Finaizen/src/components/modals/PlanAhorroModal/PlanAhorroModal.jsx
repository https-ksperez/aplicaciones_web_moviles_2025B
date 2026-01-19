import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CATEGORIAS_PLAN_AHORRO, ICONOS_CATEGORIA, COLORES_CATEGORIA } from '../../../models/PlanAhorro';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import styles from './PlanAhorroModal.module.css';

/**
 * PlanAhorroModal - Modal para crear/editar planes de ahorro
 */
function PlanAhorroModal({ isOpen, plan, onSave, onCancel, simboloMoneda }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'Personal',
    objetivo: '',
    montoMeta: '',
    montoAhorrarMensual: '',
    fechaMeta: '',
    prioridad: 'normal',
    estrategia: 'consistente',
    notificacionActiva: true
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // Wizard steps: 1, 2, 3

  const isEditMode = plan !== null;

  // Cargar datos cuando se abre en modo edición
  useEffect(() => {
    if (isOpen && plan) {
      const fechaMeta = plan.fechaMeta instanceof Date 
        ? plan.fechaMeta.toISOString().split('T')[0]
        : new Date(plan.fechaMeta).toISOString().split('T')[0];

      setFormData({
        nombre: plan.nombre || '',
        descripcion: plan.descripcion || '',
        categoria: plan.categoria || 'Personal',
        objetivo: plan.objetivo || '',
        montoMeta: plan.montoMeta?.toString() || '',
        montoAhorrarMensual: plan.montoAhorrarMensual?.toString() || '',
        fechaMeta,
        prioridad: plan.prioridad || 'normal',
        estrategia: plan.estrategia || 'consistente',
        notificacionActiva: plan.notificacionActiva !== false
      });
      setErrors({});
      setStep(1);
    } else if (isOpen && !plan) {
      setFormData({
        nombre: '',
        descripcion: '',
        categoria: 'Personal',
        objetivo: '',
        montoMeta: '',
        montoAhorrarMensual: '',
        fechaMeta: '',
        prioridad: 'normal',
        estrategia: 'consistente',
        notificacionActiva: true
      });
      setErrors({});
      setStep(1);
    }
  }, [isOpen, plan]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.nombre.trim()) {
        newErrors.nombre = 'El nombre del plan es requerido';
      }
      if (!formData.objetivo.trim()) {
        newErrors.objetivo = 'El objetivo es requerido';
      }
      if (!formData.categoria) {
        newErrors.categoria = 'Selecciona una categoría';
      }
    } else if (step === 2) {
      if (!formData.montoMeta || parseFloat(formData.montoMeta) <= 0) {
        newErrors.montoMeta = 'El monto meta debe ser mayor a 0';
      }
      if (!formData.fechaMeta) {
        newErrors.fechaMeta = 'Selecciona una fecha meta';
      } else {
        const fechaMeta = new Date(formData.fechaMeta);
        const hoy = new Date();
        if (fechaMeta <= hoy) {
          newErrors.fechaMeta = 'La fecha meta debe ser en el futuro';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateStep()) {
      return;
    }

    // Calcular montoAhorrarMensual si no está definido
    let montoMensual = parseFloat(formData.montoAhorrarMensual);
    if (isNaN(montoMensual) || montoMensual <= 0) {
      const montoMeta = parseFloat(formData.montoMeta);
      const fechaMeta = new Date(formData.fechaMeta);
      const hoy = new Date();
      const diasFaltantes = Math.ceil((fechaMeta - hoy) / (1000 * 60 * 60 * 24));
      const mesesFaltantes = Math.max(1, Math.ceil(diasFaltantes / 30));
      montoMensual = montoMeta / mesesFaltantes;
    }

    const planData = {
      ...formData,
      montoMeta: parseFloat(formData.montoMeta),
      montoAhorrarMensual: montoMensual,
      fechaMeta: new Date(formData.fechaMeta),
      icono: ICONOS_CATEGORIA[formData.categoria],
      color: COLORES_CATEGORIA[formData.categoria]
    };

    onSave(planData);
  };

  if (!isOpen) return null;

  const categoriaSeleccionada = formData.categoria;
  const icono = ICONOS_CATEGORIA[categoriaSeleccionada];
  const color = COLORES_CATEGORIA[categoriaSeleccionada];

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.titulo}>
          {isEditMode ? 'Editar Plan de Ahorro' : 'Crear Nuevo Plan de Ahorro'}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* STEP 1: Información Básica */}
          {step === 1 && (
            <div className={styles.step}>
              <h3 className={styles.stepTitle}>Paso 1: Información Básica</h3>

              <Input
                label="Nombre del Plan *"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Viaje a París"
                error={errors.nombre}
              />

              <Input
                label="Objetivo *"
                name="objetivo"
                value={formData.objetivo}
                onChange={handleChange}
                placeholder="Ej: Pasar vacaciones en París con familia"
                error={errors.objetivo}
              />

              <div className={styles.formGroup}>
                <label className={styles.label}>Categoría *</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className={styles.select}
                >
                  {CATEGORIAS_PLAN_AHORRO.map(cat => (
                    <option key={cat} value={cat}>
                      {ICONOS_CATEGORIA[cat]} {cat}
                    </option>
                  ))}
                </select>
                {errors.categoria && <span className={styles.error}>{errors.categoria}</span>}
              </div>

              <Input
                label="Descripción (opcional)"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Detalles adicionales sobre tu plan"
              />

              <div className={styles.preview} style={{ borderLeftColor: color }}>
                <span className={styles.previewIcon}>{icono}</span>
                <div>
                  <p className={styles.previewName}>{formData.nombre || 'Mi Plan'}</p>
                  <p className={styles.previewObjective}>{formData.objetivo || 'Sin objetivo'}</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Metas Financieras */}
          {step === 2 && (
            <div className={styles.step}>
              <h3 className={styles.stepTitle}>Paso 2: Metas Financieras</h3>

              <Input
                label="Monto Meta (¿Cuánto quieres ahorrar?) *"
                type="number"
                name="montoMeta"
                value={formData.montoMeta}
                onChange={handleChange}
                placeholder="1000.00"
                step="0.01"
                error={errors.montoMeta}
              />

              <Input
                label="Fecha Meta (¿Para cuándo?) *"
                type="date"
                name="fechaMeta"
                value={formData.fechaMeta}
                onChange={handleChange}
                error={errors.fechaMeta}
              />

              {formData.montoMeta && formData.fechaMeta && (
                <div className={styles.simulacion}>
                  <h4>Simulación:</h4>
                  {(() => {
                    const monto = parseFloat(formData.montoMeta);
                    const fechaMeta = new Date(formData.fechaMeta);
                    const hoy = new Date();
                    const diasFaltantes = Math.ceil((fechaMeta - hoy) / (1000 * 60 * 60 * 24));
                    const mesesFaltantes = Math.ceil(diasFaltantes / 30);
                    const montoMensual = monto / mesesFaltantes;

                    return (
                      <ul>
                        <li>
                          📅 Días disponibles: <strong>{diasFaltantes}</strong>
                        </li>
                        <li>
                          📊 Meses disponibles: <strong>{mesesFaltantes}</strong>
                        </li>
                        <li>
                          💾 Necesitas ahorrar: <strong>{simboloMoneda}{montoMensual.toFixed(2)}/mes</strong>
                        </li>
                      </ul>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Configuración */}
          {step === 3 && (
            <div className={styles.step}>
              <h3 className={styles.stepTitle}>Paso 3: Configuración del Plan</h3>

              <div className={styles.formGroup}>
                <label className={styles.label}>Prioridad</label>
                <select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="baja">Baja</option>
                  <option value="normal">Normal</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Estrategia de Ahorro</label>
                <select
                  name="estrategia"
                  value={formData.estrategia}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="consistente">📊 Consistente - Ahorrar siempre lo mismo</option>
                  <option value="agresiva">🚀 Agresiva - Ahorrar más al principio</option>
                  <option value="flexible">🔄 Flexible - Ajustar según sea posible</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    name="notificacionActiva"
                    checked={formData.notificacionActiva}
                    onChange={handleChange}
                  />
                  <span>Recibir recordatorios de ahorro</span>
                </label>
              </div>

              <div className={styles.resumen}>
                <h4>Resumen de tu Plan:</h4>
                <ul>
                  <li>📝 Nombre: <strong>{formData.nombre}</strong></li>
                  <li>🎯 Meta: <strong>{simboloMoneda}{parseFloat(formData.montoMeta).toLocaleString()}</strong></li>
                  <li>💰 Mensual: <strong>{simboloMoneda}{parseFloat(formData.montoAhorrarMensual).toLocaleString()}</strong></li>
                  <li>📅 Estrategia: <strong>{formData.estrategia}</strong></li>
                </ul>
              </div>
            </div>
          )}

          {/* Controles de navegación */}
          <div className={styles.buttonGroup}>
            {step > 1 && (
              <Button variant="outline" type="button" onClick={handlePrevious}>
                ← Anterior
              </Button>
            )}

            {step < 3 ? (
              <Button variant="brand" type="button" onClick={handleNext}>
                Siguiente →
              </Button>
            ) : (
              <Button variant="brand" type="submit">
                {isEditMode ? 'Guardar Cambios' : 'Crear Plan'}
              </Button>
            )}

            <Button variant="outline" type="button" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

PlanAhorroModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  plan: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  simboloMoneda: PropTypes.string.isRequired
};

export default PlanAhorroModal;
