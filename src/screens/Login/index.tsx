import React from "react";
import { Container, Logo, Title, Buttons, ButtonText, Icon, FooterText } from "./styles";

const LoginScreen: React.FC = () => {
  return (
    <Container>
      
      <Logo source={require("../../../assets/splash.png")} resizeMode="contain" />
      <Title>
        Faça Login para Começar
      </Title>

      <Buttons bgColor="#ffffff">
        <Icon source={require("../../../assets/google.png")} />
        <ButtonText color="#000">
          Continuar com Google
        </ButtonText>
      </Buttons>

      <Buttons bgColor="#ffffff">
        <Icon source={require("../../../assets/apple-logo.png")} resizeMode="contain" />
        <ButtonText color="#ffffff">
          Continuar com Apple
        </ButtonText>
      </Buttons>

      <FooterText>Ao continuar, você aceita nossos Termos & Condições</FooterText>
    </Container>
  );
};

export default LoginScreen;
