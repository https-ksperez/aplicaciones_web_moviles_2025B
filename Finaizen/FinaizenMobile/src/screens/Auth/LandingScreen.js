import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Button from '../../components/ui/Button';
import { COLORS } from '../../utils/constants';

const { width } = Dimensions.get('window');

/**
 * LandingScreen - Pantalla de bienvenida
 * Primera pantalla que ve el usuario
 */
export default function LandingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <Text style={styles.logo}>💰 Finaizen</Text>
            <Text style={styles.heroTitle}>
              Organiza tu Dinero.{'\n'}
              <Text style={styles.brand}>Vive Mejor.</Text>
            </Text>
            <Text style={styles.subtitle}>
              "Donde cada gasto tiene un propósito y cada meta se hace realidad."
            </Text>
            <View style={styles.heroActions}>
              <Button 
                variant="brand" 
                onPress={() => navigation.navigate('Register')}
                style={styles.btnPrimary}
              >
                Comenzar Gratis
              </Button>
              <Button 
                variant="outline" 
                onPress={() => navigation.navigate('Login')}
                style={styles.btnSecondary}
              >
                Iniciar Sesión
              </Button>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.features}>
          <FeatureCard 
            icon="📊"
            title="Dashboard Intuitivo"
            description="Visualiza un resumen completo de tus finanzas en un solo lugar."
          />
          <FeatureCard 
            icon="💵"
            title="Control de Gastos"
            description="Registra y categoriza tus ingresos y egresos fácilmente."
          />
          <FeatureCard 
            icon="🎯"
            title="Metas de Ahorro"
            description="Define cuánto deseas ahorrar y te ayudamos a lograrlo."
          />
          <FeatureCard 
            icon="📈"
            title="Presupuestos"
            description="Crea presupuestos y recibe alertas cuando estés por exceder."
          />
          <FeatureCard 
            icon="🏆"
            title="Logros"
            description="Gana insignias mientras mejoras tus hábitos financieros."
          />
          <FeatureCard 
            icon="🔔"
            title="Notificaciones"
            description="Recibe recordatorios y alertas personalizadas."
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Finaizen - Finanzas Inteligentes
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Componente FeatureCard para mostrar características
 */
function FeatureCard({ icon, title, description }) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    minHeight: 400,
    backgroundColor: '#0f766e',
    paddingHorizontal: 24,
    paddingVertical: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 500,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  brand: {
    color: '#fde68a',
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 32,
    fontStyle: 'italic',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  heroActions: {
    width: '100%',
    gap: 12,
  },
  btnPrimary: {
    width: '100%',
    backgroundColor: '#fde68a',
  },
  btnSecondary: {
    width: '100%',
    backgroundColor: 'transparent',
    borderColor: COLORS.white,
  },
  features: {
    padding: 24,
    gap: 16,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f766e',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },
});
