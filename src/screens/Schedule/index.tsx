import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, Alert, Linking } from "react-native";
import { Calendar } from "react-native-calendars";
import { format } from "date-fns";
import { Modal } from "react-native";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import "../../utils/calendarLocale";
import {
  getUserInfo,
  getEventTypes,
  getAvailableTimes,
  scheduleEvent,
} from "../../services/calendlyService";
import {
  Container,
  ScheduleList,
  ScheduleItem,
  ScheduleText,
  ScheduleListWrapper,
  Title,
  TitleWrapper,
  CalendarWrapper,
  ModalOverlay,
  ModalContent,
  ModalText,
  ModalButtonContainer,
  ModalButton,
  ModalButtonText,
} from "./styles";
import theme from "src/global/styles/theme";

export function Schedule() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState<string[]>([]);
  const [userUri, setUserUri] = useState<string | null>(null);
  const [eventTypeUri, setEventTypeUri] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const isFocused = useIsFocused();

  const resetState = useCallback(() => {
    setSelectedDate(null);
    setSelectedHour(null);
    setHours([]);
    setShowConfirmationModal(false);
  }, []);

  // Reseta o estado quando sai da tela
  useEffect(() => {
    if (!isFocused) {
      resetState();
    }
  }, [isFocused, resetState]);

  useFocusEffect(
    useCallback(() => {
      const fetchUserAndEventType = async () => {
        try {
          setLoading(true);
          const user = await getUserInfo();
          if (user) {
            setUserUri(user.uri);
            const types = await getEventTypes(user.uri);
            if (types && types.length > 0) {
              setEventTypeUri(types[0].uri);
            }
          }
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
          Alert.alert(
            "Erro",
            "Não foi possível carregar os dados necessários."
          );
        } finally {
          setLoading(false);
        }
      };

      fetchUserAndEventType();
    }, [])
  );

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!selectedDate || !eventTypeUri) return;

      setLoading(true);
      try {
        console.log("Buscando horários para:", {
          eventTypeUri,
          selectedDate,
        });

        const availableTimes = await getAvailableTimes(
          eventTypeUri,
          selectedDate
        );

        console.log("Horários disponíveis:", availableTimes);
        setHours(availableTimes);
      } catch (error) {
        console.error("Erro ao buscar horários:", error);
        Alert.alert("Erro", "Não foi possível carregar os horários.");
      }
      setLoading(false);
    };

    fetchAvailableTimes();
  }, [selectedDate, eventTypeUri]);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedHour || !eventTypeUri) {
      Alert.alert("Erro", "Selecione uma data e horário.");
      return;
    }

    setLoading(true);
    try {
      console.log("Iniciando agendamento:", {
        eventTypeUri,
        selectedDate,
        selectedHour,
      });

      const result = await scheduleEvent(
        eventTypeUri,
        selectedDate,
        selectedHour
      );

      if (result.success && result.schedulingUrl) {
        setShowConfirmationModal(false);
        setSelectedHour(null);

        await Linking.openURL(result.schedulingUrl);

        Alert.alert(
          "Sucesso",
          "Por favor, complete seu agendamento no navegador."
        );
      } else {
        Alert.alert("Erro", result.error || "Falha ao criar agendamento.");
      }
    } catch (error) {
      console.error("Erro no agendamento:", error);
      Alert.alert("Erro", "Não foi possível criar o agendamento.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: any) => {
    const selectedDateStr = date.dateString;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDateObj = new Date(selectedDateStr);
    selectedDateObj.setHours(0, 0, 0, 0);

    if (selectedDateObj < today) {
      Alert.alert("Data inválida", "Por favor, selecione uma data futura.");
      return;
    }

    setSelectedDate(selectedDateStr);
  };

  return (
    <Container>
      <TitleWrapper>
        <Title>Selecione uma data</Title>
      </TitleWrapper>
      <CalendarWrapper>
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={{
            [selectedDate || ""]: { selected: true, selectedColor: "#6200ee" },
          }}
          minDate={format(new Date(), "yyyy-MM-dd")}
          locale="pt-BR"
          theme={{
            todayTextColor: "#6200ee",
            textDayFontFamily: theme.fonts.Subtituloslight,
            textMonthFontFamily: theme.fonts.buttons,
            textDayHeaderFontFamily: theme.fonts.Subtituloslight,
            monthTextColor: theme.colors.primary,
          }}
        />
      </CalendarWrapper>

      {selectedDate && (
        <>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 20,
              color: "#258BFF",
            }}
          >
            {`Horários para ${format(
              new Date(selectedDate + "T00:00:00"),
              "dd/MM/yyyy"
            )}`}
          </Text>

          <View style={{ flex: 1 }}>
            {loading ? (
              <ActivityIndicator size="large" color="#6200ee" />
            ) : hours.length > 0 ? (
              <ScheduleListWrapper>
                <ScheduleList
                  data={hours}
                  keyExtractor={(item: any, index: any) => String(index)}
                  numColumns={3}
                  contentContainerStyle={{ paddingBottom: 50 }}
                  renderItem={({ item }) => (
                    <ScheduleItem
                      isSelected={selectedHour === item}
                      onPress={() => {
                        setSelectedHour(item);
                        setShowConfirmationModal(true);
                      }}
                    >
                      <ScheduleText>{item}</ScheduleText>
                    </ScheduleItem>
                  )}
                />
              </ScheduleListWrapper>
            ) : (
              <Text
                style={{ textAlign: "center", marginTop: 20, color: "#666" }}
              >
                Nenhum horário disponível para esta data.
              </Text>
            )}
          </View>
        </>
      )}

      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmationModal(false)}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalText>
              Confirmar agendamento para {"\n"}
              {selectedDate &&
                format(new Date(selectedDate + "T00:00:00"), "dd/MM/yyyy")}{" "}
              às {selectedHour}?
            </ModalText>

            <ModalButtonContainer>
              <ModalButton
                onPress={() => setShowConfirmationModal(false)}
                disabled={loading}
              >
                <ModalButtonText>Cancelar</ModalButtonText>
              </ModalButton>

              <ModalButton isConfirm onPress={handleConfirm} disabled={loading}>
                <ModalButtonText>
                  {loading ? "Agendando..." : "Confirmar"}
                </ModalButtonText>
              </ModalButton>
            </ModalButtonContainer>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}
