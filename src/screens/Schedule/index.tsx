import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
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
import { useDialog } from "../../contexts/DialogContext";
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
  HoursTitleGroup,
  HoursSectionDot,
  HoursTitle,
  SelectedDateBadge,
  SelectedDateBadgeText,
  HoursGrid,
  ScheduleItem,
  ScheduleText,
  StateBox,
  StateIconBadge,
  StateCompassDot,
  StateTitle,
  StateText,
  RetryButton,
  RetryButtonText,
  ModalOverlay,
  ModalContent,
  ModalScroll,
  ConfirmIconBadge,
  ModalTitle,
  ModalText,
  ModalDetailsCard,
  ModalDetailTitle,
  ModalDetailRow,
  ModalDetailText,
  ModalButtonContainer,
  ModalButton,
  ModalButtonText,
  SuccessIconBadge,
  SuccessStatusPill,
  SuccessStatusDot,
  SuccessStatusText,
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
  const { showDialog } = useDialog();

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
  const successScale = useRef(new Animated.Value(0.8)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const isFocused = useIsFocused();

  const selectedEventType = eventTypes.find((t) => t.uri === eventTypeUri);

  useEffect(() => {
    if (confirmedBooking) {
      successScale.setValue(0.8);
      successOpacity.setValue(0);
      Animated.parallel([
        Animated.spring(successScale, {
          toValue: 1,
          friction: 6,
          tension: 90,
          useNativeDriver: true,
        }),
        Animated.timing(successOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [confirmedBooking, successScale, successOpacity]);

  // 3 colunas em telas normais; 2 colunas em dispositivos muito estreitos (< 340px)
  const gridColumns = width < 340 ? 2 : 3;
  const gridCardWidth = Math.floor(
    (width - 40 - 10 * (gridColumns - 1)) / gridColumns
  );

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
      showDialog({
        variant: "warning",
        title: "Dados incompletos",
        message: "Selecione uma data e um horário antes de confirmar.",
      });
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
        showDialog({
          variant: "warning",
          title: "Horário indisponível",
          message:
            result.error || "Este horário não está mais disponível.",
        });
        fetchAvailableTimes();
        return;
      }

      if (
        result.code === "UNCERTAIN_BOOKING_STATE" ||
        result.code === "TIMEOUT" ||
        result.code === "NETWORK_ERROR" ||
        result.code === "BOOKING_IN_PROGRESS"
      ) {
        setShowConfirmationModal(false);
        showDialog({
          variant: "warning",
          title: "Verifique sua agenda",
          message:
            result.error ||
            "Não foi possível confirmar a resposta a tempo. Consulte sua agenda antes de tentar novamente.",
          actions: [
            { label: "Fechar", tone: "secondary" },
            {
              label: "Ver agenda",
              tone: "primary",
              onPress: () => {
                resetState();
                navigation.navigate("Profile");
              },
            },
          ],
        });
        return;
      }

      if (result.code === "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD") {
        setShowConfirmationModal(false);
        setSelectedHour(null);
        setIdempotencyKey(null);
        showDialog({
          variant: "warning",
          title: "Solicitação inválida",
          message: result.error || "Selecione o horário novamente.",
        });
        return;
      }

      showDialog({
        variant: "danger",
        title: "Não foi possível agendar",
        message: result.error || "Falha ao confirmar o agendamento.",
      });
    } catch (error) {
      console.error("Erro no agendamento:", error);
      showDialog({
        variant: "danger",
        title: "Erro",
        message: "Não foi possível concluir o agendamento.",
      });
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
      showDialog({
        variant: "warning",
        title: "Data inválida",
        message: "Por favor, selecione uma data futura no calendário.",
      });
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
    const startDate = new Date(startIso);
    const start = formatHourLabel(startIso);
    if (!endIso) return start;
    const endDate = new Date(endIso);
    const end = formatHourLabel(endIso);
    const durationMin = Math.round(
      (endDate.getTime() - startDate.getTime()) / 60000
    );
    return durationMin > 0
      ? `${start} – ${end} (${durationMin} min)`
      : `${start} – ${end}`;
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
          paddingBottom: Math.max(insets.bottom, 16) + 96,
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
                todayBackgroundColor: theme.colors.boxprofile,
                dayTextColor: theme.colors.text_primary,
                textDisabledColor: "#CBD5E1",
                arrowColor: theme.colors.primary_dark,
                monthTextColor: theme.colors.text_primary,
                textSectionTitleColor: theme.colors.text_secondary,
                selectedDayBackgroundColor: theme.colors.primary,
                selectedDayTextColor: "#FFFFFF",
                textDayFontFamily: theme.fonts.Subtituloslight,
                textMonthFontFamily: theme.fonts.Subtitulos,
                textDayHeaderFontFamily: theme.fonts.buttons,
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 12,
              }}
            />
          </CalendarWrapper>

          {!selectedDate ? (
            <HoursSection>
              <StateBox>
                <StateIconBadge>
                  <Feather
                    name={typesError ? "alert-circle" : "calendar"}
                    size={18}
                    color={
                      typesError ? "#DC2626" : theme.colors.primary_dark
                    }
                  />
                  {!typesError && <StateCompassDot />}
                </StateIconBadge>
                <StateTitle>
                  {loadingTypes
                    ? "Carregando agenda"
                    : typesError
                      ? "Não foi possível carregar"
                      : "Escolha uma data"}
                </StateTitle>
                <StateText>
                  {loadingTypes
                    ? "Buscando os tipos de orientação disponíveis..."
                    : typesError
                      ? typesError
                      : "Toque em um dia no calendário acima para ver os horários livres."}
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
                <HoursTitleGroup>
                  <HoursSectionDot />
                  <HoursTitle>Horários disponíveis</HoursTitle>
                </HoursTitleGroup>
                <SelectedDateBadge>
                  <Feather
                    name="calendar"
                    size={11}
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
                  <StateTitle style={{ marginTop: 10 }}>
                    Buscando horários
                  </StateTitle>
                  <StateText>
                    Consultando a disponibilidade do orientador...
                  </StateText>
                </StateBox>
              ) : timesError ? (
                <StateBox>
                  <StateIconBadge>
                    <Feather name="alert-circle" size={18} color="#DC2626" />
                  </StateIconBadge>
                  <StateTitle>Erro ao consultar horários</StateTitle>
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
                        activeOpacity={0.78}
                        disabled={submitting}
                        onPress={() => handleSelectHour(item)}
                        accessibilityRole="button"
                        accessibilityLabel={`Horário ${formatHourLabel(item)}`}
                        accessibilityState={{
                          selected: isSelected,
                          disabled: submitting,
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
                  <StateIconBadge>
                    <Feather
                      name="clock"
                      size={18}
                      color={theme.colors.text_secondary}
                    />
                  </StateIconBadge>
                  <StateTitle>Sem horários livres</StateTitle>
                  <StateText>
                    Nenhum horário disponível para esta data. Tente outro dia no
                    calendário.
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
        <ModalOverlay topInset={insets.top} bottomInset={insets.bottom}>
          <ModalContent>
            <ModalScroll>
              <ConfirmIconBadge>
                <Feather
                  name="calendar"
                  size={20}
                  color={theme.colors.primary}
                />
              </ConfirmIconBadge>

              <ModalTitle>Confirmar orientação</ModalTitle>
              <ModalText>Revise os detalhes antes de confirmar.</ModalText>

              <ModalDetailsCard>
                {selectedEventType && (
                  <ModalDetailTitle numberOfLines={2}>
                    {selectedEventType.name}
                    {selectedEventType.duration
                      ? ` (${selectedEventType.duration} min)`
                      : ""}
                  </ModalDetailTitle>
                )}

                <ModalDetailRow>
                  <Feather
                    name="calendar"
                    size={14}
                    color={theme.colors.primary_dark}
                  />
                  <ModalDetailText>
                    {selectedDate &&
                      format(
                        new Date(`${selectedDate}T00:00:00`),
                        "dd/MM/yyyy"
                      )}
                  </ModalDetailText>
                </ModalDetailRow>

                <ModalDetailRow>
                  <Feather
                    name="clock"
                    size={14}
                    color={theme.colors.lavender}
                  />
                  <ModalDetailText>
                    {selectedHour ? formatHourLabel(selectedHour) : ""}
                  </ModalDetailText>
                </ModalDetailRow>
              </ModalDetailsCard>

              <ModalButtonContainer>
                <ModalButton
                  onPress={() => setShowConfirmationModal(false)}
                  disabled={submitting}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Voltar"
                >
                  <ModalButtonText>Voltar</ModalButtonText>
                </ModalButton>

                <ModalButton
                  isConfirm
                  onPress={handleConfirm}
                  disabled={submitting}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="Confirmar reunião"
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <ModalButtonText isConfirm>
                      Confirmar reunião
                    </ModalButtonText>
                  )}
                </ModalButton>
              </ModalButtonContainer>
            </ModalScroll>
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
        <ModalOverlay topInset={insets.top} bottomInset={insets.bottom}>
          <ModalContent>
            <ModalScroll>
              <Animated.View
                style={{
                  transform: [{ scale: successScale }],
                  opacity: successOpacity,
                }}
              >
                <SuccessIconBadge>
                  <Feather name="check-circle" size={26} color="#15803D" />
                </SuccessIconBadge>
              </Animated.View>

              <SuccessStatusPill>
                <SuccessStatusDot />
                <SuccessStatusText>Confirmada</SuccessStatusText>
              </SuccessStatusPill>

              <ModalTitle>Reunião agendada!</ModalTitle>
              <ModalText>
                Sua orientação foi confirmada com sucesso.
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
            </ModalScroll>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}
