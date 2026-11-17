import styled from "styled-components/native";
import { DefaultTheme } from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import theme from "../../global/styles/theme";

/* ── Brand Mark ── */
export const BrandWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const BrandCompassBox = styled.View`
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

export const BrandTextGroup = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 7px;
`;

export const BrandWordmark = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  font-family: ${theme.fonts.Titulos};
  font-size: ${RFValue(17.5)}px;
  letter-spacing: -0.4px;
`;

export const BrandJourneySignature = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 3px;
`;

export const SignatureDotStart = styled.View`
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_lavender};
`;

export const SignatureSegment = styled.View`
  width: 10px;
  height: 1.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.border};
`;

export const SignatureDotEnd = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
`;

/* ── Academic Context Badge ── */
export const BadgePill = styled.View<{ onDark?: boolean }>`
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 10px;
  background-color: ${(props: {
    theme: DefaultTheme;
    onDark?: boolean;
  }) =>
    props.onDark
      ? "rgba(255, 255, 255, 0.18)"
      : props.theme.colors.boxprofile};
  border-width: ${(props: { onDark?: boolean }) =>
    props.onDark ? "0px" : "1px"};
  border-color: #dce8fd;
`;

export const BadgeLabel = styled.Text<{ onDark?: boolean }>`
  color: ${(props: { theme: DefaultTheme; onDark?: boolean }) =>
    props.onDark
      ? props.theme.colors.background
      : props.theme.colors.editorial_navy};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(10)}px;
`;

/* ── Journey Checkpoint Track ── */
export const CheckpointTrack = styled.View`
  width: 22px;
  align-items: center;
  margin-right: 10px;
  padding-top: 14px;
`;

export const CheckpointDotOuter = styled.View<{ waiting?: boolean }>`
  width: 15px;
  height: 15px;
  border-radius: 7.5px;
  background-color: ${(props: {
    theme: DefaultTheme;
    waiting?: boolean;
  }) =>
    props.waiting
      ? props.theme.colors.background
      : props.theme.colors.boxprofile};
  border-width: 2px;
  border-color: ${(props: { theme: DefaultTheme; waiting?: boolean }) =>
    props.waiting
      ? props.theme.colors.editorial_lavender
      : props.theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

export const CheckpointDotInner = styled.View<{ waiting?: boolean }>`
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${(props: {
    theme: DefaultTheme;
    waiting?: boolean;
  }) =>
    props.waiting
      ? props.theme.colors.editorial_lavender
      : props.theme.colors.primary};
  opacity: ${(props: { waiting?: boolean }) => (props.waiting ? 0.55 : 1)};
`;

export const CheckpointLine = styled.View<{ waiting?: boolean }>`
  flex: 1;
  width: 1.5px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.border};
  margin-top: 6px;
  margin-bottom: 6px;
  opacity: ${(props: { waiting?: boolean }) => (props.waiting ? 0.65 : 1)};
`;

/* ── Editorial Date Block ── */
export const DateBlock = styled.View`
  width: 48px;
  padding-vertical: 7px;
  border-radius: 13px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.border};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const DateBlockDay = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_navy};
  font-family: ${theme.fonts.Titulos};
  font-size: ${RFValue(16)}px;
  line-height: ${RFValue(20)}px;
`;

export const DateBlockMonth = styled.Text`
  color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.editorial_lavender};
  font-family: ${theme.fonts.Subtitulos};
  font-size: ${RFValue(10)}px;
  text-transform: uppercase;
`;
