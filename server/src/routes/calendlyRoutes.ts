import { Router, Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../middleware/auth";
import { CalendlyClient } from "../services/calendlyClient";
import {
  createIdempotencyStore,
  IdempotencyStore,
} from "../services/idempotencyStore";
import {
  BookingSummary,
  CalendlyInvitee,
  CalendlyScheduledEvent,
  CreateInviteePayload,
} from "../types/calendly";

const EVENT_TYPE_URI_REGEX =
  /^https:\/\/api\.calendly\.com\/event_types\/[A-Za-z0-9-]+$/;
const UUID_REGEX = /^[A-Za-z0-9-]+$/;
const ISO_UTC_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

const availableTimesQuerySchema = z.object({
  eventTypeUri: z.string().regex(EVENT_TYPE_URI_REGEX, "eventTypeUri inválido."),
  startTime: z.string().regex(ISO_UTC_REGEX, "startTime deve ser ISO 8601 UTC."),
  endTime: z.string().regex(ISO_UTC_REGEX, "endTime deve ser ISO 8601 UTC."),
});

const createBookingBodySchema = z.object({
  eventTypeUri: z.string().regex(EVENT_TYPE_URI_REGEX, "eventTypeUri inválido."),
  startTimeUtc: z
    .string()
    .regex(ISO_UTC_REGEX, "startTimeUtc deve ser ISO 8601 UTC."),
  timezone: z.string().min(1).max(100).optional(),
  locationKind: z.string().min(1).max(60).optional(),
  idempotencyKey: z.string().min(8).max(128).optional(),
});

const cancelBodySchema = z.object({
  reason: z.string().trim().min(1).max(300).optional(),
});

const INVITEE_LOOKUP_CONCURRENCY = 4;

async function mapWithConcurrencyLimit<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const current = nextIndex;
      nextIndex += 1;
      try {
        const value = await worker(items[current]);
        results[current] = { status: "fulfilled", value };
      } catch (reason) {
        results[current] = { status: "rejected", reason };
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    () => runWorker()
  );
  await Promise.all(workers);
  return results;
}

function getLocationLabel(location?: CalendlyScheduledEvent["location"]): string | undefined {
  if (!location) return undefined;
  if (location.location) return location.location;
  if (location.type === "google_conference") return "Google Meet";
  if (location.type === "zoom") return "Zoom";
  if (location.type === "microsoft_teams_conference") return "Microsoft Teams";
  if (location.join_url) return "Videoconferência";
  return undefined;
}

function handleCalendlyError(error: any, res: Response, fallback: string) {
  const status = error.response?.status || error.statusCode;
  console.error(
    "[Calendly Error]",
    status || error.code,
    JSON.stringify(error.response?.data || error.message)
  );

  if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
    return res.status(504).json({
      code: "TIMEOUT",
      error: "Tempo limite excedido ao comunicar com o Calendly.",
    });
  }

  if (status === 400 || status === 409 || status === 422) {
    return res.status(status).json({
      code: "SLOT_UNAVAILABLE",
      error:
        "Horário indisponível ou dados inválidos para o agendamento.",
    });
  }

  if (status === 401 || status === 403) {
    return res.status(status).json({
      code: "AUTH_ERROR",
      error:
        "Permissão insuficiente no Calendly. Verifique o token e o escopo scheduled_events:write.",
    });
  }

  if (status === 429) {
    return res.status(429).json({
      code: "RATE_LIMIT",
      error:
        "Limite de requisições do Calendly atingido. Tente novamente em instantes.",
    });
  }

  if (!error.response && error.code) {
    return res.status(503).json({
      code: "NETWORK_ERROR",
      error: "Falha de conexão com a API do Calendly.",
    });
  }

  return res.status(status || 500).json({
    code: "UNKNOWN",
    error: fallback,
  });
}

export interface CalendlyRouterDeps {
  calendly: CalendlyClient;
  allowedEventTypeUris: string[];
  idempotencyStore?: IdempotencyStore;
}

