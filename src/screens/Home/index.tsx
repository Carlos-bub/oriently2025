import React, { useState, useCallback } from "react";
import { ActivityIndicator, Linking, useWindowDimensions } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

import { useAuth } from "../../contexts/AuthContext";
import { useDialog } from "../../contexts/DialogContext";
import { OrientlyTopBar } from "../../components/OrientlyTopBar";
import { getFriendlyApiErrorMessage } from "../../services/apiClient";
import {
  getUserInfo,
  getPastAndMissedEvents,
} from "../../services/calendlyService";
import { CalendlyEvent } from "../../services/types";

import {
  Container,
  Header,
  HeaderRow,
  HeaderBrandRow,
  HeaderBrandBadge,
  HeaderBrandTitle,
  HeaderActions,
  AvatarWrapper,
  UserPhoto,
  UserAvatarFallback,
  UserIcon,
  LogoutButton,
  LogoutIcon,
  ScrollContent,
  Body,
  WelcomeSection,
  DatePill,
  DatePillText,
  GreetingTitle,
  WelcomeDescription,
  HeroScheduleCard,
  HeroGlowTopRight,
  HeroGlowBottomRight,
  HeroStepPill,
  HeroStepPillText,
  HeroMiddleRow,
  HeroTextColumn,
  HeroTitle,
  HeroDescription,
  HeroIllustrationBox,
  HeroCalendarTile,
  HeroCompassCorner,
  HeroDurationCorner,
  HeroDurationCornerText,
  HeroActionPill,
  HeroActionPillText,
  SecondaryAgendaCard,
  SecondaryLeftRow,
  SecondaryIconBox,
  SecondaryTextCol,
  SecondaryTitle,
  SecondaryDescription,
  SecondaryChevronCircle,
  SectionHeaderRow,
  SectionTitleGroup,
  SectionTitle,
  SectionLinkButton,
  SectionLinkText,
  TimelineRow,
  TimelineVerticalLine,
  TimelineDotOuter,
  TimelineDotInner,
  MeetingCard,
  MeetingStatusRow,
  StatusBadge,
  StatusDot,
  StatusBadgeText,
  MeetingContextLabel,
  MeetingTitle,
  MeetingScheduleRow,
  MeetingScheduleText,
  DurationChip,
  DurationChipText,
  ModalityBox,
  ModalityLeft,
  ModalityIconBox,
  ModalityLabel,
  JoinRoomButton,
  JoinRoomButtonText,
  PartialWarningRow,
  PartialWarningText,
  StateCard,
  EmptyIllustrationRow,
  EmptyAcademicGraphic,
  EmptyAcademicIcon,
  EmptyCompassCorner,
  EmptyTextCol,
  EmptyTitle,
  EmptySubtitle,
  EmptyDivider,
  EmptyFooterAction,
  EmptyFooterText,
  CenteredStateBox,
  CenteredStateText,
  RetryButton,
  RetryButtonText,
  TipCard,
  TipIconBox,
  TipTextCol,
  TipEyebrow,
  TipBody,
} from "./styles";

