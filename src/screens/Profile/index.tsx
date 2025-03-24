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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import {
  getUserInfo,
  getPastAndMissedEvents,
  cancelEvent,
} from "../../services/calendlyService";

export function Profile() {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState({
    activeEvents: [],
    pastEvents: [],
    missedEvents: [],
  });

  const isFocused = useIsFocused();

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
      const user = await getUserInfo();
      if (user) {
        const result = await getPastAndMissedEvents(user.uri);

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
        RNAlert.alert("Erro", "Usuário não encontrado.");
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

  const handleCancelEvent = (event: { name: any; uri: string }) => {
    console.log("Tentando cancelar evento:", event);

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
  };

  const renderEventItem = ({ item }) => {
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

    const formattedDate = format(eventDate, "dd/MM/yyyy", { locale: ptBR });
    const formattedTime = format(eventDate, "HH:mm");

    let iconName = "calendar";
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
