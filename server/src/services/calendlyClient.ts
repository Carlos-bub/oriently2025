import axios, { AxiosInstance } from "axios";
import {
  CalendlyUser,
  CalendlyEventType,
  CalendlyAvailableTime,
  CalendlyScheduledEvent,
  CalendlyInvitee,
  CreateInviteePayload,
} from "../types/calendly";

export interface CalendlyClient {
  getCurrentUser(): Promise<CalendlyUser>;
  getEventTypes(userUri: string): Promise<CalendlyEventType[]>;
  getAvailableTimes(
    eventTypeUri: string,
    startTimeUtc: string,
    endTimeUtc: string
  ): Promise<CalendlyAvailableTime[]>;
  createInvitee(payload: CreateInviteePayload): Promise<CalendlyInvitee>;
  getScheduledEvent(eventUuid: string): Promise<CalendlyScheduledEvent>;
  getScheduledEvents(
    userUri: string,
    count?: number
  ): Promise<CalendlyScheduledEvent[]>;
  getEventInvitees(eventUuid: string): Promise<CalendlyInvitee[]>;
  cancelScheduledEvent(eventUuid: string, reason: string): Promise<void>;
}

interface CalendlyClientOptions {
  baseURL: string;
  token: string;
  timeoutMs: number;
}

interface CalendlyPaginatedResponse<T> {
  collection?: T[];
  pagination?: {
    count?: number;
    next_page?: string | null;
    next_page_token?: string | null;
  };
}

const MAX_PAGINATION_PAGES = 10;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function createCalendlyClient(
  options: CalendlyClientOptions
): CalendlyClient {
  const http: AxiosInstance = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeoutMs,
    headers: {
      "Content-Type": "application/json",
    },
  });

  http.interceptors.request.use((config) => {
    if (!options.token) {
      const err = new Error("CALENDLY_API_TOKEN não configurado no servidor.");
      (err as any).statusCode = 500;
      throw err;
    }
    config.headers.Authorization = `Bearer ${options.token}`;
    return config;
  });

  async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
    let attempt = 0;
    while (true) {
      try {
        return await fn();
      } catch (error: any) {
        if (error.response?.status === 429 && attempt < maxRetries) {
          const retryAfter = Number(error.response?.headers?.["retry-after"]);
          const waitMs = Number.isFinite(retryAfter)
            ? retryAfter * 1000
            : 1500 * (attempt + 1);
          await delay(waitMs);
          attempt += 1;
          continue;
        }
        throw error;
      }
    }
  }

  return {
    async getCurrentUser() {
      const res = await withRetry(() =>
        http.get<{ resource: CalendlyUser }>("/users/me")
      );
      return res.data.resource;
    },

    async getEventTypes(userUri: string) {
      const res = await withRetry(() =>
        http.get<{ collection: CalendlyEventType[] }>("/event_types", {
          params: { user: userUri },
        })
      );
      return res.data.collection || [];
    },

    async getAvailableTimes(
      eventTypeUri: string,
      startTimeUtc: string,
      endTimeUtc: string
    ) {
      const res = await withRetry(() =>
        http.get<{ collection: CalendlyAvailableTime[] }>(
          "/event_type_available_times",
          {
            params: {
              event_type: eventTypeUri,
              start_time: startTimeUtc,
              end_time: endTimeUtc,
            },
          }
        )
      );
      return res.data.collection || [];
    },

    async createInvitee(payload: CreateInviteePayload) {
      const res = await withRetry(
        () => http.post<{ resource: CalendlyInvitee }>("/invitees", payload),
        0 // não repetir POST /invitees automaticamente sem idempotência explícita
      );
      return res.data.resource;
    },

    async getScheduledEvent(eventUuid: string) {
      const res = await withRetry(() =>
        http.get<{ resource: CalendlyScheduledEvent }>(
          `/scheduled_events/${encodeURIComponent(eventUuid)}`
        )
      );
      return res.data.resource;
    },

    async getScheduledEvents(userUri: string, count = 100) {
      const collected: CalendlyScheduledEvent[] = [];
      let pageToken: string | undefined;

      for (let page = 0; page < MAX_PAGINATION_PAGES; page += 1) {
        const res = await withRetry(() =>
          http.get<CalendlyPaginatedResponse<CalendlyScheduledEvent>>(
            "/scheduled_events",
            {
              params: {
                user: userUri,
                status: ["active", "canceled", "completed"],
                count,
                ...(pageToken ? { page_token: pageToken } : {}),
              },
            }
          )
        );

        if (res.data.collection?.length) {
          collected.push(...res.data.collection);
        }

        const nextToken = res.data.pagination?.next_page_token;
        if (!nextToken) break;
        pageToken = nextToken;
      }

      return collected;
    },

    async getEventInvitees(eventUuid: string) {
      const collected: CalendlyInvitee[] = [];
      let pageToken: string | undefined;

      for (let page = 0; page < MAX_PAGINATION_PAGES; page += 1) {
        const res = await withRetry(() =>
          http.get<CalendlyPaginatedResponse<CalendlyInvitee>>(
            `/scheduled_events/${encodeURIComponent(eventUuid)}/invitees`,
            {
              params: {
                count: 100,
                ...(pageToken ? { page_token: pageToken } : {}),
              },
            }
          )
        );

        if (res.data.collection?.length) {
          collected.push(...res.data.collection);
        }

        const nextToken = res.data.pagination?.next_page_token;
        if (!nextToken) break;
        pageToken = nextToken;
      }

      return collected;
    },

    async cancelScheduledEvent(eventUuid: string, reason: string) {
      await withRetry(() =>
        http.post(
          `/scheduled_events/${encodeURIComponent(eventUuid)}/cancellation`,
          { reason }
        )
      );
    },
  };
}
