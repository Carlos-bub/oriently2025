// styles.ts
import styled from 'styled-components/native';
import { DefaultTheme } from 'styled-components/native';
import theme from '../../global/styles/theme';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

import { MaterialIcons  } from '@expo/vector-icons';
import { FontAwesome  } from '@expo/vector-icons';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export const Container = styled.View`
  flex: 1;
  background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
`;

  export const Header = styled.View`
      width: 100%;
      height: ${RFPercentage(20)}px;
      background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.primary};
      //align-items: center;
      //justify-content: center;
    `;

  export const UserWrapper = styled.View`
    flex-direction: row;
    padding: 0 25px;
    align-items: center;
    justify-content: space-between;
    margin-top: ${getStatusBarHeight() + RFValue(45)}px;
  `;

  export const UserInfo = styled.View`
    flex-direction: row;
    align-items: center;
  `;

  export const UserIcon = styled(FontAwesome )`
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
    font-size: ${ RFValue(40)}px;
    
  `;

  export const HeaderTextWrapper = styled.View`
    margin-left: 15;
  `;

  export const Greenting = styled.Text`
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
    font-family: ${theme.fonts.buttons};
    font-size: ${ RFValue(16)}px;
    line-height: ${ RFValue(24)}px;
  `;

  export const Hello = styled.Text`
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
    font-family: ${theme.fonts.Subtitulos};
    font-size: ${ RFValue(20)}px;
    line-height: ${ RFValue(24)}px;
  `;

  export const LogoutButton = styled.View``;

  export const LogoutIcon = styled(MaterialIcons)`
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
    font-size: ${ RFValue(30)}px;
  `;
