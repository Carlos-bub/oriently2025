import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createApp } from "../app";
import { ServerConfig } from "../config/env";
import { GoogleTokenVerifier } from "../middleware/auth";
import { CalendlyClient } from "../services/calendlyClient";
import {
  AuthenticatedUser,
  CalendlyInvitee,
  CreateInviteePayload,
} from "../types/calendly";

const ALLOWED_EVENT_TYPE =
  "https://api.calendly.com/event_types/11111111-1111-1111-1111-111111111111";
const DISALLOWED_EVENT_TYPE =
  "https://api.calendly.com/event_types/99999999-9999-9999-9999-999999999999";

const baseConfig: ServerConfig = {
  port: 0,
  calendlyApiBaseUrl: "https://api.calendly.com",
  calendlyApiToken: "fake-secret-token",
  calendlyTimeoutMs: 5000,
  allowedEventTypeUris: [ALLOWED_EVENT_TYPE],
  googleClientIds: ["test-google-client-id"],
  corsAllowedOrigins: ["http://localhost:8081"],
};

const studentUser: AuthenticatedUser = {
  sub: "google-sub-123",
  email: "aluno@ufmg.br",
  name: "Maria Silva",
  emailVerified: true,
};

function createMockVerifier(
  usersByToken: Record<string, AuthenticatedUser>
): GoogleTokenVerifier {
  return {
    async verify(idToken: string) {
      const user = usersByToken[idToken];
      if (!user) {
        throw new Error("INVALID_TOKEN");
      }
      return user;
    },
  };
}

function createMockCalendlyClient(
  overrides: Partial<CalendlyClient> = {}
): CalendlyClient {
  return {
    async getCurrentUser() {
      return { uri: "https://api.calendly.com/users/advisor-1", name: "Prof. Orientador" };
    },
    async getEventTypes() {
      return [
        {
          uri: ALLOWED_EVENT_TYPE,
          name: "Orientação TCC",
          slug: "orientacao-tcc",
          active: true,
          duration: 30,
        },
        {
          uri: DISALLOWED_EVENT_TYPE,
          name: "Reunião Privada",
          slug: "privada",
          active: true,
          duration: 60,
        },
      ];
    },
    async getAvailableTimes() {
      return [
        {
          start_time: "2026-11-20T17:00:00Z",
          status: "available",
          invitees_remaining: 1,
        },
      ];
    },
    async createInvitee(payload: CreateInviteePayload): Promise<CalendlyInvitee> {
      return {
        uri: "https://api.calendly.com/scheduled_events/evt-1/invitees/inv-1",
        email: payload.invitee.email,
        name: payload.invitee.name,
        status: "active",
        event: "https://api.calendly.com/scheduled_events/evt-1",
        cancel_url: "https://calendly.com/cancellations/inv-1",
        reschedule_url: "https://calendly.com/reschedulings/inv-1",
      };
    },
    async getScheduledEvent() {
      return {
        uri: "https://api.calendly.com/scheduled_events/evt-1",
        name: "Orientação TCC",
        status: "active",
        start_time: "2026-11-20T17:00:00Z",
        end_time: "2026-11-20T17:30:00Z",
        location: { type: "google_conference", join_url: "https://meet.google.com/abc" },
      };
    },
    async getScheduledEvents() {
      return [
        {
          uri: "https://api.calendly.com/scheduled_events/evt-1",
          name: "Orientação TCC",
          status: "active",
          start_time: "2099-11-20T17:00:00Z",
          end_time: "2099-11-20T17:30:00Z",
        },
        {
          uri: "https://api.calendly.com/scheduled_events/evt-2",
          name: "Outro Aluno",
          status: "active",
          start_time: "2099-11-21T17:00:00Z",
          end_time: "2099-11-21T17:30:00Z",
        },
      ];
    },
    async getEventInvitees(eventUuid: string) {
      if (eventUuid === "evt-1") {
        return [
          {
            uri: "https://api.calendly.com/scheduled_events/evt-1/invitees/inv-1",
            email: "aluno@ufmg.br",
            status: "active",
          },
        ];
      }
      return [
        {
          uri: "https://api.calendly.com/scheduled_events/evt-2/invitees/inv-2",
          email: "outro@ufmg.br",
          status: "active",
        },
      ];
    },
    async cancelScheduledEvent() {
      return;
    },
    ...overrides,
  };
}

