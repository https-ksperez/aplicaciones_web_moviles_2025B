import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { COLORS } from '../../utils/constants';

const CATEGORIAS_INGRESO = [
  'Salario', 'Freelance', 'Inversiones', 'Ventas', 'Bonos', 
  'Regalos', 'Reembolsos', 'Alquiler', 'Otros'
];

const CATEGORIAS_EGRESO = [
  'Alimentación', 'Transporte', 'Vivienda', 'Servicios', 
  'Entretenimiento', 'Salud', 'Educación', 'Ropa', 
  'Tecnología', 'Suscripciones', 'Otros'
];

/**
 * QuickExpenseModal - Modal para agregar ingreso/egreso rápidamente
 */
export default function QuickExpenseModal({ 
  visible, 
  onClose, 
  onSave, 
  tipo = 'egreso',
  perfilId
}) {
  const [formData, setFormData] = useState({
    monto: '',
    descripcion: '',
    categoria: '',
  });
  const [saving, setSaving] = useState(false);

  const isIngreso = tipo === 'ingreso';
  const categorias = isIngreso ? CATEGORIAS_INGRESO : CATEGORIAS_EGRESO;

  // Reset form cuando se abre
  useEffect(() => {
    if (visible) {
      setFormData({
        monto: '',
        descripcion: '',
        categoria: categorias[0],
      });
    }
  }, [visible, tipo]);

  const handleSave = async () => {
    // Validaciones
    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }
    if (!formData.descripcion.trim()) {
      Alert.alert('Error', 'Ingresa una descripción');
      return;
    }
    if (!formData.categoria) {
      Alert.alert('Error', 'Selecciona una categoría');
      return;
    }

    setSaving(true);
    try {
      const data = {
        tipo,
        monto: parseFloat(formData.monto),
        descripcion: formData.descripcion.trim(),
        categoria: formData.categoria,
        perfilId,
        // Para registro rápido, se marca como ejecutado inmediatamente
        frecuencia: 'ocasional',
        ejecutado: true,
        fechaEjecucion: new Date().toISOString().split('T')[0]
      };
      
      await onSave(data);
      onClose();
      Alert.alert(
        '¡Listo!',
        `${isIngreso ? 'Ingreso' : 'Egreso'} registrado correctamente`
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={[
            styles.header, 
            { backgroundColor: isIngreso ? COLORS.success : COLORS.danger }
          ]}>
            <Text style={styles.headerIcon}>
              {isIngreso ? '💰' : '💸'}
            </Text>
            <Text style={styles.headerTitle}>
              Nuevo {isIngreso ? 'Ingreso' : 'Egreso'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
            {/* Monto */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monto *</Text>
              <View style={styles.montoContainer}>
                <Text style={styles.montoSymbol}>$</Text>
                <TextInput
                  style={styles.montoInput}
                  value={formData.monto}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, monto: text }))}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#9ca3af"
                  autoFocus
                />
              </View>
            </View>

            {/* Descripción */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descripción *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.descripcion}
                onChangeText={(text) => setFormData(prev => ({ ...prev, descripcion: text }))}
                placeholder={isIngreso ? "Ej: Salario de enero" : "Ej: Compra supermercado"}
                placeholderTextColor="#9ca3af"
                maxLength={100}
              />
            </View>

            {/* Categoría */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoría *</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
              >
                <View style={styles.categoriesContainer}>
                  {categorias.map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        formData.categoria === cat && [
                          styles.categoryChipActive,
                          { borderColor: isIngreso ? COLORS.success : COLORS.danger }
                        ]
                      ]}
                      onPress={() => setFormData(prev => ({ ...prev, categoria: cat }))}
                    >
                      <Text style={[
                        styles.categoryText,
                        formData.categoria === cat && [
                          styles.categoryTextActive,
                          { color: isIngreso ? COLORS.success : COLORS.danger }
                        ]
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </ScrollView>

          {/* Botones */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.saveButton,
                { backgroundColor: isIngreso ? COLORS.success : COLORS.danger },
                saving && styles.buttonDisabled
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveText}>
                {saving ? 'Guardando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#6b7280',
    marginRight: 8,
  },
  montoInput: {
    flex: 1,
    fontSize: 28,
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
  categoriesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 20,
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
    backgroundColor: '#fff',
  },
  categoryText: {
    fontSize: 14,
    color: '#6b7280',
  },
  categoryTextActive: {
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
