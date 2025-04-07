import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppRoutes } from './app.routes';
import { LoginScreen } from '../screens/Login';
import { Loading } from '../components/Loading';
import { useAuth } from '../contexts/AuthContext';

const Stack = createNativeStackNavigator();

export function Routes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        <Stack.Screen 
          name="AppRoutes" 
          component={AppRoutes}
          initialParams={{
            userName: user.name,
            userEmail: user.email,
            userPhoto: user.photo
          }}
        />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
} 