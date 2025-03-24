import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultTheme } from "styled-components/native";
import theme from "src/global/styles/theme";
import { FontAwesome } from "@expo/vector-icons";

export const Container = styled.View`
  flex: 1;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.background};
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
  width: ${RFValue(160)}px;
  flex-direction: row;
  align-items: center;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.primary};
  padding: ${RFValue(10)}px;
  border-radius: ${RFValue(8)}px;
  margin-bottom: ${RFValue(15)}px;
`;

export const IconBox = styled(FontAwesome)`
  margin-right: ${RFValue(10)}px;
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  font-size: ${RFValue(16)}px;
`;

export const DateText = styled.Text`
  font-size: ${RFValue(14)}px;
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  font-family: ${theme.fonts.Subtituloslight};
`;

export const ScheduleCard = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.boxprofile};
  padding: ${RFValue(15)}px;
  border-radius: ${RFValue(10)}px;
  margin-bottom: ${RFValue(10)}px;
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
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.primary};
  font-weight: bold;
  margin-right: ${RFValue(5)}px;
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
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.text_light};
  margin: ${RFValue(10)}px 0;
`;

export const TimeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(5)}px;
`;

export const Alert = styled.Text`
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.cancel};
`;

export { FontAwesome };

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${RFValue(20)}px;
`;

export const EmptyText = styled.Text`
  font-size: ${RFValue(16)}px;
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.text_light};
  text-align: center;
`;

export const CancelButton = styled.TouchableOpacity`
  padding-horizontal: ${RFValue(15)}px;
  padding-vertical: ${RFValue(8)}px;
  border-radius: ${RFValue(5)}px;
  margin-left: ${RFValue(50)}px;
  background-color: ${(props: { theme: DefaultTheme }) =>
    props.theme.colors.cancel};
`;

export const CancelButtonText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  font-size: ${RFValue(14)}px;
  font-weight: bold;
`;

export const CancelReasonText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.cancel};
  font-size: ${RFValue(12)}px;
`;
