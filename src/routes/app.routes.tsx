import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from '../screens/Home';
import { Schedule } from '../screens/Schedule';
import { Profile } from '../screens/Profile';
import { useTheme } from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { Header } from 'react-native/Libraries/NewAppScreen';

const Tab = createBottomTabNavigator();

export function AppRoutes() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Schedule') {
            iconName = 'calendar';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text_light,
        tabBarShowLabel: false,
        tabBarStyle: route.name === 'Home' 
        ? { display: 'none' }  
        : {
            backgroundColor: theme.colors.background,
            height: 70,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'absolute',
            paddingBottom: 10,
          },
      })}
    >
      <Tab.Screen 
          name="Home" 
          component={Home}
          options={{ headerShown: false }} 
      />
      <Tab.Screen 
          name="Schedule" 
          component={Schedule} 
          options={{ headerShown: false }}
      />
      <Tab.Screen 
          name="Profile" 
          component={Profile} 
          options={{ headerShown: false }}
          />
    </Tab.Navigator>
  );
}
