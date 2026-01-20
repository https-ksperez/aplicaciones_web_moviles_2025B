import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingScreen, LoginScreen, RegisterScreen } from '../screens/Auth';

const Stack = createNativeStackNavigator();

/**
 * AuthNavigator - Navegación para pantallas de autenticación
 * Landing, Login, Register
 */
export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
