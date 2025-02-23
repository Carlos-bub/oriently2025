import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultTheme } from "styled-components/native";
import theme from "src/global/styles/theme";

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  padding: 20px;
`;

export const Logo = styled.Image`
  width: ${RFValue(1000)}px;
  height: ${RFValue(300)}px;
  margin-bottom: ${RFValue(20)}px;
`;

export const Title = styled.Text`
  font-size: ${RFValue(18)}px;
  font-family: ${theme.fonts.Titulos};
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.text};
  margin-bottom: ${RFValue(20)}px;
`;

export const Buttons = styled.TouchableOpacity<{ bgColor?: string }>`
  width: 100%;
  max-width: ${RFValue(300)}px;
  height: ${RFValue(50)}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${RFValue(8)}px;
  margin-bottom: ${RFValue(10)}px;
  background-color: ${(props: { bgColor: any; }) => props.bgColor || "transparent"};

  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;

  
  elevation: 5;
`;

export const ButtonText = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${theme.fonts.Titulos};
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.text};;
  margin-left: ${RFValue(10)}px;
`;

export const Icon = styled.Image`
  width: ${RFValue(24)}px;
  height: ${RFValue(24)}px;
`;

export const FooterText = styled.Text`
  font-size: ${RFValue(10)}px;
  font-family: ${theme.fonts.Titulos};
  color: ${theme.colors.text_light};
  text-align: center;
  margin-top: ${RFValue(150)}px;
`;
