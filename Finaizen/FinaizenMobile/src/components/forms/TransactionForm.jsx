import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext.jsx';
import apiService from '../../services/apiService';
import { COLORS } from '../../utils/constants';
import Card from '../ui/Card.jsx';
import {
  AmountField,
  DescriptionField,
  CategorySelector,
  FrequencySelector,
  WeekDaySelector,
  MonthDaySelector,
  DateField,
  NotificationSwitch,
  ClassificationSelector
} from './fields';

// Categorías
const CATEGORIAS_INGRESO = [
  'Salario', 'Freelance', 'Inversiones', 'Ventas', 'Bonos', 
  'Regalos', 'Reembolsos', 'Alquiler', 'Otros'
];

const CATEGORIAS_EGRESO = [
  'Alimentación', 'Transporte', 'Vivienda', 'Servicios', 
  'Entretenimiento', 'Salud', 'Educación', 'Ropa', 
  'Tecnología', 'Suscripciones', 'Otros'
];

const FRECUENCIAS = [
  { value: 'ocasional', label: 'Una vez', icon: '📅' },
  { value: 'diario', label: 'Diario', icon: '🔄' },
  { value: 'semanal', label: 'Semanal', icon: '📆' },
  { value: 'mensual', label: 'Mensual', icon: '🗓️' },
  { value: 'anual', label: 'Anual', icon: '📊' },
];

/**
 * TransactionForm - Formulario completo para Ingresos/Egresos (Refactorizado)
 * Usa componentes reutilizables para mejorar mantenibilidad
 * @param {string} type - 'ingreso' o 'egreso'
 * @param {string} perfilId - ID del perfil actual
 * @param {object} initialData - Datos iniciales (de OCR, voz, o edición)
 * @param {function} onSuccess - Callback al guardar exitosamente
 * @param {function} onCancel - Callback al cancelar
 */
