import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  useWindowDimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { format } from "date-fns";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { useTheme } from "styled-components/native";

import "../../utils/calendarLocale";
import {
  getUserInfo,
  getEventTypes,
  getAvailableTimes,
  scheduleEvent,
  clearInviteesCache,
} from "../../services/calendlyService";
import { EventType } from "../../services/types";
import { useAuth } from "../../contexts/AuthContext";
import {
  Container,
  ScrollBody,
  Header,
  HeaderTag,
  HeaderTagText,
  Title,
  Subtitle,
  ContentWrapper,
  EventTypeList,
  EventTypeChip,
  EventTypeChipText,
  CalendarWrapper,
  HoursSection,
  HoursHeaderRow,
  HoursTitle,
  SelectedDateBadge,
  SelectedDateBadgeText,
  HoursGrid,
  ScheduleItem,
  ScheduleText,
  StateBox,
  StateText,
  RetryButton,
  RetryButtonText,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalText,
  ModalSummaryPill,
  ModalSummaryText,
  ModalButtonContainer,
  ModalButton,
  ModalButtonText,
  WebViewContainer,
  WebViewHeader,
  WebViewTitle,
  WebViewCloseButton,
  WebViewCloseText,
} from "./styles";

export function Schedule() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const theme = useTheme();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timesError, setTimesError] = useState<string | null>(null);
  const [hours, setHours] = useState<string[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [eventTypeUri, setEventTypeUri] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bookingUrl, setBookingUrl] = useState<string | null>(null);
  const isFocused = useIsFocused();

  // 3 columns with 20px horizontal padding on each side and 10px gaps
  const gridCardWidth = Math.floor((width - 40 - 20) / 3);

  const resetState = useCallback(() => {
    setSelectedDate(null);
    setSelectedHour(null);
    setHours([]);
    setTimesError(null);
    setShowConfirmationModal(false);
    setBookingUrl(null);
  }, []);

  useEffect(() => {
    if (!isFocused) {
      resetState();
    }
  }, [isFocused, resetState]);

  useFocusEffect(
    useCallback(() => {
      const fetchUserAndEventType = async () => {
        try {
          setLoadingTypes(true);
          const calendlyUser = await getUserInfo();
          if (calendlyUser) {
            const types = await getEventTypes(calendlyUser.uri);
            const activeTypes = types.filter((t) => t.active !== false);
            setEventTypes(activeTypes);
            if (activeTypes.length > 0) {
              setEventTypeUri((prev) =>
                prev && activeTypes.some((t) => t.uri === prev)
                  ? prev
                  : activeTypes[0].uri
              );
            }
          }
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
          Alert.alert(
            "Erro",
            "Não foi possível carregar os tipos de orientação."
          );
        } finally {
          setLoadingTypes(false);
        }
      };

      fetchUserAndEventType();
    }, [])
  );

  const fetchAvailableTimes = useCallback(async () => {
    if (!selectedDate || !eventTypeUri) return;

    setLoadingTimes(true);
    setTimesError(null);
    try {
      const availableTimes = await getAvailableTimes(
        eventTypeUri,
        selectedDate
      );
      setHours(availableTimes);
    } catch (error) {
      console.error("Erro ao buscar horários:", error);
      setTimesError("Não foi possível carregar os horários disponíveis.");
      setHours([]);
    } finally {
      setLoadingTimes(false);
    }
  }, [selectedDate, eventTypeUri]);

  useEffect(() => {
    fetchAvailableTimes();
  }, [fetchAvailableTimes]);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedHour || !eventTypeUri) {
      Alert.alert("Erro", "Selecione uma data e horário.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await scheduleEvent(
        eventTypeUri,
        selectedDate,
        selectedHour
      );

      if (result.success && result.schedulingUrl) {
        setShowConfirmationModal(false);
        setSelectedHour(null);

        const params = new URLSearchParams();
        if (user?.name) params.append("name", user.name);
        if (user?.email) params.append("email", user.email);
        const queryString = params.toString();
        const separator = result.schedulingUrl.includes("?") ? "&" : "?";
        const prefilledUrl = queryString
          ? `${result.schedulingUrl}${separator}${queryString}`
          : result.schedulingUrl;

        setBookingUrl(prefilledUrl);
      } else {
        Alert.alert("Erro", result.error || "Falha ao criar agendamento.");
      }
    } catch (error) {
      console.error("Erro no agendamento:", error);
      Alert.alert("Erro", "Não foi possível criar o agendamento.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDateSelect = (date: { dateString: string }) => {
    const selectedDateStr = date.dateString;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDateObj = new Date(`${selectedDateStr}T00:00:00`);
    selectedDateObj.setHours(0, 0, 0, 0);

    if (selectedDateObj < today) {
      Alert.alert("Data inválida", "Por favor, selecione uma data futura.");
      return;
    }

    setSelectedHour(null);
    setSelectedDate(selectedDateStr);
  };

  const handleCloseWebView = () => {
    setBookingUrl(null);
    clearInviteesCache();
  };

  const formatHourLabel = (isoOrHour: string) => {
    if (!isoOrHour.includes("T")) return isoOrHour;
    return new Date(isoOrHour).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const markedDates = {
    ...(todayStr !== selectedDate
      ? {
          [todayStr]: {
            marked: true,
            dotColor: theme.colors.primary_dark,
          },
        }
      : {}),
    ...(selectedDate
      ? {
          [selectedDate]: {
            selected: true,
            selectedColor: theme.colors.primary,
            selectedTextColor: "#FFFFFF",
          },
        }
      : {}),
  };

  return (
    <Container>
      <Header topInset={insets.top}>
        <HeaderTag>
          <Feather name="compass" size={11} color={theme.colors.primary_dark} />
          <HeaderTagText>Orientação TCC</HeaderTagText>
        </HeaderTag>
        <Title>Agendar orientação</Title>
        <Subtitle>
          Escolha o melhor momento para conversar com seu orientador
        </Subtitle>
      </Header>

      <ScrollBody
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 16) + 84,
        }}
      >
        <ContentWrapper>
          {eventTypes.length > 1 && (
            <EventTypeList>
              {eventTypes.map((eventType) => {
                const isSelected = eventType.uri === eventTypeUri;
                return (
                  <EventTypeChip
                    key={eventType.uri}
                    isSelected={isSelected}
                    activeOpacity={0.8}
                    onPress={() => {
                      setEventTypeUri(eventType.uri);
                      setSelectedHour(null);
                    }}
                  >
                    <EventTypeChipText isSelected={isSelected}>
                      {eventType.name}
                      {eventType.duration ? ` (${eventType.duration}m)` : ""}
                    </EventTypeChipText>
                  </EventTypeChip>
                );
              })}
            </EventTypeList>
          )}

          <CalendarWrapper>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={markedDates}
              minDate={todayStr}
              theme={{
                backgroundColor: theme.colors.background,
                calendarBackground: theme.colors.background,
                todayTextColor: theme.colors.primary_dark,
                dayTextColor: theme.colors.text_primary,
                textDisabledColor: theme.colors.text_light,
                arrowColor: theme.colors.primary_dark,
                monthTextColor: theme.colors.text_primary,
                textSectionTitleColor: theme.colors.text_secondary,
                selectedDayBackgroundColor: theme.colors.primary,
                selectedDayTextColor: "#FFFFFF",
                textDayFontFamily: theme.fonts.Subtituloslight,
                textMonthFontFamily: theme.fonts.Subtitulos,
                textDayHeaderFontFamily: theme.fonts.buttons,
              }}
            />
          </CalendarWrapper>

          {!selectedDate ? (
            <HoursSection>
              <StateBox>
                <Feather
                  name="calendar"
                  size={20}
                  color={theme.colors.primary}
                />
                <StateText>
                  {loadingTypes
                    ? "Carregando agenda do orientador..."
                    : "Selecione uma data no calendário acima para ver os horários disponíveis."}
                </StateText>
              </StateBox>
            </HoursSection>
          ) : (
            <HoursSection>
              <HoursHeaderRow>
                <HoursTitle>Horários disponíveis</HoursTitle>
                <SelectedDateBadge>
                  <Feather
                    name="calendar"
                    size={12}
                    color={theme.colors.primary_dark}
                  />
                  <SelectedDateBadgeText>
                    {format(new Date(`${selectedDate}T00:00:00`), "dd/MM/yyyy")}
                  </SelectedDateBadgeText>
                </SelectedDateBadge>
              </HoursHeaderRow>

              {loadingTimes ? (
                <StateBox>
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primary}
                  />
                  <StateText>Buscando horários disponíveis...</StateText>
                </StateBox>
              ) : timesError ? (
                <StateBox>
                  <Feather
                    name="alert-circle"
                    size={20}
                    color={theme.colors.cancel}
                  />
                  <StateText>{timesError}</StateText>
                  <RetryButton onPress={fetchAvailableTimes}>
                    <RetryButtonText>Tentar novamente</RetryButtonText>
                  </RetryButton>
                </StateBox>
              ) : hours.length > 0 ? (
                <HoursGrid>
                  {hours.map((item, index) => {
                    const isSelected = selectedHour === item;
                    return (
                      <ScheduleItem
                        key={`${item}-${index}`}
                        cardWidth={gridCardWidth}
                        isSelected={isSelected}
                        activeOpacity={0.8}
                        onPress={() => {
                          setSelectedHour(item);
                          setShowConfirmationModal(true);
                        }}
                      >
                        <ScheduleText isSelected={isSelected}>
                          {formatHourLabel(item)}
                        </ScheduleText>
                      </ScheduleItem>
                    );
                  })}
                </HoursGrid>
              ) : (
                <StateBox>
                  <Feather
                    name="clock"
                    size={20}
                    color={theme.colors.text_secondary}
                  />
                  <StateText>
                    Nenhum horário disponível para esta data.
                  </StateText>
                </StateBox>
              )}
            </HoursSection>
          )}
        </ContentWrapper>
      </ScrollBody>

      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmationModal(false)}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Confirmar orientação</ModalTitle>
            <ModalText>
              Você selecionou o seguinte horário para sua reunião de TCC:
            </ModalText>

            <ModalSummaryPill>
              <Feather
                name="calendar"
                size={15}
                color={theme.colors.primary_dark}
              />
              <ModalSummaryText>
                {selectedDate &&
                  format(
                    new Date(`${selectedDate}T00:00:00`),
                    "dd/MM/yyyy"
                  )}{" "}
                às {selectedHour ? formatHourLabel(selectedHour) : ""}
              </ModalSummaryText>
            </ModalSummaryPill>

            <ModalButtonContainer>
              <ModalButton
                onPress={() => setShowConfirmationModal(false)}
                disabled={submitting}
              >
                <ModalButtonText>Cancelar</ModalButtonText>
              </ModalButton>

              <ModalButton
                isConfirm
                onPress={handleConfirm}
                disabled={submitting}
              >
                <ModalButtonText isConfirm>
                  {submitting ? "Agendando..." : "Confirmar"}
                </ModalButtonText>
              </ModalButton>
            </ModalButtonContainer>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      <Modal
        visible={!!bookingUrl}
        animationType="slide"
        onRequestClose={handleCloseWebView}
      >
        <WebViewContainer>
          <WebViewHeader>
            <WebViewTitle>Concluir Agendamento</WebViewTitle>
            <WebViewCloseButton onPress={handleCloseWebView}>
              <WebViewCloseText>Concluir / Fechar</WebViewCloseText>
            </WebViewCloseButton>
          </WebViewHeader>
          {bookingUrl && (
            <WebView
              source={{ uri: bookingUrl }}
              startInLoadingState
              renderLoading={() => (
                <ActivityIndicator
                  size="large"
                  color={theme.colors.primary}
                  style={{ flex: 1 }}
                />
              )}
            />
          )}
        </WebViewContainer>
      </Modal>
    </Container>
  );
}
