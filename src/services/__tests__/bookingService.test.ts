import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { ApiAuthProvider, createApiClient } from "../apiClient";
import {
  executeCancelEvent,
  executeNativeBooking,
  fetchEventsWithMeta,
  isValidCalendlyCancelUrl,
} from "../bookingService";

const EVENT_TYPE_URI =
  "https://api.calendly.com/event_types/11111111-1111-1111-1111-111111111111";

async function withMockServer(
  handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
  fn: (baseUrl: string) => Promise<void>
) {
  const server = http.createServer(handler);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  if (!addr || typeof addr === "string") {
    throw new Error("Invalid address");
  }
  try {
    await fn(`http://127.0.0.1:${addr.port}`);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );
  }
}

function createTestClient(baseUrl: string) {
  const authRef: { current: ApiAuthProvider | null } = {
    current: {
      getIdToken: () => "valid-google-id-token",
      refreshIdToken: async () => null,
      onUnauthorized: async () => {},
    },
  };
  return createApiClient(baseUrl, authRef);
}

test("cria agendamento nativo com sucesso, envia Idempotency-Key, preserva UTC e invalida cache", async () => {
  let receivedHeaders: http.IncomingHttpHeaders = {};
  let receivedBody = "";
  let cacheInvalidated = false;

  await withMockServer(
    (req, res) => {
      receivedHeaders = req.headers;
      req.on("data", (chunk) => {
        receivedBody += chunk;
      });
      req.on("end", () => {
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: true,
            booking: {
              inviteeUri: "https://api.calendly.com/scheduled_events/evt-1/invitees/inv-1",
              eventUri: "https://api.calendly.com/scheduled_events/evt-1",
              eventName: "Orientação TCC",
              startTime: "2026-11-20T17:00:00Z",
              endTime: "2026-11-20T17:30:00Z",
              locationLabel: "Google Meet",
              status: "active",
            },
          })
        );
      });
    },
    async (baseUrl) => {
      const client = createTestClient(baseUrl);
      const result = await executeNativeBooking(
        {
          eventTypeUri: EVENT_TYPE_URI,
          startTimeUtc: "2026-11-20T17:00:00Z",
          timezone: "America/Sao_Paulo",
          idempotencyKey: "key-abc-123",
        },
        client,
        () => {
          cacheInvalidated = true;
        }
      );

      assert.equal(result.success, true);
      assert.equal(result.booking?.eventName, "Orientação TCC");
      assert.equal(result.booking?.locationLabel, "Google Meet");
      assert.equal(receivedHeaders["idempotency-key"], "key-abc-123");
      assert.equal(receivedHeaders.authorization, "Bearer valid-google-id-token");

      const parsedBody = JSON.parse(receivedBody);
      assert.equal(parsedBody.startTimeUtc, "2026-11-20T17:00:00Z");
      assert.equal(parsedBody.email, undefined);
      assert.equal(cacheInvalidated, true);
    }
  );
});

test("rejeita horário indisponível (409) sem invalidar cache", async () => {
  let cacheInvalidated = false;

  await withMockServer(
    (_req, res) => {
      res.writeHead(409, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ code: "SLOT_UNAVAILABLE", error: "Ocupado" }));
    },
    async (baseUrl) => {
      const client = createTestClient(baseUrl);
      const result = await executeNativeBooking(
        {
          eventTypeUri: EVENT_TYPE_URI,
          startTimeUtc: "2026-11-20T17:00:00Z",
          idempotencyKey: "key-slot-409",
        },
        client,
        () => {
          cacheInvalidated = true;
        }
      );

      assert.equal(result.success, false);
      assert.equal(result.code, "SLOT_UNAVAILABLE");
      assert.equal(cacheInvalidated, false);
    }
  );
});

test("previne múltiplos envios retornando BOOKING_IN_PROGRESS e trata timeout (504) sem retry automático", async () => {
  let calls = 0;

  await withMockServer(
    (req, res) => {
      calls += 1;
      if (calls === 1) {
        res.writeHead(409, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            code: "BOOKING_IN_PROGRESS",
            error: "Em andamento",
          })
        );
        return;
      }
      res.writeHead(504, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ code: "TIMEOUT", error: "Timeout" }));
    },
    async (baseUrl) => {
      const client = createTestClient(baseUrl);

      const inProgress = await executeNativeBooking(
        {
          eventTypeUri: EVENT_TYPE_URI,
          startTimeUtc: "2026-11-20T17:00:00Z",
          idempotencyKey: "key-dup",
        },
        client
      );
      assert.equal(inProgress.success, false);
      assert.equal(inProgress.code, "BOOKING_IN_PROGRESS");

      const timeoutRes = await executeNativeBooking(
        {
          eventTypeUri: EVENT_TYPE_URI,
          startTimeUtc: "2026-11-20T17:00:00Z",
          idempotencyKey: "key-timeout",
        },
        client
      );
      assert.equal(timeoutRes.success, false);
      assert.equal(timeoutRes.code, "TIMEOUT");
      // Garante que não houve retry automático após 504
      assert.equal(calls, 2);
    }
  );
});

