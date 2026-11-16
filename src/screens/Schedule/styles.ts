import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultTheme } from "styled-components/native";
import theme from "src/global/styles/theme";

export const Container = styled.View`
  flex: 1;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
`;

export const ScrollBody = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
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

export const HeaderTag = styled.View`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  padding: 4px 10px;
  border-radius: 10px;
  margin-bottom: 8px;
`;

export const HeaderTagText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(10.5)}px;
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

export const ContentWrapper = styled.View`
  padding: 18px 20px 0px 20px;
`;

export const EventTypeList = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  margin-bottom: 16px;
`;

export const EventTypeChip = styled.TouchableOpacity<{ isSelected?: boolean }>`
  background-color: ${(props: { theme: DefaultTheme; isSelected?: boolean }) =>
    props.isSelected
      ? props.theme.colors.primary
      : props.theme.colors.background};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme; isSelected?: boolean }) =>
    props.isSelected ? props.theme.colors.primary : props.theme.colors.border};
  padding: 8px 14px;
  border-radius: 16px;
  margin-right: 8px;
  justify-content: center;
  align-items: center;
`;

export const EventTypeChipText = styled.Text<{ isSelected?: boolean }>`
  color: ${(props: { theme: DefaultTheme; isSelected?: boolean }) =>
    props.isSelected
      ? props.theme.colors.background
      : props.theme.colors.text_primary};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(12)}px;
`;

export const CalendarWrapper = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 20px;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  padding: 8px;
  overflow: hidden;
  elevation: 2;
  shadow-color: #172b4d;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
`;

export const HoursSection = styled.View`
  margin-top: 22px;
`;

export const HoursHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 8px;
`;

export const HoursTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(15)}px;
`;

export const SelectedDateBadge = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  padding: 4px 10px;
  border-radius: 10px;
`;

export const SelectedDateBadgeText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(11.5)}px;
`;

export const HoursGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

export const ScheduleItem = styled.TouchableOpacity<{
  isSelected?: boolean;
  cardWidth: number;
}>`
  width: ${(props: { cardWidth: number }) => props.cardWidth}px;
  background-color: ${(props: { theme: DefaultTheme; isSelected?: boolean }) =>
    props.isSelected
      ? props.theme.colors.boxprofile
      : props.theme.colors.background};
  border-width: ${(props: { isSelected?: boolean }) =>
    props.isSelected ? "1.5px" : "1px"};
  border-color: ${(props: { theme: DefaultTheme; isSelected?: boolean }) =>
    props.isSelected ? props.theme.colors.primary : props.theme.colors.border};
  padding-vertical: 12px;
  padding-horizontal: 8px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  elevation: 1;
  shadow-color: #172b4d;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.04;
  shadow-radius: 4px;
`;

export const ScheduleText = styled.Text<{ isSelected?: boolean }>`
  color: ${(props: { theme: DefaultTheme; isSelected?: boolean }) =>
    props.isSelected
      ? props.theme.colors.primary_dark
      : props.theme.colors.text_primary};
  font-size: ${RFValue(13.5)}px;
  font-family: ${theme.fonts.Subtitulos};
`;

export const StateBox = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 18px;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  padding: 20px 16px;
  align-items: center;
  justify-content: center;
`;

export const StateText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(13)}px;
  text-align: center;
  margin-top: 8px;
  line-height: ${RFValue(18)}px;
`;

export const RetryButton = styled.TouchableOpacity`
  margin-top: 12px;
  padding: 8px 16px;
  border-radius: 12px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
`;

export const RetryButtonText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(12.5)}px;
`;

/* ── Confirmation Modal ── */
export const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(23, 43, 77, 0.45);
  padding: 20px;
`;

export const ModalContent = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  padding: 22px 20px;
  border-radius: 22px;
  align-items: center;
  width: 100%;
  max-width: 340px;
  elevation: 6;
`;

export const ModalTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-size: ${RFValue(17)}px;
  font-family: ${theme.fonts.Titulos};
  margin-bottom: 6px;
  text-align: center;
`;

export const ModalText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-size: ${RFValue(13)}px;
  font-family: ${theme.fonts.Subtituloslight};
  margin-bottom: 14px;
  text-align: center;
  line-height: ${RFValue(19)}px;
`;

export const ModalSummaryPill = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  border-radius: 14px;
  padding: 10px 16px;
  margin-bottom: 18px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const ModalSummaryText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(14)}px;
`;

export const ModalButtonContainer = styled.View`
  flex-direction: row;
  gap: 10px;
  width: 100%;
`;

export const ModalButton = styled.TouchableOpacity<{ isConfirm?: boolean }>`
  flex: 1;
  padding-vertical: 12px;
  background-color: ${(props: { theme: DefaultTheme; isConfirm?: boolean }) =>
    props.isConfirm ? props.theme.colors.primary : props.theme.colors.surface};
  border-width: ${(props: { isConfirm?: boolean }) =>
    props.isConfirm ? "0px" : "1px"};
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  border-radius: 14px;
  align-items: center;
  justify-content: center;
`;

export const ModalButtonText = styled.Text<{ isConfirm?: boolean }>`
  color: ${(props: { theme: DefaultTheme; isConfirm?: boolean }) =>
    props.isConfirm
      ? props.theme.colors.background
      : props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(13.5)}px;
`;

/* ── WebView Modal ── */
export const WebViewContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
`;

export const WebViewHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.border};
`;

export const WebViewTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(15)}px;
`;

export const WebViewCloseButton = styled.TouchableOpacity`
  padding: 7px 14px;
  border-radius: 10px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
`;

export const WebViewCloseText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(12.5)}px;
`;
