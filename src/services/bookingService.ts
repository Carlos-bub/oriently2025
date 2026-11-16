import { AxiosInstance } from "axios";
import { ApiError } from "./apiClient";
import {
  BookingErrorCode,
  BookingResult,
  CalendlyEvent,
  CancelEventResult,
  Invitee,
  PastAndMissedEventsResult,
} from "./types";

export function isValidCalendlyCancelUrl(url: unknown): url is string {
  if (typeof url !== "string" || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    return host === "calendly.com" || host.endsWith(".calendly.com");
  } catch {
    return false;
  }
}

export interface CreateNativeBookingParams {
  eventTypeUri: string;
  startTimeUtc: string;
  timezone?: string;
  idempotencyKey?: string;
}

export function mapBookingError(error: unknown): {
  code: BookingErrorCode;
  message: string;
} {
  if (error instanceof ApiError) {
    if (error.code === "UNCERTAIN_BOOKING_STATE") {
      return {
        code: "UNCERTAIN_BOOKING_STATE",
        message:
          "A tentativa anterior teve resultado incerto. Consulte sua agenda antes de agendar novamente.",
      };
    }

    if (error.code === "BOOKING_IN_PROGRESS") {
      return {
        code: "BOOKING_IN_PROGRESS",
        message:
          "Já existe uma solicitação em andamento para este horário. Aguarde ou verifique sua agenda.",
      };
    }

    if (error.code === "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD") {
      return {
        code: "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD",
        message:
          "Esta solicitação já foi utilizada para outro horário. Selecione o horário novamente.",
      };
    }

    if (error.status === 400 || error.status === 409 || error.status === 422) {
      return {
        code: "SLOT_UNAVAILABLE",
        message:
          "Este horário não está mais disponível. Por favor, escolha outro horário.",
      };
    }

    if (
      error.status === 401 ||
      error.status === 403 ||
      error.code === "UNAUTHORIZED" ||
      error.code === "FORBIDDEN" ||
      error.code === "AUTH_ERROR"
    ) {
      return {
        code: "AUTH_ERROR",
        message:
          "Sua sessão expirou ou não tem permissão. Faça login novamente com o Google.",
      };
    }

    if (error.status === 429 || error.code === "RATE_LIMIT") {
      return {
        code: "RATE_LIMIT",
        message:
          "Muitas tentativas em pouco tempo. Aguarde alguns instantes e tente novamente.",
      };
    }

    if (error.status === 504 || error.code === "TIMEOUT") {
      return {
        code: "TIMEOUT",
        message:
          "A confirmação demorou mais que o esperado. Verifique sua agenda antes de tentar novamente para evitar duplicidade.",
      };
    }

    if (error.code === "NETWORK_ERROR" || error.status === 503) {
      return {
        code: "NETWORK_ERROR",
        message:
          "Falha de conexão com o servidor. Verifique sua rede e confira sua agenda antes de tentar novamente.",
      };
    }

    return {
      code: "UNKNOWN",
      message: error.message || "Não foi possível confirmar o agendamento.",
    };
  }

  return {
    code: "UNKNOWN",
    message: "Não foi possível confirmar o agendamento.",
  };
}

export async function executeNativeBooking(
  params: CreateNativeBookingParams,
  client: AxiosInstance,
  onSuccessInvalidate?: () => void
): Promise<BookingResult> {
  try {
    const timezone =
      params.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await client.post<BookingResult>(
      "/api/calendly/bookings",
      {
        eventTypeUri: params.eventTypeUri,
        startTimeUtc: params.startTimeUtc,
        timezone,
        ...(params.idempotencyKey
          ? { idempotencyKey: params.idempotencyKey }
          : {}),
      },
      params.idempotencyKey
        ? {
            headers: {
              "Idempotency-Key": params.idempotencyKey,
            },
          }
        : undefined
    );

    if (response.data?.success && response.data.booking) {
      onSuccessInvalidate?.();
      return response.data;
    }

    return {
      success: false,
      code: "UNKNOWN",
      error: response.data?.error || "Não foi possível confirmar o agendamento.",
    };
  } catch (error) {
    const mapped = mapBookingError(error);
    return {
      success: false,
      code: mapped.code,
      error: mapped.message,
    };
  }
}

export async function fetchEventsWithMeta(
  client: AxiosInstance,
  cacheInvitee?: (uri: string, invitees: Invitee[]) => void
): Promise<PastAndMissedEventsResult> {
  const response = await client.get<PastAndMissedEventsResult>(
    "/api/calendly/events"
  );

  const {
    activeEvents = [],
    pastEvents = [],
    missedEvents = [],
    partialErrors,
    truncated,
  } = response.data;

  if (cacheInvitee) {
    [...activeEvents, ...pastEvents, ...missedEvents].forEach((event) => {
      if (event.invitees) {
        cacheInvitee(event.uri, event.invitees);
      }
    });
  }

  return {
    activeEvents,
    pastEvents,
    missedEvents,
    ...(partialErrors ? { partialErrors } : {}),
    ...(truncated ? { truncated: true } : {}),
  };
}

export async function executeCancelEvent(
  eventUri: string,
  client: AxiosInstance,
  onSuccessInvalidate?: () => void
): Promise<CancelEventResult> {
  try {
    const eventUuid = eventUri.split("/").pop();
    if (!eventUuid) {
      return {
        success: false,
        code: "VALIDATION_ERROR",
        error: "Identificador de evento inválido.",
      };
    }

    await client.post(`/api/calendly/events/${eventUuid}/cancel`, {
      reason: "Cancelado pelo usuário",
    });

    onSuccessInvalidate?.();

    return {
      success: true,
    };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      if (error.code === "SHARED_EVENT_INDIVIDUAL_CANCEL_REQUIRED") {
        const rawCancelUrl = error.data?.cancelUrl;
        const cancelUrl = isValidCalendlyCancelUrl(rawCancelUrl)
          ? rawCancelUrl.trim()
          : undefined;

        return {
          success: false,
          code: "SHARED_EVENT_INDIVIDUAL_CANCEL_REQUIRED",
          error: error.message,
          ...(cancelUrl ? { cancelUrl } : {}),
        };
      }

      return {
        success: false,
        code: error.code,
        error: error.message || "Não foi possível cancelar o evento.",
      };
    }

    return {
      success: false,
      code: "UNKNOWN",
      error: "Não foi possível cancelar o evento.",
    };
  }
}
