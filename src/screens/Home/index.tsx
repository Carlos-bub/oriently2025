import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image, Alert } from "react-native";
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
  UserPhoto,
} from "./styles";
import { Button } from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";

export function Home() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    // Evitar cliques múltiplos
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      console.log("Iniciando processo de logout...");
      
      // Usar o contexto para fazer logout
      await signOut();
      
      console.log("Logout realizado com sucesso");
    } catch (error) {
      console.error("Erro no processo de logout:", error);
      
      // Em caso de erro
      Alert.alert(
        "Aviso",
        "Ocorreu um erro ao fazer logout, por favor tente novamente."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            {user?.photo ? (
              <UserPhoto source={{ uri: user.photo }} />
            ) : (
              <UserIcon name="account-circle" />
            )}
            <HeaderTextWrapper>
              <Greenting>Olá</Greenting>
              <Hello>{user?.name ? user.name.split(" ")[0] : ""}</Hello>
            </HeaderTextWrapper>
          </UserInfo>
          <LogoutButton onPress={handleLogout} disabled={isLoggingOut}>
            <LogoutIcon name="logout" />
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
