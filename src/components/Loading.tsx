import { ActivityIndicator, View } from "react-native";
import theme from "../global/styles/theme";

export function Loading() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <ActivityIndicator color={theme.colors.primary} size={"large"} />
    </View>
  );
}
