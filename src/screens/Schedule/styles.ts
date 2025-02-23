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
margin-top: 25px;
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
