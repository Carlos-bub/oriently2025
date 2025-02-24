import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { DefaultTheme } from 'styled-components';
import theme from 'src/global/styles/theme';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
  background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  padding: 20px;
`;

export const TitleWrapper = styled.View`
align-items: center;
`

export const Title = styled.Text`
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.text};
    font-family: ${theme.fonts.Titulos};
    font-size: ${ RFValue(30)}px;
    margin-top: ${getStatusBarHeight() + RFValue(20)}px;
    justify-content: center;
    align-items: center;
`
export const CalendarWrapper = styled.View`
 margin-top: ${RFValue(25)}px;
  border-radius: ${RFValue(12)}px;
  overflow: hidden;
  elevation: 3;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
`

export const ScheduleListWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 15px;
`;

export const ScheduleList = styled(FlatList as new () => FlatList<string>)`
  flex-grow: 0; 
`;

export const ScheduleItem = styled.TouchableOpacity`
  background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.boxreserv};
  padding: ${RFValue(12)}px;
  border-radius: ${RFValue(8)}px;
  margin-bottom: ${RFValue(20)}px;
  margin-right: ${RFValue(12)}px;
  align-items: center;
  justify-content: center;
  width: 30%; 
`;

export const ScheduleText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.text};
  font-size: ${RFValue(16)}px;
  font-family: ${theme.fonts.buttons};
`;

export const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.View`
  background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  padding: ${RFValue(20)}px;
  border-radius: ${RFValue(10)}px;
  align-items: center;
  width: 80%;
`;

export const ModalText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.text};
  font-size: ${RFValue(16)}px;
  font-family: ${theme.fonts.Titulos};
  margin-bottom: ${RFValue(20)}px;
  text-align: center;
`;

export const ModalButtonContainer = styled.View`
  flex-direction: row;
  margin-top: ${RFValue(10)}px;
`;

export const ModalButton = styled.TouchableOpacity`
  padding: ${RFValue(10)}px ${RFValue(20)}px;
  background-color: ${(props: { theme: DefaultTheme; isConfirm?: boolean }) =>
    props.isConfirm ? props.theme.colors.primary : props.theme.colors.cancel};
  border-radius: ${RFValue(5)}px;
  margin-horizontal: ${RFValue(10)}px;
`;

export const ModalButtonText = styled.Text`
  color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  font-family: ${theme.fonts.buttons};
  font-size: ${RFValue(14)}px;
`;