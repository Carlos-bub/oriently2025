import React, { useState, useEffect, useCallback } from "react";
import { FlatList, ActivityIndicator, Alert as RNAlert } from "react-native";
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
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import {
  getUserInfo,
  getPastAndMissedEvents,
  cancelEvent,
  getEventInvitees,
} from "../../services/calendlyService";
import { useAuth } from "../../contexts/AuthContext";

// Definindo interface para o tipo de evento
interface CalendlyEvent {
  uri: string;
  name: string;
  start_time: string;
  status: string;
  cancel_reason?: string;
}

export function Profile() {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState({
    activeEvents: [],
    pastEvents: [],
    missedEvents: [],
  });

  const isFocused = useIsFocused();
  const { user } = useAuth(); 

  const resetState = useCallback(() => {
    setEvents({
      activeEvents: [],
      pastEvents: [],
      missedEvents: [],
    });
  }, []);

  useEffect(() => {
    if (!isFocused) {
      resetState();
    }
  }, [isFocused, resetState]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const calendlyUser = await getUserInfo();

      if (!user?.email) {
        RNAlert.alert("Erro", "Usuário não está logado corretamente.");
        setLoading(false);
        return;
      }

      if (calendlyUser) {
        // filtrando os eventos por email do usuário logado para 
        const result = await getPastAndMissedEvents(
          calendlyUser.uri,
          user.email
        );

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
        RNAlert.alert("Erro", "Usuário do Calendly não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      RNAlert.alert("Erro", "Não foi possível carregar os eventos.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  const handleCancelEvent = async (event: CalendlyEvent) => {
    console.log("Tentando cancelar evento:", event);

    // Verifica se o usuário logado é participante deste evento
    try {
      const invitees = await getEventInvitees(event.uri);
      const isUserEvent = invitees.some(
        (invitee: any) =>
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

      // Continuar com o processo de cancelamento
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
              setLoading(true);
              try {
                const result = await cancelEvent(event.uri);
                if (result.success) {
                  await loadEvents();
                  RNAlert.alert("Sucesso", "Evento cancelado com sucesso!");
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
                setLoading(false);
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
              disabled={loading}
            >
              {loading ? (
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

  if (loading && !events.activeEvents.length) {
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

      {events.activeEvents.length > 0 && (
        <>
          <Subtitle>Agendamentos Ativos</Subtitle>
          <FlatList
            data={events.activeEvents}
            keyExtractor={(item) => item.uri}
            renderItem={renderEventItem}
            ItemSeparatorComponent={() => <Divider />}
            style={{
              minHeight: RFValue(150),
              maxHeight: RFValue(150),
              marginBottom: RFValue(20),
            }}
          />
        </>
      )}

      {events.pastEvents.length > 0 && (
        <>
          <Subtitle>Agendamentos Realizados</Subtitle>
          <FlatList
            data={events.pastEvents}
            keyExtractor={(item) => item.uri}
            renderItem={renderEventItem}
            ItemSeparatorComponent={() => <Divider />}
            style={{ minHeight: RFValue(150), marginBottom: RFValue(20) }}
          />
        </>
      )}

      {events.missedEvents.length > 0 && (
        <>
          <Subtitle>Agendamentos Cancelados</Subtitle>
          <FlatList
            data={events.missedEvents}
            keyExtractor={(item) => item.uri}
            renderItem={renderEventItem}
            ItemSeparatorComponent={() => <Divider />}
            style={{ minHeight: RFValue(150), marginBottom: RFValue(20) }}
          />
        </>
      )}

      {!events.activeEvents.length &&
        !events.pastEvents.length &&
        !events.missedEvents.length && (
          <EmptyContainer>
            <EmptyText>Nenhum agendamento encontrado.</EmptyText>
          </EmptyContainer>
        )}
    </Container>
  );
}
