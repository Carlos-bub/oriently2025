import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "../screens/Home";
import { Schedule } from "../screens/Schedule";
import { Profile } from "../screens/Profile";
import { useTheme } from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export function AppRoutes() {
  const theme = useTheme();
  const route = useRoute();
  
  // pegando os parâmetros de usuário da tela de login
  const userParams = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Schedule") {
            iconName = "calendar";
          } else if (route.name === "Profile") {
            iconName = "user";
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text_light,
        tabBarShowLabel: false,
        tabBarStyle:
          route.name === "Home"
            ? { display: "none" }
            : {
                backgroundColor: theme.colors.background,
                height: 70,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                position: "absolute",
                paddingBottom: 10,
              },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={userParams}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Schedule"
        component={Schedule}
        initialParams={userParams}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        initialParams={userParams}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
