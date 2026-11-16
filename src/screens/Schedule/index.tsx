import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  useWindowDimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { format } from "date-fns";
import {
  useIsFocused,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "styled-components/native";

import "../../utils/calendarLocale";
import { getFriendlyApiErrorMessage } from "../../services/apiClient";
import {
  getUserInfo,
  getEventTypes,
  getAvailableTimes,
  createNativeBooking,
  clearInviteesCache,
} from "../../services/calendlyService";
import { BookingDetails, EventType } from "../../services/types";
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
  SuccessIconBadge,
  SuccessDetailsCard,
  SuccessEventTitle,
  SuccessDetailRow,
  SuccessDetailText,
  SuccessButtonsStack,
  SuccessPrimaryButton,
  SuccessPrimaryButtonText,
  SuccessSecondaryButton,
  SuccessSecondaryButtonText,
} from "./styles";

function generateIdempotencyKey(eventTypeUri: string, startTimeUtc: string) {
  const random = Math.random().toString(36).slice(2, 10);
  const eventSuffix = eventTypeUri.split("/").pop() || "evt";
  return `${eventSuffix}-${startTimeUtc}-${random}`;
}

export function Schedule() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const theme = useTheme();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState<string | null>(null);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [typesError, setTypesError] = useState<string | null>(null);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timesError, setTimesError] = useState<string | null>(null);
  const [hours, setHours] = useState<string[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [eventTypeUri, setEventTypeUri] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] =
    useState<BookingDetails | null>(null);

  const submittingRef = useRef(false);
  const isFocused = useIsFocused();

  // 3 columns with 20px horizontal padding on each side and 10px gaps
  const gridCardWidth = Math.floor((width - 40 - 20) / 3);

  const resetState = useCallback(() => {
    setSelectedDate(null);
    setSelectedHour(null);
    setIdempotencyKey(null);
    setHours([]);
    setTimesError(null);
    setShowConfirmationModal(false);
    setConfirmedBooking(null);
    submittingRef.current = false;
  }, []);

  useEffect(() => {
    if (!isFocused) {
      resetState();
    }
  }, [isFocused, resetState]);

  const fetchUserAndEventType = useCallback(async () => {
    try {
      setLoadingTypes(true);
      setTypesError(null);
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
      setTypesError(
        getFriendlyApiErrorMessage(
          error,
          "Não foi possível carregar os tipos de orientação."
        )
      );
    } finally {
      setLoadingTypes(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserAndEventType();
    }, [fetchUserAndEventType])
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
      setTimesError(
        getFriendlyApiErrorMessage(
          error,
          "Não foi possível carregar os horários disponíveis."
        )
      );
      setHours([]);
    } finally {
      setLoadingTimes(false);
    }
  }, [selectedDate, eventTypeUri]);

  useEffect(() => {
    fetchAvailableTimes();
  }, [fetchAvailableTimes]);

  const handleSelectHour = (isoUtc: string) => {
    if (!eventTypeUri) return;
    setSelectedHour(isoUtc);
    setIdempotencyKey(generateIdempotencyKey(eventTypeUri, isoUtc));
    setShowConfirmationModal(true);
  };

  const handleConfirm = async () => {
    if (submittingRef.current) return;

    if (!selectedDate || !selectedHour || !eventTypeUri) {
      Alert.alert("Erro", "Selecione uma data e horário.");
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);

    try {
      const requestKey =
        idempotencyKey || generateIdempotencyKey(eventTypeUri, selectedHour);

      const result = await createNativeBooking({
        eventTypeUri,
        startTimeUtc: selectedHour,
        idempotencyKey: requestKey,
      });

      if (result.success && result.booking) {
        setShowConfirmationModal(false);
        setSelectedHour(null);
        setIdempotencyKey(null);
        clearInviteesCache();
        setConfirmedBooking(result.booking);
        fetchAvailableTimes();
        return;
      }

      if (result.code === "SLOT_UNAVAILABLE") {
        setShowConfirmationModal(false);
        setSelectedHour(null);
        setIdempotencyKey(null);
        Alert.alert(
          "Horário indisponível",
          result.error || "Este horário não está mais disponível."
        );
        fetchAvailableTimes();
        return;
      }

      if (
        result.code === "TIMEOUT" ||
        result.code === "NETWORK_ERROR" ||
        result.code === "BOOKING_IN_PROGRESS"
      ) {
        setShowConfirmationModal(false);
        Alert.alert(
          "Confirmação pendente",
          result.error ||
            "Não foi possível confirmar a resposta a tempo. Verifique sua agenda antes de tentar novamente."
        );
        return;
      }

      Alert.alert(
        "Não foi possível agendar",
        result.error || "Falha ao confirmar o agendamento."
      );
    } catch (error) {
      console.error("Erro no agendamento:", error);
      Alert.alert("Erro", "Não foi possível concluir o agendamento.");
    } finally {
      submittingRef.current = false;
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
    setIdempotencyKey(null);
    setSelectedDate(selectedDateStr);
  };

  const formatHourLabel = (isoOrHour: string) => {
    if (!isoOrHour.includes("T")) return isoOrHour;
    return new Date(isoOrHour).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatBookingDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatBookingTimeRange = (startIso: string, endIso?: string) => {
    const start = formatHourLabel(startIso);
    if (!endIso) return start;
    return `${start} – ${formatHourLabel(endIso)}`;
  };

  const handleGoToAgenda = () => {
    resetState();
    navigation.navigate("Profile");
  };

  const handleGoHome = () => {
    resetState();
    navigation.navigate("Home");
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
                      setIdempotencyKey(null);
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
                  name={typesError ? "alert-circle" : "calendar"}
                  size={20}
                  color={typesError ? theme.colors.cancel : theme.colors.primary}
                />
                <StateText>
                  {loadingTypes
                    ? "Carregando agenda do orientador..."
                    : typesError
                      ? typesError
                      : "Selecione uma data no calendário acima para ver os horários disponíveis."}
                </StateText>
                {typesError && (
                  <RetryButton onPress={fetchUserAndEventType}>
                    <RetryButtonText>Tentar novamente</RetryButtonText>
                  </RetryButton>
                )}
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
                        disabled={submitting}
                        onPress={() => handleSelectHour(item)}
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

      {/* Modal de confirmação antes de enviar */}
      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          if (!submitting) setShowConfirmationModal(false);
        }}
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
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <ModalButtonText isConfirm>Confirmar</ModalButtonText>
                )}
              </ModalButton>
            </ModalButtonContainer>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      {/* Modal de sucesso após resposta real da API */}
      <Modal
        visible={!!confirmedBooking}
        transparent={true}
        animationType="fade"
        onRequestClose={handleGoToAgenda}
      >
        <ModalOverlay>
          <ModalContent>
            <SuccessIconBadge>
              <Feather
                name="check-circle"
                size={28}
                color={theme.colors.success}
              />
            </SuccessIconBadge>

            <ModalTitle>Reunião agendada!</ModalTitle>
            <ModalText>
              Sua orientação de TCC foi confirmada com sucesso.
            </ModalText>

            {confirmedBooking && (
              <SuccessDetailsCard>
                <SuccessEventTitle numberOfLines={2}>
                  {confirmedBooking.eventName}
                </SuccessEventTitle>

                <SuccessDetailRow>
                  <Feather
                    name="calendar"
                    size={14}
                    color={theme.colors.primary_dark}
                  />
                  <SuccessDetailText>
                    {formatBookingDate(confirmedBooking.startTime)}
                  </SuccessDetailText>
                </SuccessDetailRow>

                <SuccessDetailRow>
                  <Feather
                    name="clock"
                    size={14}
                    color={theme.colors.primary_dark}
                  />
                  <SuccessDetailText>
                    {formatBookingTimeRange(
                      confirmedBooking.startTime,
                      confirmedBooking.endTime
                    )}
                  </SuccessDetailText>
                </SuccessDetailRow>

                {confirmedBooking.locationLabel && (
                  <SuccessDetailRow>
                    <Feather
                      name="map-pin"
                      size={14}
                      color={theme.colors.lavender}
                    />
                    <SuccessDetailText numberOfLines={1}>
                      {confirmedBooking.locationLabel}
                    </SuccessDetailText>
                  </SuccessDetailRow>
                )}
              </SuccessDetailsCard>
            )}

            <SuccessButtonsStack>
              <SuccessPrimaryButton
                activeOpacity={0.85}
                onPress={handleGoToAgenda}
                accessibilityRole="button"
                accessibilityLabel="Ver meus agendamentos"
              >
                <SuccessPrimaryButtonText>
                  Ver meus agendamentos
                </SuccessPrimaryButtonText>
              </SuccessPrimaryButton>

              <SuccessSecondaryButton
                activeOpacity={0.85}
                onPress={handleGoHome}
                accessibilityRole="button"
                accessibilityLabel="Voltar ao início"
              >
                <SuccessSecondaryButtonText>
                  Voltar ao início
                </SuccessSecondaryButtonText>
              </SuccessSecondaryButton>
            </SuccessButtonsStack>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}
