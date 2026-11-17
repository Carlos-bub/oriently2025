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

export const BrandHeader = styled.View`
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
`;

/* ── Editorial Journey Scene ── */
export const HeroScene = styled.View<{ isShortScreen?: boolean }>`
  width: 264px;
  height: ${(props: { isShortScreen?: boolean }) =>
    props.isShortScreen ? "144px" : "164px"};
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: ${(props: { isShortScreen?: boolean }) =>
    props.isShortScreen ? "16px" : "22px"};
`;

export const ConcentricArcOuter = styled.View`
  position: absolute;
  width: 158px;
  height: 158px;
  border-radius: 79px;
  border-width: 1px;
  border-color: rgba(37, 139, 255, 0.14);
`;

export const ConcentricArcInner = styled.View`
  position: absolute;
  width: 112px;
  height: 112px;
  border-radius: 56px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  border-width: 1px;
  border-color: rgba(124, 114, 232, 0.22);
  opacity: 0.78;
`;

export const TrajectoryTrackLine = styled.View`
  position: absolute;
  width: 146px;
  height: 1.5px;
  background-color: rgba(124, 114, 232, 0.35);
  transform: rotate(-16deg);
`;

export const WaypointDotBlue = styled.View`
  position: absolute;
  top: 20px;
  left: 34px;
  width: 9px;
  height: 9px;
  border-radius: 4.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
  opacity: 0.55;
`;

export const WaypointDotLavender = styled.View`
  position: absolute;
  bottom: 22px;
  right: 30px;
  width: 11px;
  height: 11px;
  border-radius: 5.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_lavender};
  opacity: 0.65;
`;

export const FloatingCalendarCard = styled.View`
  position: absolute;
  left: 16px;
  bottom: 14px;
  width: 94px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 16px;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  overflow: hidden;
  transform: rotate(-6deg);
  elevation: 3;
  shadow-color: #1e355e;
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

export const FloatingOrientationCard = styled.View`
  position: absolute;
  right: 14px;
  top: 14px;
  width: 122px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 16px;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  padding: 11px 12px;
  transform: rotate(4deg);
  elevation: 4;
  shadow-color: #1e355e;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  gap: 7px;
`;

export const OrientationCardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const OrientationPill = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  padding: 2px 7px;
  border-radius: 8px;
`;

export const OrientationPillText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(9)}px;
`;

export const AcademicIconSmall = styled(MaterialCommunityIcons)`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  font-size: 16px;
`;

export const SkeletonLineShort = styled.View`
  width: 58px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_lavender};
  opacity: 0.7;
`;

export const SkeletonLineLong = styled.View`
  width: 88px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.border};
`;

export const CenterCompassRing = styled.View`
  width: 46px;
  height: 46px;
  border-radius: 23px;
  background-color: rgba(124, 114, 232, 0.18);
  align-items: center;
  justify-content: center;
`;

export const CenterCompassBadge = styled.View`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_lavender};
  border-width: 2.5px;
  border-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  align-items: center;
  justify-content: center;
  elevation: 5;
  shadow-color: #1e355e;
  shadow-offset: 0px 3px;
  shadow-opacity: 0.18;
  shadow-radius: 6px;
`;

/* ── Copy ── */
export const TextBlock = styled.View`
  align-items: center;
  margin-bottom: 22px;
  padding-horizontal: 8px;
`;

export const Title = styled.Text<{ isCompact?: boolean }>`
  font-size: ${(props: { isCompact?: boolean }) =>
    props.isCompact ? RFValue(21) : RFValue(24)}px;
  line-height: ${(props: { isCompact?: boolean }) =>
    props.isCompact ? RFValue(27) : RFValue(31)}px;
  font-family: ${theme.fonts.Titulos};
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  text-align: center;
  margin-bottom: 8px;
`;

export const Subtitle = styled.Text`
  font-size: ${RFValue(13)}px;
  line-height: ${RFValue(19)}px;
  font-family: ${theme.fonts.Subtituloslight};
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_muted};
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
  shadow-color: #1e355e;
  shadow-offset: 0px 3px;
  shadow-opacity: 0.08;
  shadow-radius: 8px;
`;

export const GoogleButtonText = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${theme.fonts.Subtitulos};
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
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
    props.theme.colors.editorial_navy};
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
    props.theme.colors.editorial_muted};
  text-align: center;
  max-width: 280px;
`;
