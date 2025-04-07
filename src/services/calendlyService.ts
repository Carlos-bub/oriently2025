import axios from "axios";
import { User, EventType, AvailabilitySchedule, CalendlyEvent, Invitee } from "./types";
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

// Cache de participantes (invitees)
const inviteesCache: { [key: string]: Invitee[] } = {};

// Limpar cache
export const clearInviteesCache = () => {
  Object.keys(inviteesCache).forEach(key => {
    delete inviteesCache[key];
  });
};

// Função auxiliar para adicionar atraso
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

// Busca os participantes (invitees) de um evento específico com tratamento de cache e retry
export const getEventInvitees = async (eventUri: string): Promise<Invitee[]> => {
  try {
    // Verificar cache
    if (inviteesCache[eventUri]) {
      return inviteesCache[eventUri];
    }
    
    const eventUuid = eventUri.split("/").pop();
    const response = await api.get(`/scheduled_events/${eventUuid}/invitees`);
    const invitees = response.data.collection;
    
    // Armazenar no cache
    inviteesCache[eventUri] = invitees;
    
    return invitees;
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.log("Limite de taxa excedido. Aguardando 3 segundos antes de tentar novamente...");
      await delay(3000);
      return getEventInvitees(eventUri);
    }
    
    console.error(`Erro ao buscar participantes do evento:`, error.response?.status || error.message);
    return [];
  }
};

// Busca participantes em lote para vários eventos para evitar muitas requisições individuais
export const getInviteesInBatch = async (eventUris: string[]): Promise<{[eventUri: string]: Invitee[]}> => {
  const result: {[eventUri: string]: Invitee[]} = {};
  const uncachedEvents: string[] = [];
  
  // verifica quais eventos já estão em cache
  eventUris.forEach(uri => {
    if (inviteesCache[uri]) {
      result[uri] = inviteesCache[uri];
    } else {
      uncachedEvents.push(uri);
    }
  });
  
  if (uncachedEvents.length === 0) {
    return result;
  }
  
  // carregar eventos não estao no cache em lotes para evitar sobrecarga da API
  const batchSize = 5; 
  
  for (let i = 0; i < uncachedEvents.length; i += batchSize) {
    const batch = uncachedEvents.slice(i, i + batchSize);
    
    try {
      // Fazer requisições em paralelo para o lote atual, mas com atraso entre lotes
      const batchResults = await Promise.all(
        batch.map(async (uri) => {
          try {
            const invitees = await getEventInvitees(uri);
            return { uri, invitees };
          } catch (error) {
            console.error(`Erro ao buscar invitees para ${uri}:`, error);
            return { uri, invitees: [] };
          }
        })
      );
      
      // Armazenar resultados
      batchResults.forEach(({ uri, invitees }) => {
        result[uri] = invitees;
        inviteesCache[uri] = invitees;
      });
      
      // Adicionar atraso entre lotes para evitar limitação de taxa
      if (i + batchSize < uncachedEvents.length) {
        await delay(1000);
      }
    } catch (error) {
      console.error(`Erro ao processar lote de invitees:`, error);
    }
  }
  
  return result;
};

// Busca todos os eventos agendados (ativos, passados e cancelados)
export const getPastAndMissedEvents = async (userUri: string, currentUserEmail?: string) => {
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

    // Separar eventos por status
    let activeEvents = events.filter(
        (event: CalendlyEvent) =>
          event.status === "active" &&
          !isBefore(new Date(event.start_time), now)
    );
    
    let pastEvents = events.filter(
        (event: CalendlyEvent) =>
          event.status === "active" && isBefore(new Date(event.start_time), now)
    );
    
    let missedEvents = events.filter(
      (event: CalendlyEvent) => event.status === "canceled"
    );

    // Se um email de usuário foi fornecido, vamos buscar participantes e filtrar eventos
    if (currentUserEmail) {
      // Coletar todos os URIs de eventos que precisamos verificar
      const allEventUris = [
        ...activeEvents.map((event: CalendlyEvent) => event.uri),
        ...pastEvents.map((event: CalendlyEvent) => event.uri),
        ...missedEvents.map((event: CalendlyEvent) => event.uri)
      ];
      
      // Buscar participantes em lote
      const allInvitees = await getInviteesInBatch(allEventUris);
      
      // Adicionar participantes aos eventos e filtrar
      activeEvents = activeEvents
        .map((event: CalendlyEvent) => ({
          ...event,
          invitees: allInvitees[event.uri] || []
        }))
        .filter((event: CalendlyEvent) => 
          event.invitees?.some((invitee: Invitee) => 
            invitee.email && invitee.email.toLowerCase() === currentUserEmail.toLowerCase()
          )
        );
      
      pastEvents = pastEvents
        .map((event: CalendlyEvent) => ({
          ...event,
          invitees: allInvitees[event.uri] || []
        }))
        .filter((event: CalendlyEvent) => 
          event.invitees?.some((invitee: Invitee) => 
            invitee.email && invitee.email.toLowerCase() === currentUserEmail.toLowerCase()
          )
        );
      
      missedEvents = missedEvents
        .map((event: CalendlyEvent) => ({
          ...event,
          invitees: allInvitees[event.uri] || []
        }))
        .filter((event: CalendlyEvent) => 
          event.invitees?.some((invitee: Invitee) => 
            invitee.email && invitee.email.toLowerCase() === currentUserEmail.toLowerCase()
          )
        );
    }

    return {
      activeEvents,
      pastEvents,
      missedEvents,
    };
  } catch (error: any) {
    console.error("Erro ao buscar eventos:", error);
    return { activeEvents: [], pastEvents: [], missedEvents: [] };
  }
};

export const scheduleEvent = async (
  eventTypeUri: string,
  selectedDate: string,
  selectedTime: string
) => {
  try {
    const startTime = `${selectedDate}T${selectedTime}:00Z`;

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
    console.error("Erro ao agendar evento:", error.message);

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

    const response = await api.post(
      `/scheduled_events/${eventUuid}/cancellation`,
      {
        reason: "Cancelado pelo usuário",
      }
    );

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Erro ao cancelar evento:", error.message);

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
