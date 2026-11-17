import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultTheme } from "styled-components/native";
import theme from "src/global/styles/theme";

export const Container = styled.View`
  flex: 1;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
`;

export const Header = styled.View<{ topInset: number }>`
  padding-top: ${(props: { topInset: number }) => props.topInset + 14}px;
  padding-horizontal: 20px;
  padding-bottom: 16px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.border};
`;

export const HeaderTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const HeaderTag = styled.View`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  padding: 4px 10px;
  border-radius: 10px;
`;

export const HeaderTagText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(10.5)}px;
`;

export const RefreshIconButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  align-items: center;
  justify-content: center;
  opacity: ${(props: { disabled?: boolean }) => (props.disabled ? 0.5 : 1)};
`;

export const Title = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.Titulos};
  font-size: ${RFValue(21)}px;
  line-height: ${RFValue(27)}px;
  margin-bottom: 4px;
`;

export const Subtitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(13)}px;
  line-height: ${RFValue(18)}px;
`;

export const SectionHeaderText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(12)}px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 18px;
  margin-bottom: 10px;
`;

export const ScheduleCard = styled.View<{ isCanceled?: boolean }>`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 18px;
  padding: 16px;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme; isCanceled?: boolean }) =>
    props.isCanceled ? "#E2E8F0" : props.theme.colors.border};
  opacity: ${(props: { isCanceled?: boolean }) => (props.isCanceled ? 0.84 : 1)};
  elevation: 1;
  shadow-color: #172b4d;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 6px;
`;

export const CardTopRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;

export const DateHighlightBox = styled.View<{ isCanceled?: boolean }>`
  width: 52px;
  padding-vertical: 8px;
  border-radius: 14px;
  background-color: ${(props: { theme: DefaultTheme; isCanceled?: boolean }) =>
    props.isCanceled ? "#F1F5F9" : props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const DateHighlightDay = styled.Text<{ isCanceled?: boolean }>`
  color: ${(props: { theme: DefaultTheme; isCanceled?: boolean }) =>
    props.isCanceled
      ? props.theme.colors.text_secondary
      : props.theme.colors.primary_dark};
  font-family: ${theme.fonts.Titulos};
  font-size: ${RFValue(17)}px;
  line-height: ${RFValue(21)}px;
`;

export const DateHighlightMonth = styled.Text<{ isCanceled?: boolean }>`
  color: ${(props: { theme: DefaultTheme; isCanceled?: boolean }) =>
    props.isCanceled
      ? props.theme.colors.text_secondary
      : props.theme.colors.lavender};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(10.5)}px;
  text-transform: uppercase;
`;

export const CardDetailsCol = styled.View`
  flex: 1;
`;

export const StatusBadge = styled.View<{
  variant: "active" | "completed" | "canceled";
}>`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 10px;
  margin-bottom: 6px;
  background-color: ${(props: {
    theme: DefaultTheme;
    variant: "active" | "completed" | "canceled";
  }) => {
    if (props.variant === "completed") return "#E6F6EC";
    if (props.variant === "canceled") return "#FEF2F2";
    return props.theme.colors.boxprofile;
  }};
`;

export const StatusDot = styled.View<{
  variant: "active" | "completed" | "canceled";
}>`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${(props: {
    theme: DefaultTheme;
    variant: "active" | "completed" | "canceled";
  }) => {
    if (props.variant === "completed") return "#15803D";
    if (props.variant === "canceled") return "#DC2626";
    return props.theme.colors.primary;
  }};
`;

export const StatusBadgeText = styled.Text<{
  variant: "active" | "completed" | "canceled";
}>`
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(10)}px;
  color: ${(props: {
    theme: DefaultTheme;
    variant: "active" | "completed" | "canceled";
  }) => {
    if (props.variant === "completed") return "#15803D";
    if (props.variant === "canceled") return "#B91C1C";
    return props.theme.colors.primary_dark;
  }};
`;

export const EventTitle = styled.Text<{ isCanceled?: boolean }>`
  color: ${(props: { theme: DefaultTheme; isCanceled?: boolean }) =>
    props.isCanceled
      ? props.theme.colors.text_secondary
      : props.theme.colors.text_primary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(14.5)}px;
  margin-bottom: 6px;
`;

export const MetaList = styled.View`
  gap: 4px;
`;

export const MetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const MetaText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(12)}px;
  flex: 1;
`;

export const CancelReasonText = styled.Text`
  color: #b91c1c;
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(11.5)}px;
  margin-top: 4px;
`;

export const CancelActionRow = styled.View`
  margin-top: 12px;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.border};
  align-items: flex-end;
`;

export const CancelOutlineButton = styled.TouchableOpacity<{
  disabled?: boolean;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 12px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-width: 1px;
  border-color: #fca5a5;
  opacity: ${(props: { disabled?: boolean }) => (props.disabled ? 0.55 : 1)};
`;

export const CancelOutlineText = styled.Text`
  color: #dc2626;
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(12)}px;
`;

export const Divider = styled.View`
  height: 12px;
`;

export const WarningBanner = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  border-width: 1px;
  border-color: #dce8fd;
  border-radius: 14px;
  padding: 10px 12px;
  margin-top: 14px;
`;

export const WarningBannerText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(12)}px;
  flex: 1;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const StateCard = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 20px;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  padding: 24px 18px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
`;

export const StateTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(14.5)}px;
  margin-top: 10px;
  text-align: center;
`;

export const StateDescription = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(12.5)}px;
  line-height: ${RFValue(18)}px;
  text-align: center;
  margin-top: 4px;
`;

export const RetryButton = styled.TouchableOpacity`
  margin-top: 14px;
  padding: 9px 18px;
  border-radius: 12px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
`;

export const RetryButtonText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(12.5)}px;
`;