async function withServer<T>(
  app: ReturnType<typeof createApp>,
  fn: (baseUrl: string) => Promise<T>
): Promise<T> {
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  if (!addr || typeof addr === "string") {
    throw new Error("Invalid server address");
  }
  const baseUrl = `http://127.0.0.1:${addr.port}`;
  try {
    return await fn(baseUrl);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );
  }
}

test("rejeita requisições sem Google ID Token válido (401)", async () => {
  const app = createApp({
    config: baseConfig,
    calendlyClient: createMockCalendlyClient(),
    tokenVerifier: createMockVerifier({ "valid-token": studentUser }),
  });

  await withServer(app, async (baseUrl) => {
    const noToken = await fetch(`${baseUrl}/api/calendly/event-types`);
    assert.equal(noToken.status, 401);

    const badToken = await fetch(`${baseUrl}/api/calendly/event-types`, {
      headers: { Authorization: "Bearer invalid-token" },
    });
    assert.equal(badToken.status, 401);
  });
});

test("filtra event-types pela allowlist explícita e bloqueia URIs não permitidas", async () => {
  const app = createApp({
    config: baseConfig,
    calendlyClient: createMockCalendlyClient(),
    tokenVerifier: createMockVerifier({ "valid-token": studentUser }),
  });

  await withServer(app, async (baseUrl) => {
    const typesRes = await fetch(`${baseUrl}/api/calendly/event-types`, {
      headers: { Authorization: "Bearer valid-token" },
    });
    assert.equal(typesRes.status, 200);
    const typesBody = (await typesRes.json()) as { collection: Array<{ uri: string }> };
    assert.equal(typesBody.collection.length, 1);
    assert.equal(typesBody.collection[0].uri, ALLOWED_EVENT_TYPE);

    const forbiddenRes = await fetch(
      `${baseUrl}/api/calendly/available-times?eventTypeUri=${encodeURIComponent(
        DISALLOWED_EVENT_TYPE
      )}&startTime=2026-11-20T00:00:00Z&endTime=2026-11-20T23:59:59Z`,
      { headers: { Authorization: "Bearer valid-token" } }
    );
    assert.equal(forbiddenRes.status, 403);
  });
});

test("preserva timestamps UTC originais na consulta de disponibilidade", async () => {
  const app = createApp({
    config: baseConfig,
    calendlyClient: createMockCalendlyClient(),
    tokenVerifier: createMockVerifier({ "valid-token": studentUser }),
  });

  await withServer(app, async (baseUrl) => {
    const res = await fetch(
      `${baseUrl}/api/calendly/available-times?eventTypeUri=${encodeURIComponent(
        ALLOWED_EVENT_TYPE
      )}&startTime=2026-11-20T00:00:00Z&endTime=2026-11-20T23:59:59Z`,
      { headers: { Authorization: "Bearer valid-token" } }
    );
    assert.equal(res.status, 200);
    const body = (await res.json()) as { collection: Array<{ start_time: string }> };
    assert.equal(body.collection[0].start_time, "2026-11-20T17:00:00Z");
  });
});

test("cria agendamento via POST /invitees usando identidade do token e evita duplicação por idempotência", async () => {
  let createCalls = 0;
  let capturedPayload: CreateInviteePayload | null = null;

  const app = createApp({
    config: baseConfig,
    calendlyClient: createMockCalendlyClient({
      async createInvitee(payload) {
        createCalls += 1;
        capturedPayload = payload;
        return {
          uri: "https://api.calendly.com/scheduled_events/evt-1/invitees/inv-1",
          email: payload.invitee.email,
          name: payload.invitee.name,
          status: "active",
          event: "https://api.calendly.com/scheduled_events/evt-1",
        };
      },
    }),
    tokenVerifier: createMockVerifier({ "valid-token": studentUser }),
  });

  await withServer(app, async (baseUrl) => {
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: "Bearer valid-token",
        "Content-Type": "application/json",
        "Idempotency-Key": "booking-req-001",
      },
      body: JSON.stringify({
        eventTypeUri: ALLOWED_EVENT_TYPE,
        startTimeUtc: "2026-11-20T17:00:00Z",
        timezone: "America/Sao_Paulo",
        // tentativa de spoofing que deve ser ignorada pelo servidor
        email: "hacker@evil.com",
      }),
    };

    const first = await fetch(`${baseUrl}/api/calendly/bookings`, requestOptions);
    assert.equal(first.status, 201);
    const firstBody = (await first.json()) as {
      success: boolean;
      booking: { eventName: string; locationLabel?: string };
    };
    assert.equal(firstBody.success, true);
    assert.equal(firstBody.booking.eventName, "Orientação TCC");
    assert.equal(firstBody.booking.locationLabel, "Google Meet");
    assert.equal(capturedPayload?.invitee.email, "aluno@ufmg.br");
    assert.equal(capturedPayload?.invitee.name, "Maria Silva");

    const second = await fetch(`${baseUrl}/api/calendly/bookings`, requestOptions);
    assert.equal(second.status, 201);
    const secondBody = (await second.json()) as { deduplicated?: boolean };
    assert.equal(secondBody.deduplicated, true);
    assert.equal(createCalls, 1);
  });
});

