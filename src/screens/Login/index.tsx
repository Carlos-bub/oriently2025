import React, { useState, useEffect } from "react";
import { ActivityIndicator, Alert, useWindowDimensions } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

import { useAuth } from "../../contexts/AuthContext";
import {
  Container,
  ScrollContent,
  TopSection,
  BrandHeader,
  BrandRow,
  BrandIconBox,
  BrandName,
  AcademicPill,
  AcademicPillText,
  IllustrationCard,
  IllustrationLeft,
  FlowStepRow,
  FlowDotPrimary,
  FlowDotLavender,
  FlowStepText,
  FlowSubLine,
  IllustrationBadgeBox,
  AcademicIcon,
  CompassCornerBadge,
  TextBlock,
  Title,
  Subtitle,
  BottomSection,
  ActionsStack,
  GoogleButton,
  GoogleButtonText,
  DemoButton,
  DemoButtonText,
  Icon,
  FooterText,
} from "./styles";

export function LoginScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const theme = useTheme();

  const isCompact = width < 360;

  useEffect(() => {
    const checkGoogleSigninConfig = async () => {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      }).catch((error) => {
        console.error("Google Play Services não disponível", error);
      });
    };

    checkGoogleSigninConfig();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const result = await GoogleSignin.signIn();

      let userName = "";
      let userEmail = "";
      let userPhoto = "";
      let idToken: string | null = null;

      if (result.type === "success" && result.data?.user) {
        userName = result.data.user.name || "";
        userEmail = result.data.user.email || "";
        userPhoto = result.data.user.photo || "";
        idToken = result.data.idToken || null;
      }

      if (!idToken) {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken || null;
      }

      if (userName && userEmail && idToken) {
        await signIn(
          {
            name: userName,
            email: userEmail,
            photo: userPhoto,
          },
          idToken,
          false
        );

        Alert.alert("Sucesso", "Login realizado com sucesso!");
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível validar o token de autenticação do Google."
        );
      }
    } catch (error: any) {
      console.error("Erro no login com Google:", error);

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
      <ScrollContent
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          paddingTop: Math.max(insets.top, 16) + 16,
          paddingBottom: Math.max(insets.bottom, 16) + 16,
          paddingHorizontal: 24,
        }}
      >
        <TopSection>
          <BrandHeader>
            <BrandRow>
              <BrandIconBox>
                <Feather
                  name="compass"
                  size={18}
                  color={theme.colors.primary}
                />
              </BrandIconBox>
              <BrandName>Oriently</BrandName>
            </BrandRow>

            <AcademicPill>
              <AcademicPillText>Orientação TCC</AcademicPillText>
            </AcademicPill>
          </BrandHeader>

          <IllustrationCard>
            <IllustrationLeft>
              <FlowStepRow>
                <FlowDotPrimary />
                <FlowStepText>Escolha data e horário</FlowStepText>
              </FlowStepRow>
              <FlowSubLine />
              <FlowStepRow>
                <FlowDotLavender />
                <FlowStepText>Confirme sua orientação</FlowStepText>
              </FlowStepRow>
            </IllustrationLeft>

            <IllustrationBadgeBox>
              <AcademicIcon name="school-outline" />
              <CompassCornerBadge>
                <Feather name="compass" size={14} color="#FFFFFF" />
              </CompassCornerBadge>
            </IllustrationBadgeBox>
          </IllustrationCard>

          <TextBlock>
            <Title isCompact={isCompact}>Seu TCC, no caminho certo.</Title>
            <Subtitle>
              Organize suas orientações, agende reuniões e acompanhe cada etapa.
            </Subtitle>
          </TextBlock>
        </TopSection>

        <BottomSection>
          <ActionsStack>
            <GoogleButton
              activeOpacity={0.85}
              onPress={handleGoogleSignIn}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Continuar com Google"
              accessibilityHint="Autentica com sua conta Google para acessar suas reuniões"
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <Icon source={require("../../../assets/google.png")} />
              )}
              <GoogleButtonText>
                {isSubmitting ? "Conectando..." : "Continuar com Google"}
              </GoogleButtonText>
            </GoogleButton>

            <DemoButton
              activeOpacity={0.82}
              disabled={isSubmitting}
              onPress={() => {
                signIn(
                  {
                    name: "Visitante Demo",
                    email: "teste@example.com",
                    photo: "",
                  },
                  null,
                  true
                );
              }}
              accessibilityRole="button"
              accessibilityLabel="Explorar modo demo"
              accessibilityHint="Entra no aplicativo em modo de demonstração"
            >
              <Feather
                name="compass"
                size={16}
                color={theme.colors.primary_dark}
              />
              <DemoButtonText>Explorar modo demo</DemoButtonText>
            </DemoButton>
          </ActionsStack>

          <FooterText>
            Ao continuar, você concorda com os Termos de Uso e Política de
            Privacidade.
          </FooterText>
        </BottomSection>
      </ScrollContent>
    </Container>
  );
}

export default LoginScreen;
