import styled, { DefaultTheme } from "styled-components/native";

type ThemedProps = { theme: DefaultTheme };

export const Container = styled.View`
  flex: 1;
  background-color: #f9f9ff;
`;

export const ScrollBody = styled.ScrollView`
  flex: 1;
`;

export const Header = styled.View<{ topInset: number }>`
  width: 100%;
  background-color: #f9f9ff;
  padding-top: ${({ topInset }: { topInset: number }) => topInset + 12}px;
  padding-bottom: 12px;
  padding-horizontal: 20px;
`;

export const HeaderTag = styled.View`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background-color: #dce1ff;
  padding: 4px 11px;
  border-radius: 999px;
  margin-bottom: 10px;
`;

export const HeaderTagText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 10.5px;
  color: #005bb1;
  letter-spacing: 0.3px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 25px;
  line-height: 31px;
  color: #0f1b32;
  letter-spacing: -0.5px;
  margin-bottom: 4px;
`;

export const Subtitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 13.5px;
  line-height: 19px;
  color: #414754;
`;

export const ContentWrapper = styled.View`
  width: 100%;
  max-width: 480px;
  align-self: center;
  padding-horizontal: 20px;
  padding-top: 6px;
`;

export const EventTypeList = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
`;

export const EventTypeChip = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding: 7px 14px;
  border-radius: 999px;
  background-color: ${({ isSelected }: { isSelected: boolean }) =>
    isSelected ? "#005bb1" : "#e9edff"};
`;

export const EventTypeChipText = styled.Text<{ isSelected: boolean }>`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 12px;
  color: ${({ isSelected }: { isSelected: boolean }) =>
    isSelected ? "#FFFFFF" : "#005bb1"};
`;

export const CalendarWrapper = styled.View`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 20px;
  shadow-color: #258bff;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.07;
  shadow-radius: 18px;
  elevation: 3;
`;

export const HoursSection = styled.View`
  width: 100%;
`;

export const HoursHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
`;

export const HoursTitleGroup = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const HoursSectionDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #005bb1;
`;

export const HoursTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 16px;
  color: #0f1b32;
`;

export const SelectedDateBadge = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
  background-color: #dce1ff;
  padding: 4px 10px;
  border-radius: 999px;
`;

export const SelectedDateBadgeText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 11px;
  color: #005bb1;
`;

export const SessionInfoBanner = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: #f1f3ff;
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 14px;
`;

export const SessionInfoBannerText = styled.Text`
  flex: 1;
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 12.5px;
  color: #0f1b32;
`;

export const HoursGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
`;

export const ScheduleItem = styled.TouchableOpacity<{
  cardWidth: number;
  isSelected: boolean;
}>`
  width: ${({ cardWidth }: { cardWidth: number }) => cardWidth}px;
  height: 46px;
  border-radius: 14px;
  background-color: ${({ isSelected }: { isSelected: boolean }) =>
    isSelected ? "#005bb1" : "#FFFFFF"};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
  shadow-color: #258bff;
  shadow-offset: 0px 4px;
  shadow-opacity: ${({ isSelected }: { isSelected: boolean }) =>
    isSelected ? 0.22 : 0.05};
  shadow-radius: 10px;
  elevation: ${({ isSelected }: { isSelected: boolean }) =>
    isSelected ? 3 : 1};
`;

export const ScheduleText = styled.Text<{ isSelected: boolean }>`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 14px;
  color: ${({ isSelected }: { isSelected: boolean }) =>
    isSelected ? "#FFFFFF" : "#0f1b32"};
`;

export const SelectedSlotSummaryCard = styled.View`
  margin-top: 18px;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 16px;
  shadow-color: #258bff;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.09;
  shadow-radius: 20px;
  elevation: 4;
`;

export const SelectedSlotTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

export const SelectedSlotLeft = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const SelectedSlotIconBox = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: #e9edff;
  align-items: center;
  justify-content: center;
`;

export const SelectedSlotTextCol = styled.View`
  flex: 1;
`;

export const SelectedSlotTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 14.5px;
  color: #0f1b32;
  margin-bottom: 2px;
`;

export const SelectedSlotSubtitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 12px;
  color: #414754;
`;

export const SelectedSlotDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #005bb1;
`;

export const AdvanceButton = styled.TouchableOpacity`
  width: 100%;
  height: 48px;
  border-radius: 999px;
  background-color: #005bb1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  shadow-color: #005bb1;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.24;
  shadow-radius: 12px;
  elevation: 3;
`;

export const AdvanceButtonText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 14px;
  color: #ffffff;
`;

