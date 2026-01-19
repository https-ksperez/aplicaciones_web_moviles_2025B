import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../../context/AuthContext';
import apiService from '../../../services/apiService';
import { Ingreso, Egreso, RegistroHistorial, CATEGORIAS_INGRESO, CATEGORIAS_EGRESO } from '../../../models';
import { Button, Toast } from '../../ui';
import styles from './TransactionForm.module.css';

/**
 * TransactionForm - Formulario reutilizable para Ingresos y Egresos
 * 
 * Aplica los siguientes principios de React:
 * - Estado local con useState para manejo de formulario controlado
 * - useEffect para efectos secundarios y validaciones
 * - Props con PropTypes para validación de tipos
 * - Lifting state up mediante callbacks (onSubmitSuccess)
 * - Componentes funcionales con hooks
 * - Formularios controlados (todos los inputs vinculados al estado)
 * - Manejo de eventos onChange/onSubmit
 * - Sistema de notificaciones local (Toast)
 */
function TransactionForm({ type = 'ingreso', onSubmitSuccess }) {
  const navigate = useNavigate();
  const { currentPerfil, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Detectar si estamos en modo edición
  const editId = searchParams.get('edit');
  const isEditMode = editId !== null;
  
  // Obtener fecha y hora actuales
  const now = useMemo(() => new Date(), []);
  const currentDay = useMemo(() => now.getDate(), [now]);
  const currentDayOfWeek = useMemo(() => now.getDay(), [now]);
  const currentDate = useMemo(() => now.toLocaleDateString('en-CA'), [now]); // Formato YYYY-MM-DD en zona horaria local
  
  // Calcular hora redondeada a intervalos de 15 minutos
  const getDefaultTime = useCallback(() => {
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes();
    let roundedMinutes;
    
    if (minutes < 15) roundedMinutes = '00';
    else if (minutes < 30) roundedMinutes = '15';
    else if (minutes < 45) roundedMinutes = '30';
    else roundedMinutes = '45';
    
    return `${hours}:${roundedMinutes}`;
  }, [now]);

  // Estado del formulario (formulario controlado)
  const [formData, setFormData] = useState({
    monto: '0.00',
    descripcion: '',
    categoria: type === 'ingreso' ? 'Otros' : 'Otros',
    frecuencia: 'ocasional',
    diasSemana: [],
    diaMes: null,
    fechaEspecifica: currentDate,
    fechaLimite: '', // Fecha hasta la cual la transacción recurrente estará activa
    hora: getDefaultTime().split(':')[0],
    minutos: getDefaultTime().split(':')[1],
    notificacionActiva: false,
    clasificacion: 'prioritario' // Solo para egresos
  });

  // Estado para notificaciones (Toast)
  const [toast, setToast] = useState(null);

  // Estado para errores de validación
  const [errors, setErrors] = useState({});

  // Categorías según el tipo
  const categorias = type === 'ingreso' ? CATEGORIAS_INGRESO : CATEGORIAS_EGRESO;

  // useEffect: Validar autenticación al montar
  useEffect(() => {
    if (!authLoading && !currentPerfil) {
      navigate('/login');
    }
  }, [currentPerfil, authLoading, navigate]);

  // useEffect: Cargar datos en modo edición
  useEffect(() => {
    if (isEditMode && editId && currentPerfil) {
      const loadRecord = async () => {
        try {
          // Buscar el registro a editar en el backend
          const record = type === 'ingreso' 
            ? await apiService.ingresos.getById(currentPerfil.id, editId)
            : await apiService.egresos.getById(currentPerfil.id, editId);

          if (record) {
            // Cargar datos del registro en el formulario
            setFormData({
              monto: parseFloat(record.monto || 0).toFixed(2),
              descripcion: record.descripcion,
              categoria: record.categoria,
              frecuencia: record.frecuencia,
              diasSemana: record.diasSemana || [],
              diaMes: record.diaMes || null,
              fechaEspecifica: record.fechaEspecifica || currentDate,
              hora: record.hora?.toString().padStart(2, '0') || getDefaultTime().split(':')[0],
              minutos: record.minutos?.toString().padStart(2, '0') || getDefaultTime().split(':')[1],
              notificacionActiva: record.notificacionActiva || false,
              clasificacion: record.clasificacionIA || 'prioritario'
            });
          }
        } catch (error) {
          console.error('Error al cargar registro:', error);
          setToast({
            type: 'error',
            message: 'Error al cargar el registro'
          });
        }
      };
      loadRecord();
    }
  }, [isEditMode, editId, type, currentPerfil, currentDate, getDefaultTime]);

  // useEffect: Cargar datos pre-llenados desde OCR o voz
  useEffect(() => {
    const ocr = searchParams.get('ocr');
    if (ocr && !isEditMode) {
      try {
        const ocrData = JSON.parse(decodeURIComponent(ocr));
        
        // Extraer hora y minutos de la fecha si existen
        let horaOCR = getDefaultTime().split(':')[0];
        let minutosOCR = getDefaultTime().split(':')[1];
        if (ocrData.hora) {
          const [h, m] = ocrData.hora.split(':');
          horaOCR = h;
          minutosOCR = m;
        }

        setFormData(prev => ({
          ...prev,
          monto: ocrData.monto ? ocrData.monto.toString() : prev.monto,
          descripcion: ocrData.descripcion || prev.descripcion,
          categoria: ocrData.categoria || prev.categoria,
          fechaEspecifica: ocrData.fecha || prev.fechaEspecifica,
          hora: horaOCR,
          minutos: minutosOCR,
          frecuencia: 'ocasional' // Los escaneos siempre son ocasionales
        }));

        // Mostrar toast informativo
        setToast({
          type: 'info',
          message: '📷 Datos cargados desde escaneo. Revisa y confirma la información.'
        });

        // Limpiar el parámetro OCR de la URL
        searchParams.delete('ocr');
        navigate({ search: searchParams.toString() }, { replace: true });
      } catch (error) {
        console.error('Error cargando datos OCR:', error);
      }
    }
  }, [searchParams, isEditMode, getDefaultTime, navigate]);

  // useEffect: Actualizar valores por defecto cuando cambie la frecuencia
  useEffect(() => {
    if (formData.frecuencia === 'mensual' && !formData.diaMes) {
      setFormData(prev => ({ ...prev, diaMes: currentDay }));
    }
    if (formData.frecuencia === 'semanal' && formData.diasSemana.length === 0) {
      setFormData(prev => ({ ...prev, diasSemana: [currentDayOfWeek] }));
    }
    if ((formData.frecuencia === 'ocasional' || formData.frecuencia === 'anual') && !formData.fechaEspecifica) {
      setFormData(prev => ({ ...prev, fechaEspecifica: currentDate }));
    }
  }, [formData.frecuencia, currentDay, currentDayOfWeek, currentDate, formData.diaMes, formData.diasSemana.length, formData.fechaEspecifica]); // Solo cuando cambie la frecuencia

  // useEffect: Ajustar minutos exactos al cargar inicialmente si es ocasional
  useEffect(() => {
    // Solo ejecutar una vez al montar el componente y si no estamos en modo edición
    if (!isEditMode && formData.frecuencia === 'ocasional') {
      const currentMinutes = now.getMinutes();
      const minutosActuales = currentMinutes.toString().padStart(2, '0');
      
      // Solo actualizar si los minutos son diferentes (evitar loop)
      if (formData.minutos !== minutosActuales) {
        setFormData(prev => ({ ...prev, minutos: minutosActuales }));
      }
    }
  }, [isEditMode, formData.frecuencia, formData.minutos, now]); // Solo al montar

  /**
   * Manejo de cambios en inputs (onChange)
   * Actualiza el estado del formulario
   */
  const handleInputChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  /**
   * Manejo de selección de frecuencia
   */
  const handleFrequencyChange = (frecuencia) => {
    const updates = {
      frecuencia,
      diasSemana: frecuencia === 'semanal' ? [currentDayOfWeek] : [],
      diaMes: frecuencia === 'mensual' ? currentDay : null,
      fechaEspecifica: (frecuencia === 'ocasional' || frecuencia === 'anual') ? currentDate : ''
    };
    
    // Si cambia A ocasional, ajustar a los minutos actuales exactos
    if (frecuencia === 'ocasional' && formData.frecuencia !== 'ocasional') {
      const currentMinutes = now.getMinutes();
      updates.minutos = currentMinutes.toString().padStart(2, '0');
    }
    
    // Si cambia DE ocasional a otra frecuencia, redondear minutos al intervalo de 15 más cercano
    if (formData.frecuencia === 'ocasional' && frecuencia !== 'ocasional') {
      const currentMinutes = parseInt(formData.minutos);
      let roundedMinutes;
      
      if (currentMinutes < 8) roundedMinutes = '00';
      else if (currentMinutes < 23) roundedMinutes = '15';
      else if (currentMinutes < 38) roundedMinutes = '30';
      else if (currentMinutes < 53) roundedMinutes = '45';
      else roundedMinutes = '00';
      
      updates.minutos = roundedMinutes;
    }
    
    setFormData(prev => ({ ...prev, ...updates }));
  };

  /**
   * Manejo de selección de días de la semana
   */
  const handleDayToggle = (dayIndex) => {
    setFormData(prev => {
      const diasSemana = [...prev.diasSemana];
      const index = diasSemana.indexOf(dayIndex);
      
      if (index > -1) {
        diasSemana.splice(index, 1);
      } else {
        diasSemana.push(dayIndex);
      }
      
      return { ...prev, diasSemana: diasSemana.sort() };
    });
  };

  /**
   * Manejo de selección de día del mes
   */
  const handleMonthDaySelect = (day) => {
    setFormData(prev => ({ ...prev, diaMes: day }));
  };

  /**
   * Validación del formulario
   * Retorna true si es válido, false si hay errores
   */
  const validateForm = () => {
    const newErrors = {};

    // Validar monto
    const monto = parseFloat(formData.monto);
    if (isNaN(monto) || monto <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    }

    // Validar descripción
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    // Validar hora y minutos
    if (!formData.hora) {
      newErrors.hora = 'Debe seleccionar la hora';
    }
    if (!formData.minutos) {
      newErrors.minutos = 'Debe seleccionar los minutos';
    }

    // Validar según frecuencia
    switch (formData.frecuencia) {
      case 'semanal':
        if (formData.diasSemana.length === 0) {
          newErrors.diasSemana = 'Seleccione al menos un día de la semana';
        }
        break;
      
      case 'mensual':
        if (!formData.diaMes) {
          newErrors.diaMes = 'Seleccione un día del mes';
        }
        break;
      
      case 'anual':
      case 'ocasional':
        if (!formData.fechaEspecifica) {
          newErrors.fechaEspecifica = 'Seleccione una fecha';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Manejo del envío del formulario (onSubmit)
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar
    if (!validateForm()) {
      setToast({
        type: 'error',
        message: 'Por favor corrija los errores en el formulario'
      });
      return;
    }

    try {
      if (isEditMode && editId) {
        // MODO EDICIÓN: Actualizar registro existente
        updateTransaction(editId);
      } else {
        // MODO CREACIÓN: Crear nuevo registro
        createTransaction();
      }
    } catch (error) {
      console.error('Error al guardar transacción:', error);
      setToast({
        type: 'error',
        message: 'Error al guardar. Por favor intente nuevamente.'
      });
    }
  };

  /**
   * Crear nueva transacción
   */
  const createTransaction = () => {
    // Si es OCASIONAL, crear directamente en transacciones (historial)
    if (formData.frecuencia === 'ocasional') {
      createOcasionalTransaction();
      return;
    }

    // Si NO es ocasional, crear en ingresos/egresos (recurrente)
    createRecurringTransaction();
  };

  /**
   * Crear transacción ocasional (directa al historial)
   */
  const createOcasionalTransaction = async () => {
    try {
      // Crear registro directamente en historial
      const [year, month, day] = formData.fechaEspecifica.split('-').map(Number);
      const fechaEjecucion = new Date(year, month - 1, day);
      
      const registroData = {
        tipo: type,
        monto: parseFloat(formData.monto),
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        transaccionOrigenId: null,
        fechaEjecucion: fechaEjecucion.toISOString(),
        mes: fechaEjecucion.getMonth() + 1,
        anio: fechaEjecucion.getFullYear()
      };

      console.log('💾 Guardando transacción ocasional:', registroData);
      console.log('📅 Fecha:', formData.fechaEspecifica);
      console.log('📆 Mes/Año calculado:', registroData.mes, '/', registroData.anio);

      // Crear en backend
      const registroHistorial = await apiService.historial.create(currentPerfil.id, registroData);

      console.log('=== TRANSACCIÓN OCASIONAL REGISTRADA ===');
      console.log('Tipo:', type);
      console.log('Registro en historial:', registroHistorial);

      // Callback para el componente padre
      if (onSubmitSuccess) {
        onSubmitSuccess(registroHistorial);
      }

      // Redirigir al dashboard con notificación
      navigate('/user/dashboard', {
        state: {
          notification: {
            type: 'success',
            message: `✓ ${type === 'ingreso' ? 'Ingreso' : 'Egreso'} ocasional registrado en historial`
          }
        }
      });
    } catch (error) {
      console.error('Error al crear transacción ocasional:', error);
      setToast({
        type: 'error',
        message: 'Error al registrar la transacción'
      });
    }
  };

  /**
   * Crear transacción recurrente (en ingresos/egresos)
   */
  const createRecurringTransaction = async () => {
    try {
      // Preparar datos para el backend
      const transactionData = {
        perfilId: currentPerfil.id,
        monto: parseFloat(formData.monto),
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        frecuencia: formData.frecuencia,
        diasSemana: formData.diasSemana,
        diaMes: formData.diaMes,
        fechaEspecifica: formData.fechaEspecifica || null,
        fechaLimite: formData.fechaLimite || null,
        delay: `${formData.hora}:${formData.minutos}`,
        notificacionActiva: formData.notificacionActiva
      };

      // Crear en backend
      let transaction;
      if (type === 'ingreso') {
        transaction = await apiService.ingresos.create(currentPerfil.id, transactionData);
        console.log('=== INGRESO REGISTRADO ===');
        console.log('Nuevo ingreso:', transaction);
      } else {
        transaction = await apiService.egresos.create(currentPerfil.id, {
          ...transactionData,
          clasificacionIA: formData.clasificacion
        });
        console.log('=== EGRESO REGISTRADO ===');
        console.log('Nuevo egreso:', transaction);
      }

      // Callback para el componente padre (lifting state up)
      if (onSubmitSuccess) {
        onSubmitSuccess(transaction);
      }

      // Redirigir al dashboard inmediatamente con mensaje de notificación
      navigate('/user/dashboard', {
        state: {
          notification: {
            type: 'success',
            message: `✓ ${type === 'ingreso' ? 'Ingreso' : 'Egreso'} recurrente registrado exitosamente`
          }
        }
      });
    } catch (error) {
      console.error('Error al crear transacción recurrente:', error);
      setToast({
        type: 'error',
        message: 'Error al registrar la transacción'
      });
    }
  };

  /**
   * Actualizar transacción existente
   */
  const updateTransaction = async (id) => {
    try {
      // Actualizar datos del registro
      const updatedData = {
        monto: parseFloat(formData.monto),
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        frecuencia: formData.frecuencia,
        diasSemana: formData.diasSemana,
        diaMes: formData.diaMes,
        fechaEspecifica: formData.fechaEspecifica || null,
        delay: `${formData.hora}:${formData.minutos}`,
        hora: parseInt(formData.hora),
        minutos: parseInt(formData.minutos),
        notificacionActiva: formData.notificacionActiva
      };

      if (type === 'ingreso') {
        // Actualizar ingreso
        await apiService.ingresos.update(currentPerfil.id, id, updatedData);
        console.log('=== INGRESO ACTUALIZADO ===');
      } else {
        // Actualizar egreso
        await apiService.egresos.update(currentPerfil.id, id, {
          ...updatedData,
          clasificacionIA: formData.clasificacion
        });
        console.log('=== EGRESO ACTUALIZADO ===');
      }

      // Redirigir al administrador de registros con notificación
      navigate('/user/administrar-registros', {
        state: {
          notification: {
            type: 'success',
            message: `✓ ${type === 'ingreso' ? 'Ingreso' : 'Egreso'} actualizado exitosamente`
          }
        }
      });
    } catch (error) {
      console.error('Error al actualizar:', error);
      setToast({
        type: 'error',
        message: 'Error al actualizar el registro'
      });
    }
  };

  // Array de días de la semana
  const diasSemanaLabels = [
    { index: 1, label: 'Lunes', short: 'L' },
    { index: 2, label: 'Martes', short: 'M' },
    { index: 3, label: 'Miércoles', short: 'X' },
    { index: 4, label: 'Jueves', short: 'J' },
    { index: 5, label: 'Viernes', short: 'V' },
    { index: 6, label: 'Sábado', short: 'S' },
    { index: 0, label: 'Domingo', short: 'D' }
  ];

  // Opciones de frecuencia con iconos (Ocasional primero y por defecto)
  const frecuenciaOptions = [
    { value: 'ocasional', label: 'Ocasional', icon: '⭐' },
    { value: 'diario', label: 'Diario', icon: '☀️' },
    { value: 'semanal', label: 'Semanal', icon: '📆' },
    { value: 'mensual', label: 'Mensual', icon: '📅' },
    { value: 'anual', label: 'Anual', icon: '🎯' }
  ];

  // Generar opciones de hora (0 a 23)
  const generarOpcionesHora = () => {
    const opciones = [];
    for (let h = 0; h < 24; h++) {
      opciones.push(h.toString().padStart(2, '0'));
    }
    return opciones;
  };

  // Generar opciones de minutos dinámicamente según frecuencia
  const generarOpcionesMinutos = () => {
    if (formData.frecuencia === 'ocasional') {
      // Para ocasional: 00-59
      const opciones = [];
      for (let m = 0; m < 60; m++) {
        opciones.push(m.toString().padStart(2, '0'));
      }
      return opciones;
    } else {
      // Para otros: intervalos de 15 minutos
      return ['00', '15', '30', '45'];
    }
  };

  const opcionesHora = generarOpcionesHora();
  const opcionesMinutos = generarOpcionesMinutos();

  // Generar días del mes (1-31)
  const diasDelMes = Array.from({ length: 31 }, (_, i) => i + 1);

  if (authLoading) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  return (
    <div className={styles.mainContent}>
      <form className={styles.transactionForm} onSubmit={handleSubmit} noValidate>
          <h1>
            {isEditMode 
              ? `Editar ${type === 'ingreso' ? 'Ingreso' : 'Egreso'}`
              : `Nuevo ${type === 'ingreso' ? 'Ingreso' : 'Egreso'}`
            }
          </h1>

          {/* Monto */}
          <div className={styles.formGroup}>
            <label htmlFor="monto">Monto:</label>
            <div className={`${styles.inputWrapper} ${errors.monto ? styles.error : ''}`}>
              <span className={styles.currencySymbol}>$</span>
              <input
                type="number"
                id="monto"
                name="monto"
                value={formData.monto}
                onChange={handleInputChange}
                step="0.01"
                placeholder="0.00"
                min="0"
              />
            </div>
            {errors.monto && <span className={styles.errorMessage}>{errors.monto}</span>}
          </div>

          {/* Descripción y Categoría en la misma fila */}
          <div className={styles.formRow}>
            {/* Descripción */}
            <div className={styles.formGroup}>
              <label htmlFor="descripcion">Descripción:</label>
              <div className={`${styles.inputWrapper} ${errors.descripcion ? styles.error : ''}`}>
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder={type === 'ingreso' 
                    ? 'Ej: Salario mensual, bono, regalo...' 
                    : 'Ej: Suscripción streaming, comida...'}
                />
              </div>
              {errors.descripcion && <span className={styles.errorMessage}>{errors.descripcion}</span>}
            </div>

            {/* Categoría */}
            <div className={styles.formGroup}>
              <label htmlFor="categoria">Categoría:</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className={styles.select}
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila: Clasificación + Hora (izquierda) | Frecuencia (derecha) */}
          <div className={styles.formRow}>
            {/* Columna Izquierda: Clasificación y Hora */}
            <div className={styles.formColumn}>
              {/* Clasificación (solo para egresos) */}
              {type === 'egreso' && (
                <div className={styles.formGroup}>
                  <label>Clasificación:</label>
                  <div className={styles.classificationBtns}>
                    <button
                      type="button"
                      className={`${styles.classificationBtn} ${formData.clasificacion === 'prioritario' ? styles.active : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, clasificacion: 'prioritario' }))}
                    >
                      Prioritario
                    </button>
                    <button
                      type="button"
                      className={`${styles.classificationBtn} ${formData.clasificacion === 'secundario' ? styles.active : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, clasificacion: 'secundario' }))}
                    >
                      Secundario
                    </button>
                  </div>
                </div>
              )}

              {/* Hora del día */}
              <div className={styles.formGroup}>
                <label>Hora del día:</label>
                <div className={styles.timeRow}>
                  <div className={`${styles.inputWrapper} ${errors.hora ? styles.error : ''}`}>
                    <select
                      className={styles.timeSelect}
                      value={formData.hora}
                      onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                    >
                      {opcionesHora.map(hora => (
                        <option key={hora} value={hora}>{hora}</option>
                      ))}
                    </select>
                    {errors.hora && <span className={styles.errorText}>{errors.hora}</span>}
                  </div>

                  <span className={styles.timeSeparator}>:</span>

                  <div className={`${styles.inputWrapper} ${errors.minutos ? styles.error : ''}`}>
                    <select
                      className={styles.timeSelect}
                      value={formData.minutos}
                      onChange={(e) => setFormData({ ...formData, minutos: e.target.value })}
                      disabled={!formData.hora}
                    >
                      {opcionesMinutos.map(min => (
                        <option key={min} value={min}>{min}</option>
                      ))}
                    </select>
                    {errors.minutos && <span className={styles.errorText}>{errors.minutos}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Frecuencia */}
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label>Frecuencia:</label>
                <div className={styles.frequencyGrid}>
                  {frecuenciaOptions.map(({ value, label, icon }) => (
                    <button
                      key={value}
                      type="button"
                      className={`${styles.frequencyCard} ${formData.frecuencia === value ? styles.active : ''}`}
                      onClick={() => handleFrequencyChange(value)}
                    >
                      <span className={styles.frequencyIcon}>{icon}</span>
                      <span className={styles.frequencyLabel}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Selectores de tiempo según frecuencia */}
          {formData.frecuencia === 'semanal' && (
            <div className={styles.formGroup}>
              <label>Seleccione los días de la semana:</label>
              <div className={`${styles.weekDaysSelector} ${errors.diasSemana ? styles.error : ''}`}>
                {diasSemanaLabels.map(({ index, label, short }) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.weekDayBtn} ${formData.diasSemana.includes(index) ? styles.active : ''}`}
                    onClick={() => handleDayToggle(index)}
                    title={label}
                  >
                    <span className={styles.weekDayShort}>{short}</span>
                    <span className={styles.weekDayFull}>{label}</span>
                  </button>
                ))}
              </div>
              {errors.diasSemana && <span className={styles.errorMessage}>{errors.diasSemana}</span>}
            </div>
          )}

          {formData.frecuencia === 'mensual' && (
            <div className={styles.formGroup}>
              <label>Día del mes:</label>
              <div className={styles.monthDaySelector}>
                {diasDelMes.map(day => (
                  <button
                    key={day}
                    type="button"
                    className={`${styles.dayBtn} ${formData.diaMes === day ? styles.active : ''}`}
                    onClick={() => handleMonthDaySelect(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(formData.frecuencia === 'anual' || formData.frecuencia === 'ocasional') && (
            <div className={styles.formGroup}>
              <label htmlFor="fechaEspecifica">Fecha específica:</label>
              <div className={`${styles.inputWrapper} ${errors.fechaEspecifica ? styles.error : ''}`}>
                <input
                  type="date"
                  id="fechaEspecifica"
                  name="fechaEspecifica"
                  value={formData.fechaEspecifica}
                  onChange={handleInputChange}
                />
              </div>
              {errors.fechaEspecifica && <span className={styles.errorMessage}>{errors.fechaEspecifica}</span>}
            </div>
          )}

          {/* Notificación (solo si NO es ocasional) */}
          {formData.frecuencia !== 'ocasional' && (
            <>
              {/* Fecha límite - hasta cuándo estará activa la transacción recurrente */}
              <div className={styles.formGroup}>
                <label htmlFor="fechaLimite">Fecha límite (opcional):</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="date"
                    id="fechaLimite"
                    name="fechaLimite"
                    value={formData.fechaLimite}
                    onChange={handleInputChange}
                    min={currentDate}
                    placeholder="Sin fecha límite"
                  />
                </div>
                <span className={styles.helpText}>
                  Deja vacío para que la transacción se repita indefinidamente
                </span>
              </div>

              <div className={styles.notificationGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="notificacionActiva"
                    checked={formData.notificacionActiva}
                    onChange={handleInputChange}
                  />
                  <span>Activar notificación</span>
                </label>
              </div>
            </>
          )}

          {/* Botones de acción */}
          <div className={styles.formActions}>
            <Button type="submit" variant="brand">
              Guardar {type === 'ingreso' ? 'Ingreso' : 'Egreso'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/user/dashboard')}
            >
              Cancelar
            </Button>
          </div>
        </form>

        {/* Toast de notificación */}
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
            duration={5000}
          />
        )}
      </div>
    );
}

TransactionForm.propTypes = {
  type: PropTypes.oneOf(['ingreso', 'egreso']).isRequired,
  onSubmitSuccess: PropTypes.func
};

export default TransactionForm;
