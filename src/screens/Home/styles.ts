// styles.ts
import styled from 'styled-components/native';
import { DefaultTheme } from 'styled-components/native';
import theme from '../../global/styles/theme';

export const Container = styled.View`
  flex: 1;
  background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-size: 30px;
  font-family: ${theme.fonts.Titulos};
`;