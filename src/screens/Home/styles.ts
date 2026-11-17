import styled from "styled-components/native";
import { DefaultTheme } from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../../global/styles/theme";

export const Container = styled.View`
  flex: 1;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
`;

/* ── Editorial Header ── */
export const Header = styled.View<{ topInset: number }>`
  width: 100%;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
  padding-top: ${(props: { topInset: number }) => props.topInset + 12}px;
  padding-bottom: 14px;
  padding-horizontal: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.border};
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderBrandBlock = styled.View`
  flex: 1;
  margin-right: 12px;
  gap: 3px;
`;

export const HeaderDateText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_muted};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(11)}px;
  text-transform: capitalize;
`;

export const HeaderActions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const AvatarWrapper = styled.View`
  position: relative;
`;

export const UserPhoto = styled.Image`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  border-width: 1.5px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.primary};
`;

export const UserAvatarFallback = styled.View`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  border-width: 1.5px;
  border-color: #dce8fd;
  align-items: center;
  justify-content: center;
`;

export const UserIcon = styled(MaterialIcons)`
  font-size: 20px;
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
`;

export const AvatarStatusDot = styled.View`
  position: absolute;
  top: 0px;
  right: 0px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
  border-width: 1.5px;
  border-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
`;

export const LogoutButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  align-items: center;
  justify-content: center;
  opacity: ${(props: { disabled?: boolean }) => (props.disabled ? 0.5 : 1)};
`;

export const LogoutIcon = styled(MaterialIcons)`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  font-size: 18px;
`;

/* ── Scroll & Body ── */
export const ScrollContent = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
`;

export const Body = styled.View`
  padding: 20px 20px 28px 20px;
`;

/* ── Editorial Greeting ── */
export const WelcomeSection = styled.View`
  margin-bottom: 20px;
`;

export const GreetingEyebrow = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_muted};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(13)}px;
  margin-bottom: 2px;
`;

export const GreetingTitle = styled.Text<{ isCompact?: boolean }>`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  font-family: ${theme.fonts.Titulos};
  font-size: ${(props: { isCompact?: boolean }) =>
    props.isCompact ? RFValue(21) : RFValue(23)}px;
  line-height: ${(props: { isCompact?: boolean }) =>
    props.isCompact ? RFValue(27) : RFValue(30)}px;
  margin-bottom: 4px;
`;

export const WelcomeDescription = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_muted};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(13)}px;
  line-height: ${RFValue(18.5)}px;
`;

/* ── Featured Hero Card: Agendar reunião ── */
export const HeroScheduleCard = styled.TouchableOpacity`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
  border-radius: 20px;
  padding: 16px 18px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  margin-bottom: 12px;
  elevation: 4;
  shadow-color: #1544b5;
  shadow-offset: 0px 5px;
  shadow-opacity: 0.2;
  shadow-radius: 10px;
`;

export const HeroTextColumn = styled.View`
  flex: 1;
  padding-right: 12px;
  gap: 6px;
`;

export const HeroTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  font-family: ${theme.fonts.Titulos};
  font-size: ${RFValue(17.5)}px;
  margin-top: 2px;
`;

export const HeroDescription = styled.Text`
  color: rgba(255, 255, 255, 0.9);
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(12)}px;
  line-height: ${RFValue(17)}px;
  margin-bottom: 6px;
`;

export const HeroActionPill = styled.View`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  padding: 7px 12px;
  border-radius: 12px;
`;

export const HeroActionPillText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(12)}px;
`;

/* ── Vector Illustration inside Hero Card ── */
export const HeroIllustrationBox = styled.View<{ isCompact?: boolean }>`
  width: ${(props: { isCompact?: boolean }) =>
    props.isCompact ? "82px" : "94px"};
  height: ${(props: { isCompact?: boolean }) =>
    props.isCompact ? "92px" : "102px"};
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const HeroTrajectoryArc = styled.View`
  position: absolute;
  width: 84px;
  height: 84px;
  border-radius: 42px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.22);
`;

export const HeroOrbitDotTop = styled.View`
  position: absolute;
  top: 4px;
  right: 8px;
  width: 9px;
  height: 9px;
  border-radius: 4.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_lavender};
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.85);
`;

export const HeroOrbitDotBottom = styled.View`
  position: absolute;
  bottom: 8px;
  left: 4px;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.6);