test("trata erro de autenticação (403) e limite de requisições (429)", async () => {
  await withMockServer(
    (req, res) => {
      if (req.headers["idempotency-key"] === "key-403") {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ code: "AUTH_ERROR", error: "Sem escopo" }));
        return;
      }
      res.writeHead(429, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ code: "RATE_LIMIT", error: "Rate limit" }));
    },
    async (baseUrl) => {
      const client = createTestClient(baseUrl);

      const authErr = await executeNativeBooking(
        {
          eventTypeUri: EVENT_TYPE_URI,
          startTimeUtc: "2026-11-20T17:00:00Z",
          idempotencyKey: "key-403",
        },
        client
      );
      assert.equal(authErr.success, false);
      assert.equal(authErr.code, "AUTH_ERROR");

      const rateErr = await executeNativeBooking(
        {
          eventTypeUri: EVENT_TYPE_URI,
          startTimeUtc: "2026-11-20T17:00:00Z",
          idempotencyKey: "key-429",
        },
        client
      );
      assert.equal(rateErr.success, false);
      assert.equal(rateErr.code, "RATE_LIMIT");
    }
  );
});

test("preserva códigos específicos UNCERTAIN_BOOKING_STATE e IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD", async () => {
  await withMockServer(
    (req, res) => {
      if (req.headers["idempotency-key"] === "key-uncertain") {
        res.writeHead(409, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            code: "UNCERTAIN_BOOKING_STATE",
            error: "Resultado incerto",
          })
        );
        return;
      }
      res.writeHead(422, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          code: "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD",
          error: "Payload diferente",
        })
      );
    },
    async (baseUrl) => {
      const client = createTestClient(baseUrl);

      const uncertain = await executeNativeBooking(
        {
          eventTypeUri: EVENT_TYPE_URI,
          startTimeUtc: "2026-11-20T17:00:00Z",
          idempotencyKey: "key-uncertain",
        },
        client
      );
      assert.equal(uncertain.success, false);
      assert.equal(uncertain.code, "UNCERTAIN_BOOKING_STATE");

      const diffPayload = await executeNativeBooking(
        {
          eventTypeUri: EVENT_TYPE_URI,
          startTimeUtc: "2026-11-20T17:00:00Z",
          idempotencyKey: "key-diff",
        },
        client
      );
      assert.equal(diffPayload.success, false);
      assert.equal(
        diffPayload.code,
        "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD"
      );
    }
  );
});

test("preserva SHARED_EVENT_INDIVIDUAL_CANCEL_REQUIRED e valida domínio/protocolo de cancelUrl", async () => {
  assert.equal(
    isValidCalendlyCancelUrl("https://calendly.com/cancellations/inv-1"),
    true
  );
  assert.equal(
    isValidCalendlyCancelUrl("https://app.calendly.com/cancellations/inv-1"),
    true
  );
  assert.equal(
    isValidCalendlyCancelUrl("http://calendly.com/cancellations/inv-1"),
    false
  );
  assert.equal(
    isValidCalendlyCancelUrl("https://evil.com/cancellations/inv-1"),
    false
  );

  await withMockServer(
    (req, res) => {
      res.writeHead(409, { "Content-Type": "application/json" });
      if (req.url?.includes("evt-valid")) {
        res.end(
          JSON.stringify({
            code: "SHARED_EVENT_INDIVIDUAL_CANCEL_REQUIRED",
            error: "Reunião compartilhada.",
            cancelUrl: "https://calendly.com/cancellations/inv-1",
          })
        );
        return;
      }
      res.end(
        JSON.stringify({
          code: "SHARED_EVENT_INDIVIDUAL_CANCEL_REQUIRED",
          error: "Reunião compartilhada.",
          cancelUrl: "https://phishing.example.com/cancel",
        })
      );
    },
    async (baseUrl) => {
      const client = createTestClient(baseUrl);

      const validRes = await executeCancelEvent(
        "https://api.calendly.com/scheduled_events/evt-valid",
        client
      );
      assert.equal(validRes.success, false);
      assert.equal(
        validRes.code,
        "SHARED_EVENT_INDIVIDUAL_CANCEL_REQUIRED"
      );
      assert.equal(
        validRes.cancelUrl,
        "https://calendly.com/cancellations/inv-1"
      );

      const untrustedRes = await executeCancelEvent(
        "https://api.calendly.com/scheduled_events/evt-evil",
        client
      );
      assert.equal(untrustedRes.success, false);
      assert.equal(
        untrustedRes.code,
        "SHARED_EVENT_INDIVIDUAL_CANCEL_REQUIRED"
      );
      assert.equal(untrustedRes.cancelUrl, undefined);
    }
  );
});

test("fetchEventsWithMeta propaga partialErrors e truncated na listagem da agenda", async () => {
  await withMockServer(
    (_req, res) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          activeEvents: [],
          pastEvents: [],
          missedEvents: [],
          partialErrors: 2,
          truncated: true,
        })
      );
    },
    async (baseUrl) => {
      const client = createTestClient(baseUrl);
      const res = await fetchEventsWithMeta(client);
      assert.equal(res.partialErrors, 2);
      assert.equal(res.truncated, true);
      assert.equal(res.activeEvents.length, 0);
    }
  );
});
