import React, { useState, useEffect } from "react";
import {
  Container,
  Logo,
  Title,
  Buttons,
  ButtonText,
  Icon,
  FooterText,
} from "./styles";
import { useNavigation } from "@react-navigation/native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

// Tipagem para navegação
type NavigationProps = {
  navigate: (screen: string, params?: any) => void;
  reset: (config: { index: number; routes: { name: string }[] }) => void;
};

// Interface para o formato da resposta do GoogleSignin
interface GoogleSignInResponse {
  type: string;
  data: {
    idToken: string;
    serverAuthCode: string;
    scopes: string[];
    user: {
      id: string;
      name: string;
      email: string;
      photo: string;
      givenName: string;
      familyName: string;
    };
  };
}

export function LoginScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation<NavigationProps>();
  const { signIn } = useAuth();

  // Verificar o status de configuração do GoogleSignin quando o componente for montado
  useEffect(() => {
    const checkGoogleSigninConfig = async () => {
      const isConfigured = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      })
        .then(() => true)
        .catch((error) => {
          console.error("Google Play Services não disponível", error);
          return false;
        });

      console.log("GoogleSignin configurado:", isConfigured);
    };

    checkGoogleSigninConfig();
  }, []);

  const handleGoogleSignIn = async () => {
    console.log("Iniciando login com Google...");
    try {
      setIsSubmitting(true);

      // Verificar se o Google Play Services está disponível
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      console.log("Google Play Services disponível");

      // Realizar o login
      const result = await GoogleSignin.signIn();
      console.log(
        "Login com Google bem-sucedido - RESPOSTA COMPLETA:",
        JSON.stringify(result)
      );

      // Acessando os dados usando a estrutura correta
      let userName = "";
      let userEmail = "";
      let userPhoto = "";

      // Convertendo para tipo correto
      // Verifica se result tem user diretamente ou dentro de data
      if (result.user) {
        // Nova estrutura do GoogleSignin
        userName = result.user.name || "";
        userEmail = result.user.email || "";
        userPhoto = result.user.photo || "";
      } else {
        // Estrutura antiga (com type e data)
        const googleResponse = result as unknown as GoogleSignInResponse;

        if (
          googleResponse.type === "success" &&
          googleResponse.data &&
          googleResponse.data.user
        ) {
          userName = googleResponse.data.user.name || "";
          userEmail = googleResponse.data.user.email || "";
          userPhoto = googleResponse.data.user.photo || "";
        }
      }

      console.log("Dados extraídos do usuário:", {
        userName,
        userEmail,
        userPhoto,
      });

      if (userName && userEmail) {
        await signIn({
          name: userName,
          email: userEmail,
          photo: userPhoto,
        });

        Alert.alert("Sucesso", "Login realizado com sucesso!");
      } else {
        console.error("Não foi possível obter dados do usuário:", result);
        Alert.alert("Erro", "Não foi possível obter os dados do usuário");
      }
    } catch (error: any) {
      console.error("Erro no login com Google:", error);

      // Tratar erros específicos do GoogleSignin
      let errorMessage = "Ocorreu um erro ao tentar fazer login";

      if (error.code) {
        switch (error.code) {
          case "SIGN_IN_CANCELLED":
            errorMessage = "Login cancelado pelo usuário";
            break;
          case "IN_PROGRESS":
            errorMessage = "Operação de login já está em andamento";
            break;
          case "PLAY_SERVICES_NOT_AVAILABLE":
            errorMessage =
              "Google Play Services não disponível ou desatualizado";
            break;
          default:
            errorMessage = `Erro ao fazer login: ${
              error.message || error.code
            }`;
            break;
        }
      }

      Alert.alert("Erro de Login", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Logo
        source={require("../../../assets/splash.png")}
        resizeMode="contain"
      />
      <Title>Faça Login para Começar</Title>

      <Buttons
        bgColor="#dddbdb"
        onPress={handleGoogleSignIn}
        disabled={isSubmitting}
      >
        <Icon source={require("../../../assets/google.png")} />
        <ButtonText color="#000">
          Continuar com Google{isSubmitting ? "..." : ""}
        </ButtonText>
      </Buttons>

      <Buttons
        bgColor="#dddbdb"
        onPress={() => {
          // contexto para login de teste
          signIn({
            name: "Usuário de Teste",
            email: "teste@example.com",
            photo: "",
          });
        }}
      >
        <Icon
          source={require("../../../assets/apple-logo.png")}
          resizeMode="contain"
        />
        <ButtonText color="#ffffff">Continuar com Apple</ButtonText>
      </Buttons>

      <FooterText>
        Ao continuar, você aceita nossos Termos & Condições
      </FooterText>
    </Container>
  );
}

export default LoginScreen;
