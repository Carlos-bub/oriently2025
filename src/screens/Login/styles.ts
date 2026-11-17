import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultTheme } from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "src/global/styles/theme";

export const Container = styled.View`
  flex: 1;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
`;

export const ScrollContent = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  bounces: false,
})`
  flex: 1;
`;

export const MainColumn = styled.View`
  width: 100%;
  max-width: 380px;
  align-self: center;
  align-items: center;
`;

/* ── Brand Header ── */
export const BrandRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
`;

export const BrandIconBox = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  border-width: 1px;
  border-color: #dce8fd;
  align-items: center;
  justify-content: center;
`;

export const BrandName = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.Titulos};
  font-size: ${RFValue(18)}px;
  letter-spacing: -0.3px;
`;

/* ── Cohesive Academic Flow Hero Composition ── */
export const HeroComposition = styled.View`
  width: 240px;
  height: 146px;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;
`;

export const HeroBackdropHalo = styled.View`
  position: absolute;
  width: 136px;
  height: 136px;
  border-radius: 68px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  opacity: 0.75;
`;

export const OrbitDotBlue = styled.View`
  position: absolute;
  top: 14px;
  left: 26px;
  width: 9px;
  height: 9px;
  border-radius: 4.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
  opacity: 0.45;
`;

export const OrbitDotLavender = styled.View`
  position: absolute;
  bottom: 18px;
  right: 22px;
  width: 11px;
  height: 11px;
  border-radius: 5.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.lavender};
  opacity: 0.55;
`;

export const FloatingCalendarCard = styled.View`
  position: absolute;
  left: 26px;
  bottom: 14px;
  width: 92px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 16px;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  overflow: hidden;
  transform: rotate(-7deg);
  elevation: 3;
  shadow-color: #1544b5;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.12;
  shadow-radius: 8px;
`;

export const FloatingCalendarHeader = styled.View`
  height: 22px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 12px;
`;

export const CalendarRingDot = styled.View`
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  background-color: rgba(255, 255, 255, 0.9);
`;

export const FloatingCalendarGrid = styled.View`
  padding: 9px;
  gap: 5px;
`;

export const GridRow = styled.View`
  flex-direction: row;
  gap: 5px;
  justify-content: center;
`;

export const GridCell = styled.View<{ active?: boolean }>`
  width: 18px;
  height: 12px;
  border-radius: 4px;
  background-color: ${(props: { theme: DefaultTheme; active?: boolean }) =>
    props.active ? props.theme.colors.primary : props.theme.colors.surface};
`;

export const FloatingProgressCard = styled.View`
  position: absolute;
  right: 24px;
  top: 16px;
  width: 118px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 16px;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  padding: 11px 12px;
  transform: rotate(5deg);
  elevation: 4;
  shadow-color: #172b4d;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  gap: 7px;
`;

export const ProgressCardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ProgressPill = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  padding: 2px 7px;
  border-radius: 8px;
`;

export const ProgressPillText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(9)}px;
`;

export const AcademicIconSmall = styled(MaterialCommunityIcons)`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-size: 16px;
`;

export const SkeletonLineShort = styled.View`
  width: 58px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.lavender};
  opacity: 0.65;
`;

export const SkeletonLineLong = styled.View`
  width: 86px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.border};
`;

export const CenterCompassBadge = styled.View`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.lavender};
  border-width: 3px;
  border-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  align-items: center;
  justify-content: center;
  elevation: 5;
  shadow-color: #172b4d;
  shadow-offset: 0px 3px;
  shadow-opacity: 0.15;
  shadow-radius: 6px;
`;

/* ── Copy ── */
export const TextBlock = styled.View`
  align-items: center;
  margin-bottom: 24px;
  padding-horizontal: 8px;
`;

export const Title = styled.Text<{ isCompact?: boolean }>`
  font-size: ${(props: { isCompact?: boolean }) =>
    props.isCompact ? RFValue(20) : RFValue(23)}px;
  line-height: ${(props: { isCompact?: boolean }) =>
    props.isCompact ? RFValue(26) : RFValue(30)}px;
  font-family: ${theme.fonts.Titulos};
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  text-align: center;
  margin-bottom: 8px;
`;

export const Subtitle = styled.Text`
  font-size: ${RFValue(13)}px;
  line-height: ${RFValue(19)}px;
  font-family: ${theme.fonts.Subtituloslight};
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  text-align: center;
  max-width: 300px;
`;

/* ── Actions & Footer ── */
export const ActionsStack = styled.View`
  width: 100%;
  gap: 10px;
  margin-bottom: 18px;
`;

export const GoogleButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  width: 100%;
  min-height: 50px;
  padding-horizontal: 18px;
  padding-vertical: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  opacity: ${(props: { disabled?: boolean }) => (props.disabled ? 0.6 : 1)};
  elevation: 2;
  shadow-color: #172b4d;
  shadow-offset: 0px 3px;
  shadow-opacity: 0.08;
  shadow-radius: 8px;
`;

export const GoogleButtonText = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${theme.fonts.Subtitulos};
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  margin-left: 10px;
`;

export const DemoButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  width: 100%;
  min-height: 46px;
  padding-horizontal: 18px;
  padding-vertical: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  border-width: 1px;
  border-color: #dce8fd;
  gap: 8px;
  opacity: ${(props: { disabled?: boolean }) => (props.disabled ? 0.6 : 1)};
`;

export const DemoButtonText = styled.Text`
  font-size: ${RFValue(13)}px;
  font-family: ${theme.fonts.Subtitulos};
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
`;

export const Icon = styled.Image`
  width: 20px;
  height: 20px;
`;

export const FooterText = styled.Text`
  font-size: ${RFValue(11)}px;
  line-height: ${RFValue(16)}px;
  font-family: ${theme.fonts.Subtituloslight};
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
  text-align: center;
  max-width: 280px;
`;
