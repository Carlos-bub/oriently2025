import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Home } from "../screens/Home";
import { Schedule } from "../screens/Schedule";
import { Profile } from "../screens/Profile";
import { MeetingDetails } from "../screens/MeetingDetails";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const activeRoute = state.routes[state.index];

  if (activeRoute?.name === "Home") {
    return null;
  }

  const bottomOffset = Math.max(insets.bottom, 12);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: bottomOffset }]}
    >
      <View style={styles.pillContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Home")}
          accessibilityRole="button"
          accessibilityLabel="Início"
          style={styles.sideTab}
        >
          <Feather name="home" size={20} color="#414754" />
          <Text
            style={[
              styles.sideLabel,
              { fontFamily: theme.fonts.Subtituloslight },
            ]}
          >
            Início
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.86}
          onPress={() => navigation.navigate("Schedule")}
          accessibilityRole="button"
          accessibilityLabel="Agendar orientação"
          accessibilityState={{ selected: activeRoute?.name === "Schedule" }}
          style={[
            styles.centerButton,
            activeRoute?.name === "Schedule" && styles.centerButtonActive,
          ]}
        >
          <Feather name="plus" size={18} color="#FFFFFF" />
          <Text
            style={[
              styles.centerLabel,
              { fontFamily: theme.fonts.Subtitulos },
            ]}
          >
            Agendar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Profile")}
          accessibilityRole="button"
          accessibilityLabel="Agenda"
          accessibilityState={{ selected: activeRoute?.name === "Profile" }}
          style={styles.sideTab}
        >
          <Feather
            name="calendar"
            size={20}
            color={activeRoute?.name === "Profile" ? "#005bb1" : "#414754"}
          />
          <Text
            style={[
              styles.sideLabel,
              {
                fontFamily:
                  activeRoute?.name === "Profile"
                    ? theme.fonts.Subtitulos
                    : theme.fonts.Subtituloslight,
                color:
                  activeRoute?.name === "Profile" ? "#005bb1" : "#414754",
              },
            ]}
          >
            Agenda
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MainTabs() {
  const route = useRoute();
  const userParams = route.params || {};

  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={userParams}
      />
      <Tab.Screen
        name="Schedule"
        component={Schedule}
        initialParams={userParams}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        initialParams={userParams}
      />
    </Tab.Navigator>
  );
}

export function AppRoutes() {
  const route = useRoute();
  const userParams = route.params || {};

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        initialParams={userParams}
      />
      <Stack.Screen name="MeetingDetails" component={MeetingDetails} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    alignItems: "center",
  },
  pillContainer: {
    width: "100%",
    maxWidth: 420,
    height: 64,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    shadowColor: "#172B4D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  sideTab: {
    minWidth: 64,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  sideLabel: {
    fontSize: 11,
    color: "#414754",
  },
  centerButton: {
    height: 46,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: "#005bb1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#005bb1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  centerButtonActive: {
    backgroundColor: "#00468a",
  },
  centerLabel: {
    fontSize: 14,
    color: "#FFFFFF",
  },
});
