import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createApp } from "../app";
import { loadConfig, ServerConfig } from "../config/env";
import { GoogleTokenVerifier } from "../middleware/auth";
import { CalendlyClient, createCalendlyClient } from "../services/calendlyClient";
import { createIdempotencyStore } from "../services/idempotencyStore";
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
  nodeEnv: "test",
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
      return {
        items: [
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
        ],
        truncated: false,
      };
    },
    async getEventInvitees(eventUuid: string) {
      if (eventUuid === "evt-1") {
        return {
          items: [
            {
              uri: "https://api.calendly.com/scheduled_events/evt-1/invitees/inv-1",
              email: "aluno@ufmg.br",
              status: "active",
            },
          ],
          truncated: false,
        };
      }
      return {
        items: [
          {
            uri: "https://api.calendly.com/scheduled_events/evt-2/invitees/inv-2",
            email: "outro@ufmg.br",
            status: "active",
          },
        ],
        truncated: false,
      };
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
    idempotencyStore: createIdempotencyStore(),
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
    idempotencyStore: createIdempotencyStore(),
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
    idempotencyStore: createIdempotencyStore(),
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
    idempotencyStore: createIdempotencyStore(),
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

    // Nova tentativa após resultado incerto não deve chamar POST /invitees novamente
    const retryUncertain = await fetch(`${baseUrl}/api/calendly/bookings`, {
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
    assert.equal(retryUncertain.status, 409);
    const retryBody = (await retryUncertain.json()) as { code: string };
    assert.equal(retryBody.code, "UNCERTAIN_BOOKING_STATE");
  });
});

