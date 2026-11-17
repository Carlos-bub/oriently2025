import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function Loading() {
  return (
    <View style={styles.container}>
      <View style={styles.glowTopRight} />
      <View style={styles.glowBottomLeft} />

      <View style={styles.badgeBox}>
        <View style={styles.needleGroup}>
          <View style={styles.needleNorth} />
          <View style={styles.needleSouth} />
          <View style={styles.needlePivot} />
        </View>
      </View>

      <Text style={styles.brandTitle}>Oriently</Text>
      <Text style={styles.brandEyebrow}>EM DIREÇÃO AO TCC</Text>

      <ActivityIndicator
        color="#005bb1"
        size="small"
        style={styles.spinner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9ff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  glowTopRight: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(37, 139, 255, 0.08)",
  },
  glowBottomLeft: {
    position: "absolute",
    bottom: -60,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(124, 114, 232, 0.08)",
  },
  badgeBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4ebff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: "#258bff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 4,
  },
  needleGroup: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "42deg" }],
  },
  needleNorth: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 15,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#005bb1",
  },
  needleSouth: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 15,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#7c72e8",
  },
  needlePivot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#0f1b32",
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f1b32",
    letterSpacing: -0.5,
  },
  brandEyebrow: {
    marginTop: 4,
    fontSize: 10.5,
    fontWeight: "700",
    color: "#005bb1",
    letterSpacing: 2,
  },
  spinner: {
    marginTop: 22,
  },
});
