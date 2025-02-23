import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';


//Fontes
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Inter_400Regular, Inter_500Medium, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

//Componentes
import { Loading } from './src/components/Loading';
import theme from './src/global/styles/theme';
import { AppRoutes } from './src/routes/app.routes'

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_800ExtraBold,
    Poppins_700Bold,
    Poppins_600SemiBold
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return<Loading/>;
  }
 
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        < AppRoutes />
      </NavigationContainer>
    </ThemeProvider>
  );
}
