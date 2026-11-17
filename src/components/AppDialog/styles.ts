import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultTheme } from "styled-components/native";
import theme from "src/global/styles/theme";

export type DialogVariant = "info" | "success" | "warning" | "danger";

export const ModalOverlay = styled.View<{
  topInset?: number;
  bottomInset?: number;
}>`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(23, 43, 77, 0.48);
  padding-top: ${(props: { topInset?: number }) =>
    Math.max(props.topInset || 0, 20)}px;
  padding-bottom: ${(props: { bottomInset?: number }) =>
    Math.max(props.bottomInset || 0, 20)}px;
  padding-horizontal: 20px;
`;

export const ModalContent = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  padding: 20px;
  border-radius: 22px;
  align-items: center;
  width: 100%;
  max-width: 348px;
  max-height: 90%;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  elevation: 8;
  shadow-color: #172b4d;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.16;
  shadow-radius: 16px;
`;

export const ModalScroll = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  bounces: false,
  contentContainerStyle: {
    alignItems: "center",
  },
})`
  width: 100%;
`;

export const IconBadge = styled.View<{ variant: DialogVariant }>`
  width: 50px;
  height: 50px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  border-width: 1px;
  background-color: ${(props: {
    theme: DefaultTheme;
    variant: DialogVariant;
  }) => {
    switch (props.variant) {
      case "success":
        return "#E6F6EC";
      case "warning":
        return "#FEF3C7";
      case "danger":
        return "#FEF2F2";
      default:
        return props.theme.colors.boxprofile;
    }
  }};
  border-color: ${(props: { variant: DialogVariant }) => {
    switch (props.variant) {
      case "success":
        return "#BBF7D0";
      case "warning":
        return "#FDE68A";
      case "danger":
        return "#FECACA";
      default:
        return "#DCE8FD";
    }
  }};
`;

export const DialogTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-size: ${RFValue(16.5)}px;
  font-family: ${theme.fonts.Titulos};
  margin-bottom: 5px;
  text-align: center;
`;

export const DialogMessage = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-size: ${RFValue(12.5)}px;
  font-family: ${theme.fonts.Subtituloslight};
  margin-bottom: 16px;
  text-align: center;
  line-height: ${RFValue(18)}px;
`;

export const DetailsCard = styled.View`
  width: 100%;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  border-radius: 16px;
  padding: 12px 14px;
  gap: 6px;
  margin-bottom: 16px;
`;

export const DetailsTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(13.5)}px;
  margin-bottom: 2px;
`;

export const DetailsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 7px;
`;

export const DetailsText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(12)}px;
  flex: 1;
`;

export const ButtonsRow = styled.View<{ single?: boolean }>`
  flex-direction: row;
  gap: 10px;
  width: 100%;
`;

export const DialogButton = styled.TouchableOpacity<{
  tone: "primary" | "danger" | "secondary";
}>`
  flex: 1;
  min-height: 44px;
  padding-vertical: 11px;
  padding-horizontal: 12px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${(props: {
    theme: DefaultTheme;
    tone: "primary" | "danger" | "secondary";
  }) => {
    if (props.tone === "primary") return props.theme.colors.primary;
    if (props.tone === "danger") return "#DC2626";
    return props.theme.colors.surface;
  }};
  border-width: ${(props: { tone: "primary" | "danger" | "secondary" }) =>
    props.tone === "secondary" ? "1px" : "0px"};
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
`;

export const DialogButtonText = styled.Text<{
  tone: "primary" | "danger" | "secondary";
}>`
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(13)}px;
  text-align: center;
  color: ${(props: {
    theme: DefaultTheme;
    tone: "primary" | "danger" | "secondary";
  }) =>
    props.tone === "secondary"
      ? props.theme.colors.text_secondary
      : props.theme.colors.background};
`;
