import "styled-components/native";
import theme from "./theme";

declare module "styled-components/native" {
  export interface DefaultTheme {
    colors: typeof theme.colors;
    fonts: typeof theme.fonts;
  }
}
