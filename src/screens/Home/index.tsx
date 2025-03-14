import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  UserIcon,
  HeaderTextWrapper,
  Greenting,
  Hello,
  LogoutButton,
  LogoutIcon,
  TextWrapper,
  TitleHome,
  TitleHome2,
  Subtitle,
  Subtitle2,
  ButtonWrapper,
} from "./styles";
import { Button } from "../../components/Button";

export function Home() {
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };
  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <UserIcon name="user-circle"></UserIcon>
            <HeaderTextWrapper>
              <Greenting>Olá</Greenting>
              <Hello>Usuário</Hello>
            </HeaderTextWrapper>
          </UserInfo>
          <LogoutButton onPress={handleLogout}>
            <LogoutIcon name="logout"></LogoutIcon>
          </LogoutButton>
        </UserWrapper>
      </Header>

      <TextWrapper>
        <TitleHome>Bem-vindo(a)</TitleHome>
        <TitleHome2>ao Oriently!</TitleHome2>
        <Subtitle>Fique livre das complicações e</Subtitle>
        <Subtitle2>organize tudo no seu tempo.</Subtitle2>
      </TextWrapper>

      <ButtonWrapper>
        <Button
          title="Agendar"
          iconName="calendar"
          onPress={() => navigation.navigate("Schedule")}
        />
        <Button
          title="Visualizar Agenda"
          iconName="eye"
          onPress={() => navigation.navigate("Profile")}
        />
      </ButtonWrapper>
    </Container>
  );
}
