import styled from 'styled-components/native';
import { DefaultTheme } from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';
import theme from '../../global/styles/theme';

export const ButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.primary};
  padding: ${RFValue(12)}px;
  border-radius: ${RFValue(8)}px;
  width: 80%;
  max-width: ${RFValue(300)}px;
  position: relative; 
`;

export const ButtonIcon = styled(Feather)`
  font-size: ${RFValue(20)}px;
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  margin-right: ${RFValue(12)}px;
  position: absolute; 
  left: ${RFValue(16)}px;
`;

export const ButtonText = styled.Text`
  font-size: ${RFValue(16)}px;
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  font-family: ${theme.fonts.buttons};
  text-align: center; 
  flex: 1; 
`;

