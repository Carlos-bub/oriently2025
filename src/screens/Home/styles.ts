// styles.ts
import styled from 'styled-components/native';
import { DefaultTheme } from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-style: italic;
  font-family: ${(props: { theme: DefaultTheme }) => props.theme.fonts.Titulos};
`;