export default function TransactionForm({ 
  type = 'ingreso', 
  perfilId,
  initialData = null, 
  onSuccess,
  onCancel 
}) {
  const navigation = useNavigation();
  const { currentPerfil, isDemoMode } = useAuth();
  
  // Usar perfilId proporcionado o del contexto
  const activePerfilId = perfilId || currentPerfil?.id;
  
  const isIngreso = type === 'ingreso';
  const categorias = isIngreso ? CATEGORIAS_INGRESO : CATEGORIAS_EGRESO;
  
  // Fecha actual
  const now = useMemo(() => new Date(), []);
  const currentDate = useMemo(() => now.toISOString().split('T')[0], [now]);
  const currentDay = useMemo(() => now.getDate(), [now]);
  const currentDayOfWeek = useMemo(() => now.getDay(), [now]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    monto: '',
    descripcion: '',
    categoria: categorias[0],
    frecuencia: 'ocasional',
    diasSemana: [currentDayOfWeek],
    diaMes: currentDay,
    fechaEspecifica: currentDate,
    notificacionActiva: false,
    clasificacion: 'necesidad', // Solo para egresos
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Cargar datos iniciales si existen
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        monto: initialData.monto?.toString() || prev.monto,
        descripcion: initialData.descripcion || prev.descripcion,
        categoria: initialData.categoria || prev.categoria,
        fechaEspecifica: initialData.fecha || prev.fechaEspecifica,
        clasificacion: initialData.clasificacion || prev.clasificacion,
        frecuencia: 'ocasional'
      }));
    }
  }, [initialData]);

  // Handlers
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFrecuenciaChange = (frecuencia) => {
    setFormData(prev => ({
      ...prev,
      frecuencia,
      diasSemana: frecuencia === 'semanal' ? [currentDayOfWeek] : [],
      diaMes: frecuencia === 'mensual' ? currentDay : null,
      fechaEspecifica: ['ocasional', 'anual'].includes(frecuencia) ? currentDate : ''
    }));
  };

  // Toggle de día de la semana
  const handleDayToggle = (dayIndex) => {
    setFormData(prev => {
      const dias = [...prev.diasSemana];
      const idx = dias.indexOf(dayIndex);
      if (idx > -1) {
        dias.splice(idx, 1);
      } else {
        dias.push(dayIndex);
      }
      return { ...prev, diasSemana: dias.sort() };
    });
  };

  // Validación
  const validate = () => {
    const newErrors = {};
    
    const monto = parseFloat(formData.monto);
    if (isNaN(monto) || monto <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    if (formData.frecuencia === 'semanal' && formData.diasSemana.length === 0) {
      newErrors.diasSemana = 'Seleccione al menos un día';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Error', 'Por favor corrija los errores del formulario');
      return;
    }

    setLoading(true);
    try {
      if (formData.frecuencia === 'ocasional') {
        // Transacción ocasional: crear directamente en historial
        await createOcasionalTransaction();
      } else {
        // Transacción recurrente: crear en ingresos/egresos
        await createRecurringTransaction();
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudo guardar la transacción');
    } finally {
      setLoading(false);
    }
  };

  const createOcasionalTransaction = async () => {
    const [year, month, day] = formData.fechaEspecifica.split('-').map(Number);
    const fechaEjecucion = new Date(year, month - 1, day);
    
    const registroData = {
      tipo: type,
      monto: parseFloat(formData.monto),
      descripcion: formData.descripcion.trim(),
      categoria: formData.categoria,
      transaccionOrigenId: null,
      fechaEjecucion: fechaEjecucion.toISOString(),
      mes: fechaEjecucion.getMonth() + 1,
      anio: fechaEjecucion.getFullYear()
    };

    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      await apiService.historial.create(activePerfilId, registroData);
    }

    if (onSuccess) {
      onSuccess({ ...registroData, frecuencia: 'ocasional' });
    } else {
      Alert.alert(
        '¡Listo!',
        `${isIngreso ? 'Ingreso' : 'Egreso'} registrado correctamente`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  const createRecurringTransaction = async () => {
    const transactionData = {
      monto: parseFloat(formData.monto),
      descripcion: formData.descripcion.trim(),
      categoria: formData.categoria,
      frecuencia: formData.frecuencia,
      diasSemana: formData.diasSemana,
      diaMes: formData.diaMes,
      fechaEspecifica: formData.fechaEspecifica || null,
      notificacionActiva: formData.notificacionActiva,
      activo: true
    };

    if (!isIngreso) {
      transactionData.clasificacionIA = formData.clasificacion;
    }

    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      if (isIngreso) {
        await apiService.ingresos.create(activePerfilId, transactionData);
      } else {
        await apiService.egresos.create(activePerfilId, transactionData);
      }
    }

    if (onSuccess) {
      onSuccess({ ...transactionData, frecuencia: formData.frecuencia });
    } else {
      Alert.alert(
        '¡Listo!',
        `${isIngreso ? 'Ingreso' : 'Egreso'} recurrente programado`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  // Handler para cancelar/volver
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.backButton}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {isIngreso ? '💰 Nuevo Ingreso' : '💸 Nuevo Egreso'}
          </Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Campo de Monto */}
          <Card style={styles.card}>
            <AmountField
              value={formData.monto}
              onChangeText={(v) => handleChange('monto', v)}
              error={errors.monto}
            />
          </Card>

          {/* Campo de Descripción */}
          <Card style={styles.card}>
            <DescriptionField
              value={formData.descripcion}
              onChangeText={(v) => handleChange('descripcion', v)}
              error={errors.descripcion}
              placeholder={isIngreso ? "Ej: Salario mensual" : "Ej: Compra supermercado"}
            />
          </Card>

          {/* Selector de Categoría */}
          <Card style={styles.card}>
            <CategorySelector
              value={formData.categoria}
              onChange={(v) => handleChange('categoria', v)}
              categories={categorias}
            />
          </Card>

          {/* Selector de Frecuencia */}
          <Card style={styles.card}>
            <FrequencySelector
              value={formData.frecuencia}
              onChange={handleFrecuenciaChange}
              frequencies={FRECUENCIAS}
            />
          </Card>

          {/* Opciones según frecuencia */}
          {formData.frecuencia === 'semanal' && (
            <Card style={styles.card}>
              <WeekDaySelector
                selectedDays={formData.diasSemana}
                onToggle={handleDayToggle}
                error={errors.diasSemana}
              />
            </Card>
          )}

          {formData.frecuencia === 'mensual' && (
            <Card style={styles.card}>
              <MonthDaySelector
                selectedDay={formData.diaMes}
                onChange={(v) => handleChange('diaMes', v)}
              />
            </Card>
          )}

          {(formData.frecuencia === 'ocasional' || formData.frecuencia === 'anual') && (
            <Card style={styles.card}>
              <DateField
                value={formData.fechaEspecifica}
                onChangeText={(v) => handleChange('fechaEspecifica', v)}
              />
            </Card>
          )}

          {/* Notificación (solo para recurrentes) */}
          {formData.frecuencia !== 'ocasional' && (
            <Card style={styles.card}>
              <NotificationSwitch
                value={formData.notificacionActiva}
                onValueChange={(v) => handleChange('notificacionActiva', v)}
              />
            </Card>
          )}

          {/* Clasificación (solo egresos) */}
          {!isIngreso && (
            <Card style={styles.card}>
              <ClassificationSelector
                value={formData.clasificacion}
                onChange={(v) => handleChange('clasificacion', v)}
              />
            </Card>
          )}

          {/* Espacio inferior */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Botón guardar */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.cancelBtn]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.submitBtn,
              { backgroundColor: isIngreso ? COLORS.success : COLORS.danger },
              loading && styles.btnDisabled
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>
                {formData.frecuencia === 'ocasional' ? 'Registrar' : 'Programar'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  backButton: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
