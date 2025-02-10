import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';


//Fontes
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Inter_400Regular, Inter_500Medium, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { Poppins_700Bold, Poppins_600SemiBold } from '@expo-google-fonts/poppins';


import { Home } from './src/screens/Home';
import { Loading } from './src/components/Loading';

import theme from './src/global/styles/theme';

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
      <StatusBar style="auto" />
      <Home />
    </ThemeProvider>
  );
}