test("rejeita reutilização de Idempotency-Key com payload diferente (422), bloqueia concorrência (409) e persiste após reinício", async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "oriently-idem-"));
  const storePath = path.join(tmpDir, "idempotency.json");

  let releaseSlowRequest!: () => void;
  const slowGate = new Promise<void>((resolve) => {
    releaseSlowRequest = resolve;
  });

  let inviteeCalls = 0;

  try {
    const store1 = createIdempotencyStore({ filePath: storePath });
    const app1 = createApp({
      config: baseConfig,
      idempotencyStore: store1,
      calendlyClient: createMockCalendlyClient({
        async createInvitee(payload) {
          inviteeCalls += 1;
          await slowGate;
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

    await withServer(app1, async (baseUrl) => {
      // Dispara 2 requisições simultâneas com mesma chave e payload
      const p1 = fetch(`${baseUrl}/api/calendly/bookings`, {
        method: "POST",
        headers: {
          Authorization: "Bearer valid-token",
          "Content-Type": "application/json",
          "Idempotency-Key": "concurrent-key-1",
        },
        body: JSON.stringify({
          eventTypeUri: ALLOWED_EVENT_TYPE,
          startTimeUtc: "2026-11-20T17:00:00Z",
        }),
      });

      // Pequena pausa para garantir que p1 adquiriu o lock
      await new Promise((r) => setTimeout(r, 20));

      const p2 = await fetch(`${baseUrl}/api/calendly/bookings`, {
        method: "POST",
        headers: {
          Authorization: "Bearer valid-token",
          "Content-Type": "application/json",
          "Idempotency-Key": "concurrent-key-1",
        },
        body: JSON.stringify({
          eventTypeUri: ALLOWED_EVENT_TYPE,
          startTimeUtc: "2026-11-20T17:00:00Z",
        }),
      });
      assert.equal(p2.status, 409);

      releaseSlowRequest();
      const r1 = await p1;
      assert.equal(r1.status, 201);
      assert.equal(inviteeCalls, 1);

      // Mesma chave com payload diferente -> 422
      const diffPayload = await fetch(`${baseUrl}/api/calendly/bookings`, {
        method: "POST",
        headers: {
          Authorization: "Bearer valid-token",
          "Content-Type": "application/json",
          "Idempotency-Key": "concurrent-key-1",
        },
        body: JSON.stringify({
          eventTypeUri: ALLOWED_EVENT_TYPE,
          startTimeUtc: "2026-11-21T18:00:00Z",
        }),
      });
      assert.equal(diffPayload.status, 422);
    });

    // Simula reinício do servidor recarregando o store do disco
    const store2 = createIdempotencyStore({ filePath: storePath });
    const app2 = createApp({
      config: baseConfig,
      idempotencyStore: store2,
      calendlyClient: createMockCalendlyClient({
        async createInvitee() {
          throw new Error("Não deveria chamar POST /invitees após reinício");
        },
      }),
      tokenVerifier: createMockVerifier({ "valid-token": studentUser }),
    });

    await withServer(app2, async (baseUrl) => {
      const afterRestart = await fetch(`${baseUrl}/api/calendly/bookings`, {
        method: "POST",
        headers: {
          Authorization: "Bearer valid-token",
          "Content-Type": "application/json",
          "Idempotency-Key": "concurrent-key-1",
        },
        body: JSON.stringify({
          eventTypeUri: ALLOWED_EVENT_TYPE,
          startTimeUtc: "2026-11-20T17:00:00Z",
        }),
      });
      assert.equal(afterRestart.status, 201);
      const body = (await afterRestart.json()) as { deduplicated?: boolean };
      assert.equal(body.deduplicated, true);
    });
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test("bloqueia cancelamento de reunião compartilhada (409) e exige allowlist em produção", async () => {
  let cancelCalled = false;

  const app = createApp({
    config: baseConfig,
    idempotencyStore: createIdempotencyStore(),
    calendlyClient: createMockCalendlyClient({
      async getEventInvitees() {
        return {
          items: [
            {
              uri: "https://api.calendly.com/scheduled_events/evt-shared/invitees/inv-1",
              email: "aluno@ufmg.br",
              status: "active",
              cancel_url: "https://calendly.com/cancellations/inv-1",
            },
            {
              uri: "https://api.calendly.com/scheduled_events/evt-shared/invitees/inv-2",
              email: "colega@ufmg.br",
              status: "active",
            },
          ],
          truncated: false,
        };
      },
      async cancelScheduledEvent() {
        cancelCalled = true;
      },
    }),
    tokenVerifier: createMockVerifier({ "valid-token": studentUser }),
  });

  await withServer(app, async (baseUrl) => {
    const res = await fetch(
      `${baseUrl}/api/calendly/events/evt-shared/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer valid-token",
          "Content-Type": "application/json",
        },
      }
    );
    assert.equal(res.status, 409);
    const body = (await res.json()) as { code: string; cancelUrl?: string };
    assert.equal(body.code, "SHARED_EVENT_INDIVIDUAL_CANCEL_REQUIRED");
    assert.equal(body.cancelUrl, "https://calendly.com/cancellations/inv-1");
    assert.equal(cancelCalled, false);
  });

  const prevNodeEnv = process.env.NODE_ENV;
  const prevAllow = process.env.ALLOWED_EVENT_TYPE_URIS;
  try {
    process.env.NODE_ENV = "production";
    process.env.ALLOWED_EVENT_TYPE_URIS = "";
    assert.throws(() => loadConfig(), /ALLOWED_EVENT_TYPE_URIS/);
  } finally {
    process.env.NODE_ENV = prevNodeEnv;
    process.env.ALLOWED_EVENT_TYPE_URIS = prevAllow;
  }
});

test("consulta paginada de eventos via page_token e tratamento de erros parciais sem vazar terceiros", async () => {
  const mockCalendlyServer = http.createServer((req, res) => {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    if (url.pathname === "/scheduled_events") {
      const pageToken = url.searchParams.get("page_token");
      res.writeHead(200, { "Content-Type": "application/json" });
      if (!pageToken) {
        res.end(
          JSON.stringify({
            collection: [
              {
                uri: "https://api.calendly.com/scheduled_events/evt-p1",
                name: "Página 1",
                status: "active",
                start_time: "2099-11-20T17:00:00Z",
                end_time: "2099-11-20T17:30:00Z",
              },
            ],
            pagination: { next_page_token: "cursor-2" },
          })
        );
        return;
      }
      res.end(
        JSON.stringify({
          collection: [
            {
              uri: "https://api.calendly.com/scheduled_events/evt-p2",
              name: "Página 2",
              status: "active",
              start_time: "2099-11-21T17:00:00Z",
              end_time: "2099-11-21T17:30:00Z",
            },
          ],
          pagination: { next_page_token: null },
        })
      );
      return;
    }
    res.writeHead(404);
    res.end();
  });

  await new Promise<void>((resolve) =>
    mockCalendlyServer.listen(0, "127.0.0.1", resolve)
  );
  const addr = mockCalendlyServer.address();
  assert.ok(addr && typeof addr !== "string");

  try {
    const client = createCalendlyClient({
      baseURL: `http://127.0.0.1:${addr.port}`,
      token: "test-token",
      timeoutMs: 3000,
    });

    const result = await client.getScheduledEvents(
      "https://api.calendly.com/users/advisor-1"
    );
    assert.equal(result.truncated, false);
    assert.equal(result.items.length, 2);
    assert.equal(result.items[0].name, "Página 1");
    assert.equal(result.items[1].name, "Página 2");
  } finally {
    await new Promise<void>((resolve, reject) =>
      mockCalendlyServer.close((e) => (e ? reject(e) : resolve()))
    );
  }

  // Simula truncamento ao atingir MAX_PAGINATION_PAGES (10 páginas) com next_page_token ainda presente
  const alwaysMorePagesServer = http.createServer((req, res) => {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    if (url.pathname === "/scheduled_events") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          collection: [
            {
              uri: "https://api.calendly.com/scheduled_events/evt-page",
              name: "Evento Paginado",
              status: "active",
              start_time: "2099-11-20T17:00:00Z",
              end_time: "2099-11-20T17:30:00Z",
            },
          ],
          pagination: { next_page_token: "always-has-next" },
        })
      );
      return;
    }
    res.writeHead(404);
    res.end();
  });

  await new Promise<void>((resolve) =>
    alwaysMorePagesServer.listen(0, "127.0.0.1", resolve)
  );
  const truncAddr = alwaysMorePagesServer.address();
  assert.ok(truncAddr && typeof truncAddr !== "string");

  try {
    const truncClient = createCalendlyClient({
      baseURL: `http://127.0.0.1:${truncAddr.port}`,
      token: "test-token",
      timeoutMs: 3000,
    });
    const truncResult = await truncClient.getScheduledEvents(
      "https://api.calendly.com/users/advisor-1"
    );
    assert.equal(truncResult.truncated, true);
    assert.equal(truncResult.items.length, 10);
  } finally {
    await new Promise<void>((resolve, reject) =>
      alwaysMorePagesServer.close((e) => (e ? reject(e) : resolve()))
    );
  }

  // Erro parcial em um evento não vaza evento de terceiros nem derruba a listagem
  const partialApp = createApp({
    config: baseConfig,
    idempotencyStore: createIdempotencyStore(),
    calendlyClient: createMockCalendlyClient({
      async getScheduledEvents() {
        return {
          items: [
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
          ],
          truncated: true,
        };
      },
      async getEventInvitees(uuid) {
        if (uuid === "evt-2") {
          throw new Error("Erro transitório em evento de terceiro");
        }
        return {
          items: [
            {
              uri: "https://api.calendly.com/scheduled_events/evt-1/invitees/inv-1",
              email: "aluno@ufmg.br",
              status: "active",
            },
          ],
          truncated: false,
        };
      },
    }),
    tokenVerifier: createMockVerifier({ "valid-token": studentUser }),
  });

  await withServer(partialApp, async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/calendly/events`, {
      headers: { Authorization: "Bearer valid-token" },
    });
    assert.equal(res.status, 200);
    const body = (await res.json()) as {
      activeEvents: Array<{ uri: string }>;
      partialErrors?: number;
      truncated?: boolean;
    };
    assert.equal(body.activeEvents.length, 1);
    assert.ok(body.activeEvents[0].uri.endsWith("/evt-1"));
    assert.equal(body.partialErrors, 1);
    assert.equal(body.truncated, true);
  });
});

test("sinaliza truncamento na paginação de participantes (getEventInvitees) e bloqueia cancelamento inseguro", async () => {
  const alwaysMoreInviteesServer = http.createServer((req, res) => {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    if (url.pathname.endsWith("/invitees")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          collection: [
            {
              uri: "https://api.calendly.com/scheduled_events/evt-big/invitees/inv-x",
              email: "participante@ufmg.br",
              status: "active",
            },
          ],
          pagination: { next_page_token: "more-invitees" },
        })
      );
      return;
    }
    res.writeHead(404);
    res.end();
  });

  await new Promise<void>((resolve) =>
    alwaysMoreInviteesServer.listen(0, "127.0.0.1", resolve)
  );
  const addr = alwaysMoreInviteesServer.address();
  assert.ok(addr && typeof addr !== "string");

  try {
    const client = createCalendlyClient({
      baseURL: `http://127.0.0.1:${addr.port}`,
      token: "test-token",
      timeoutMs: 3000,
    });
    const invResult = await client.getEventInvitees("evt-big");
    assert.equal(invResult.truncated, true);
    assert.equal(invResult.items.length, 10);
  } finally {
    await new Promise<void>((resolve, reject) =>
      alwaysMoreInviteesServer.close((e) => (e ? reject(e) : resolve()))
    );
  }

  let cancelCalled = false;
  const truncatedCancelApp = createApp({
    config: baseConfig,
    idempotencyStore: createIdempotencyStore(),
    calendlyClient: createMockCalendlyClient({
      async getEventInvitees() {
        return {
          items: [
            {
              uri: "https://api.calendly.com/scheduled_events/evt-big/invitees/inv-1",
              email: "outro@ufmg.br",
              status: "active",
            },
          ],
          truncated: true,
        };
      },
      async cancelScheduledEvent() {
        cancelCalled = true;
      },
    }),
    tokenVerifier: createMockVerifier({ "valid-token": studentUser }),
  });

  await withServer(truncatedCancelApp, async (baseUrl) => {
    const res = await fetch(
      `${baseUrl}/api/calendly/events/evt-big/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer valid-token",
          "Content-Type": "application/json",
        },
      }
    );
    assert.equal(res.status, 502);
    const body = (await res.json()) as { code: string };
    assert.equal(body.code, "INVITEES_LIST_TRUNCATED");
    assert.equal(cancelCalled, false);
  });
});
