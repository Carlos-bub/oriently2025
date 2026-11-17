import styled, { DefaultTheme } from "styled-components/native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

type ThemedProps = { theme: DefaultTheme };

export const Container = styled.View`
  flex: 1;
  background-color: #f9f9ff;
`;

export const Header = styled.View<{ topInset: number }>`
  width: 100%;
  background-color: #f9f9ff;
  padding-top: ${({ topInset }: { topInset: number }) => topInset + 10}px;
  padding-bottom: 12px;
  padding-horizontal: 20px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderBrandRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const HeaderBrandBadge = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background-color: #005bb1;
  align-items: center;
  justify-content: center;
  shadow-color: #005bb1;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.22;
  shadow-radius: 8px;
  elevation: 3;
`;

export const HeaderBrandTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 20px;
  color: #0f1b32;
  letter-spacing: -0.4px;
`;

export const HeaderActions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const AvatarWrapper = styled.View`
  position: relative;
  width: 34px;
  height: 34px;
`;

export const UserPhoto = styled.Image`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  border-width: 1.5px;
  border-color: #d6e3ff;
`;

export const UserAvatarFallback = styled.View`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background-color: #005bb1;
  align-items: center;
  justify-content: center;
`;

export const UserIcon = styled(MaterialIcons)`
  font-size: 18px;
  color: #ffffff;
`;

export const LogoutButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #e9edff;
  align-items: center;
  justify-content: center;
`;

export const LogoutIcon = styled(MaterialIcons)`
  font-size: 18px;
  color: #1e355e;
`;

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

export const Body = styled.View`
  width: 100%;
  max-width: 480px;
  align-self: center;
  padding-horizontal: 20px;
  padding-top: 4px;
`;

export const WelcomeSection = styled.View`
  margin-bottom: 18px;
`;

export const DatePill = styled.View`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background-color: #e9edff;
  padding: 5px 12px;
  border-radius: 999px;
  margin-bottom: 10px;
`;

export const DatePillText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 11px;
  color: #414754;
  text-transform: capitalize;
`;

export const GreetingTitle = styled.Text<{ isCompact?: boolean }>`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: ${({ isCompact }: { isCompact?: boolean }) =>
    isCompact ? 22 : 25}px;
  line-height: ${({ isCompact }: { isCompact?: boolean }) =>
    isCompact ? 28 : 31}px;
  color: #0f1b32;
  letter-spacing: -0.5px;
  margin-bottom: 4px;
`;

export const WelcomeDescription = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 14px;
  line-height: 20px;
  color: #414754;
`;

export const HeroScheduleCard = styled.TouchableOpacity`
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background-color: #005bb1;
  padding: 18px;
  margin-bottom: 14px;
  shadow-color: #005bb1;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.24;
  shadow-radius: 20px;
  elevation: 5;
`;

export const HeroGlowTopRight = styled.View`
  position: absolute;
  top: -36px;
  right: -36px;
  width: 150px;
  height: 150px;
  border-radius: 75px;
  background-color: rgba(255, 255, 255, 0.12);
`;

export const HeroGlowBottomRight = styled.View`
  position: absolute;
  bottom: -30px;
  right: 20px;
  width: 110px;
  height: 110px;
  border-radius: 55px;
  background-color: rgba(106, 141, 255, 0.22);
`;

export const HeroStepPill = styled.View`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 999px;
  margin-bottom: 12px;
`;

export const HeroStepPillText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 10px;
  color: #ffffff;
  letter-spacing: 0.7px;
  text-transform: uppercase;
`;

export const HeroMiddleRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
`;

export const HeroTextColumn = styled.View`
  flex: 1;
`;

export const HeroTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 20px;
  line-height: 25px;
  color: #ffffff;
  letter-spacing: -0.3px;
  margin-bottom: 6px;
`;

export const HeroDescription = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 13px;
  line-height: 19px;
  color: rgba(255, 255, 255, 0.88);
`;

export const HeroIllustrationBox = styled.View<{ isCompact?: boolean }>`
  width: ${({ isCompact }: { isCompact?: boolean }) =>
    isCompact ? 68 : 76}px;
  height: ${({ isCompact }: { isCompact?: boolean }) =>
    isCompact ? 68 : 76}px;
  align-items: center;
  justify-content: center;
`;

export const HeroCalendarTile = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.18);
  align-items: center;
  justify-content: center;
  transform: rotate(-3deg);
`;

export const HeroCompassCorner = styled.View`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 26px;
  height: 26px;
  border-radius: 13px;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
  shadow-color: #001b3d;
  shadow-offset: 0px 3px;
  shadow-opacity: 0.16;
  shadow-radius: 6px;
  elevation: 3;
`;

export const HeroDurationCorner = styled.View`
  position: absolute;
  bottom: -4px;
  left: -4px;
  background-color: #6a68d0;
  padding: 2px 7px;
  border-radius: 999px;
`;

export const HeroDurationCornerText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 9px;
  color: #ffffff;
`;

export const HeroActionPill = styled.View`
  width: 100%;
  height: 46px;
  border-radius: 999px;
  background-color: #ffffff;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  shadow-color: #001b3d;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.16;
  shadow-radius: 12px;
  elevation: 3;
`;

export const HeroActionPillText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 14px;
  color: #005bb1;
`;

export const SecondaryAgendaCard = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background-color: #f1f3ff;
  border-radius: 18px;
  padding: 14px 16px;
  margin-bottom: 22px;
  shadow-color: #258bff;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.05;
  shadow-radius: 10px;
  elevation: 1;
`;

