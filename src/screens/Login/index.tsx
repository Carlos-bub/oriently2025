import React, { useState, useEffect } from "react";
import { ActivityIndicator, useWindowDimensions } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

import { useAuth } from "../../contexts/AuthContext";
import { useDialog } from "../../contexts/DialogContext";
import {
  Container,
  ScrollContent,
  MainColumn,
  BrandHeader,
  BrandBadgeBox,
  BrandNeedleGroup,
  BrandNeedleNorth,
  BrandNeedleSouth,
  BrandNeedlePivot,
  BrandTitleRow,
  BrandTitle,
  ProPill,
  ProPillText,
  BrandEyebrow,
  HeroCard,
  GlowTopRight,
  GlowBottomLeft,
  TrailDot,
  MilestoneNode,
  CompassOuterRing,
  CompassInnerDisk,
  CardinalDot,
  HeroNeedleGroup,
  HeroNeedleNorth,
  HeroNeedleSouth,
  HeroNeedleCenter,
  FloatingStatusCardTop,
  FloatingCardIconBlue,
  FloatingStatusCardBottom,
  FloatingCardIconEmerald,
  FloatingCardTextGroup,
  FloatingCardMeta,
  FloatingCardTitle,
  ValuePropSection,
  JourneyPill,
  JourneyPillText,
  Title,
  Subtitle,
  ProgressDotsRow,
  ProgressDotActive,
  ProgressDotMuted,
  ActionsStack,
  GoogleButton,
  GoogleButtonLeft,
  GoogleButtonText,
  DemoButton,
  DemoButtonText,
  Icon,
  FooterText,
  FooterLinkText,
} from "./styles";

const TRAJECTORY_DOTS = [
  { leftPct: 11, topPct: 72, color: "#93c5fd" },
  { leftPct: 18, topPct: 68, color: "#93c5fd" },
  { leftPct: 26, topPct: 64, color: "#a5b4fc" },
  { leftPct: 34, topPct: 58, color: "#a5b4fc" },
  { leftPct: 62, topPct: 42, color: "#a5b4fc" },
  { leftPct: 70, topPct: 36, color: "#93c5fd" },
  { leftPct: 78, topPct: 31, color: "#93c5fd" },
  { leftPct: 86, topPct: 27, color: "#93c5fd" },
];

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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingTop: Math.max(insets.top, 16) + 8,
          paddingBottom: Math.max(insets.bottom, 16) + 12,
          paddingHorizontal: 24,
        }}
      >
        <MainColumn>
          <BrandHeader>
            <BrandBadgeBox accessible={false}>
              <BrandNeedleGroup>
                <BrandNeedleNorth />
                <BrandNeedleSouth />
                <BrandNeedlePivot />
              </BrandNeedleGroup>
            </BrandBadgeBox>

            <BrandTitleRow>
              <BrandTitle>Oriently</BrandTitle>
              <ProPill>
                <ProPillText>PRO</ProPillText>
              </ProPill>
            </BrandTitleRow>

            <BrandEyebrow>Em direção ao TCC</BrandEyebrow>
          </BrandHeader>

          <HeroCard isShortScreen={isShortScreen} accessible={false}>
            <GlowTopRight />
            <GlowBottomLeft />

            {TRAJECTORY_DOTS.map((dot, index) => (
              <TrailDot
                key={index}
                leftPct={dot.leftPct}
                topPct={dot.topPct}
                color={dot.color}
              />
            ))}

            <MilestoneNode leftPct={7} topPct={73} bgColor="#258BFF" />
            <MilestoneNode leftPct={89} topPct={23} bgColor="#7C72E8" />

            <CompassOuterRing isShortScreen={isShortScreen}>
              <CompassInnerDisk isShortScreen={isShortScreen}>
                <CardinalDot top={7} />
                <CardinalDot bottom={7} />
                <CardinalDot left={7} />
                <CardinalDot right={7} />

                <HeroNeedleGroup>
                  <HeroNeedleNorth />
                  <HeroNeedleSouth />
                  <HeroNeedleCenter />
                </HeroNeedleGroup>
              </CompassInnerDisk>
            </CompassOuterRing>

            <FloatingStatusCardTop>
              <FloatingCardIconBlue>
                <Feather name="calendar" size={13} color="#005bb1" />
              </FloatingCardIconBlue>
              <FloatingCardTextGroup>
                <FloatingCardMeta>17 NOV • 14:30</FloatingCardMeta>
                <FloatingCardTitle>Orientação Ativa</FloatingCardTitle>
              </FloatingCardTextGroup>
            </FloatingStatusCardTop>

            <FloatingStatusCardBottom>
              <FloatingCardIconEmerald>
                <Feather name="check-circle" size={13} color="#059669" />
              </FloatingCardIconEmerald>
              <FloatingCardTextGroup>
                <FloatingCardTitle>Capítulo 2</FloatingCardTitle>
                <FloatingCardMeta>Validado pelo orientador</FloatingCardMeta>
              </FloatingCardTextGroup>
            </FloatingStatusCardBottom>
          </HeroCard>

          <ValuePropSection>
            <JourneyPill>
              <Feather name="compass" size={12} color="#023cad" />
              <JourneyPillText>Jornada acadêmica</JourneyPillText>
            </JourneyPill>

            <Title isCompact={isCompact}>Seu TCC, no caminho certo.</Title>
            <Subtitle>
              Organize suas orientações acadêmicas, agende reuniões com
              facilidade e acompanhe cada etapa do seu projeto rumo à aprovação.
            </Subtitle>

            <ProgressDotsRow accessible={false}>
              <ProgressDotActive />
              <ProgressDotMuted />
              <ProgressDotMuted />
            </ProgressDotsRow>
          </ValuePropSection>

          <ActionsStack>
            <GoogleButton
              activeOpacity={0.85}
              onPress={handleGoogleSignIn}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Continuar com Google"
              accessibilityHint="Autentica com sua conta Google para acessar suas reuniões"
            >
              <GoogleButtonLeft>
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : (
                  <Icon source={require("../../../assets/google.png")} />
                )}
                <GoogleButtonText>
                  {isSubmitting ? "Conectando..." : "Continuar com Google"}
                </GoogleButtonText>
              </GoogleButtonLeft>

              <Feather name="arrow-right" size={18} color="#64748B" />
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
              <MaterialCommunityIcons
                name="creation"
                size={16}
                color="#023cad"
              />
              <DemoButtonText>Explorar modo demo</DemoButtonText>
            </DemoButton>
          </ActionsStack>

          <FooterText>
            Ao continuar, você concorda com os{" "}
            <FooterLinkText>Termos de Uso</FooterLinkText> e{" "}
            <FooterLinkText>Política de Privacidade</FooterLinkText>.
          </FooterText>
        </MainColumn>
      </ScrollContent>
    </Container>
  );
}

export default LoginScreen;