`;

export const MiniCalendarFrame = styled.View`
  width: 72px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 14px;
  overflow: hidden;
  transform: rotate(-4deg);
  elevation: 3;
  shadow-color: #1e355e;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.22;
  shadow-radius: 6px;
`;

export const MiniCalendarTopBar = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  height: 19px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 10px;
`;

export const MiniCalendarRing = styled.View`
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  background-color: rgba(255, 255, 255, 0.85);
`;

export const MiniCalendarBody = styled.View`
  padding: 8px;
  gap: 5px;
  align-items: center;
`;

export const MiniCalendarLineShort = styled.View`
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_lavender};
  opacity: 0.7;
`;

export const MiniCalendarLineLong = styled.View`
  width: 48px;
  height: 4px;
  border-radius: 2px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.border};
`;

export const MiniCompassBadge = styled.View`
  position: absolute;
  bottom: 4px;
  right: 2px;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_lavender};
  border-width: 2.5px;
  border-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  align-items: center;
  justify-content: center;
  elevation: 4;
`;

/* ── Secondary Card: Visualizar agenda ── */
export const SecondaryAgendaCard = styled.TouchableOpacity`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 16px;
  padding: 13px 16px;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  margin-bottom: 22px;
  elevation: 1;
  shadow-color: #1e355e;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.04;
  shadow-radius: 6px;
`;

export const SecondaryIconBox = styled.View`
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const SecondaryTextCol = styled.View`
  flex: 1;
  margin-right: 8px;
`;

export const SecondaryTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(14)}px;
`;

export const SecondaryDescription = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_muted};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(11.5)}px;
  margin-top: 1px;
`;

/* ── Section Header: Próxima orientação ── */
export const SectionHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const SectionTitleGroup = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 7px;
`;

export const SectionDot = styled.View`
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
`;

export const SectionTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(14)}px;
`;

export const SectionLinkButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 3px;
`;

export const SectionLinkText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(12)}px;
`;

/* ── Editorial Checkpoint + Next Meeting Card ── */
export const TimelineRow = styled.View`
  flex-direction: row;
  align-items: stretch;
`;

export const MeetingCard = styled.TouchableOpacity`
  flex: 1;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 18px;
  padding: 14px 16px;
  border-width: 1px;
  border-color: #dce8fd;
  elevation: 1;
  shadow-color: #1e355e;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 6px;
`;

export const MeetingTopRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;

export const MeetingInfoCol = styled.View`
  flex: 1;
`;

export const StatusBadge = styled.View`
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

export const StatusDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
`;

export const StatusBadgeText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(10)}px;
`;

export const MeetingTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(14.5)}px;
  margin-bottom: 6px;
`;

export const MeetingMetaList = styled.View`
  gap: 4px;
`;

export const MeetingMetaItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const MeetingMetaText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_muted};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(12)}px;
  flex: 1;
`;

/* ── Empty, Loading & Error States ── */
export const StateCard = styled.View`
  flex: 1;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 18px;
  padding: 16px;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  elevation: 1;
  shadow-color: #1e355e;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.04;
  shadow-radius: 6px;
`;

export const EmptyIllustrationRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const EmptyAcademicGraphic = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 15px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const EmptyAcademicIcon = styled(MaterialCommunityIcons)`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  font-size: 22px;
`;

export const EmptyCompassCorner = styled.View`
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 19px;
  height: 19px;
  border-radius: 9.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_lavender};
  border-width: 2px;
  border-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  align-items: center;
  justify-content: center;
`;

export const EmptyTextCol = styled.View`
  flex: 1;
`;

export const EmptyTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(13.5)}px;
`;

export const EmptySubtitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_muted};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(12)}px;
  line-height: ${RFValue(17)}px;
  margin-top: 2px;
`;

export const EmptyDivider = styled.View`
  height: 1px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.border};
  margin-vertical: 11px;
`;

export const EmptyFooterAction = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const EmptyFooterText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(12.5)}px;
`;

export const CenteredStateBox = styled.View`
  align-items: center;
  justify-content: center;
  padding: 10px;
`;

export const CenteredStateText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_muted};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(12.5)}px;
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
    props.theme.colors.editorial_navy};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(12.5)}px;
`;
