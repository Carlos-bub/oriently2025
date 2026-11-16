import axios from "axios";
import Constants from "expo-constants";
import {
  User,
  EventType,
  AvailabilitySchedule,
  CalendlyEvent,
  Invitee,
} from "./types";
import {
  createApiClient,
  getAuthProviderRef,
  resolveBackendUrl,
} from "./apiClient";

const env = process.env as Record<string, string | undefined>;
const BACKEND_URL = resolveBackendUrl(
  env.EXPO_PUBLIC_BACKEND_URL,
  Constants.expoConfig?.hostUri
);

const api = createApiClient(BACKEND_URL, getAuthProviderRef());

// Cache de participantes (invitees)
const inviteesCache: { [key: string]: Invitee[] } = {};

// Limpar cache
export const clearInviteesCache = () => {
  Object.keys(inviteesCache).forEach((key) => {
    delete inviteesCache[key];
  });
};

// Busca informações do orientador via BFF
export const getUserInfo = async (): Promise<User | null> => {
  try {
    const response = await api.get<{ resource: User }>("/api/calendly/me");
    return response.data.resource;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
};

// Busca tipos de eventos permitidos via BFF
export const getEventTypes = async (_userUri?: string): Promise<EventType[]> => {
  try {
    const response = await api.get<{ collection: EventType[] }>(
      "/api/calendly/event-types"
    );
    return response.data.collection;
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return [];
  }
};

// Busca horários disponíveis via BFF preservando os timestamps ISO UTC originais
export const getAvailableTimes = async (
  eventTypeUri: string,
  selectedDate: string
): Promise<string[]> => {
  const startLocal = new Date(`${selectedDate}T00:00:00`);
  const endLocal = new Date(`${selectedDate}T23:59:59.999`);

  const startUTC = startLocal.toISOString();
  const endUTC = endLocal.toISOString();

  const response = await api.get<{ collection: AvailabilitySchedule[] }>(
    "/api/calendly/available-times",
    {
      params: {
        eventTypeUri,
        startTime: startUTC,
        endTime: endUTC,
      },
    }
  );

  // Preserva os timestamps ISO UTC originais; a formatação ocorre apenas na UI
  return response.data.collection.map((schedule) => schedule.start_time);
};

// Mantido para compatibilidade com Profile enquanto a migração avança
export const getEventInvitees = async (
  eventUri: string
): Promise<Invitee[]> => {
  if (inviteesCache[eventUri]) {
    return inviteesCache[eventUri];
  }
  return [];
};

// Busca todos os eventos do usuário autenticado via BFF (ativos, passados e cancelados)
export const getPastAndMissedEvents = async (
  _userUri?: string,
  _currentUserEmail?: string
) => {
  try {
    const response = await api.get<{
      activeEvents: CalendlyEvent[];
      pastEvents: CalendlyEvent[];
      missedEvents: CalendlyEvent[];
    }>("/api/calendly/events");

    const { activeEvents, pastEvents, missedEvents } = response.data;

    [...activeEvents, ...pastEvents, ...missedEvents].forEach((event) => {
      if (event.invitees) {
        inviteesCache[event.uri] = event.invitees;
      }
    });

    return {
      activeEvents,
      pastEvents,
      missedEvents,
    };
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return { activeEvents: [], pastEvents: [], missedEvents: [] };
  }
};

// Fluxo temporário preservado até a Fase 3 (migração para POST /invitees nativo)
export const scheduleEvent = async (
  eventTypeUri: string,
  selectedDate: string,
  selectedTimeOrIso: string
) => {
  try {
    const apiBaseUrl = env.EXPO_PUBLIC_API_BASE_URL;
    const apiToken = env.EXPO_PUBLIC_API_TOKEN;

    if (!apiBaseUrl || !apiToken) {
      return {
        success: false,
        error:
          "Agendamento nativo será habilitado na Fase 3. Configure EXPO_PUBLIC_API_BASE_URL/TOKEN para o fluxo legado temporário.",
      };
    }

    const startDate = selectedTimeOrIso.includes("T")
      ? new Date(selectedTimeOrIso)
      : new Date(`${selectedDate}T${selectedTimeOrIso}:00`);

    const response = await axios.post(
      `${apiBaseUrl}/scheduling_links`,
      {
        max_event_count: 1,
        owner: eventTypeUri,
        owner_type: "EventType",
        start_time_window: {
          start_time: startDate.toISOString(),
          end_time: new Date(
            startDate.getTime() + 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

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
    return {
      success: false,
      error:
        error.response?.data?.message || "Não foi possível criar o agendamento.",
    };
  }
};

// Cancela evento via BFF com validação de autorização no backend
export const cancelEvent = async (eventUri: string) => {
  try {
    const eventUuid = eventUri.split("/").pop();
    if (!eventUuid) {
      return {
        success: false,
        error: "Identificador de evento inválido.",
      };
    }

    await api.post(`/api/calendly/events/${eventUuid}/cancel`, {
      reason: "Cancelado pelo usuário",
    });

    clearInviteesCache();

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Não foi possível cancelar o evento.",
    };
  }
};
