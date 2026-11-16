import { AxiosInstance } from "axios";
import Constants from "expo-constants";
import {
  User,
  EventType,
  AvailabilitySchedule,
  CalendlyEvent,
  Invitee,
  BookingResult,
} from "./types";
import {
  createApiClient,
  getAuthProviderRef,
  resolveBackendUrl,
} from "./apiClient";
import {
  CreateNativeBookingParams,
  executeNativeBooking,
} from "./bookingService";

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

export const getInviteesCacheSize = () => Object.keys(inviteesCache).length;

export const seedInviteesCacheForTest = (uri: string, invitees: Invitee[]) => {
  inviteesCache[uri] = invitees;
};

// Busca informações do orientador via BFF (propaga erros reais de rede/auth/servidor)
export const getUserInfo = async (): Promise<User | null> => {
  const response = await api.get<{ resource: User | null }>("/api/calendly/me");
  return response.data.resource;
};

// Busca tipos de eventos permitidos via BFF (propaga erros reais)
export const getEventTypes = async (_userUri?: string): Promise<EventType[]> => {
  const response = await api.get<{ collection: EventType[] }>(
    "/api/calendly/event-types"
  );
  return response.data.collection || [];
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

// Mantido para compatibilidade com Profile
export const getEventInvitees = async (
  eventUri: string
): Promise<Invitee[]> => {
  if (inviteesCache[eventUri]) {
    return inviteesCache[eventUri];
  }
  return [];
};

// Busca todos os eventos do usuário autenticado via BFF (propaga erros reais)
export const getPastAndMissedEvents = async (
  _userUri?: string,
  _currentUserEmail?: string
) => {
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
};

// Cria agendamento real diretamente via POST /api/calendly/bookings -> Calendly POST /invitees
export const createNativeBooking = async (
  params: CreateNativeBookingParams,
  client: AxiosInstance = api
): Promise<BookingResult> => {
  return executeNativeBooking(params, client, clearInviteesCache);
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
