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
  padding-top: ${(props: { topInset: number }) => props.topInset + 12}px;
  padding-horizontal: 20px;
  padding-bottom: 14px;
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
  padding: 3px 9px;
  border-radius: 10px;
  margin-bottom: 6px;
`;

export const HeaderTagText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(10)}px;
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

export const ContentWrapper = styled.View`
  padding: 16px 20px 0px 20px;
`;

export const EventTypeList = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  margin-bottom: 14px;
`;

export const EventTypeChip = styled.TouchableOpacity<{ isSelected?: boolean }>`
  background-color: ${(props: { theme: DefaultTheme; isSelected?: boolean }) =>
    props.isSelected
      ? props.theme.colors.primary
      : props.theme.colors.background};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme; isSelected?: boolean }) =>
    props.isSelected ? props.theme.colors.primary : props.theme.colors.border};
  padding: 7px 13px;
  border-radius: 14px;
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
  font-size: ${RFValue(11.5)}px;
`;

export const CalendarWrapper = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 18px;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  padding: 6px 8px;
  overflow: hidden;
  elevation: 1;
  shadow-color: #172b4d;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.04;
  shadow-radius: 6px;
`;

export const HoursSection = styled.View`
  margin-top: 20px;
`;

export const HoursHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 8px;
`;

export const HoursTitleGroup = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 7px;
`;

export const HoursSectionDot = styled.View`
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
`;

export const HoursTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(14)}px;
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
  font-size: ${RFValue(11)}px;
`;

export const HoursGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

export const ScheduleItem = styled.TouchableOpacity<{
  isSelected?: boolean;
  cardWidth: number;
  disabled?: boolean;
}>`
  width: ${(props: { cardWidth: number }) => props.cardWidth}px;
  background-color: ${(props: { theme: DefaultTheme; isSelected?: boolean }) =>
    props.isSelected
      ? props.theme.colors.primary
      : props.theme.colors.background};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme; isSelected?: boolean }) =>
    props.isSelected ? props.theme.colors.primary : props.theme.colors.border};
  padding-vertical: 11px;
  padding-horizontal: 8px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  opacity: ${(props: { disabled?: boolean }) => (props.disabled ? 0.55 : 1)};
`;

export const ScheduleText = styled.Text<{ isSelected?: boolean }>`
  color: ${(props: { theme: DefaultTheme; isSelected?: boolean }) =>
    props.isSelected
      ? props.theme.colors.background
      : props.theme.colors.text_primary};
  font-size: ${RFValue(13)}px;
  font-family: ${theme.fonts.Subtitulos};
`;

export const StateBox = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 18px;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  padding: 18px 16px;
  align-items: center;
  justify-content: center;
`;

export const StateIconBadge = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 10px;
`;

export const StateCompassDot = styled.View`
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.lavender};
  border-width: 2px;
  border-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
`;

export const StateTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(13.5)}px;
  text-align: center;
  margin-bottom: 3px;
`;

export const StateText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(12)}px;
  text-align: center;
  line-height: ${RFValue(17)}px;
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
export const ModalOverlay = styled.View<{
  topInset?: number;
  bottomInset?: number;
}>`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(23, 43, 77, 0.45);
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

export const ConfirmIconBadge = styled.View`
  width: 46px;
  height: 46px;
  border-radius: 15px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  border-width: 1px;
  border-color: #dce8fd;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

export const ModalTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-size: ${RFValue(17)}px;
  font-family: ${theme.fonts.Titulos};
  margin-bottom: 4px;
  text-align: center;
`;

export const ModalText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-size: ${RFValue(12.5)}px;
  font-family: ${theme.fonts.Subtituloslight};
  margin-bottom: 14px;
  text-align: center;
  line-height: ${RFValue(18)}px;
`;

export const ModalDetailsCard = styled.View`
  width: 100%;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  border-radius: 16px;
  padding: 13px 14px;
  gap: 8px;
  margin-bottom: 16px;
`;

export const ModalDetailTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(13.5)}px;
  margin-bottom: 2px;
`;

export const ModalDetailRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const ModalDetailText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(12.5)}px;
  flex: 1;
`;

export const ModalButtonContainer = styled.View`
  flex-direction: row;
  gap: 10px;
  width: 100%;
`;

export const ModalButton = styled.TouchableOpacity<{ isConfirm?: boolean }>`
  flex: ${(props: { isConfirm?: boolean }) => (props.isConfirm ? 1.35 : 1)};
  min-height: 44px;
  padding-vertical: 11px;
  padding-horizontal: 12px;
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
  font-size: ${RFValue(13)}px;
  text-align: center;
`;

/* ── Success Modal ── */
export const SuccessIconBadge = styled.View`
  width: 54px;
  height: 54px;
  border-radius: 27px;
  background-color: #e6f6ec;
  border-width: 1.5px;
  border-color: #bbf7d0;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

export const SuccessStatusPill = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  padding: 3px 10px;
  border-radius: 10px;
  margin-bottom: 8px;
`;

export const SuccessStatusDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #15803d;
`;

export const SuccessStatusText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(10)}px;
`;

export const SuccessDetailsCard = styled.View`
  width: 100%;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  border-radius: 16px;
  padding: 14px;
  gap: 8px;
  margin-bottom: 18px;
`;

export const SuccessEventTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(14.5)}px;
  margin-bottom: 2px;
`;

export const SuccessDetailRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const SuccessDetailText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(12.5)}px;
  flex: 1;
`;

export const SuccessButtonsStack = styled.View`
  width: 100%;
  gap: 10px;
`;

export const SuccessPrimaryButton = styled.TouchableOpacity`
  width: 100%;
  padding-vertical: 12px;
  border-radius: 14px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

export const SuccessPrimaryButtonText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(13.5)}px;
`;

export const SuccessSecondaryButton = styled.TouchableOpacity`
  width: 100%;
  padding-vertical: 11px;
  border-radius: 14px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  align-items: center;
  justify-content: center;
`;

export const SuccessSecondaryButtonText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(13)}px;
`;
