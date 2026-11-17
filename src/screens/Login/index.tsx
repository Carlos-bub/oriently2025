import React, { useState, useEffect } from "react";
import { ActivityIndicator, useWindowDimensions } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

import { useAuth } from "../../contexts/AuthContext";
import { useDialog } from "../../contexts/DialogContext";
import { AcademicBadge, BrandMark } from "../../components/AcademicFlow";
import {
  Container,
  ScrollContent,
  MainColumn,
  BrandHeader,
  HeroScene,
  ConcentricArcOuter,
  ConcentricArcInner,
  TrajectoryTrackLine,
  WaypointDotBlue,
  WaypointDotLavender,
  FloatingCalendarCard,
  FloatingCalendarHeader,
  CalendarRingDot,
  FloatingCalendarGrid,
  GridRow,
  GridCell,
  FloatingOrientationCard,
  OrientationCardHeader,
  OrientationPill,
  OrientationPillText,
  AcademicIconSmall,
  SkeletonLineShort,
  SkeletonLineLong,
  CenterCompassRing,
  CenterCompassBadge,
  TextBlock,
  Title,
  Subtitle,
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
  const { showDialog } = useDialog();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const theme = useTheme();

  const isCompact = width < 360;
  const isShortScreen = height < 680;

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

        showDialog({
          variant: "success",
          title: "Login realizado!",
          message: `Bem-vindo(a), ${userName.split(" ")[0]}.`,
        });
      } else {
        showDialog({
          variant: "danger",
          title: "Erro de autenticação",
          message:
            "Não foi possível validar o token de autenticação do Google.",
        });
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

      showDialog({
        variant: "danger",
        title: "Erro de Login",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <ScrollContent
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingTop: Math.max(insets.top, 16) + 12,
          paddingBottom: Math.max(insets.bottom, 16) + 12,
          paddingHorizontal: 24,
        }}
      >
        <MainColumn>
          <BrandHeader>
            <BrandMark showJourneySignature />
            <AcademicBadge label="Em direção ao TCC" />
          </BrandHeader>

          <HeroScene isShortScreen={isShortScreen} accessible={false}>
            <ConcentricArcOuter />
            <ConcentricArcInner />
            <TrajectoryTrackLine />
            <WaypointDotBlue />
            <WaypointDotLavender />

            <FloatingCalendarCard>
              <FloatingCalendarHeader>
                <CalendarRingDot />
                <CalendarRingDot />
              </FloatingCalendarHeader>
              <FloatingCalendarGrid>
                <GridRow>
                  <GridCell />
                  <GridCell active />
                  <GridCell />
                </GridRow>
                <GridRow>
                  <GridCell />
                  <GridCell />
                  <GridCell />
                </GridRow>
              </FloatingCalendarGrid>
            </FloatingCalendarCard>

            <FloatingOrientationCard>
              <OrientationCardHeader>
                <OrientationPill>
                  <OrientationPillText>TCC</OrientationPillText>
                </OrientationPill>
                <AcademicIconSmall name="school-outline" />
              </OrientationCardHeader>
              <SkeletonLineShort />
              <SkeletonLineLong />
            </FloatingOrientationCard>

            <CenterCompassRing>
              <CenterCompassBadge>
                <Feather name="compass" size={17} color="#FFFFFF" />
              </CenterCompassBadge>
            </CenterCompassRing>
          </HeroScene>

          <TextBlock>
            <Title isCompact={isCompact}>Seu TCC, no caminho certo.</Title>
            <Subtitle>
              Organize suas orientações, agende reuniões e acompanhe cada etapa.
            </Subtitle>
          </TextBlock>

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
                size={15}
                color={theme.colors.editorial_navy}
              />
              <DemoButtonText>Explorar modo demo</DemoButtonText>
            </DemoButton>
          </ActionsStack>

          <FooterText>
            Ao continuar, você concorda com os Termos de Uso e Política de
            Privacidade.
          </FooterText>
        </MainColumn>
      </ScrollContent>
    </Container>
  );
}

export default LoginScreen;
