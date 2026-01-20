import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  Pressable,
  Dimensions
} from 'react-native';
import { COLORS } from '../../utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * QuickActionButton - Botón flotante de acciones rápidas (FAB)
 * Permite agregar ingresos/egresos de forma rápida
 */
export default function QuickActionButton({ onAddIngreso, onAddEgreso, onVoiceRecord, onPhotoRecord }) {
  const [isOpen, setIsOpen] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const toggleMenu = () => {
    // Pequeño efecto de pulso al presionar
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsOpen(!isOpen);
  };

  const handleAction = (action) => {
    setIsOpen(false);
    // Pequeño delay para permitir que se cierre el menú
    setTimeout(() => {
      action && action();
    }, 200);
  };

  // Animaciones para los botones del menú
  const getButtonStyle = (index, total) => {
    const translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -70 * (total - index)],
    });

    const opacity = animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.5, 1],
    });

    const scale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });

    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  };

  // Rotación del botón principal
  const mainButtonRotation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const actions = [
    {
      id: 'ingreso',
      icon: '💰',
      label: 'Ingreso',
      color: COLORS.success,
      onPress: onAddIngreso,
    },
    {
      id: 'egreso',
      icon: '💸',
      label: 'Egreso',
      color: COLORS.danger,
      onPress: onAddEgreso,
    },
    {
      id: 'voice',
      icon: '🎤',
      label: 'Por Voz',
      color: COLORS.primary,
      onPress: onVoiceRecord,
    },
    {
      id: 'photo',
      icon: '📷',
      label: 'Por Foto',
      color: '#9333ea',
      onPress: onPhotoRecord,
    },
  ];

  return (
    <>
      {/* Overlay cuando el menú está abierto */}
      {isOpen && (
        <Pressable 
          style={styles.overlay} 
          onPress={() => setIsOpen(false)}
        />
      )}
      
      <View style={styles.container} pointerEvents="box-none">
        {/* Botones de acciones */}
        {actions.map((action, index) => (
          <Animated.View
            key={action.id}
            style={[
              styles.actionButtonWrapper,
              getButtonStyle(index, actions.length),
            ]}
          >
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: action.color }]}
              onPress={() => handleAction(action.onPress)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
            </TouchableOpacity>
            {isOpen && (
              <Animated.View 
                style={[
                  styles.labelContainer,
                  { opacity: animatedValue }
                ]}
              >
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Animated.View>
            )}
          </Animated.View>
        ))}

        {/* Botón principal (FAB) */}
        <Animated.View
          style={[
            styles.mainButtonWrapper,
            {
              transform: [
                { scale: scaleValue },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.mainButton}
            onPress={toggleMenu}
            activeOpacity={0.9}
          >
            <Animated.Text
              style={[
                styles.mainIcon,
                { transform: [{ rotate: mainButtonRotation }] },
              ]}
            >
              ＋
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 998,
  },
  container: {
    position: 'absolute',
    right: 20,
    bottom: 90, // Ajustar según la altura del TabBar
    alignItems: 'center',
    zIndex: 999,
  },
  mainButtonWrapper: {
    position: 'relative',
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  mainIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
    marginTop: -2,
  },
  actionButtonWrapper: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  actionIcon: {
    fontSize: 22,
  },
  labelContainer: {
    position: 'absolute',
    right: 60,
    backgroundColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});
