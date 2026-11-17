import { AxiosInstance } from "axios";
import Constants from "expo-constants";
import {
  User,
  EventType,
  AvailabilitySchedule,
  Invitee,
  BookingResult,
  CancelEventResult,
  PastAndMissedEventsResult,
} from "./types";
import {
  createApiClient,
  getAuthProviderRef,
  resolveBackendUrl,
} from "./apiClient";
import {
  CreateNativeBookingParams,
  executeCancelEvent,
  executeNativeBooking,
  fetchEventsWithMeta,
} from "./bookingService";
import {
  cancelDemoEvent,
  createDemoBooking,
  getDemoAvailableTimes,
  getDemoEvents,
  getDemoEventTypes,
  getDemoUserInfo,
  isDemoModeActive,
} from "./demoData";

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
  if (isDemoModeActive()) {
    return getDemoUserInfo();
  }
  const response = await api.get<{ resource: User | null }>("/api/calendly/me");
  return response.data.resource;
};

// Busca tipos de eventos permitidos via BFF (propaga erros reais)
export const getEventTypes = async (_userUri?: string): Promise<EventType[]> => {
  if (isDemoModeActive()) {
    return getDemoEventTypes();
  }
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
  if (isDemoModeActive()) {
    return getDemoAvailableTimes(eventTypeUri, selectedDate);
  }
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

// Busca todos os eventos do usuário autenticado via BFF (propaga erros reais, partialErrors e truncated)
export const getPastAndMissedEvents = async (
  _userUri?: string,
  _currentUserEmail?: string
): Promise<PastAndMissedEventsResult> => {
  if (isDemoModeActive()) {
    return getDemoEvents((uri, invitees) => {
      inviteesCache[uri] = invitees;
    });
  }
  return fetchEventsWithMeta(api, (uri, invitees) => {
    inviteesCache[uri] = invitees;
  });
};

// Cria agendamento real diretamente via POST /api/calendly/bookings -> Calendly POST /invitees
export const createNativeBooking = async (
  params: CreateNativeBookingParams,
  client: AxiosInstance = api
): Promise<BookingResult> => {
  if (isDemoModeActive()) {
    return createDemoBooking(params);
  }
  return executeNativeBooking(params, client, clearInviteesCache);
};

// Cancela evento via BFF com validação de autorização no backend
export const cancelEvent = async (
  eventUri: string
): Promise<CancelEventResult> => {
  if (isDemoModeActive()) {
    return cancelDemoEvent(eventUri);
  }
  return executeCancelEvent(eventUri, api, clearInviteesCache);
};
