import React, { useState, useCallback } from "react";
import { ActivityIndicator, Alert, useWindowDimensions } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

import { useAuth } from "../../contexts/AuthContext";
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
  HeaderBrandBlock,
  HeaderDateText,
  BrandRow,
  BrandName,
  HeaderActions,
  AvatarWrapper,
  UserPhoto,
  UserAvatarFallback,
  UserIcon,
  AvatarStatusDot,
  LogoutButton,
  LogoutIcon,
  ScrollContent,
  Body,
  WelcomeSection,
  GreetingTitle,
  GreetingHighlight,
  WelcomeDescription,
  HeroScheduleCard,
  HeroTextColumn,
  HeroTag,
  HeroTagText,
  HeroTitle,
  HeroDescription,
  HeroActionPill,
  HeroActionPillText,
  HeroIllustrationBox,
  HeroOrbitDotTop,
  HeroOrbitDotBottom,
  MiniCalendarFrame,
  MiniCalendarTopBar,
  MiniCalendarRing,
  MiniCalendarBody,
  MiniCalendarLineShort,
  MiniCalendarLineLong,
  MiniCompassBadge,
  SecondaryAgendaCard,
  SecondaryIconBox,
  SecondaryTextCol,
  SecondaryTitle,
  SecondaryDescription,
  SectionHeaderRow,
  SectionTitle,
  SectionLinkButton,
  SectionLinkText,
  TimelineRow,
  TimelineTrack,
  TimelineOuterDot,
  TimelineInnerDot,
  TimelineLine,
  MeetingCard,
  MeetingTopRow,
  DateHighlightBox,
  DateHighlightDay,
  DateHighlightMonth,
  MeetingInfoCol,
  StatusBadge,
  StatusDot,
  StatusBadgeText,
  MeetingTitle,
  MeetingMetaList,
  MeetingMetaItem,
  MeetingMetaText,
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
  ActionIcon,
} from "./styles";

