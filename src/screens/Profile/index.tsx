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
  Alert as RNAlert,
  Linking,
  AppState,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components/native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { getFriendlyApiErrorMessage } from "../../services/apiClient";
import {
  getUserInfo,
  getPastAndMissedEvents,
  cancelEvent,
  getEventInvitees,
  clearInviteesCache,
} from "../../services/calendlyService";
import { CalendlyEvent } from "../../services/types";
import { useAuth } from "../../contexts/AuthContext";
import {
  Container,
  Header,
  HeaderTopRow,
  HeaderTag,
  HeaderTagText,
  RefreshIconButton,
  Title,
  Subtitle,
  SectionHeaderText,
  ScheduleCard,
  CardTopRow,
  DateHighlightBox,
  DateHighlightDay,
  DateHighlightMonth,
  CardDetailsCol,
  StatusBadge,
  StatusDot,
  StatusBadgeText,
  EventTitle,
  MetaList,
  MetaRow,
  MetaText,
  CancelReasonText,
  CancelActionRow,
  CancelOutlineButton,
  CancelOutlineText,
  Divider,
  WarningBanner,
  WarningBannerText,
  LoadingContainer,
  StateCard,
  StateTitle,
  StateDescription,
  RetryButton,
  RetryButtonText,
} from "./styles";

