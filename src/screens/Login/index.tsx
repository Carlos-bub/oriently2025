import React from "react";
import { Container, Logo, Title, Buttons, ButtonText, Icon, FooterText } from "./styles";
import { useNavigation } from "@react-navigation/native";

export function LoginScreen() {
  const navigation = useNavigation();
  return (
    <Container>
      
      <Logo source={require("../../../assets/splash.png")} resizeMode="contain" />
      <Title>
        Faça Login para Começar
      </Title>

      <Buttons bgColor="#ffffff" onPress={() => navigation.navigate("AppRoutes")}>
        <Icon source={require("../../../assets/google.png")} />
        <ButtonText color="#000">
          Continuar com Google
        </ButtonText>
      </Buttons>

      <Buttons bgColor="#ffffff" onPress={() => navigation.navigate("AppRoutes")}>
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
