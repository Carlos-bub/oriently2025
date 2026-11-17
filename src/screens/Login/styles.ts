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

export const TopSection = styled.View`
  width: 100%;
`;

export const BrandHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const BrandRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const BrandIconBox = styled.View`
  width: 34px;
  height: 34px;
  border-radius: 11px;
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
  font-size: ${RFValue(19)}px;
  letter-spacing: -0.3px;
`;

export const AcademicPill = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  padding: 5px 11px;
  border-radius: 12px;
`;

export const AcademicPillText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(10.5)}px;
`;

/* ── Authorial Academic Flow Illustration Card ── */
export const IllustrationCard = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  border-radius: 22px;
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  padding: 18px;
  margin-bottom: 24px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  elevation: 2;
  shadow-color: #172b4d;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.06;
  shadow-radius: 10px;
`;

export const IllustrationLeft = styled.View`
  flex: 1;
  padding-right: 12px;
  gap: 10px;
`;

export const FlowStepRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const FlowDotPrimary = styled.View`
  width: 9px;
  height: 9px;
  border-radius: 4.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
`;

export const FlowDotLavender = styled.View`
  width: 9px;
  height: 9px;
  border-radius: 4.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.lavender};
`;

export const FlowStepText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(12)}px;
`;

export const FlowSubLine = styled.View`
  width: 1.5px;
  height: 12px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.border};
  margin-left: 3.5px;
`;

export const IllustrationBadgeBox = styled.View`
  width: 82px;
  height: 82px;
  border-radius: 20px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const AcademicIcon = styled(MaterialCommunityIcons)`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary_dark};
  font-size: 32px;
`;

export const CompassCornerBadge = styled.View`
  position: absolute;
  bottom: -6px;
  right: -6px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.lavender};
  border-width: 2.5px;
  border-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
  align-items: center;
  justify-content: center;
`;

/* ── Copy ── */
export const TextBlock = styled.View`
  margin-bottom: 24px;
`;

export const Title = styled.Text<{ isCompact?: boolean }>`
  font-size: ${(props: { isCompact?: boolean }) =>
    props.isCompact ? RFValue(22) : RFValue(25)}px;
  line-height: ${(props: { isCompact?: boolean }) =>
    props.isCompact ? RFValue(28) : RFValue(32)}px;
  font-family: ${theme.fonts.Titulos};
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_primary};
  margin-bottom: 8px;
`;

export const Subtitle = styled.Text`
  font-size: ${RFValue(13.5)}px;
  line-height: ${RFValue(20)}px;
  font-family: ${theme.fonts.Subtituloslight};
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_secondary};
`;

/* ── Actions & Footer ── */
export const BottomSection = styled.View`
  width: 100%;
`;

export const ActionsStack = styled.View`
  gap: 12px;
  margin-bottom: 18px;
`;

export const GoogleButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  width: 100%;
  min-height: 52px;
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
  min-height: 48px;
  padding-horizontal: 18px;
  padding-vertical: 11px;
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
  font-size: ${RFValue(13.5)}px;
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
`;