export const StateBox = styled.View`
  background-color: #ffffff;
  border-radius: 18px;
  padding: 22px 18px;
  align-items: center;
  justify-content: center;
  shadow-color: #258bff;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.05;
  shadow-radius: 14px;
  elevation: 2;
`;

export const StateIconBadge = styled.View`
  position: relative;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background-color: #f1f3ff;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

export const StateCompassDot = styled.View`
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: #005bb1;
  border-width: 2px;
  border-color: #ffffff;
`;

export const StateTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 15px;
  color: #0f1b32;
  margin-bottom: 4px;
  text-align: center;
`;

export const StateText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 13px;
  line-height: 19px;
  color: #414754;
  text-align: center;
`;

export const RetryButton = styled.TouchableOpacity`
  margin-top: 12px;
  padding: 8px 16px;
  border-radius: 999px;
  background-color: #e9edff;
`;

export const RetryButtonText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 12.5px;
  color: #005bb1;
`;

export const ModalOverlay = styled.View<{
  topInset: number;
  bottomInset: number;
}>`
  flex: 1;
  background-color: rgba(15, 27, 50, 0.45);
  justify-content: center;
  align-items: center;
  padding-top: ${({ topInset }: { topInset: number }) => topInset + 16}px;
  padding-bottom: ${({ bottomInset }: { bottomInset: number }) =>
    bottomInset + 16}px;
  padding-horizontal: 22px;
`;

export const ModalContent = styled.View`
  width: 100%;
  max-width: 380px;
  background-color: #ffffff;
  border-radius: 24px;
  padding: 22px 20px;
  shadow-color: #001b3d;
  shadow-offset: 0px 18px;
  shadow-opacity: 0.16;
  shadow-radius: 32px;
  elevation: 8;
`;

export const ModalScroll = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    alignItems: "center",
  },
})``;

export const ConfirmIconBadge = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background-color: #e9edff;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

export const ModalTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 19px;
  color: #0f1b32;
  text-align: center;
  margin-bottom: 4px;
`;

export const ModalText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 13px;
  color: #414754;
  text-align: center;
  margin-bottom: 16px;
`;

export const ModalDetailsCard = styled.View`
  width: 100%;
  background-color: #f1f3ff;
  border-radius: 16px;
  padding: 14px;
  gap: 8px;
  margin-bottom: 18px;
`;

export const ModalDetailTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 14px;
  color: #0f1b32;
  margin-bottom: 2px;
`;

export const ModalDetailRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const ModalDetailText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 13px;
  color: #0f1b32;
`;

export const ModalButtonContainer = styled.View`
  width: 100%;
  flex-direction: row;
  gap: 10px;
`;

export const ModalButton = styled.TouchableOpacity<{ isConfirm?: boolean }>`
  flex: 1;
  height: 46px;
  border-radius: 999px;
  background-color: ${({ isConfirm }: { isConfirm?: boolean }) =>
    isConfirm ? "#005bb1" : "#f1f3ff"};
  align-items: center;
  justify-content: center;
`;

export const ModalButtonText = styled.Text<{ isConfirm?: boolean }>`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 13.5px;
  color: ${({ isConfirm }: { isConfirm?: boolean }) =>
    isConfirm ? "#FFFFFF" : "#414754"};
`;

export const SuccessIconBadge = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 20px;
  background-color: #dcfce7;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

export const SuccessStatusPill = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background-color: #dcfce7;
  padding: 4px 10px;
  border-radius: 999px;
  margin-bottom: 10px;
`;

export const SuccessStatusDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #15803d;
`;

export const SuccessStatusText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 11px;
  color: #15803d;
`;

export const SuccessDetailsCard = styled.View`
  width: 100%;
  background-color: #f1f3ff;
  border-radius: 16px;
  padding: 14px;
  gap: 8px;
  margin-bottom: 18px;
`;

export const SuccessEventTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 14.5px;
  color: #0f1b32;
  margin-bottom: 2px;
`;

export const SuccessDetailRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const SuccessDetailText = styled.Text`
  flex: 1;
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 13px;
  color: #0f1b32;
`;

export const SuccessButtonsStack = styled.View`
  width: 100%;
  gap: 10px;
`;

export const SuccessPrimaryButton = styled.TouchableOpacity`
  width: 100%;
  height: 46px;
  border-radius: 999px;
  background-color: #005bb1;
  align-items: center;
  justify-content: center;
`;

export const SuccessPrimaryButtonText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 14px;
  color: #ffffff;
`;

export const SuccessSecondaryButton = styled.TouchableOpacity`
  width: 100%;
  height: 44px;
  border-radius: 999px;
  background-color: #f1f3ff;
  align-items: center;
  justify-content: center;
`;

export const SuccessSecondaryButtonText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 13.5px;
  color: #005bb1;
`;
