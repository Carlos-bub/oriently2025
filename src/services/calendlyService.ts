import axios from "axios";
import { User, EventType, AvailabilitySchedule } from "./types";
import { isBefore } from "date-fns";
import Constants from "expo-constants";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// Busca informações do usuário
export const getUserInfo = async (): Promise<User | null> => {
  try {
    const response = await api.get<{ resource: User }>("/users/me");
    return response.data.resource;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
};

// Busca tipos de eventos disponíveis do usuário
export const getEventTypes = async (userUri: string): Promise<EventType[]> => {
  try {
    const response = await api.get<{ collection: EventType[] }>(
      `/event_types?user=${encodeURIComponent(userUri)}`
    );
    return response.data.collection;
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return [];
  }
};

// Busca horários disponíveis para um evento 
export const getAvailableTimes = async (
  eventTypeUri: string,
  selectedDate: string
): Promise<string[]> => {
  try {
    const startLocal = new Date(`${selectedDate}T00:00:00`);
    const endLocal = new Date(`${selectedDate}T23:59:59.999`);

    const startUTC = startLocal.toISOString();
    const endUTC = endLocal.toISOString();

    const response = await api.get<{ collection: AvailabilitySchedule[] }>(
      `/event_type_available_times?event_type=${encodeURIComponent(
        eventTypeUri
      )}&start_time=${startUTC}&end_time=${endUTC}`
    );

    const availableTimes = response.data.collection.map((schedule) => {
      const utcTime = schedule.start_time;
      const localDate = new Date(utcTime);
      return localDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    });

    return availableTimes;
  } catch (error) {
    console.error("Erro ao buscar horários disponíveis:", error);
    return [];
  }
};

// Busca todos os eventos agendados (ativos, passados e cancelados)
export const getPastAndMissedEvents = async (userUri: string) => {
  try {
    const response = await api.get(`/scheduled_events`, {
      params: {
        user: userUri,
        status: ["active", "canceled", "completed"],
        count: 100,
      },
    });

    const events = response.data.collection;
    const now = new Date();

    return {
      activeEvents: events.filter(
        (event: any) =>
          event.status === "active" &&
          !isBefore(new Date(event.start_time), now)
      ),
      pastEvents: events.filter(
        (event: any) =>
          event.status === "active" && isBefore(new Date(event.start_time), now)
      ),
      missedEvents: events.filter((event: any) => event.status === "canceled"),
    };
  } catch (error: any) {
    console.error("Erro ao buscar eventos:", error);
    return { activeEvents: [], pastEvents: [], missedEvents: [] };
  }
};

export const scheduleEvent = async (
  eventTypeUri: string,
  email: string,
  selectedDate: string,
  selectedTime: string
) => {
  try {
    const startTime = `${selectedDate}T${selectedTime}:00Z`;

    console.log("Tentando agendar com:", {
      eventTypeUri,
      email,
      startTime,
    });

    // Cria um link de agendamento instantâneo
    const response = await api.post("/scheduling_links", {
      max_event_count: 1,
      owner: eventTypeUri,
      owner_type: "EventType",
      start_time_window: {
        start_time: startTime,
        end_time: new Date(
          new Date(startTime).getTime() + 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    });

    console.log("Link de agendamento criado:", response.data);

    if (response.data.resource?.booking_url) {
      return {
        success: true,
        schedulingUrl: response.data.resource.booking_url,
      };
    }

    return {
      success: false,
      error: "Não foi possível criar o link de agendamento.",
    };
  } catch (error: any) {
    console.error("Erro detalhado ao agendar evento:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
    });

    let errorMessage = "Não foi possível criar o agendamento.";
    if (error.response?.status === 400) {
      errorMessage = "Horário indisponível ou inválido.";
    } else if (error.response?.status === 401) {
      errorMessage = "Erro de autenticação com o Calendly.";
    } else if (error.response?.status === 404) {
      errorMessage = "Tipo de evento não encontrado.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const cancelEvent = async (eventUri: string) => {
  try {
    const eventUuid = eventUri.split("/").pop();

    console.log("Tentando cancelar evento:", {
      eventUri,
      eventUuid,
    });

    const response = await api.post(
      `/scheduled_events/${eventUuid}/cancellation`,
      {
        reason: "Cancelado pelo usuário",
      }
    );

    console.log("Resposta do cancelamento:", response.data);

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Erro ao cancelar evento:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
    });

    let errorMessage = "Não foi possível cancelar o evento.";
    if (error.response?.status === 404) {
      errorMessage = "Evento não encontrado.";
    } else if (error.response?.status === 403) {
      errorMessage = "Sem permissão para cancelar este evento.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};