export function Home() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const { user, signOut } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [nextMeeting, setNextMeeting] = useState<CalendlyEvent | null>(null);
  const [loadingMeeting, setLoadingMeeting] = useState(true);
  const [meetingError, setMeetingError] = useState<string | null>(null);
  const [partialWarning, setPartialWarning] = useState<string | null>(null);

  const isCompactScreen = width < 360;
  const showHeroIllustration = width >= 330;
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
      Alert.alert(
        "Aviso",
        "Ocorreu um erro ao fazer logout, por favor tente novamente."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getHighlightedDate = (isoString: string) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date
      .toLocaleDateString("pt-BR", { month: "short" })
      .replace(".", "")
      .toUpperCase();
    return { day, month };
  };

  const formatTimeAndDuration = (startIso: string, endIso?: string) => {
    const startDate = new Date(startIso);
    const start = startDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (!endIso) return start;

    const endDate = new Date(endIso);
    const end = endDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const durationMin = Math.round(
      (endDate.getTime() - startDate.getTime()) / 60000
    );

    return durationMin > 0
      ? `${start} – ${end} (${durationMin} min)`
      : `${start} – ${end}`;
  };

  const getMeetingLocationLabel = (event: CalendlyEvent): string | null => {
    if (!event.location) return null;
    if (event.location.location) return event.location.location;
    if (event.location.join_url) return "Videoconferência";
    if (event.location.type === "google_conference") return "Google Meet";
    if (event.location.type === "zoom") return "Zoom";
    if (event.location.type === "microsoft_teams_conference") {
      return "Microsoft Teams";
    }
    return null;
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
                  "Que tal reservar o próximo encontro do seu TCC?"}
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
            <ActionIcon
              name="arrow-right"
              size={15}
              color={theme.colors.primary_dark}
            />
          </EmptyFooterAction>
        </StateCard>
      );
    }

    const { day, month } = getHighlightedDate(nextMeeting.start_time);
    const locationLabel = getMeetingLocationLabel(nextMeeting);

    return (
      <TimelineRow>
        <TimelineTrack>
          <TimelineOuterDot>
            <TimelineInnerDot />
          </TimelineOuterDot>
          <TimelineLine />
        </TimelineTrack>

        <MeetingCard
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Profile")}
          accessibilityRole="button"
          accessibilityLabel={`Próxima orientação: ${nextMeeting.name}`}
          accessibilityHint="Toque para abrir os detalhes na sua agenda"
        >
          <MeetingTopRow>
            <DateHighlightBox>
              <DateHighlightDay>{day}</DateHighlightDay>
              <DateHighlightMonth>{month}</DateHighlightMonth>
            </DateHighlightBox>

            <MeetingInfoCol>
              <StatusBadge>
                <StatusDot />
                <StatusBadgeText>Confirmada</StatusBadgeText>
              </StatusBadge>

              <MeetingTitle numberOfLines={2}>{nextMeeting.name}</MeetingTitle>

              <MeetingMetaList>
                <MeetingMetaItem>
                  <Feather
                    name="clock"
                    size={12}
                    color={theme.colors.text_secondary}
                  />
                  <MeetingMetaText>
                    {formatTimeAndDuration(
                      nextMeeting.start_time,
                      nextMeeting.end_time
                    )}
                  </MeetingMetaText>
                </MeetingMetaItem>

                {locationLabel && (
                  <MeetingMetaItem>
                    <Feather
                      name="map-pin"
                      size={12}
                      color={theme.colors.lavender}
                    />
                    <MeetingMetaText numberOfLines={1}>
                      {locationLabel}
                    </MeetingMetaText>
                  </MeetingMetaItem>
                )}

                {partialWarning && (
                  <MeetingMetaItem>
                    <Feather
                      name="info"
                      size={12}
                      color={theme.colors.text_secondary}
                    />
                    <MeetingMetaText numberOfLines={2}>
                      {partialWarning}
                    </MeetingMetaText>
                  </MeetingMetaItem>
                )}
              </MeetingMetaList>
            </MeetingInfoCol>
          </MeetingTopRow>
        </MeetingCard>
      </TimelineRow>
    );
  };

  return (
    <Container>
      <Header topInset={insets.top}>
        <HeaderRow>
          <HeaderBrandBlock>
            <HeaderDateText>{todayEditorial}</HeaderDateText>
            <BrandRow>
              <Feather name="compass" size={16} color={theme.colors.primary} />
              <BrandName>Oriently</BrandName>
            </BrandRow>
          </HeaderBrandBlock>

          <HeaderActions>
            <AvatarWrapper>
              {user?.photo ? (
                <UserPhoto
                  source={{ uri: user.photo }}
                  accessibilityLabel={`Foto de perfil de ${firstName}`}
                />
              ) : (
                <UserAvatarFallback>
                  <UserIcon name="person" />
                </UserAvatarFallback>
              )}
              <AvatarStatusDot />
            </AvatarWrapper>

            <LogoutButton
              onPress={handleLogout}
              disabled={isLoggingOut}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Sair da conta"
              accessibilityHint="Encerra sua sessão atual"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {isLoggingOut ? (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.primary_dark}
                />
              ) : (
                <LogoutIcon name="logout" />
              )}
            </LogoutButton>
          </HeaderActions>
        </HeaderRow>
      </Header>

      <ScrollContent
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 20),
        }}
      >
        <Body>
          <WelcomeSection>
            <GreetingTitle isCompact={isCompactScreen}>
              Olá, {firstName}!
            </GreetingTitle>
            <GreetingHighlight>Seu TCC, no caminho certo.</GreetingHighlight>
            <WelcomeDescription>
              Acompanhe suas orientações e organize seus próximos encontros.
            </WelcomeDescription>
          </WelcomeSection>

          <HeroScheduleCard
            activeOpacity={0.86}
            onPress={() => navigation.navigate("Schedule")}
            accessibilityRole="button"
            accessibilityLabel="Agendar reunião"
            accessibilityHint="Abre o calendário para escolher data e horário"
          >
            <HeroTextColumn>
              <HeroTag>
                <Feather name="compass" size={11} color="#FFFFFF" />
                <HeroTagText>Orientação</HeroTagText>
              </HeroTag>

              <HeroTitle>Agendar reunião</HeroTitle>
              <HeroDescription>
                Escolha data e horário disponíveis com seu orientador.
              </HeroDescription>

              <HeroActionPill>
                <HeroActionPillText>Escolher horário</HeroActionPillText>
                <Feather
                  name="arrow-right"
                  size={13}
                  color={theme.colors.primary_dark}
                />
              </HeroActionPill>
            </HeroTextColumn>

            {showHeroIllustration && (
              <HeroIllustrationBox>
                <HeroOrbitDotTop />
                <HeroOrbitDotBottom />
                <MiniCalendarFrame>
                  <MiniCalendarTopBar>
                    <MiniCalendarRing />
                    <MiniCalendarRing />
                  </MiniCalendarTopBar>
                  <MiniCalendarBody>
                    <MiniCalendarLineShort />
                    <MiniCalendarLineLong />
                    <MiniCalendarLineLong />
                  </MiniCalendarBody>
                </MiniCalendarFrame>
                <MiniCompassBadge>
                  <Feather name="compass" size={16} color="#FFFFFF" />
                </MiniCompassBadge>
              </HeroIllustrationBox>
            )}
          </HeroScheduleCard>

          <SecondaryAgendaCard
            activeOpacity={0.82}
            onPress={() => navigation.navigate("Profile")}
            accessibilityRole="button"
            accessibilityLabel="Visualizar agenda"
            accessibilityHint="Abre sua agenda com reuniões ativas, realizadas e canceladas"
          >
            <SecondaryIconBox>
              <Feather
                name="calendar"
                size={18}
                color={theme.colors.primary_dark}
              />
            </SecondaryIconBox>
            <SecondaryTextCol>
              <SecondaryTitle>Visualizar agenda</SecondaryTitle>
              <SecondaryDescription>
                Reuniões confirmadas, histórico e cancelamentos
              </SecondaryDescription>
            </SecondaryTextCol>
            <Feather
              name="chevron-right"
              size={18}
              color={theme.colors.text_secondary}
            />
          </SecondaryAgendaCard>

          <SectionHeaderRow>
            <SectionTitle>Próxima orientação</SectionTitle>
            {nextMeeting && (
              <SectionLinkButton
                activeOpacity={0.75}
                onPress={() => navigation.navigate("Profile")}
                accessibilityRole="button"
                accessibilityLabel="Ver agenda completa"
              >
                <SectionLinkText>Ver agenda</SectionLinkText>
                <Feather
                  name="chevron-right"
                  size={14}
                  color={theme.colors.primary_dark}
                />
              </SectionLinkButton>
            )}
          </SectionHeaderRow>

          {renderNextOrientationSection()}
        </Body>
      </ScrollContent>
    </Container>
  );
}
