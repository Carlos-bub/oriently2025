import styled, { DefaultTheme } from "styled-components/native";

type ThemedProps = { theme: DefaultTheme };
type EventVariant = "active" | "completed" | "canceled";

export const Container = styled.View`
  flex: 1;
  background-color: #f9f9ff;
`;

export const Header = styled.View<{ topInset: number }>`
  width: 100%;
  background-color: #f9f9ff;
  padding-top: ${({ topInset }: { topInset: number }) => topInset + 12}px;
  padding-bottom: 12px;
  padding-horizontal: 20px;
`;

export const HeaderTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const HeaderTag = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background-color: #e0e8ff;
  padding: 4px 11px;
  border-radius: 999px;
`;

export const HeaderTagText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 10.5px;
  color: #005bb1;
  letter-spacing: 0.4px;
  text-transform: uppercase;
`;

export const RefreshIconButton = styled.TouchableOpacity`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  background-color: #f1f3ff;
  border-width: 1px;
  border-color: #e2e8f0;
  align-items: center;
  justify-content: center;
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

export const FilterBarWrapper = styled.View`
  padding-horizontal: 20px;
  margin-bottom: 14px;
`;

export const FilterSegmentedBar = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #e9edff;
  border-radius: 16px;
  padding: 4px;
  gap: 4px;
`;

export const FilterTabButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding-vertical: 9px;
  padding-horizontal: 10px;
  border-radius: 12px;
  background-color: ${({ active }: { active: boolean }) =>
    active ? "#FFFFFF" : "transparent"};
  ${({ active }: { active: boolean }) =>
    active
      ? `
    shadow-color: #0f1b32;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.06;
    shadow-radius: 6px;
    elevation: 2;
  `
      : ""}
`;

export const FilterTabLabel = styled.Text<{ active: boolean }>`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 13px;
  color: ${({ active }: { active: boolean }) =>
    active ? "#005bb1" : "#414754"};
`;

export const FilterCountPill = styled.View<{ active: boolean }>`
  padding: 2px 7px;
  border-radius: 999px;
  background-color: ${({ active }: { active: boolean }) =>
    active ? "#d6e3ff" : "#d8e2ff"};
`;

export const FilterCountText = styled.Text<{ active: boolean }>`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 11px;
  color: ${({ active }: { active: boolean }) =>
    active ? "#005bb1" : "#414754"};
`;

export const SectionHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  margin-bottom: 10px;
`;

export const SectionTitleGroup = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const SectionDot = styled.View<{ isUpcoming?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ isUpcoming }: { isUpcoming?: boolean }) =>
    isUpcoming ? "#005bb1" : "#94a3b8"};
`;

export const SectionHeaderText = styled.Text<{ isUpcoming?: boolean }>`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 16px;
  color: ${({ isUpcoming }: { isUpcoming?: boolean }) =>
    isUpcoming ? "#0f1b32" : "#414754"};
`;

export const SectionCountLabel = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 11px;
  color: #005bb1;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

export const ScheduleCard = styled.TouchableOpacity<{
  isCanceled: boolean;
  isUpcoming: boolean;
  isSpotlight?: boolean;
}>`
  background-color: #ffffff;
  border-radius: 18px;
  padding: 15px;
  border-width: 1px;
  border-color: ${({
    isSpotlight,
    isCanceled,
  }: {
    isSpotlight?: boolean;
    isCanceled: boolean;
  }) =>
    isSpotlight
      ? "rgba(0, 91, 177, 0.22)"
      : isCanceled
        ? "#e2e8f0"
        : "#eef2ff"};
  opacity: ${({ isCanceled }: { isCanceled: boolean }) =>
    isCanceled ? 0.78 : 1};
  shadow-color: #258bff;
  shadow-offset: 0px 8px;
  shadow-opacity: ${({ isSpotlight }: { isSpotlight?: boolean }) =>
    isSpotlight ? 0.11 : 0.05};
  shadow-radius: 18px;
  elevation: ${({ isSpotlight }: { isSpotlight?: boolean }) =>
    isSpotlight ? 4 : 2};
`;

export const SpotlightHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
`;

export const SpotlightBadgesLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
`;

export const SpotlightPrimaryPill = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  background-color: #005bb1;
  padding: 3px 9px;
  border-radius: 999px;
`;

export const SpotlightPrimaryPillText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 10px;
  color: #ffffff;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const CountdownPill = styled.View`
  background-color: #d6e3ff;
  padding: 3px 9px;
  border-radius: 999px;
`;

export const CountdownPillText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 10.5px;
  color: #001b3d;
`;

export const CardRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`;

export const DateHighlightBox = styled.View<{
  isCanceled: boolean;
  isSpotlight?: boolean;
}>`
  width: 52px;
  height: 60px;
  border-radius: 14px;
  background-color: ${({
    isCanceled,
    isSpotlight,
  }: {
    isCanceled: boolean;
    isSpotlight?: boolean;
  }) =>
    isCanceled ? "#f1f5f9" : isSpotlight ? "#e6eeff" : "#f1f3ff"};
  border-width: 1px;
  border-color: ${({
    isCanceled,
    isSpotlight,
  }: {
    isCanceled: boolean;
    isSpotlight?: boolean;
  }) => (isCanceled ? "#e2e8f0" : isSpotlight ? "#d6e3ff" : "#e9edff")};
  align-items: center;
  justify-content: center;
