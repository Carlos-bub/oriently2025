import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  SectionList,
  RefreshControl,
  ActivityIndicator,
  Alert as RNAlert,
  Linking,
  AppState,
  View,
  Text,
} from "react-native";
import {
  Container,
  Header,
  Title,
  Subtitle,
  DateBox,
  DateText,
  IconBox,
  ScheduleCard,
  TimeContainer,
  FontAwesome,
  ScheduleTime,
  ScheduleItem,
  ScheduleText,
  Divider,
  LoadingContainer,
  EmptyContainer,
  EmptyText,
  CancelButton,
  CancelButtonText,
  CancelReasonText,
} from "./styles";
import { RFValue } from "react-native-responsive-fontsize";
import theme from "src/global/styles/theme";
import { useFocusEffect } from "@react-navigation/native";
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

export function Profile() {
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

  const { user } = useAuth();

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
        "Cancelar Evento",
        `Tem certeza que deseja cancelar o evento "${event.name}"?`,
        [
          {
            text: "Não",
            style: "cancel",
          },
          {
            text: "Sim",
            style: "destructive",
            onPress: async () => {
              setCancelingUri(event.uri);
              try {
                const result = await cancelEvent(event.uri);
                if (result.success) {
                  await loadEvents(true);
                  RNAlert.alert("Sucesso", "Evento cancelado com sucesso!");
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
                    result.error || "Não foi possível cancelar o evento."
                  );
                }
              } catch (error) {
                console.error("Erro ao cancelar evento:", error);
                RNAlert.alert("Erro", "Não foi possível cancelar o evento.");
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

  const renderEventItem = ({ item }: { item: CalendlyEvent }) => {
    const eventDate = new Date(item.start_time);
    const now = new Date();

    const eventDateOnly = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );
    const todayOnly = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    let effectiveStatus = item.status;
    if (effectiveStatus === "active" && eventDateOnly < todayOnly) {
      effectiveStatus = "completed";
    }

    // Formatação de data sem usar o locale explicitamente
    const formattedDate = eventDate.toLocaleDateString("pt-BR");
    const formattedTime = eventDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let iconName: "calendar" | "check-circle" | "times-circle" = "calendar";
    let iconColor = theme.colors.primary;
    if (effectiveStatus === "completed") {
      iconName = "check-circle";
      iconColor = theme.colors.success;
    } else if (effectiveStatus === "canceled") {
      iconName = "times-circle";
      iconColor = theme.colors.cancel;
    }

    return (
      <ScheduleCard>
        <DateBox>
          <DateText>{formattedDate}</DateText>
        </DateBox>
        <TimeContainer>
          <IconBox>
            <FontAwesome name={iconName} size={RFValue(24)} color={iconColor} />
          </IconBox>
          <ScheduleItem>
            <ScheduleTime>{formattedTime}</ScheduleTime>
            <ScheduleText>{item.name}</ScheduleText>
            {item.cancel_reason && (
              <CancelReasonText>
                Motivo do cancelamento: {item.cancel_reason}
              </CancelReasonText>
            )}
          </ScheduleItem>
          {effectiveStatus === "active" && (
            <CancelButton
              onPress={() => handleCancelEvent(item)}
              disabled={cancelingUri !== null}
            >
              {cancelingUri === item.uri ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <CancelButtonText>Cancelar</CancelButtonText>
              )}
            </CancelButton>
          )}
        </TimeContainer>
      </ScheduleCard>
    );
  };

  const sections = useMemo(() => {
    const list: { title: string; data: CalendlyEvent[] }[] = [];
    if (events.activeEvents.length > 0) {
      list.push({ title: "Agendamentos Ativos", data: events.activeEvents });
    }
    if (events.pastEvents.length > 0) {
      list.push({ title: "Agendamentos Realizados", data: events.pastEvents });
    }
    if (events.missedEvents.length > 0) {
      list.push({
        title: "Agendamentos Cancelados",
        data: events.missedEvents,
      });
    }
    return list;
  }, [events]);

  const hasNoEvents =
    !events.activeEvents.length &&
    !events.pastEvents.length &&
    !events.missedEvents.length;

  if (loading && hasNoEvents) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Meus Agendamentos</Title>
      </Header>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.uri}
        renderItem={renderEventItem}
        renderSectionHeader={({ section: { title } }) => (
          <Subtitle>{title}</Subtitle>
        )}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={{
          paddingBottom: RFValue(90),
          flexGrow: hasNoEvents ? 1 : 0,
        }}
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
            <View
              style={{
                backgroundColor: theme.colors.boxprofile,
                borderRadius: 12,
                padding: 10,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color: theme.colors.date,
                  fontSize: RFValue(12),
                }}
              >
                {partialWarning}
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyContainer>
            <EmptyText>
              {eventsError ||
                partialWarning ||
                "Nenhum agendamento encontrado."}
            </EmptyText>
            {(eventsError || partialWarning) && (
              <CancelButton
                onPress={() => loadEvents(true)}
                style={{
                  backgroundColor: theme.colors.primary,
                  marginTop: RFValue(12),
                }}
              >
                <CancelButtonText>Tentar novamente</CancelButtonText>
              </CancelButton>
            )}
          </EmptyContainer>
        }
      />
    </Container>
  );
}