export function Profile() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelingUri, setCancelingUri] = useState<string | null>(null);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [partialWarning, setPartialWarning] = useState<string | null>(null);
  const pendingExternalRefreshRef = useRef(false);

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

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active" && pendingExternalRefreshRef.current) {
        pendingExternalRefreshRef.current = false;
        loadEvents(true);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [loadEvents]);

  const handleCancelEvent = async (event: CalendlyEvent) => {
    try {
      const invitees =
        event.invitees && event.invitees.length > 0
          ? event.invitees
          : await getEventInvitees(event.uri);

      const isUserEvent = invitees.some(
        (invitee) =>
          invitee.email &&
          invitee.email.toLowerCase() === user?.email?.toLowerCase()
      );

      if (!isUserEvent) {
        RNAlert.alert(
          "Erro",
          "Você não tem permissão para cancelar este evento."
        );
        return;
      }

      RNAlert.alert(
        "Cancelar reunião",
        `Tem certeza que deseja cancelar "${event.name}"?`,
        [
          {
            text: "Manter",
            style: "cancel",
          },
          {
            text: "Confirmar cancelamento",
            style: "destructive",
            onPress: async () => {
              setCancelingUri(event.uri);
              try {
                const result = await cancelEvent(event.uri);
                if (result.success) {
                  await loadEvents(true);
                  RNAlert.alert("Sucesso", "Reunião cancelada com sucesso!");
                } else if (
                  result.code === "SHARED_EVENT_INDIVIDUAL_CANCEL_REQUIRED"
                ) {
                  const message =
                    result.error ||
                    "Esta é uma reunião compartilhada. Cancele apenas a sua participação pelo link individual.";

                  if (result.cancelUrl) {
                    const cancelUrl = result.cancelUrl;
                    RNAlert.alert("Reunião compartilhada", message, [
                      { text: "Fechar", style: "cancel" },
                      {
                        text: "Cancelar minha participação",
                        onPress: async () => {
                          try {
                            pendingExternalRefreshRef.current = true;
                            await Linking.openURL(cancelUrl);
                          } catch {
                            pendingExternalRefreshRef.current = false;
                            RNAlert.alert(
                              "Erro",
                              "Não foi possível abrir o link de cancelamento."
                            );
                          }
                        },
                      },
                    ]);
                  } else {
                    RNAlert.alert("Reunião compartilhada", message);
                  }
                } else {
                  RNAlert.alert(
                    "Erro",
                    result.error || "Não foi possível cancelar a reunião."
                  );
                }
              } catch (error) {
                console.error("Erro ao cancelar evento:", error);
                RNAlert.alert("Erro", "Não foi possível cancelar a reunião.");
              } finally {
                setCancelingUri(null);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Erro ao verificar participantes do evento:", error);
      RNAlert.alert(
        "Erro",
        "Não foi possível verificar se você tem permissão para cancelar este evento."
      );
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
    if (event.location.type === "google_conference") return "Google Meet";
    if (event.location.type === "zoom") return "Zoom";
    if (event.location.type === "microsoft_teams_conference") {
      return "Microsoft Teams";
    }
    if (event.location.join_url) return "Videoconferência";
    return null;
  };

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
    const { day, month } = getHighlightedDate(item.start_time);
    const locationLabel = getMeetingLocationLabel(item);
    const isThisCanceling = cancelingUri === item.uri;

    return (
      <ScheduleCard isCanceled={isCanceled}>
        <CardTopRow>
          <DateHighlightBox isCanceled={isCanceled}>
            <DateHighlightDay isCanceled={isCanceled}>{day}</DateHighlightDay>
            <DateHighlightMonth isCanceled={isCanceled}>
              {month}
            </DateHighlightMonth>
          </DateHighlightBox>

          <CardDetailsCol>
            <StatusBadge variant={variant}>
              <StatusDot variant={variant} />
              <StatusBadgeText variant={variant}>{statusLabel}</StatusBadgeText>
            </StatusBadge>

            <EventTitle isCanceled={isCanceled} numberOfLines={2}>
              {item.name}
            </EventTitle>

            <MetaList>
              <MetaRow>
                <Feather
                  name="clock"
                  size={12}
                  color={theme.colors.text_secondary}
                />
                <MetaText>
                  {formatTimeAndDuration(item.start_time, item.end_time)}
                </MetaText>
              </MetaRow>

              {locationLabel && (
                <MetaRow>
                  <Feather
                    name="map-pin"
                    size={12}
                    color={
                      isCanceled
                        ? theme.colors.text_secondary
                        : theme.colors.lavender
                    }
                  />
                  <MetaText numberOfLines={1}>{locationLabel}</MetaText>
                </MetaRow>
              )}

              {item.cancel_reason && (
                <CancelReasonText>
                  Motivo: {item.cancel_reason}
                </CancelReasonText>
              )}
            </MetaList>
          </CardDetailsCol>
        </CardTopRow>

        {variant === "active" && (
          <CancelActionRow>
            <CancelOutlineButton
              activeOpacity={0.78}
              onPress={() => handleCancelEvent(item)}
              disabled={cancelingUri !== null}
              accessibilityRole="button"
              accessibilityLabel={`Cancelar reunião ${item.name}`}
            >
              {isThisCanceling ? (
                <ActivityIndicator size="small" color="#DC2626" />
              ) : (
                <>
                  <Feather name="x-circle" size={14} color="#DC2626" />
                  <CancelOutlineText>Cancelar reunião</CancelOutlineText>
                </>
              )}
            </CancelOutlineButton>
          </CancelActionRow>
        )}
      </ScheduleCard>
    );
  };

  const sections = useMemo(() => {
    const list: { title: string; data: CalendlyEvent[] }[] = [];
    if (events.activeEvents.length > 0) {
      list.push({ title: "Próximas orientações", data: events.activeEvents });
    }
    if (events.pastEvents.length > 0) {
      list.push({ title: "Realizadas", data: events.pastEvents });
    }
    if (events.missedEvents.length > 0) {
      list.push({ title: "Canceladas", data: events.missedEvents });
    }
    return list;
  }, [events]);

  const hasNoEvents =
    !events.activeEvents.length &&
    !events.pastEvents.length &&
    !events.missedEvents.length;

  if (loading && hasNoEvents && !eventsError) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header topInset={insets.top}>
        <HeaderTopRow>
          <HeaderTag>
            <Feather
              name="compass"
              size={11}
              color={theme.colors.primary_dark}
            />
            <HeaderTagText>Orientação TCC</HeaderTagText>
          </HeaderTag>

          <RefreshIconButton
            onPress={() => loadEvents(true)}
            disabled={loading || refreshing}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Atualizar agendamentos"
          >
            <Feather
              name="refresh-cw"
              size={15}
              color={theme.colors.primary_dark}
            />
          </RefreshIconButton>
        </HeaderTopRow>

        <Title>Meus agendamentos</Title>
        <Subtitle>
          Acompanhe suas próximas orientações e seu histórico.
        </Subtitle>
      </Header>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.uri}
        renderItem={renderEventItem}
        renderSectionHeader={({ section: { title } }) => (
          <SectionHeaderText>{title}</SectionHeaderText>
        )}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 16) + 84,
          flexGrow: hasNoEvents ? 1 : 0,
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
              <Feather
                name="info"
                size={15}
                color={theme.colors.primary_dark}
              />
              <WarningBannerText>{partialWarning}</WarningBannerText>
            </WarningBanner>
          ) : null
        }
        ListEmptyComponent={
          <StateCard>
            <Feather
              name={eventsError ? "alert-circle" : partialWarning ? "info" : "calendar"}
              size={24}
              color={
                eventsError
                  ? "#DC2626"
                  : partialWarning
                    ? theme.colors.primary_dark
                    : theme.colors.primary
              }
            />
            <StateTitle>
              {eventsError
                ? "Não foi possível carregar"
                : partialWarning
                  ? "Agenda carregada parcialmente"
                  : "Nenhum agendamento encontrado"}
            </StateTitle>
            <StateDescription>
              {eventsError ||
                partialWarning ||
                "Suas futuras orientações, reuniões realizadas e canceladas aparecerão aqui."}
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