`;

export const DateHighlightDay = styled.Text<{ isCanceled: boolean }>`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 18px;
  line-height: 21px;
  color: ${({ isCanceled }: { isCanceled: boolean }) =>
    isCanceled ? "#64748b" : "#0f1b32"};
`;

export const DateHighlightMonth = styled.Text<{ isCanceled: boolean }>`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 10px;
  color: ${({ isCanceled }: { isCanceled: boolean }) =>
    isCanceled ? "#94a3b8" : "#005bb1"};
  letter-spacing: 0.6px;
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
  margin-bottom: 6px;
`;

export const StatusBadge = styled.View<{ variant: EventVariant }>`
  flex-direction: row;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 999px;
  background-color: ${({ variant }: { variant: EventVariant }) =>
    variant === "canceled"
      ? "#fee2e2"
      : variant === "completed"
        ? "#e2e8f0"
        : "#d6e3ff"};
`;

export const StatusDot = styled.View<{ variant: EventVariant }>`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${({ variant }: { variant: EventVariant }) =>
    variant === "canceled"
      ? "#dc2626"
      : variant === "completed"
        ? "#64748b"
        : "#005bb1"};
`;

export const StatusBadgeText = styled.Text<{ variant: EventVariant }>`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 10.5px;
  color: ${({ variant }: { variant: EventVariant }) =>
    variant === "canceled"
      ? "#b91c1c"
      : variant === "completed"
        ? "#475569"
        : "#001b3d"};
`;

export const CompactCancelButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
`;

export const CompactCancelText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 11px;
  color: #64748b;
`;

export const EventTitle = styled.Text<{ isCanceled: boolean }>`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 15px;
  line-height: 20px;
  color: ${({ isCanceled }: { isCanceled: boolean }) =>
    isCanceled ? "#64748b" : "#0f1b32"};
  text-decoration-line: ${({ isCanceled }: { isCanceled: boolean }) =>
    isCanceled ? "line-through" : "none"};
  margin-bottom: 6px;
`;

export const MetaRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`;

export const MetaItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const MetaText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 12px;
  color: #414754;
`;

export const CancelReasonText = styled.Text`
  margin-top: 6px;
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 12px;
  color: #dc2626;
`;

export const CardFooterBar = styled.View`
  margin-top: 12px;
  padding-top: 10px;
  border-top-width: 1px;
  border-top-color: #e9edff;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const CardFooterLabel = styled.Text`
  flex: 1;
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 11.5px;
  color: #414754;
`;

export const JoinRoomPill = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 5px;
  background-color: #005bb1;
  padding: 6px 12px;
  border-radius: 999px;
`;

export const JoinRoomPillText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 11.5px;
  color: #ffffff;
`;

export const Divider = styled.View`
  height: 12px;
`;

export const WarningBanner = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: #e9edff;
  border-radius: 14px;
  padding: 10px 12px;
  margin-bottom: 14px;
`;

export const WarningBannerText = styled.Text`
  flex: 1;
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 12px;
  color: #0f1b32;
`;

export const HistoryLinkCard = styled.TouchableOpacity`
  margin-top: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background-color: #f1f3ff;
`;

export const HistoryLinkText = styled.Text`
  flex: 1;
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 12.5px;
  color: #0f1b32;
`;

export const TipCard = styled.View`
  margin-top: 14px;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  background-color: rgba(226, 223, 255, 0.42);
  border-radius: 18px;
  padding: 14px 16px;
`;

export const TipIconBox = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background-color: #514fb5;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
`;

export const TipTextCol = styled.View`
  flex: 1;
`;

export const TipTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 13.5px;
  color: #0f1b32;
  margin-bottom: 3px;
`;

export const TipBody = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 12.5px;
  line-height: 18px;
  color: #414754;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  background-color: #f9f9ff;
  align-items: center;
  justify-content: center;
`;

export const StateCard = styled.View`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 26px 20px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  shadow-color: #258bff;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.06;
  shadow-radius: 16px;
  elevation: 2;
`;

export const StateTitle = styled.Text`
  margin-top: 10px;
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 15.5px;
  color: #0f1b32;
  text-align: center;
`;

export const StateDescription = styled.Text`
  margin-top: 6px;
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 13px;
  line-height: 19px;
  color: #414754;
  text-align: center;
`;

export const RetryButton = styled.TouchableOpacity`
  margin-top: 14px;
  padding: 9px 18px;
  border-radius: 999px;
  background-color: #e9edff;
`;

export const RetryButtonText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 13px;
  color: #005bb1;
`;

export const FloatingNewButton = styled.TouchableOpacity<{ bottomOffset: number }>`
  position: absolute;
  right: 20px;
  bottom: ${({ bottomOffset }: { bottomOffset: number }) => bottomOffset}px;
  flex-direction: row;
  align-items: center;
  gap: 7px;
  background-color: #005bb1;
  padding: 12px 18px;
  border-radius: 999px;
  shadow-color: #005bb1;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.28;
  shadow-radius: 16px;
  elevation: 6;
`;

export const FloatingNewButtonText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 13.5px;
  color: #ffffff;
`;
