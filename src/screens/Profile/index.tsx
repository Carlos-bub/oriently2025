import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  SectionList,
  RefreshControl,
  ActivityIndicator,
  Linking,
  AppState,
} from "react-native";
import { useTheme } from "styled-components/native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { getFriendlyApiErrorMessage } from "../../services/apiClient";
import {
  getUserInfo,
  getPastAndMissedEvents,
  clearInviteesCache,
} from "../../services/calendlyService";
import { CalendlyEvent } from "../../services/types";
import { useAuth } from "../../contexts/AuthContext";
import { OrientlyTopBar } from "../../components/OrientlyTopBar";
import {
  getValidVideoJoinUrl,
  getMeetingLocationLabel,
} from "../../utils/meetingLinks";
import {
  Container,
  Header,
  HeaderTopRow,
  HeaderTag,
  HeaderTagText,
  RefreshIconButton,
  Title,
  Subtitle,
  FilterBarWrapper,
  FilterSegmentedBar,
  FilterTabButton,
  FilterTabLabel,
  FilterCountPill,
  FilterCountText,
  SectionHeaderRow,
  SectionTitleGroup,
  SectionDot,
  SectionHeaderText,
  SectionCountLabel,
  ScheduleCard,
  SpotlightHeaderRow,
  SpotlightBadgesLeft,
  SpotlightPrimaryPill,
  SpotlightPrimaryPillText,
  CountdownPill,
  CountdownPillText,
  CardRow,
  DateHighlightBox,
  DateHighlightDay,
  DateHighlightMonth,
  CardDetailsCol,
  CardHeaderInline,
  StatusBadge,
  StatusDot,
  StatusBadgeText,
  CompactCancelButton,
  CompactCancelText,
  EventTitle,
  MetaRow,
  MetaItem,
  MetaText,
  CancelReasonText,
  CardFooterBar,
  CardFooterLabel,
  JoinRoomPill,
  JoinRoomPillText,
  Divider,
  WarningBanner,
  WarningBannerText,
  HistoryLinkCard,
  HistoryLinkText,
  TipCard,
  TipIconBox,
  TipTextCol,
  TipTitle,
  TipBody,
  LoadingContainer,
  StateCard,
  StateTitle,
  StateDescription,
  RetryButton,
  RetryButtonText,
} from "./styles";

type FilterTab = "upcoming" | "history";

