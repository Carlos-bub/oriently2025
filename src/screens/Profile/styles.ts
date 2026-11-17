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
  padding-top: ${(props: { topInset: number }) => props.topInset + 12}px;
  padding-horizontal: 20px;
  padding-bottom: 14px;
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
  margin-bottom: 6px;
`;

export const HeaderTag = styled.View`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  padding: 3px 9px;
  border-radius: 10px;
`;

export const HeaderTagText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(10)}px;
`;

export const RefreshIconButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 11px;
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
  font-size: ${RFValue(20)}px;
  line-height: ${RFValue(26)}px;
  margin-bottom: 3px;
`;

export const Subtitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(12.5)}px;
  line-height: ${RFValue(17)}px;
`;

export const SectionHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 7px;
  margin-top: 18px;
  margin-bottom: 8px;
`;

export const SectionDot = styled.View<{ isUpcoming?: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: ${(props: {
    theme: DefaultTheme;
    isUpcoming?: boolean;
  }) =>
    props.isUpcoming
      ? props.theme.colors.primary
      : props.theme.colors.text_light};
`;

export const SectionHeaderText = styled.Text<{ isUpcoming?: boolean }>`
  color: ${(props: { theme: DefaultTheme; isUpcoming?: boolean }) =>
    props.isUpcoming
      ? props.theme.colors.text_primary
      : props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(13.5)}px;
`;

export const ScheduleCard = styled.View<{
  isCanceled?: boolean;
  isUpcoming?: boolean;
}>`
  background-color: ${(props: {
    theme: DefaultTheme;
    isCanceled?: boolean;
  }) =>
    props.isCanceled ? "#F8FAFC" : props.theme.colors.background};
  border-radius: 16px;
  padding: 12px 14px;
  border-width: 1px;
  border-color: ${(props: {
    theme: DefaultTheme;
    isUpcoming?: boolean;
    isCanceled?: boolean;
  }) => {
    if (props.isCanceled) return props.theme.colors.border;
    if (props.isUpcoming) return "#DCE8FD";
    return props.theme.colors.border;
  }};
  elevation: ${(props: { isCanceled?: boolean }) => (props.isCanceled ? 0 : 1)};
  shadow-color: #172b4d;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.04;
  shadow-radius: 5px;
`;

export const CardRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;

export const DateHighlightBox = styled.View<{ isCanceled?: boolean }>`
  width: 46px;
  padding-vertical: 6px;
  border-radius: 12px;
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
  font-size: ${RFValue(15)}px;
  line-height: ${RFValue(19)}px;
`;

export const DateHighlightMonth = styled.Text<{ isCanceled?: boolean }>`
  color: ${(props: { theme: DefaultTheme; isCanceled?: boolean }) =>
    props.isCanceled
      ? props.theme.colors.text_secondary
      : props.theme.colors.lavender};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(9.5)}px;
  text-transform: uppercase;
`;

export const CardDetailsCol = styled.View`
  flex: 1;
`;

export const CardHeaderInline = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
`;

export const StatusBadge = styled.View<{
  variant: "active" | "completed" | "canceled";
}>`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9px;
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
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
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
  font-size: ${RFValue(9.5)}px;
  color: ${(props: {
    theme: DefaultTheme;
    variant: "active" | "completed" | "canceled";
  }) => {
    if (props.variant === "completed") return "#15803D";
    if (props.variant === "canceled") return "#B91C1C";
    return props.theme.colors.primary_dark;
  }};
`;

export const CompactCancelButton = styled.TouchableOpacity<{
  disabled?: boolean;
}>`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 9px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  opacity: ${(props: { disabled?: boolean }) => (props.disabled ? 0.5 : 1)};
`;

export const CompactCancelText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(10)}px;
`;

export const EventTitle = styled.Text<{ isCanceled?: boolean }>`
  color: ${(props: { theme: DefaultTheme; isCanceled?: boolean }) =>
    props.isCanceled
      ? props.theme.colors.text_secondary
      : props.theme.colors.text_primary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(14)}px;
  line-height: ${RFValue(19)}px;
  margin-bottom: 4px;
`;

export const MetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

export const MetaItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

export const MetaText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(11.5)}px;
`;

export const CancelReasonText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(11)}px;
  margin-top: 4px;
`;

export const Divider = styled.View`
  height: 10px;
`;

export const WarningBanner = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  border-width: 1px;
  border-color: #dce8fd;
  border-radius: 12px;
  padding: 9px 12px;
  margin-top: 12px;
`;

export const WarningBannerText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(11.5)}px;
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
  border-radius: 18px;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  padding: 22px 18px;
  margin-top: 18px;
  align-items: center;
  justify-content: center;
`;

export const StateTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(14)}px;
  margin-top: 10px;
  text-align: center;
`;

export const StateDescription = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(12)}px;
  line-height: ${RFValue(17)}px;
  text-align: center;
  margin-top: 4px;
`;

export const RetryButton = styled.TouchableOpacity`
  margin-top: 14px;
  padding: 8px 16px;
  border-radius: 12px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
`;

export const RetryButtonText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(12)}px;
`;
