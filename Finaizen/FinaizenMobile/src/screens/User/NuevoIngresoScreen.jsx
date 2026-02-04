import { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TransactionForm from '../../components/forms/TransactionForm.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function NuevoIngresoScreen({ navigation, route }) {
  const { user } = useAuth();
  const [initialData, setInitialData] = useState(null);
  
  // Datos que pueden venir de OCR o reconocimiento de voz
  const ocrData = route?.params?.ocrData || null;
  const voiceData = route?.params?.voiceData || null;

  useEffect(() => {
    // Si vienen datos de OCR o voz, preparar datos iniciales
    if (ocrData) {
      setInitialData({
        descripcion: ocrData.descripcion || '',
        monto: ocrData.monto || '',
        categoria: ocrData.categoria || '',
      });
    } else if (voiceData) {
      setInitialData({
        descripcion: voiceData.descripcion || '',
        monto: voiceData.monto || '',
        categoria: voiceData.categoria || '',
      });
    }
  }, [ocrData, voiceData]);

  const handleSuccess = (result) => {
    Alert.alert(
      '✅ Ingreso Guardado',
      result.frecuencia === 'ocasional'
        ? 'El ingreso se ha registrado correctamente en tu historial.'
        : 'El ingreso recurrente se ha configurado correctamente.',
      [
        {
          text: 'Ver Historial',
          onPress: () => navigation.navigate('Historial'),
        },
        {
          text: 'Aceptar',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TransactionForm
        type="ingreso"
        perfilId={user?.perfilId}
        initialData={initialData}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f9fafb' 
  },
});
