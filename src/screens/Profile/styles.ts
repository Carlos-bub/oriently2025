import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultTheme } from "styled-components/native";
import theme from "src/global/styles/theme";
import { FontAwesome } from "@expo/vector-icons";

export const Container = styled.View`
  flex: 1;
  background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  padding: ${RFValue(20)}px;
`;

export const Header = styled.View`
  margin-bottom: ${RFValue(20)}px;
`;

export const Title = styled.Text`
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(22)}px;
  font-weight: bold;
  margin-top: ${RFValue(30)}px;
`;

export const Subtitle = styled.Text`
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(12)}px;
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.text_light};
`;

export const DateBox = styled.View`
width: ${RFValue(130)}px;
  flex-direction: row;
  align-items: center;
  background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.primary};
  padding: ${RFValue(10)}px;
  border-radius: ${RFValue(8)}px;
  margin-top: ${RFValue(30)}px;
`;

export const IconBox = styled( FontAwesome )`
  margin-right: ${RFValue(10)}px;
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  font-size: ${ RFValue(16)}px;
`;

export const DateText = styled.Text`
  font-size: ${RFValue(14)}px;
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  font-family: ${theme.fonts.Subtituloslight};
`;

export const ScheduleCard = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.boxprofile};
  padding: ${RFValue(15)}px;
  border-radius: ${RFValue(10)}px;
  margin-top: ${RFValue(30)}px;
`;

export const ScheduleHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${RFValue(10)}px;
`;

export const ScheduleTitle = styled.Text`
  font-size: ${RFValue(16)}px;
  font-weight: bold;
`;

export const ScheduleTime = styled.Text`
  font-size: ${RFValue(14)}px;
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.text};
`;

export const ScheduleItem = styled.View`
  margin-bottom: ${RFValue(10)}px;
`;

export const ScheduleText = styled.Text`
  font-size: ${RFValue(14)}px;
`;

export const RemoveButton = styled.Text`
  font-size: ${RFValue(12)}px;
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.primary};
  text-decoration: underline;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.text_light};
  margin: ${RFValue(10)}px 0;
`;