test("aplica autorização por usuário em listagem e cancelamento de eventos", async () => {
  let canceledUuid: string | null = null;

  const app = createApp({
    config: baseConfig,
    calendlyClient: createMockCalendlyClient({
      async cancelScheduledEvent(uuid) {
        canceledUuid = uuid;
      },
    }),
    tokenVerifier: createMockVerifier({ "valid-token": studentUser }),
  });

  await withServer(app, async (baseUrl) => {
    const eventsRes = await fetch(`${baseUrl}/api/calendly/events`, {
      headers: { Authorization: "Bearer valid-token" },
    });
    assert.equal(eventsRes.status, 200);
    const eventsBody = (await eventsRes.json()) as {
      activeEvents: Array<{ uri: string }>;
    };
    assert.equal(eventsBody.activeEvents.length, 1);
    assert.ok(eventsBody.activeEvents[0].uri.endsWith("/evt-1"));

    // Tentar cancelar evento de outro estudante -> 403
    const forbiddenCancel = await fetch(
      `${baseUrl}/api/calendly/events/evt-2/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer valid-token",
          "Content-Type": "application/json",
        },
      }
    );
    assert.equal(forbiddenCancel.status, 403);
    assert.equal(canceledUuid, null);

    // Cancelar próprio evento -> 200
    const allowedCancel = await fetch(
      `${baseUrl}/api/calendly/events/evt-1/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer valid-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: "Imprevisto" }),
      }
    );
    assert.equal(allowedCancel.status, 200);
    assert.equal(canceledUuid, "evt-1");
  });
});

test("trata horário indisponível (409), timeout (504) e rate limit (429)", async () => {
  const unavailableApp = createApp({
    config: baseConfig,
    calendlyClient: createMockCalendlyClient({
      async createInvitee() {
        const err: any = new Error("Slot taken");
        err.response = { status: 409 };
        throw err;
      },
    }),
    tokenVerifier: createMockVerifier({ "valid-token": studentUser }),
    rateLimitMaxRequests: 2,
    rateLimitWindowMs: 60_000,
  });

  await withServer(unavailableApp, async (baseUrl) => {
    const res1 = await fetch(`${baseUrl}/api/calendly/bookings`, {
      method: "POST",
      headers: {
        Authorization: "Bearer valid-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventTypeUri: ALLOWED_EVENT_TYPE,
        startTimeUtc: "2026-11-20T17:00:00Z",
      }),
    });
    assert.equal(res1.status, 409);

    const res2 = await fetch(`${baseUrl}/api/calendly/event-types`, {
      headers: { Authorization: "Bearer valid-token" },
    });
    assert.equal(res2.status, 200);

    // 3a requisição dentro da janela -> 429
    const res3 = await fetch(`${baseUrl}/api/calendly/event-types`, {
      headers: { Authorization: "Bearer valid-token" },
    });
    assert.equal(res3.status, 429);
  });

  const timeoutApp = createApp({
    config: baseConfig,
    calendlyClient: createMockCalendlyClient({
      async createInvitee() {
        const err: any = new Error("timeout of 5000ms exceeded");
        err.code = "ECONNABORTED";
        throw err;
      },
    }),
    tokenVerifier: createMockVerifier({ "valid-token": studentUser }),
  });

  await withServer(timeoutApp, async (baseUrl) => {
    const timeoutRes = await fetch(`${baseUrl}/api/calendly/bookings`, {
      method: "POST",
      headers: {
        Authorization: "Bearer valid-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventTypeUri: ALLOWED_EVENT_TYPE,
        startTimeUtc: "2026-11-20T17:00:00Z",
      }),
    });
    assert.equal(timeoutRes.status, 504);
  });
});
