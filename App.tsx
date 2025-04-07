import { StatusBar } from "expo-status-bar";
import React, { useEffect, useCallback } from "react";
import { ThemeProvider } from "styled-components/native";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

//Fontes
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import {
  Poppins_700Bold,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

//Componentes
import { Loading } from "./src/components/Loading";
import theme from "./src/global/styles/theme";
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { Routes } from "./src/routes";

SplashScreen.preventAutoHideAsync();

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, 
  offlineAccess: true,
  forceCodeForRefreshToken: true, 
  iosClientId: '', // implementação Futura
});

async function checkGoogleSignin() {
  try {
    await GoogleSignin.hasPlayServices();
    console.log('GoogleSignin: Play Services disponíveis');
  } catch (error) {
    console.error('Erro ao verificar GoogleSignin:', error);
  }
}

checkGoogleSignin();

export default function App() {
  const [loaded, error] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_800ExtraBold,
    Poppins_700Bold,
    Poppins_600SemiBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <Loading />;
  }

  return (
    <ThemeProvider theme={theme}>
      <AuthContextProvider>
        <NavigationContainer onReady={onLayoutRootView}>
          <Routes />
          <StatusBar style="light" backgroundColor="transparent" translucent />
        </NavigationContainer>
      </AuthContextProvider>
    </ThemeProvider>
  );
}