export const SecondaryLeftRow = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const SecondaryIconBox = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: #e2dfff;
  align-items: center;
  justify-content: center;
`;

export const SecondaryTextCol = styled.View`
  flex: 1;
`;

export const SecondaryTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 15px;
  color: #0f1b32;
  margin-bottom: 2px;
`;

export const SecondaryDescription = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 12.5px;
  color: #414754;
`;

export const SecondaryChevronCircle = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #e9edff;
  align-items: center;
  justify-content: center;
`;

export const SectionHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const SectionTitleGroup = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 7px;
`;

export const SectionTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 17px;
  color: #0f1b32;
  letter-spacing: -0.2px;
`;

export const SectionLinkButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding-vertical: 4px;
  padding-left: 8px;
`;

export const SectionLinkText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 12px;
  color: #005bb1;
`;

export const TimelineRow = styled.View`
  position: relative;
  padding-left: 24px;
  margin-bottom: 16px;
`;

export const TimelineVerticalLine = styled.View`
  position: absolute;
  left: 8px;
  top: 22px;
  bottom: 0px;
  width: 2px;
  border-radius: 1px;
  background-color: #c2d7ff;
`;

export const TimelineDotOuter = styled.View<{ waiting?: boolean }>`
  position: absolute;
  left: 0px;
  top: 14px;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: ${({ waiting }: { waiting?: boolean }) =>
    waiting ? "#cbd5e1" : "#005bb1"};
  align-items: center;
  justify-content: center;
  border-width: 3px;
  border-color: #dbe8ff;
`;

export const TimelineDotInner = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #ffffff;
`;

export const MeetingCard = styled.TouchableOpacity`
  background-color: #ffffff;
  border-radius: 18px;
  padding: 16px;
  shadow-color: #258bff;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.08;
  shadow-radius: 18px;
  elevation: 3;
`;

export const MeetingStatusRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
`;

export const StatusBadge = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background-color: #f1f3ff;
  padding: 4px 10px;
  border-radius: 999px;
`;

export const StatusDot = styled.View`
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: #10b981;
`;

export const StatusBadgeText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 11px;
  color: #005bb1;
`;

export const MeetingContextLabel = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 11px;
  color: #414754;
`;

export const MeetingTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 18px;
  line-height: 24px;
  color: #0f1b32;
  letter-spacing: -0.3px;
  margin-bottom: 8px;
`;

export const MeetingScheduleRow = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
`;

export const MeetingScheduleText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 13px;
  color: #0f1b32;
`;

export const DurationChip = styled.View`
  background-color: #e9edff;
  padding: 2px 7px;
  border-radius: 6px;
`;

export const DurationChipText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 10.5px;
  color: #414754;
`;

export const ModalityBox = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background-color: #f1f3ff;
  border-radius: 12px;
  padding: 10px 12px;
`;

export const ModalityLeft = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const ModalityIconBox = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background-color: #e9edff;
  align-items: center;
  justify-content: center;
`;

export const ModalityLabel = styled.Text`
  flex: 1;
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 12.5px;
  color: #0f1b32;
`;

export const JoinRoomButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 5px;
  background-color: #005bb1;
  padding: 6px 12px;
  border-radius: 999px;
`;

export const JoinRoomButtonText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 11px;
  color: #ffffff;
`;

export const PartialWarningRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
`;

export const PartialWarningText = styled.Text`
  flex: 1;
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 11.5px;
  color: #64748b;
`;

export const StateCard = styled.View`
  background-color: #ffffff;
  border-radius: 18px;
  padding: 16px;
  shadow-color: #258bff;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.06;
  shadow-radius: 16px;
  elevation: 2;
`;

export const CenteredStateBox = styled.View`
  align-items: center;
  justify-content: center;
  padding-vertical: 14px;
  gap: 8px;
`;

export const CenteredStateText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 13px;
  color: #414754;
  text-align: center;
`;

export const RetryButton = styled.TouchableOpacity`
  margin-top: 4px;
  padding: 8px 16px;
  border-radius: 999px;
  background-color: #e9edff;
`;

export const RetryButtonText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 12.5px;
  color: #005bb1;
`;

export const EmptyIllustrationRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export const EmptyAcademicGraphic = styled.View`
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: #f1f3ff;
  align-items: center;
  justify-content: center;
`;

export const EmptyAcademicIcon = styled(MaterialCommunityIcons)`
  font-size: 21px;
  color: #1e355e;
`;

export const EmptyCompassCorner = styled.View`
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: #005bb1;
  align-items: center;
  justify-content: center;
`;

export const EmptyTextCol = styled.View`
  flex: 1;
`;

export const EmptyTitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Titulos};
  font-size: 14.5px;
  color: #0f1b32;
  margin-bottom: 2px;
`;

export const EmptySubtitle = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 12.5px;
  line-height: 18px;
  color: #414754;
`;

export const EmptyDivider = styled.View`
  height: 1px;
  background-color: #e9edff;
  margin-bottom: 10px;
`;

export const EmptyFooterAction = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const EmptyFooterText = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 13px;
  color: #005bb1;
`;

export const TipCard = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  background-color: rgba(226, 223, 255, 0.38);
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

export const TipEyebrow = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtitulos};
  font-size: 10.5px;
  color: #3c389e;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  margin-bottom: 3px;
`;

export const TipBody = styled.Text`
  font-family: ${({ theme }: ThemedProps) => theme.fonts.Subtituloslight};
  font-size: 13px;
  line-height: 19px;
  color: #0f1b32;
`;