export function Home() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const { showDialog } = useDialog();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [nextMeeting, setNextMeeting] = useState<CalendlyEvent | null>(null);
  const [loadingMeeting, setLoadingMeeting] = useState(true);
  const [meetingError, setMeetingError] = useState<string | null>(null);
  const [partialWarning, setPartialWarning] = useState<string | null>(null);

  const isCompactScreen = width < 360;
  const showHeroIllustration = width >= 320;
  const firstName = user?.name ? user.name.trim().split(" ")[0] : "Visitante";

  const todayEditorial = new Date().toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  });

  const loadNextMeeting = useCallback(async () => {
    if (!user?.email) {
      setNextMeeting(null);
      setLoadingMeeting(false);
      return;
    }

    try {
      setLoadingMeeting(true);
      setMeetingError(null);
      setPartialWarning(null);

      const calendlyUser = await getUserInfo();
      if (!calendlyUser) {
        setMeetingError("Não foi possível conectar ao Calendly.");
        setNextMeeting(null);
        return;
      }

      const { activeEvents, partialErrors, truncated } =
        await getPastAndMissedEvents(calendlyUser.uri, user.email);

      if (partialErrors || truncated) {
        setPartialWarning(
          truncated
            ? "Exibindo resultados parciais (limite de paginação atingido)."
            : "Algumas reuniões não puderam ser verificadas agora."
        );
      }

      if (activeEvents.length > 0) {
        const sorted = [...activeEvents].sort(
          (a, b) =>
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        setNextMeeting(sorted[0]);
      } else {
        setNextMeeting(null);
      }
    } catch (error) {
      console.error("Erro ao carregar próxima reunião:", error);
      setMeetingError(
        getFriendlyApiErrorMessage(
          error,
          "Erro ao buscar sua próxima orientação."
        )
      );
      setNextMeeting(null);
    } finally {
      setLoadingMeeting(false);
    }
  }, [user?.email]);

  useFocusEffect(
    useCallback(() => {
      loadNextMeeting();
    }, [loadNextMeeting])
  );

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Erro no processo de logout:", error);
      showDialog({
        variant: "warning",
        title: "Aviso",
        message:
          "Ocorreu um erro ao fazer logout, por favor tente novamente.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getRelativeCountdownLabel = (isoString: string) => {
    const start = new Date(isoString);
    const now = new Date();
    const startDay = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.round(
      (startDay.getTime() - today.getTime()) / 86400000
    );

    if (diffDays <= 0) return "Confirmada • Hoje";
    if (diffDays === 1) return "Confirmada • Amanhã";
    return `Confirmada • Em ${diffDays} dias`;
  };

  const formatScheduleSummary = (startIso: string, endIso?: string) => {
    const startDate = new Date(startIso);
    const datePart = startDate.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
    });
    const startTime = startDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (!endIso) {
      return {
        scheduleLabel: `${datePart} • ${startTime}`,
        durationLabel: null as string | null,
      };
    }

    const endDate = new Date(endIso);
    const endTime = endDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const durationMin = Math.round(
      (endDate.getTime() - startDate.getTime()) / 60000
    );

    return {
      scheduleLabel: `${datePart} • ${startTime} – ${endTime}`,
      durationLabel: durationMin > 0 ? `${durationMin} min` : null,
    };
  };

  const getMeetingLocationLabel = (event: CalendlyEvent): string | null => {
    if (!event.location) return null;
    if (event.location.location) return event.location.location;
    if (event.location.type === "google_conference") return "Google Meet";
    if (event.location.type === "zoom") return "Zoom";
    if (event.location.type === "microsoft_teams_conference") {
      return "Microsoft Teams";
    }
    if (event.location.join_url) return "Videoconferência";
    return null;
  };

  const handleOpenJoinUrl = async (joinUrl?: string) => {
    if (!joinUrl || !joinUrl.startsWith("https://")) {
      navigation.navigate("Profile");
      return;
    }

    try {
      const supported = await Linking.canOpenURL(joinUrl);
      if (supported) {
        await Linking.openURL(joinUrl);
      } else {
        navigation.navigate("Profile");
      }
    } catch {
      navigation.navigate("Profile");
    }
  };

  const renderNextOrientationSection = () => {
    if (loadingMeeting) {
      return (
        <StateCard>
          <CenteredStateBox>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <CenteredStateText>Consultando sua agenda...</CenteredStateText>
          </CenteredStateBox>
        </StateCard>
      );
    }

    if (meetingError) {
      return (
        <StateCard>
          <CenteredStateBox>
            <Feather
              name="alert-circle"
              size={20}
              color={theme.colors.cancel}
            />
            <CenteredStateText>{meetingError}</CenteredStateText>
            <RetryButton
              onPress={loadNextMeeting}
              accessibilityRole="button"
              accessibilityLabel="Tentar novamente"
              accessibilityHint="Recarrega os dados da próxima orientação"
            >
              <RetryButtonText>Tentar novamente</RetryButtonText>
            </RetryButton>
          </CenteredStateBox>
        </StateCard>
      );
    }

    if (!nextMeeting) {
      return (
        <TimelineRow>
          <TimelineVerticalLine />
          <TimelineDotOuter waiting>
            <TimelineDotInner />
          </TimelineDotOuter>

          <StateCard>
            <EmptyIllustrationRow>
              <EmptyAcademicGraphic>
                <EmptyAcademicIcon name="book-open-page-variant-outline" />
                <EmptyCompassCorner>
                  <Feather name="compass" size={10} color="#FFFFFF" />
                </EmptyCompassCorner>
              </EmptyAcademicGraphic>

              <EmptyTextCol>
                <EmptyTitle>
                  {partialWarning
                    ? "Agenda carregada parcialmente"
                    : "Nenhuma orientação marcada"}
                </EmptyTitle>
                <EmptySubtitle>
                  {partialWarning ||
                    "Reserve seu próximo encontro para continuar sua trajetória."}
                </EmptySubtitle>
              </EmptyTextCol>
            </EmptyIllustrationRow>

            <EmptyDivider />

            <EmptyFooterAction
              activeOpacity={0.75}
              onPress={() => navigation.navigate("Schedule")}
              accessibilityRole="button"
              accessibilityLabel="Agendar orientação agora"
              accessibilityHint="Abre a tela para agendar uma reunião"
            >
              <EmptyFooterText>Agendar agora</EmptyFooterText>
              <Feather name="arrow-right" size={15} color="#005bb1" />
            </EmptyFooterAction>
          </StateCard>
        </TimelineRow>
      );
    }

    const locationLabel = getMeetingLocationLabel(nextMeeting);
    const { scheduleLabel, durationLabel } = formatScheduleSummary(
      nextMeeting.start_time,
      nextMeeting.end_time
    );
    const hasJoinUrl = Boolean(
      nextMeeting.location?.join_url &&
        nextMeeting.location.join_url.startsWith("https://")
    );

    return (
      <TimelineRow>
        <TimelineVerticalLine />
        <TimelineDotOuter>
          <TimelineDotInner />
        </TimelineDotOuter>

        <MeetingCard
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("MeetingDetails", { event: nextMeeting })
          }
          accessibilityRole="button"
          accessibilityLabel={`Próxima orientação: ${nextMeeting.name}`}
          accessibilityHint="Toque para abrir os detalhes da orientação"
        >
          <MeetingStatusRow>
            <StatusBadge>
              <StatusDot />
              <StatusBadgeText>
                {getRelativeCountdownLabel(nextMeeting.start_time)}
              </StatusBadgeText>
            </StatusBadge>

            <MeetingContextLabel>TCC • Orientação</MeetingContextLabel>
          </MeetingStatusRow>

          <MeetingTitle numberOfLines={2}>{nextMeeting.name}</MeetingTitle>

          <MeetingScheduleRow>
            <Feather name="clock" size={14} color="#005bb1" />
            <MeetingScheduleText>{scheduleLabel}</MeetingScheduleText>
            {durationLabel && (
              <DurationChip>
                <DurationChipText>{durationLabel}</DurationChipText>
              </DurationChip>
            )}
          </MeetingScheduleRow>

          <ModalityBox>
            <ModalityLeft>
              <ModalityIconBox>
                <Feather
                  name={hasJoinUrl ? "video" : "map-pin"}
                  size={14}
                  color="#005bb1"
                />
              </ModalityIconBox>
              <ModalityLabel numberOfLines={1}>
                {locationLabel || "Detalhes na agenda"}
              </ModalityLabel>
            </ModalityLeft>

            <JoinRoomButton
              activeOpacity={0.85}
              onPress={() => handleOpenJoinUrl(nextMeeting.location?.join_url)}
              accessibilityRole="button"
              accessibilityLabel={hasJoinUrl ? "Acessar sala" : "Ver agenda"}
            >
              <JoinRoomButtonText>
                {hasJoinUrl ? "Acessar sala" : "Ver detalhes"}
              </JoinRoomButtonText>
              <Feather
                name={hasJoinUrl ? "external-link" : "arrow-right"}
                size={12}
                color="#FFFFFF"
              />
            </JoinRoomButton>
          </ModalityBox>

          {partialWarning && (
            <PartialWarningRow>
              <Feather
                name="info"
                size={12}
                color={theme.colors.editorial_muted}
              />
              <PartialWarningText numberOfLines={2}>
                {partialWarning}
              </PartialWarningText>
            </PartialWarningRow>
          )}
        </MeetingCard>
      </TimelineRow>
    );
  };

  return (
    <Container>
      <OrientlyTopBar
        showLogout
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      <ScrollContent
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 24),
        }}
      >
        <Body>
          <WelcomeSection>
            <DatePill>
              <Feather name="calendar" size={12} color="#005bb1" />
              <DatePillText>{todayEditorial}</DatePillText>
            </DatePill>

            <GreetingTitle isCompact={isCompactScreen}>
              Olá, {firstName} 👋
            </GreetingTitle>
            <WelcomeDescription>
              Vamos avançar com a sua pesquisa hoje?
            </WelcomeDescription>
          </WelcomeSection>

          <HeroScheduleCard
            activeOpacity={0.88}
            onPress={() => navigation.navigate("Schedule")}
            accessibilityRole="button"
            accessibilityLabel="Agendar reunião com orientador"
            accessibilityHint="Abre o calendário para escolher data e horário"
          >
            <HeroGlowTopRight />
            <HeroGlowBottomRight />

            <HeroStepPill>
              <Feather name="zap" size={11} color="#FDE047" />
              <HeroStepPillText>Próximo passo • Orientação</HeroStepPillText>
            </HeroStepPill>

            <HeroMiddleRow>
              <HeroTextColumn>
                <HeroTitle>Agendar reunião com orientador</HeroTitle>
                <HeroDescription>
                  Escolha data e horário disponíveis na agenda do seu
                  orientador.
                </HeroDescription>
              </HeroTextColumn>

              {showHeroIllustration && (
                <HeroIllustrationBox isCompact={isCompactScreen}>
                  <HeroCalendarTile>
                    <MaterialCommunityIcons
                      name="calendar-check-outline"
                      size={26}
                      color="#FFFFFF"
                    />
                    <HeroCompassCorner>
                      <Feather name="compass" size={13} color="#005bb1" />
                    </HeroCompassCorner>
                    <HeroDurationCorner>
                      <HeroDurationCornerText>30m</HeroDurationCornerText>
                    </HeroDurationCorner>
                  </HeroCalendarTile>
                </HeroIllustrationBox>
              )}
            </HeroMiddleRow>

            <HeroActionPill>
              <HeroActionPillText>Escolher horário</HeroActionPillText>
              <Feather name="arrow-right" size={16} color="#005bb1" />
            </HeroActionPill>
          </HeroScheduleCard>

          <SecondaryAgendaCard
            activeOpacity={0.82}
            onPress={() => navigation.navigate("Profile")}
            accessibilityRole="button"
            accessibilityLabel="Visualizar agenda completa"
            accessibilityHint="Abre sua agenda com reuniões confirmadas, histórico e cancelamentos"
          >
            <SecondaryLeftRow>
              <SecondaryIconBox>
                <Feather name="calendar" size={20} color="#0e006a" />
              </SecondaryIconBox>

              <SecondaryTextCol>
                <SecondaryTitle>Visualizar agenda completa</SecondaryTitle>
                <SecondaryDescription numberOfLines={1}>
                  Reuniões confirmadas, histórico e cancelamentos.
                </SecondaryDescription>
              </SecondaryTextCol>
            </SecondaryLeftRow>

            <SecondaryChevronCircle>
              <Feather name="chevron-right" size={17} color="#414754" />
            </SecondaryChevronCircle>
          </SecondaryAgendaCard>

          <SectionHeaderRow>
            <SectionTitleGroup>
              <Feather name="flag" size={16} color="#005bb1" />
              <SectionTitle>Próxima orientação</SectionTitle>
            </SectionTitleGroup>

            {nextMeeting && (
              <SectionLinkButton
                activeOpacity={0.75}
                onPress={() =>
                  navigation.navigate("MeetingDetails", { event: nextMeeting })
                }
                accessibilityRole="button"
                accessibilityLabel="Ver detalhes da orientação"
              >
                <SectionLinkText>Ver detalhes</SectionLinkText>
                <Feather name="arrow-right" size={13} color="#005bb1" />
              </SectionLinkButton>
            )}
          </SectionHeaderRow>

          {renderNextOrientationSection()}

          <TipCard>
            <TipIconBox>
              <MaterialCommunityIcons
                name="lightbulb-outline"
                size={19}
                color="#FFFFFF"
              />
            </TipIconBox>
            <TipTextCol>
              <TipEyebrow>Dica para o encontro</TipEyebrow>
              <TipBody>
                Anote os tópicos principais e dúvidas antes da reunião para
                aproveitar melhor o horário.
              </TipBody>
            </TipTextCol>
          </TipCard>
        </Body>
      </ScrollContent>
    </Container>
  );
}
