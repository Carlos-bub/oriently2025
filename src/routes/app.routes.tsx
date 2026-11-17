import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Home } from "../screens/Home";
import { Schedule } from "../screens/Schedule";
import { Profile } from "../screens/Profile";

const Tab = createBottomTabNavigator();

export function AppRoutes() {
  const theme = useTheme();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const userParams = route.params || {};
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <Tab.Navigator
      screenOptions={({ route: currentRoute }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = "home";

          if (currentRoute.name === "Home") {
            iconName = "home";
          } else if (currentRoute.name === "Schedule") {
            iconName = "calendar";
          } else if (currentRoute.name === "Profile") {
            iconName = "book-open";
          }

          return <Feather name={iconName} size={Math.min(size, 22)} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text_secondary,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarStyle:
          currentRoute.name === "Home"
            ? { display: "none" }
            : {
                backgroundColor: theme.colors.background,
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
                height: 58 + bottomInset,
                paddingTop: 6,
                paddingBottom: bottomInset,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                position: "absolute",
                elevation: 8,
                shadowColor: "#172B4D",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
              },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={userParams}
        options={{
          headerShown: false,
          tabBarAccessibilityLabel: "Início",
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={Schedule}
        initialParams={userParams}
        options={{
          headerShown: false,
          tabBarAccessibilityLabel: "Agendar orientação",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        initialParams={userParams}
        options={{
          headerShown: false,
          tabBarAccessibilityLabel: "Meus agendamentos",
        }}
      />
    </Tab.Navigator>
  );
}
