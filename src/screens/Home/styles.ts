import styled from "styled-components/native";
import { DefaultTheme } from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
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
  padding-top: ${(props: { topInset: number }) => props.topInset + 10}px;
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
`;

export const HeaderDateText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(11.5)}px;
  text-transform: capitalize;
  margin-bottom: 2px;
`;

export const BrandRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const BrandName = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.Titulos};
  font-size: ${RFValue(17)}px;
  letter-spacing: -0.3px;
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
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  align-items: center;
  justify-content: center;
`;

export const UserIcon = styled(MaterialIcons)`
  font-size: 20px;
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
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
    props.theme.colors.text_primary};
  font-size: 18px;
`;

/* ── Scroll & Body ── */
export const ScrollContent = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
`;

export const Body = styled.View`
  padding: 22px 20px 32px 20px;
`;

/* ── Welcome ── */
export const WelcomeSection = styled.View`
  margin-bottom: 22px;
`;

export const GreetingTitle = styled.Text<{ isCompact?: boolean }>`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.Titulos};
  font-size: ${(props: { isCompact?: boolean }) =>
    props.isCompact ? RFValue(21) : RFValue(23)}px;
  line-height: ${(props: { isCompact?: boolean }) =>
    props.isCompact ? RFValue(27) : RFValue(30)}px;
`;

export const GreetingHighlight = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(15)}px;
  margin-top: 2px;
  margin-bottom: 6px;
`;

export const WelcomeDescription = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(13)}px;
  line-height: ${RFValue(19)}px;
`;

/* ── Featured Hero Card: Agendar reunião ── */
export const HeroScheduleCard = styled.TouchableOpacity`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
  border-radius: 22px;
  padding: 18px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  margin-bottom: 14px;
  elevation: 5;
  shadow-color: #1544b5;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.22;
  shadow-radius: 12px;
`;

export const HeroTextColumn = styled.View`
  flex: 1;
  padding-right: 12px;
`;

export const HeroTag = styled.View`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  background-color: rgba(255, 255, 255, 0.18);
  padding: 4px 10px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

export const HeroTagText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(10.5)}px;
`;

export const HeroTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  font-family: ${theme.fonts.Titulos};
  font-size: ${RFValue(18)}px;
  margin-bottom: 4px;
`;

export const HeroDescription = styled.Text`
  color: rgba(255, 255, 255, 0.9);
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(12)}px;
  line-height: ${RFValue(17)}px;
  margin-bottom: 14px;
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
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(12)}px;
`;

/* ── Custom Vector Illustration inside Hero Card ── */
export const HeroIllustrationBox = styled.View`
  width: 96px;
  height: 104px;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const HeroOrbitDotTop = styled.View`
  position: absolute;
  top: 4px;
  right: 8px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.lavender};
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.85);
`;

export const HeroOrbitDotBottom = styled.View`
  position: absolute;
  bottom: 8px;
  left: 4px;
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: rgba(255, 255, 255, 0.55);
`;

export const MiniCalendarFrame = styled.View`
  width: 76px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 14px;
  overflow: hidden;
  transform: rotate(-4deg);
  elevation: 3;
  shadow-color: #1544b5;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 6px;
`;

export const MiniCalendarTopBar = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  height: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 10px;
`;

export const MiniCalendarRing = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.85);
`;

export const MiniCalendarBody = styled.View`
  padding: 8px;
  gap: 5px;
  align-items: center;
`;

export const MiniCalendarLineShort = styled.View`
  width: 34px;
  height: 4px;
  border-radius: 2px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.lavender};
  opacity: 0.65;
`;

export const MiniCalendarLineLong = styled.View`
  width: 52px;
  height: 4px;
  border-radius: 2px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.border};
`;

export const MiniCompassBadge = styled.View`
  position: absolute;
  bottom: 4px;
  right: 2px;
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.lavender};
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
  border-radius: 18px;
  padding: 14px 16px;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  margin-bottom: 24px;
  elevation: 1;
  shadow-color: #172b4d;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 6px;
`;

export const SecondaryIconBox = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 12px;
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
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(14.5)}px;
`;

export const SecondaryDescription = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(11.5)}px;
  margin-top: 1px;
`;

/* ── Section Header: Próxima orientação ── */
export const SectionHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const SectionTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(15)}px;
`;

export const SectionLinkButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const SectionLinkText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(12)}px;
`;

/* ── Editorial Timeline + Next Meeting Card ── */
export const TimelineRow = styled.View`
  flex-direction: row;
  align-items: stretch;
`;

export const TimelineTrack = styled.View`
  width: 22px;
  align-items: center;
  margin-right: 10px;
  padding-top: 16px;
`;

export const TimelineOuterDot = styled.View`
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  border-width: 2px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

export const TimelineInnerDot = styled.View`
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
`;

export const TimelineLine = styled.View`
  flex: 1;
  width: 1.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.border};
  margin-top: 6px;
  margin-bottom: 6px;
`;

export const MeetingCard = styled.TouchableOpacity`
  flex: 1;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 20px;
  padding: 16px;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  elevation: 2;
  shadow-color: #172b4d;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
`;

export const MeetingTopRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;

export const DateHighlightBox = styled.View`
  width: 52px;
  padding-vertical: 8px;
  border-radius: 14px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const DateHighlightDay = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.Titulos};
  font-size: ${RFValue(17)}px;
  line-height: ${RFValue(21)}px;
`;

export const DateHighlightMonth = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.lavender};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(10.5)}px;
  text-transform: uppercase;
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
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(10)}px;
`;

export const MeetingTitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
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
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(12)}px;
  flex: 1;
`;

/* ── Empty, Loading & Error States ── */
export const StateCard = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 20px;
  padding: 18px 16px;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  elevation: 1;
  shadow-color: #172b4d;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.04;
  shadow-radius: 6px;
`;

export const EmptyIllustrationRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
`;

export const EmptyAcademicGraphic = styled.View`
  width: 52px;
  height: 52px;
  border-radius: 16px;
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
    props.theme.colors.primary_dark};
  font-size: 24px;
`;

export const EmptyCompassCorner = styled.View`
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.lavender};
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
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(14)}px;
`;

export const EmptySubtitle = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  font-family: ${theme.fonts.Subtituloslight};
  font-size: ${RFValue(12)}px;
  line-height: ${RFValue(17)}px;
  margin-top: 2px;
`;

export const EmptyDivider = styled.View`
  height: 1px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.border};
  margin-vertical: 12px;
`;

export const EmptyFooterAction = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const EmptyFooterText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
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
    props.theme.colors.text_secondary};
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
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(12.5)}px;
`;

export const ActionIcon = styled(Feather)``;