export function createCalendlyRouter({
  calendly,
  allowedEventTypeUris,
  idempotencyStore = createIdempotencyStore(),
}: CalendlyRouterDeps): Router {
  const router = Router();

  const resolveAllowedEventTypes = async (): Promise<Set<string>> => {
    if (allowedEventTypeUris.length > 0) {
      return new Set(allowedEventTypeUris);
    }
    const owner = await calendly.getCurrentUser();
    const types = await calendly.getEventTypes(owner.uri);
    return new Set(types.filter((t) => t.active !== false).map((t) => t.uri));
  };

  router.get("/me", async (_req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await calendly.getCurrentUser();
      res.json({
        resource: {
          uri: user.uri,
          name: user.name,
        },
      });
    } catch (error) {
      handleCalendlyError(error, res, "Erro ao buscar dados do orientador.");
    }
  });

  router.get(
    "/event-types",
    async (_req: AuthenticatedRequest, res: Response) => {
      try {
        const owner = await calendly.getCurrentUser();
        const allTypes = await calendly.getEventTypes(owner.uri);
        const allowlist =
          allowedEventTypeUris.length > 0
            ? new Set(allowedEventTypeUris)
            : null;

        const filtered = allTypes.filter(
          (t) => t.active !== false && (!allowlist || allowlist.has(t.uri))
        );

        res.json({ collection: filtered });
      } catch (error) {
        handleCalendlyError(error, res, "Erro ao listar tipos de orientação.");
      }
    }
  );

  router.get(
    "/available-times",
    async (req: AuthenticatedRequest, res: Response) => {
      const parsed = availableTimesQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({
          code: "VALIDATION_ERROR",
          error: parsed.error.issues[0]?.message || "Parâmetros inválidos.",
        });
        return;
      }

      const { eventTypeUri, startTime, endTime } = parsed.data;

      try {
        const allowedSet = await resolveAllowedEventTypes();
        if (!allowedSet.has(eventTypeUri)) {
          res.status(403).json({
            code: "FORBIDDEN_EVENT_TYPE",
            error: "Tipo de evento não permitido.",
          });
          return;
        }

        const slots = await calendly.getAvailableTimes(
          eventTypeUri,
          startTime,
          endTime
        );
        // Preserva os timestamps UTC originais
        res.json({ collection: slots });
      } catch (error) {
        handleCalendlyError(
          error,
          res,
          "Erro ao consultar horários disponíveis."
        );
      }
    }
  );

  router.get("/events", async (req: AuthenticatedRequest, res: Response) => {
    const authenticatedEmail = req.user?.email?.toLowerCase();
    if (!authenticatedEmail) {
      res.status(401).json({
        code: "UNAUTHORIZED",
        error: "Usuário autenticado não identificado.",
      });
      return;
    }

    try {
      const owner = await calendly.getCurrentUser();
      const { items: events, truncated } = await calendly.getScheduledEvents(
        owner.uri,
        100
      );

      const settled = await mapWithConcurrencyLimit(
        events,
        INVITEE_LOOKUP_CONCURRENCY,
        async (event) => {
          const uuid = event.uri.split("/").pop();
          if (!uuid) return null;
          const invitees = await calendly.getEventInvitees(uuid);
          const isParticipant = invitees.some(
            (inv: CalendlyInvitee) =>
              inv.email && inv.email.toLowerCase() === authenticatedEmail
          );
          if (!isParticipant) return null;
          return { ...event, invitees };
        }
      );

      let partialErrors = 0;
      const userEvents: Array<
        CalendlyScheduledEvent & { invitees: CalendlyInvitee[] }
      > = [];

      for (const item of settled) {
        if (item.status === "fulfilled") {
          if (item.value) userEvents.push(item.value);
          continue;
        }

        const err: any = item.reason;
        const status = err?.response?.status || err?.statusCode;
        if (status === 401 || status === 403 || status === 429) {
          throw err;
        }
        partialErrors += 1;
      }

      const now = Date.now();
      const activeEvents = userEvents.filter(
        (e) =>
          e.status === "active" && new Date(e.start_time).getTime() >= now
      );
      const pastEvents = userEvents.filter(
        (e) =>
          e.status === "active" && new Date(e.start_time).getTime() < now
      );
      const missedEvents = userEvents.filter((e) => e.status === "canceled");

      res.json({
        activeEvents,
        pastEvents,
        missedEvents,
        ...(partialErrors > 0 ? { partialErrors } : {}),
        ...(truncated ? { truncated: true } : {}),
      });
    } catch (error) {
      handleCalendlyError(error, res, "Erro ao listar agendamentos.");
    }
  });

  router.post("/bookings", async (req: AuthenticatedRequest, res: Response) => {
    const authenticatedUser = req.user;
    if (!authenticatedUser?.email) {
      res.status(401).json({
        code: "UNAUTHORIZED",
        error: "Usuário autenticado não identificado.",
      });
      return;
    }

    const parsed = createBookingBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        code: "VALIDATION_ERROR",
        error: parsed.error.issues[0]?.message || "Dados de agendamento inválidos.",
      });
      return;
    }

    const { eventTypeUri, startTimeUtc, timezone, locationKind } = parsed.data;
    const headerIdempotencyKey = req.headers["idempotency-key"];
    const clientKey =
      typeof headerIdempotencyKey === "string" && headerIdempotencyKey.trim()
        ? headerIdempotencyKey.trim()
        : parsed.data.idempotencyKey;

    const idempotencyKey = `${authenticatedUser.sub}:${
      clientKey || `${eventTypeUri}:${startTimeUtc}`
    }`;
    const payloadHash = idempotencyStore.hashPayload({
      eventTypeUri,
      startTimeUtc,
      timezone: timezone || "America/Sao_Paulo",
      locationKind: locationKind || null,
    });

    const lock = idempotencyStore.acquireLock(idempotencyKey, payloadHash);
    if (!lock.ok) {
      if (lock.reason === "DIFFERENT_PAYLOAD") {
        res.status(422).json({
          code: "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD",
          error:
            "A mesma chave de idempotência foi reutilizada com dados diferentes.",
        });
        return;
      }
      if (lock.reason === "IN_PROGRESS") {
        res.status(409).json({
          code: "BOOKING_IN_PROGRESS",
          error:
            "Já existe uma solicitação de agendamento em andamento para este horário.",
        });
        return;
      }
      if (lock.reason === "UNCERTAIN") {
        res.status(409).json({
          code: "UNCERTAIN_BOOKING_STATE",
          error:
            "A tentativa anterior teve resultado incerto (timeout ou falha de rede). Verifique sua agenda antes de tentar novamente.",
        });
        return;
      }
      if (lock.reason === "ALREADY_COMPLETED" && lock.record.booking) {
        res.status(201).json({
          success: true,
          deduplicated: true,
          booking: lock.record.booking,
        });
        return;
      }
    }

    try {
      const allowedSet = await resolveAllowedEventTypes();
      if (!allowedSet.has(eventTypeUri)) {
        idempotencyStore.releaseOnDefiniteError(idempotencyKey);
        res.status(403).json({
          code: "FORBIDDEN_EVENT_TYPE",
          error: "Tipo de evento não permitido.",
        });
        return;
      }

      const owner = await calendly.getCurrentUser();
      const eventTypes = await calendly.getEventTypes(owner.uri);
      const matchedEventType = eventTypes.find((t) => t.uri === eventTypeUri);
      const defaultLocation = matchedEventType?.locations?.[0];

      const resolvedLocation = locationKind
        ? { kind: locationKind }
        : defaultLocation?.kind
          ? {
              kind: defaultLocation.kind,
              ...(defaultLocation.location
                ? { location: defaultLocation.location }
                : {}),
            }
          : undefined;

      const payload: CreateInviteePayload = {
        event_type: eventTypeUri,
        start_time: startTimeUtc,
        invitee: {
          name: authenticatedUser.name,
          email: authenticatedUser.email,
          timezone: timezone || "America/Sao_Paulo",
        },
        ...(resolvedLocation ? { location: resolvedLocation } : {}),
      };

      const inviteeResource = await calendly.createInvitee(payload);
      const eventUri = inviteeResource.event || "";
      const eventUuid = eventUri ? eventUri.split("/").pop() : undefined;

      let scheduledEvent: CalendlyScheduledEvent | null = null;
      if (eventUuid && UUID_REGEX.test(eventUuid)) {
        try {
          scheduledEvent = await calendly.getScheduledEvent(eventUuid);
        } catch {
          scheduledEvent = null;
        }
      }

      const booking: BookingSummary = {
        inviteeUri: inviteeResource.uri,
        eventUri,
        eventName: scheduledEvent?.name || "Reunião de Orientação",
        startTime: scheduledEvent?.start_time || startTimeUtc,
        endTime: scheduledEvent?.end_time,
        locationLabel: getLocationLabel(scheduledEvent?.location),
        cancelUrl: inviteeResource.cancel_url,
        rescheduleUrl: inviteeResource.reschedule_url,
        status: scheduledEvent?.status || inviteeResource.status || "active",
      };

      idempotencyStore.markCompleted(idempotencyKey, payloadHash, booking);

      res.status(201).json({
        success: true,
        booking,
      });
    } catch (error: any) {
      const isUncertain =
        !error.response ||
        error.code === "ECONNABORTED" ||
        error.message?.includes("timeout");

      if (isUncertain) {
        idempotencyStore.markUncertain(idempotencyKey, payloadHash);
      } else {
        idempotencyStore.releaseOnDefiniteError(idempotencyKey);
      }

      handleCalendlyError(
        error,
        res,
        "Não foi possível concluir o agendamento."
      );
    }
  });

  router.post(
    "/events/:eventUuid/cancel",
    async (req: AuthenticatedRequest, res: Response) => {
      const authenticatedEmail = req.user?.email?.toLowerCase();
      if (!authenticatedEmail) {
        res.status(401).json({
          code: "UNAUTHORIZED",
          error: "Usuário autenticado não identificado.",
        });
        return;
      }

      const rawEventUuid = req.params.eventUuid;
      const eventUuid = Array.isArray(rawEventUuid)
        ? rawEventUuid[0]
        : rawEventUuid;
      if (!eventUuid || !UUID_REGEX.test(eventUuid)) {
        res.status(400).json({
          code: "VALIDATION_ERROR",
          error: "Identificador de evento inválido.",
        });
        return;
      }

      const bodyParsed = cancelBodySchema.safeParse(req.body || {});
      if (!bodyParsed.success) {
        res.status(400).json({
          code: "VALIDATION_ERROR",
          error: "Motivo de cancelamento inválido.",
        });
        return;
      }

      try {
        const invitees = await calendly.getEventInvitees(eventUuid);
        const activeInvitees = invitees.filter(
          (inv) => inv.status !== "canceled"
        );
        const myInvitee = activeInvitees.find(
          (inv) => inv.email && inv.email.toLowerCase() === authenticatedEmail
        );

        if (!myInvitee) {
          res.status(403).json({
            code: "FORBIDDEN",
            error: "Você não tem permissão para cancelar este evento.",
          });
          return;
        }

        // A API pública POST /scheduled_events/:uuid/cancellation cancela o evento inteiro.
        // Em reuniões compartilhadas (>1 participante ativo), bloqueamos para não afetar outros estudantes.
        if (activeInvitees.length > 1) {
          res.status(409).json({
            code: "SHARED_EVENT_INDIVIDUAL_CANCEL_REQUIRED",
            error:
              "Esta é uma reunião compartilhada. Para cancelar apenas a sua participação sem afetar outros estudantes, utilize o link individual de cancelamento.",
            ...(myInvitee.cancel_url
              ? { cancelUrl: myInvitee.cancel_url }
              : {}),
          });
          return;
        }

        await calendly.cancelScheduledEvent(
          eventUuid,
          bodyParsed.data.reason || "Cancelado pelo estudante no Oriently"
        );

        res.json({ success: true });
      } catch (error) {
        handleCalendlyError(error, res, "Não foi possível cancelar o evento.");
      }
    }
  );

  return router;
}
