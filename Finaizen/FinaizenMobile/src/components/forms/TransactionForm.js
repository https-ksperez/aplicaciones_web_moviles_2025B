import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';
import { COLORS } from '../../utils/constants';
import Card from '../ui/Card';

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

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * TransactionForm - Formulario completo para Ingresos/Egresos
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

  // Generar días del mes
  const diasMes = Array.from({ length: 31 }, (_, i) => i + 1);

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
          {/* Monto */}
          <Card style={styles.card}>
            <Text style={styles.label}>Monto *</Text>
            <View style={styles.montoContainer}>
              <Text style={styles.montoSymbol}>$</Text>
              <TextInput
                style={[styles.montoInput, errors.monto && styles.inputError]}
                value={formData.monto}
                onChangeText={(v) => handleChange('monto', v)}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor="#9ca3af"
              />
            </View>
            {errors.monto && <Text style={styles.errorText}>{errors.monto}</Text>}
          </Card>

          {/* Descripción */}
          <Card style={styles.card}>
            <Text style={styles.label}>Descripción *</Text>
            <TextInput
              style={[styles.textInput, errors.descripcion && styles.inputError]}
              value={formData.descripcion}
              onChangeText={(v) => handleChange('descripcion', v)}
              placeholder={isIngreso ? "Ej: Salario mensual" : "Ej: Compra supermercado"}
              placeholderTextColor="#9ca3af"
              maxLength={100}
            />
            {errors.descripcion && <Text style={styles.errorText}>{errors.descripcion}</Text>}
          </Card>

          {/* Categoría */}
          <Card style={styles.card}>
            <Text style={styles.label}>Categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoriesRow}>
                {categorias.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      formData.categoria === cat && styles.categoryChipActive
                    ]}
                    onPress={() => handleChange('categoria', cat)}
                  >
                    <Text style={[
                      styles.categoryText,
                      formData.categoria === cat && styles.categoryTextActive
                    ]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Card>

          {/* Frecuencia */}
          <Card style={styles.card}>
            <Text style={styles.label}>Frecuencia</Text>
            <View style={styles.frequencyContainer}>
              {FRECUENCIAS.map(freq => (
                <TouchableOpacity
                  key={freq.value}
                  style={[
                    styles.frequencyBtn,
                    formData.frecuencia === freq.value && styles.frequencyBtnActive
                  ]}
                  onPress={() => handleFrecuenciaChange(freq.value)}
                >
                  <Text style={styles.frequencyIcon}>{freq.icon}</Text>
                  <Text style={[
                    styles.frequencyText,
                    formData.frecuencia === freq.value && styles.frequencyTextActive
                  ]}>{freq.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Opciones según frecuencia */}
          {formData.frecuencia === 'semanal' && (
            <Card style={styles.card}>
              <Text style={styles.label}>Días de la semana</Text>
              <View style={styles.daysRow}>
                {DIAS_SEMANA.map((dia, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.dayBtn,
                      formData.diasSemana.includes(idx) && styles.dayBtnActive
                    ]}
                    onPress={() => handleDayToggle(idx)}
                  >
                    <Text style={[
                      styles.dayText,
                      formData.diasSemana.includes(idx) && styles.dayTextActive
                    ]}>{dia}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.diasSemana && <Text style={styles.errorText}>{errors.diasSemana}</Text>}
            </Card>
          )}

          {formData.frecuencia === 'mensual' && (
            <Card style={styles.card}>
              <Text style={styles.label}>Día del mes</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.monthDaysRow}>
                  {diasMes.map(dia => (
                    <TouchableOpacity
                      key={dia}
                      style={[
                        styles.monthDayBtn,
                        formData.diaMes === dia && styles.monthDayBtnActive
                      ]}
                      onPress={() => handleChange('diaMes', dia)}
                    >
                      <Text style={[
                        styles.monthDayText,
                        formData.diaMes === dia && styles.monthDayTextActive
                      ]}>{dia}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </Card>
          )}

          {(formData.frecuencia === 'ocasional' || formData.frecuencia === 'anual') && (
            <Card style={styles.card}>
              <Text style={styles.label}>Fecha</Text>
              <TextInput
                style={styles.textInput}
                value={formData.fechaEspecifica}
                onChangeText={(v) => handleChange('fechaEspecifica', v)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
              />
              <Text style={styles.helperText}>Formato: 2026-01-19</Text>
            </Card>
          )}

          {/* Notificación (solo para recurrentes) */}
          {formData.frecuencia !== 'ocasional' && (
            <Card style={styles.card}>
              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.switchLabel}>🔔 Notificación</Text>
                  <Text style={styles.switchSubLabel}>Recibir recordatorio</Text>
                </View>
                <Switch
                  value={formData.notificacionActiva}
                  onValueChange={(v) => handleChange('notificacionActiva', v)}
                  trackColor={{ false: '#e5e7eb', true: COLORS.primary + '60' }}
                  thumbColor={formData.notificacionActiva ? COLORS.primary : '#9ca3af'}
                />
              </View>
            </Card>
          )}

          {/* Clasificación (solo egresos) */}
          {!isIngreso && (
            <Card style={styles.card}>
              <Text style={styles.label}>Clasificación</Text>
              <View style={styles.classificationRow}>
                {['prioritario', 'necesario', 'prescindible'].map(cls => (
                  <TouchableOpacity
                    key={cls}
                    style={[
                      styles.classificationBtn,
                      formData.clasificacion === cls && styles.classificationBtnActive
                    ]}
                    onPress={() => handleChange('clasificacion', cls)}
                  >
                    <Text style={[
                      styles.classificationText,
                      formData.clasificacion === cls && styles.classificationTextActive
                    ]}>
                      {cls === 'prioritario' ? '⭐ Prioritario' : 
                       cls === 'necesario' ? '✓ Necesario' : '○ Prescindible'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
  card: {
    marginBottom: 16,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  montoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
  },
  montoSymbol: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6b7280',
    marginRight: 8,
  },
  montoInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    paddingVertical: 16,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 6,
  },
  helperText: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 6,
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    color: '#6b7280',
  },
  categoryTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  frequencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  frequencyBtnActive: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  frequencyIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  frequencyText: {
    fontSize: 14,
    color: '#6b7280',
  },
  frequencyTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayBtnActive: {
    backgroundColor: COLORS.primary,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  dayTextActive: {
    color: '#fff',
  },
  monthDaysRow: {
    flexDirection: 'row',
    gap: 8,
  },
  monthDayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthDayBtnActive: {
    backgroundColor: COLORS.primary,
  },
  monthDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  monthDayTextActive: {
    color: '#fff',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  switchSubLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  classificationRow: {
    gap: 10,
  },
  classificationBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  classificationBtnActive: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  classificationText: {
    fontSize: 14,
    color: '#6b7280',
  },
  classificationTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
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
