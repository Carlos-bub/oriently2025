import styled, { DefaultTheme } from "styled-components/native";

type ThemedProps = { theme: DefaultTheme };
type StatusVariant = "active" | "completed" | "canceled";

export const Container = styled.View`
  flex: 1;
  background-color: #f9f9ff;
`;

export const TopBar = styled.View<{ topInset: number }>`
  width: 100%;
  background-color: #f9f9ff;
  padding-top: ${({ topInset }: { topInset: number }) => topInset + 8}px;
  padding-bottom: 10px;
  padding-horizontal: 14px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #e9edff;
`;

export const TopBarLeft = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const IconButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`;

export const TopBarTextCol = styled.View`
  flex: 1;
`;

export const TopBarTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 16px;
  color: #0f1b32;
`;

export const TopBarSubtitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 11px;
  color: #414754;
`;

export const ScrollBody = styled.ScrollView`
  flex: 1;
`;

export const Content = styled.View`
  width: 100%;
  max-width: 480px;
  align-self: center;
  padding-horizontal: 20px;
  padding-top: 16px;
  gap: 18px;
`;

export const JourneyHeader = styled.View`
  gap: 8px;
`;

export const JourneyPill = styled.View`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background-color: #e0e8ff;
  padding: 5px 12px;
  border-radius: 999px;
`;

export const JourneyPillText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 10.5px;
  color: #005bb1;
  letter-spacing: 0.6px;
  text-transform: uppercase;
`;

export const EventHeadline = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 23px;
  line-height: 29px;
  color: #0f1b32;
  letter-spacing: -0.4px;
`;

export const StatusRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const StatusPill = styled.View<{ variant: StatusVariant }>`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background-color: ${({ variant }: { variant: StatusVariant }) =>
    variant === "canceled"
      ? "#fee2e2"
      : variant === "completed"
        ? "#e2e8f0"
        : "#d8e2ff"};
`;

export const StatusDot = styled.View<{ variant: StatusVariant }>`
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: ${({ variant }: { variant: StatusVariant }) =>
    variant === "canceled"
      ? "#dc2626"
      : variant === "completed"
        ? "#64748b"
        : "#005bb1"};
`;

export const StatusPillText = styled.Text<{ variant: StatusVariant }>`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 11.5px;
  color: ${({ variant }: { variant: StatusVariant }) =>
    variant === "canceled"
      ? "#b91c1c"
      : variant === "completed"
        ? "#475569"
        : "#005bb1"};
`;

export const CountdownText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 12.5px;
  color: #414754;
`;

export const SessionCard = styled.View`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 16px;
  gap: 14px;
  shadow-color: #005bb1;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.08;
  shadow-radius: 20px;
  elevation: 3;
`;

export const SessionTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 14px;
`;

export const CalendarBlock = styled.View`
  width: 62px;
  height: 72px;
  border-radius: 14px;
  background-color: #f1f3ff;
  align-items: center;
  justify-content: center;
`;

export const CalendarMonth = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 10px;
  color: #2e56c6;
  letter-spacing: 0.6px;
  text-transform: uppercase;
`;

export const CalendarDay = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 22px;
  line-height: 26px;
  color: #005bb1;
`;

export const CalendarYear = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 10px;
  color: #414754;
`;

export const SessionMetaCol = styled.View`
  flex: 1;
  gap: 3px;
`;

export const TimeRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const TimeText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 16px;
  color: #0f1b32;
`;

export const DurationText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 13px;
  color: #414754;
`;

export const ModalityRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
`;

export const ModalityText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 13px;
  color: #005bb1;
`;

export const LinkChip = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background-color: #f1f3ff;
  border-radius: 14px;
  padding: 11px 12px;
`;

export const LinkChipLeft = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const LinkChipText = styled.Text`
  flex: 1;
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 12.5px;
  color: #0f1b32;
`;

export const PrimaryCallButton = styled.TouchableOpacity`
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
  shadow-opacity: 0.25;
  shadow-radius: 14px;
  elevation: 3;
`;

export const PrimaryCallButtonText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 14px;
  color: #ffffff;
`;

export const SecondaryActionPill = styled.TouchableOpacity`
  width: 100%;
  height: 44px;
  border-radius: 999px;
  background-color: #e0e8ff;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const SecondaryActionPillText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 13.5px;
  color: #005bb1;
`;

export const SectionHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const SectionDot = styled.View<{ color?: string }>`
  width: 9px;
  height: 9px;
  border-radius: 4.5px;
  background-color: ${({ color }: { color?: string }) => color ?? "#6a8dff"};
`;

export const SectionTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 16.5px;
  color: #0f1b32;
`;

export const SectionDisclaimer = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 12px;
  color: #64748b;
  margin-top: -10px;
`;

export const ChecklistCard = styled.View`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 12px;
  gap: 6px;
  shadow-color: #005bb1;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.05;
  shadow-radius: 14px;
  elevation: 2;
`;

export const ChecklistItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  padding: 10px;
  border-radius: 12px;
`;

export const CheckboxBox = styled.View<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  margin-top: 2px;
  background-color: ${({ checked }: { checked: boolean }) =>
    checked ? "#005bb1" : "#FFFFFF"};
  border-width: 1.5px;
  border-color: ${({ checked }: { checked: boolean }) =>
    checked ? "#005bb1" : "#94a3b8"};
  align-items: center;
  justify-content: center;
`;

export const ChecklistTextCol = styled.View`
  flex: 1;
  gap: 2px;
`;

export const ChecklistTitle = styled.Text<{ checked: boolean }>`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 13.5px;
  line-height: 19px;
  color: ${({ checked }: { checked: boolean }) =>
    checked ? "#64748b" : "#0f1b32"};
  text-decoration-line: ${({ checked }: { checked: boolean }) =>
    checked ? "line-through" : "none"};
`;

export const ChecklistMeta = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 11px;
  color: #64748b;
`;

export const CoachTipCard = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  background-color: #e2dfff;
  border-radius: 20px;
  padding: 16px;
`;

export const CoachTipIconBox = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #514fb5;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
`;

export const CoachTipTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 13.5px;
  color: #0e006a;
  margin-bottom: 3px;
`;

export const CoachTipBody = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 12.5px;
  line-height: 18px;
  color: #3c389e;
`;

export const BottomActions = styled.View`
  gap: 8px;
  padding-top: 4px;
`;

export const RescheduleButton = styled.TouchableOpacity`
  width: 100%;
  height: 44px;
  border-radius: 14px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const RescheduleButtonText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 13.5px;
  color: #005bb1;
`;

export const CancelButton = styled.TouchableOpacity`
  width: 100%;
  height: 44px;
  border-radius: 14px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const CancelButtonText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 13.5px;
  color: #ba1a1a;
`;

export const CancelReasonBox = styled.View`
  background-color: #fee2e2;
  border-radius: 14px;
  padding: 12px 14px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const CancelReasonBoxText = styled.Text`
  flex: 1;
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 12.5px;
  color: #93000a;
`;
