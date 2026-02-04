import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext.jsx';
import AppNavigator from './src/navigation/AppNavigator.jsx';

/**
 * App - Componente principal de Finaizen Mobile
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
