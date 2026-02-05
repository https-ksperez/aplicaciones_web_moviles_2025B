import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext.jsx';
import apiService from '../../services/apiService';
import { COLORS } from '../../utils/constants';

/**
 * EditarHistorialScreen - CRUD para editar elementos del historial
 * Permite editar o eliminar un registro existente
 */
export default function EditarHistorialScreen({ route, navigation }) {
  const { registro } = route.params || {};
  const { currentPerfil, isDemoMode } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo: registro?.tipo || 'egreso',
    monto: registro?.monto?.toString() || '',
    descripcion: registro?.descripcion || '',
    categoria: registro?.categoria || 'Otros',
    fechaEjecucion: registro?.fechaEjecucion || new Date().toISOString().split('T')[0]
  });

  const categorias = {
    ingreso: ['Salario', 'Freelance', 'Inversiones', 'Ventas', 'Otros'],
    egreso: ['Alimentación', 'Transporte', 'Vivienda', 'Entretenimiento', 'Salud', 'Otros']
  };

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

    setLoading(true);
    try {
      if (isDemoMode) {
        Alert.alert('Modo Demo', 'Los cambios no se guardarán en modo demo');
        navigation.goBack();
        return;
      }

      const perfilId = currentPerfil?.id || currentPerfil?._id;
      const registroId = registro?.id || registro?._id;
      
      const dataToUpdate = {
        tipo: formData.tipo,
        monto: parseFloat(formData.monto),
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        fechaEjecucion: formData.fechaEjecucion
      };

      await apiService.historial.update(registroId, dataToUpdate);
      
      Alert.alert(
        '✅ Actualizado',
        'El registro se actualizó correctamente',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error actualizando registro:', error);
      Alert.alert('Error', 'No se pudo actualizar el registro');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '⚠️ Confirmar Eliminación',
      '¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              if (isDemoMode) {
                Alert.alert('Modo Demo', 'Los cambios no se guardarán en modo demo');
                navigation.goBack();
                return;
              }

              const perfilId = currentPerfil?.id || currentPerfil?._id;
              const registroId = registro?.id || registro?._id;
              
              await apiService.historial.delete(registroId);
              
              Alert.alert(
                '✅ Eliminado',
                'El registro se eliminó correctamente',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (error) {
              console.error('Error eliminando registro:', error);
              Alert.alert('Error', 'No se pudo eliminar el registro');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Editar Registro</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {/* Tipo */}
        <View style={styles.field}>
          <Text style={styles.label}>Tipo *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.tipo}
              onValueChange={(value) => {
                setFormData({ 
                  ...formData, 
                  tipo: value,
                  categoria: categorias[value][0]
                });
              }}
              style={styles.picker}
            >
              <Picker.Item label="Ingreso" value="ingreso" />
              <Picker.Item label="Egreso" value="egreso" />
            </Picker>
          </View>
        </View>

        {/* Monto */}
        <View style={styles.field}>
          <Text style={styles.label}>Monto *</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={formData.monto}
            onChangeText={(value) => setFormData({ ...formData, monto: value })}
          />
        </View>

        {/* Descripción */}
        <View style={styles.field}>
          <Text style={styles.label}>Descripción *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Compra de supermercado"
            value={formData.descripcion}
            onChangeText={(value) => setFormData({ ...formData, descripcion: value })}
          />
        </View>

        {/* Categoría */}
        <View style={styles.field}>
          <Text style={styles.label}>Categoría *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.categoria}
              onValueChange={(value) => setFormData({ ...formData, categoria: value })}
              style={styles.picker}
            >
              {categorias[formData.tipo].map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Fecha */}
        <View style={styles.field}>
          <Text style={styles.label}>Fecha</Text>
          <Text style={styles.infoText}>
            {new Date(formData.fechaEjecucion).toLocaleDateString('es-ES')}
          </Text>
        </View>

        {/* Botones */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>💾 Guardar Cambios</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={loading}
          >
            <Text style={styles.deleteButtonText}>🗑️ Eliminar Registro</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  backButton: {
    fontSize: 16,
    color: COLORS.primary,
    width: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 180 : 50,
  },
  infoText: {
    fontSize: 16,
    color: '#6b7280',
    paddingVertical: 12,
  },
  actions: {
    marginTop: 10,
    gap: 12,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
  },
});
