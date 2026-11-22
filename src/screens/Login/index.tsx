import React, { useState, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
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
  SlidePage,
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
  MiniScheduleSheet,
  MiniScheduleHeader,
  MiniScheduleMonth,
  MiniSlotRow,
  MiniSlotChip,
  MiniSlotChipText,
  TimelineSheet,
  TimelineStepRow,
  TimelineStepBadge,
  TimelineStepLabel,
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
  GoogleButtonArrow,
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

const SLIDES = [
  {
    key: "journey",
    pillIcon: "compass" as const,
    pillLabel: "Jornada acadêmica",
    title: "Seu TCC, no caminho certo.",
    subtitle:
      "Organize suas orientações acadêmicas, agende reuniões com facilidade e acompanhe cada etapa do seu projeto rumo à aprovação.",
  },
  {
    key: "scheduling",
    pillIcon: "calendar" as const,
    pillLabel: "Agendamento ágil",
    title: "Marque reuniões em segundos.",
    subtitle:
      "Consulte os horários livres do seu orientador em tempo real e confirme seu encontro sem trocas intermináveis de e-mail.",
  },
  {
    key: "milestones",
    pillIcon: "flag" as const,
    pillLabel: "Marcos do projeto",
    title: "Cada orientação é um passo à frente.",
    subtitle:
      "Visualize suas próximas sessões, pautas de preparo e histórico completo em um só lugar até a defesa final.",
  },
];

export function LoginScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<ScrollView>(null);

  const { signIn } = useAuth();
  const { showDialog } = useDialog();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const theme = useTheme();

  const isCompact = width < 360;
  const isShortScreen = height < 680;
  const slideWidth = Math.min(width - 48, 400);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % SLIDES.length;
        carouselRef.current?.scrollTo({
          x: next * slideWidth,
          animated: true,
        });
        return next;
      });
    }, 4200);

    return () => clearInterval(timer);
  }, [slideWidth]);

  const handleCarouselScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / slideWidth);
    if (index >= 0 && index < SLIDES.length && index !== activeSlide) {
      setActiveSlide(index);
    }
  };

  const handleSelectSlide = (index: number) => {
    setActiveSlide(index);
    carouselRef.current?.scrollTo({
      x: index * slideWidth,
      animated: true,
    });
  };

  const handleGoogleSignIn = async () => {
    const googleWebClientId = (
      process.env as Record<string, string | undefined>
    ).EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();

    if (!googleWebClientId) {
      showDialog({
        variant: "warning",
        title: "Login Google não configurado",
        message:
          "Este build de demonstração não possui credenciais OAuth configuradas. Toque em 'Explorar modo demo' para testar o aplicativo.",
      });
      return;
    }

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

  const renderHeroArtwork = (key: string) => {
    if (key === "scheduling") {
      return (
        <HeroCard isShortScreen={isShortScreen} accessible={false}>
          <GlowTopRight />
          <GlowBottomLeft />

          <MiniScheduleSheet>
            <MiniScheduleHeader>
              <MiniScheduleMonth>Novembro • 17</MiniScheduleMonth>
              <Feather name="calendar" size={14} color="#005bb1" />
            </MiniScheduleHeader>

            <MiniSlotRow>
              <MiniSlotChip>
                <MiniSlotChipText>11:00</MiniSlotChipText>
              </MiniSlotChip>
              <MiniSlotChip active>
                <MiniSlotChipText active>14:30</MiniSlotChipText>
              </MiniSlotChip>
              <MiniSlotChip>
                <MiniSlotChipText>16:00</MiniSlotChipText>
              </MiniSlotChip>
            </MiniSlotRow>
          </MiniScheduleSheet>

          <FloatingStatusCardBottom>
            <FloatingCardIconEmerald>
              <Feather name="check" size={13} color="#059669" />
            </FloatingCardIconEmerald>
            <FloatingCardTextGroup>
              <FloatingCardTitle>Horário confirmado</FloatingCardTitle>
              <FloatingCardMeta>Google Meet • 30 min</FloatingCardMeta>
            </FloatingCardTextGroup>
          </FloatingStatusCardBottom>
        </HeroCard>
      );
    }

    if (key === "milestones") {
      return (
        <HeroCard isShortScreen={isShortScreen} accessible={false}>
          <GlowTopRight />
          <GlowBottomLeft />

          <TimelineSheet>
            <TimelineStepRow>
              <TimelineStepBadge tone="done">
                <Feather name="check" size={12} color="#059669" />
              </TimelineStepBadge>
              <TimelineStepLabel>Revisão Bibliográfica</TimelineStepLabel>
            </TimelineStepRow>

            <TimelineStepRow>
              <TimelineStepBadge tone="active">
                <Feather name="compass" size={12} color="#FFFFFF" />
              </TimelineStepBadge>
              <TimelineStepLabel>Metodologia (Em foco)</TimelineStepLabel>
            </TimelineStepRow>

            <TimelineStepRow>
              <TimelineStepBadge tone="next">
                <Feather name="flag" size={11} color="#514fb5" />
              </TimelineStepBadge>
              <TimelineStepLabel muted>Defesa Final</TimelineStepLabel>
            </TimelineStepRow>
          </TimelineSheet>

          <FloatingStatusCardTop>
            <FloatingCardIconBlue>
              <Feather name="trending-up" size={13} color="#005bb1" />
            </FloatingCardIconBlue>
            <FloatingCardTextGroup>
              <FloatingCardMeta>ETAPA ATUAL</FloatingCardMeta>
              <FloatingCardTitle>Progresso contínuo</FloatingCardTitle>
            </FloatingCardTextGroup>
          </FloatingStatusCardTop>
        </HeroCard>
      );
    }

    return (
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
    );
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

          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleCarouselScrollEnd}
            scrollEventThrottle={16}
          >
            {SLIDES.map((slide) => (
              <SlidePage key={slide.key} slideWidth={slideWidth}>
                {renderHeroArtwork(slide.key)}

                <ValuePropSection>
                  <JourneyPill>
                    <Feather name={slide.pillIcon} size={12} color="#023cad" />
                    <JourneyPillText>{slide.pillLabel}</JourneyPillText>
                  </JourneyPill>

                  <Title isCompact={isCompact}>{slide.title}</Title>
                  <Subtitle>{slide.subtitle}</Subtitle>
                </ValuePropSection>
              </SlidePage>
            ))}
          </ScrollView>

          <ProgressDotsRow>
            {SLIDES.map((slide, index) => (
              <TouchableOpacity
                key={slide.key}
                activeOpacity={0.7}
                onPress={() => handleSelectSlide(index)}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                accessibilityRole="button"
                accessibilityLabel={`Slide ${index + 1} de ${SLIDES.length}`}
              >
                {activeSlide === index ? (
                  <ProgressDotActive />
                ) : (
                  <ProgressDotMuted />
                )}
              </TouchableOpacity>
            ))}
          </ProgressDotsRow>

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

              <GoogleButtonArrow>
                <Feather name="arrow-right" size={18} color="#64748B" />
              </GoogleButtonArrow>
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