export function Profile() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<FilterTab>("upcoming");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [partialWarning, setPartialWarning] = useState<string | null>(null);

  const [events, setEvents] = useState<{
    activeEvents: CalendlyEvent[];
    pastEvents: CalendlyEvent[];
    missedEvents: CalendlyEvent[];
  }>({
    activeEvents: [],
    pastEvents: [],
    missedEvents: [],
  });

  const loadEvents = useCallback(
    async (isRefresh = false) => {
      try {
        setEventsError(null);
        setPartialWarning(null);
        if (isRefresh) {
          setRefreshing(true);
          clearInviteesCache();
        } else {
          setLoading(true);
        }

        if (!user?.email) {
          setEventsError("Usuário não está logado corretamente.");
          return;
        }

        const calendlyUser = await getUserInfo();

        if (calendlyUser) {
          const result = await getPastAndMissedEvents(
            calendlyUser.uri,
            user.email
          );

          if (result.partialErrors || result.truncated) {
            setPartialWarning(
              result.truncated
                ? "Exibindo resultados parciais (limite de paginação atingido)."
                : "Algumas reuniões não puderam ser verificadas agora. Puxe para atualizar."
            );
          }

          const sortByDate = (
            a: { start_time: string | number | Date },
            b: { start_time: string | number | Date }
          ) =>
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime();

          setEvents({
            activeEvents: result.activeEvents.sort(sortByDate),
            pastEvents: result.pastEvents.sort(sortByDate),
            missedEvents: result.missedEvents.sort(sortByDate),
          });
        } else {
          setEventsError("Não foi possível identificar a agenda do orientador.");
        }
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        setEventsError(
          getFriendlyApiErrorMessage(
            error,
            "Não foi possível carregar os agendamentos."
          )
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?.email]
  );

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

  const getHighlightedDate = (isoString: string) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date
      .toLocaleDateString("pt-BR", { month: "short" })
      .replace(".", "")
      .toUpperCase();
    return { day, month };
  };

  const getCountdownLabel = (isoString: string) => {
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

    if (diffDays <= 0) return "Hoje";
    if (diffDays === 1) return "Amanhã";
    return `Em ${diffDays} dias`;
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

  const firstUpcomingUri = events.activeEvents[0]?.uri;

  const renderEventItem = ({ item }: { item: CalendlyEvent }) => {
    const eventDate = new Date(item.start_time);
    const now = new Date();

    let variant: "active" | "completed" | "canceled" = "active";
    if (item.status === "canceled") {
      variant = "canceled";
    } else if (eventDate.getTime() < now.getTime()) {
      variant = "completed";
    }

    const statusLabel =
      variant === "completed"
        ? "Realizada"
        : variant === "canceled"
          ? "Cancelada"
          : "Confirmada";

    const isCanceled = variant === "canceled";
    const isUpcoming = variant === "active";
    const isSpotlight = isUpcoming && item.uri === firstUpcomingUri;
    const { day, month } = getHighlightedDate(item.start_time);
    const locationLabel = getMeetingLocationLabel(item);
    const hasJoinUrl = Boolean(isUpcoming && getValidVideoJoinUrl(item));

    return (
      <ScheduleCard
        isCanceled={isCanceled}
        isUpcoming={isUpcoming}
        isSpotlight={isSpotlight}
        activeOpacity={0.86}
        onPress={() => navigation.navigate("MeetingDetails", { event: item })}
        accessibilityRole="button"
        accessibilityLabel={`Abrir detalhes de ${item.name}`}
      >
        {isSpotlight && (
          <SpotlightHeaderRow>
            <SpotlightBadgesLeft>
              <SpotlightPrimaryPill>
                <Feather name="star" size={10} color="#FFFFFF" />
                <SpotlightPrimaryPillText>
                  Próximo marco
                </SpotlightPrimaryPillText>
              </SpotlightPrimaryPill>

              <CountdownPill>
                <CountdownPillText>
                  {getCountdownLabel(item.start_time)}
                </CountdownPillText>
              </CountdownPill>
            </SpotlightBadgesLeft>

            <Feather name="chevron-right" size={16} color="#005bb1" />
          </SpotlightHeaderRow>
        )}

        <CardRow>
          <DateHighlightBox isCanceled={isCanceled} isSpotlight={isSpotlight}>
            <DateHighlightDay isCanceled={isCanceled}>{day}</DateHighlightDay>
            <DateHighlightMonth isCanceled={isCanceled}>
              {month}
            </DateHighlightMonth>
          </DateHighlightBox>

          <CardDetailsCol>
            {!isSpotlight && (
              <CardHeaderInline>
                <StatusBadge variant={variant}>
                  <StatusDot variant={variant} />
                  <StatusBadgeText variant={variant}>
                    {statusLabel}
                  </StatusBadgeText>
                </StatusBadge>

                <Feather name="chevron-right" size={15} color="#64748b" />
              </CardHeaderInline>
            )}

            <EventTitle isCanceled={isCanceled} numberOfLines={2}>
              {item.name}
            </EventTitle>

            <MetaRow>
              <MetaItem>
                <Feather name="clock" size={12} color="#005bb1" />
                <MetaText>
                  {formatTimeAndDuration(item.start_time, item.end_time)}
                </MetaText>
              </MetaItem>

              {locationLabel && (
                <MetaItem>
                  <Feather
                    name={hasJoinUrl ? "video" : "map-pin"}
                    size={12}
                    color={isCanceled ? "#64748b" : "#514fb5"}
                  />
                  <MetaText numberOfLines={1}>{locationLabel}</MetaText>
                </MetaItem>
              )}
            </MetaRow>

            {item.cancel_reason && (
              <CancelReasonText numberOfLines={2}>
                Motivo: {item.cancel_reason}
              </CancelReasonText>
            )}
          </CardDetailsCol>
        </CardRow>

        {isSpotlight && (
          <CardFooterBar>
            <CardFooterLabel numberOfLines={1}>
              {hasJoinUrl
                ? "Sala online e ações disponíveis nos detalhes"
                : "Toque para ver detalhes e gerenciar"}
            </CardFooterLabel>
            <Feather name="arrow-right" size={14} color="#005bb1" />
          </CardFooterBar>
        )}
      </ScheduleCard>
    );
  };

  const upcomingCount = events.activeEvents.length;
  const historyCount = events.pastEvents.length + events.missedEvents.length;

  const sections = useMemo(() => {
    const list: {
      title: string;
      isUpcoming?: boolean;
      countLabel?: string;
      data: CalendlyEvent[];
    }[] = [];

    if (activeTab === "upcoming") {
      if (events.activeEvents.length > 0) {
        list.push({
          title: "Próximas orientações",
          isUpcoming: true,
          countLabel: `${events.activeEvents.length} ${
            events.activeEvents.length === 1 ? "ativa" : "ativas"
          }`,
          data: events.activeEvents,
        });
      }
      return list;
    }

    if (events.pastEvents.length > 0) {
      list.push({
        title: "Realizadas",
        countLabel: `${events.pastEvents.length}`,
        data: events.pastEvents,
      });
    }
    if (events.missedEvents.length > 0) {
      list.push({
        title: "Canceladas",
        countLabel: `${events.missedEvents.length}`,
        data: events.missedEvents,
      });
    }
    return list;
  }, [activeTab, events]);

  const hasNoEvents =
    !events.activeEvents.length &&
    !events.pastEvents.length &&
    !events.missedEvents.length;

  const isCurrentTabEmpty = sections.length === 0;

  if (loading && hasNoEvents && !eventsError) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <OrientlyTopBar />

      <Header>
        <HeaderTopRow>
          <HeaderTag>
            <Feather name="compass" size={11} color="#005bb1" />
            <HeaderTagText>Trilha TCC</HeaderTagText>
          </HeaderTag>

          <RefreshIconButton
            onPress={() => loadEvents(true)}
            disabled={loading || refreshing}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Atualizar agendamentos"
          >
            <Feather name="refresh-cw" size={15} color="#005bb1" />
          </RefreshIconButton>
        </HeaderTopRow>

        <Title>Meus agendamentos</Title>
        <Subtitle>
          Acompanhe suas próximas orientações e marcos do seu trabalho.
        </Subtitle>
      </Header>

      <FilterBarWrapper>
        <FilterSegmentedBar>
          <FilterTabButton
            active={activeTab === "upcoming"}
            activeOpacity={0.85}
            onPress={() => setActiveTab("upcoming")}
            accessibilityRole="button"
            accessibilityLabel="Filtrar próximas orientações"
            accessibilityState={{ selected: activeTab === "upcoming" }}
          >
            <FilterTabLabel active={activeTab === "upcoming"}>
              Próximas
            </FilterTabLabel>
            <FilterCountPill active={activeTab === "upcoming"}>
              <FilterCountText active={activeTab === "upcoming"}>
                {upcomingCount}
              </FilterCountText>
            </FilterCountPill>
          </FilterTabButton>

          <FilterTabButton
            active={activeTab === "history"}
            activeOpacity={0.85}
            onPress={() => setActiveTab("history")}
            accessibilityRole="button"
            accessibilityLabel="Filtrar histórico de orientações"
            accessibilityState={{ selected: activeTab === "history" }}
          >
            <FilterTabLabel active={activeTab === "history"}>
              Histórico
            </FilterTabLabel>
            <FilterCountPill active={activeTab === "history"}>
              <FilterCountText active={activeTab === "history"}>
                {historyCount}
              </FilterCountText>
            </FilterCountPill>
          </FilterTabButton>
        </FilterSegmentedBar>
      </FilterBarWrapper>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.uri}
        renderItem={renderEventItem}
        renderSectionHeader={({ section }) => (
          <SectionHeaderRow>
            <SectionTitleGroup>
              <SectionDot isUpcoming={section.isUpcoming} />
              <SectionHeaderText isUpcoming={section.isUpcoming}>
                {section.title}
              </SectionHeaderText>
            </SectionTitleGroup>
            {section.countLabel && (
              <SectionCountLabel>{section.countLabel}</SectionCountLabel>
            )}
          </SectionHeaderRow>
        )}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 16) + 108,
          flexGrow: isCurrentTabEmpty ? 1 : 0,
        }}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadEvents(true)}
            colors={[theme.colors.primary]}
          />
        }
        ListHeaderComponent={
          partialWarning && !hasNoEvents ? (
            <WarningBanner>
              <Feather name="info" size={15} color="#005bb1" />
              <WarningBannerText>{partialWarning}</WarningBannerText>
            </WarningBanner>
          ) : null
        }
        ListFooterComponent={
          activeTab === "upcoming" ? (
            <>
              {historyCount > 0 && (
                <HistoryLinkCard
                  activeOpacity={0.82}
                  onPress={() => setActiveTab("history")}
                  accessibilityRole="button"
                  accessibilityLabel="Visualizar histórico de reuniões concluídas ou canceladas"
                >
                  <HistoryLinkText>
                    Visualizar histórico de reuniões concluídas ou canceladas
                  </HistoryLinkText>
                  <Feather name="arrow-right" size={16} color="#005bb1" />
                </HistoryLinkCard>
              )}

              <TipCard>
                <TipIconBox>
                  <MaterialCommunityIcons
                    name="lightbulb-outline"
                    size={19}
                    color="#FFFFFF"
                  />
                </TipIconBox>
                <TipTextCol>
                  <TipTitle>Dica para sua orientação</TipTitle>
                  <TipBody>
                    Organize suas dúvidas e avanços antes da reunião para
                    aproveitar melhor o encontro.
                  </TipBody>
                </TipTextCol>
              </TipCard>
            </>
          ) : null
        }
        ListEmptyComponent={
          <StateCard>
            <Feather
              name={
                eventsError
                  ? "alert-circle"
                  : partialWarning
                    ? "info"
                    : "calendar"
              }
              size={22}
              color={
                eventsError
                  ? "#DC2626"
                  : partialWarning
                    ? "#005bb1"
                    : theme.colors.primary
              }
            />
            <StateTitle>
              {eventsError
                ? "Não foi possível carregar"
                : partialWarning
                  ? "Agenda carregada parcialmente"
                  : activeTab === "upcoming"
                    ? "Nenhuma orientação próxima"
                    : "Nenhum registro no histórico"}
            </StateTitle>
            <StateDescription>
              {eventsError ||
                partialWarning ||
                (activeTab === "upcoming"
                  ? "Agende uma nova reunião para acompanhar seus próximos marcos aqui."
                  : "Reuniões realizadas ou canceladas aparecerão nesta aba.")}
            </StateDescription>
            {(eventsError || partialWarning) && (
              <RetryButton
                activeOpacity={0.85}
                onPress={() => loadEvents(true)}
                accessibilityRole="button"
                accessibilityLabel="Tentar novamente"
              >
                <RetryButtonText>Tentar novamente</RetryButtonText>
              </RetryButton>
            )}
          </StateCard>
        }
      />
    </Container>
  );
}
