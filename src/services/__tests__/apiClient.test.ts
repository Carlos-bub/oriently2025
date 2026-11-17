import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import {
  ApiAuthProvider,
  ApiError,
  createApiClient,
  resolveBackendUrl,
} from "../apiClient";

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

test("resolveBackendUrl prioriza EXPO_PUBLIC_BACKEND_URL e evita localhost do hostUri", () => {
  assert.equal(
    resolveBackendUrl("http://192.168.0.10:3333/", "localhost:8081"),
    "http://192.168.0.10:3333"
  );
  assert.equal(
    resolveBackendUrl(undefined, "192.168.1.50:8081"),
    "http://192.168.1.50:3333"
  );
  assert.equal(resolveBackendUrl(undefined, "localhost:8081"), "");
});

test("envia Google ID Token no cabeçalho Authorization Bearer", async () => {
  let receivedAuth: string | undefined;

  await withMockServer(
    (req, res) => {
      receivedAuth = req.headers.authorization;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    },
    async (baseUrl) => {
      const authRef: { current: ApiAuthProvider | null } = {
        current: {
          getIdToken: () => "google-id-token-123",
          refreshIdToken: async () => null,
          onUnauthorized: async () => {},
        },
      };

      const client = createApiClient(baseUrl, authRef);
      const res = await client.get("/api/calendly/me");
      assert.equal(res.status, 200);
      assert.equal(receivedAuth, "Bearer google-id-token-123");
    }
  );
});

test("renova ID Token expirado em 401 e repete a requisição uma vez", async () => {
  let currentToken = "expired-id-token";
  let refreshCalls = 0;
  let unauthorizedCalls = 0;
  let attemptCount = 0;

  await withMockServer(
    (req, res) => {
      attemptCount += 1;
      if (req.headers.authorization === "Bearer refreshed-id-token") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ resource: { name: "Prof" } }));
        return;
      }
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ code: "UNAUTHORIZED", error: "Token expirado" }));
    },
    async (baseUrl) => {
      const authRef: { current: ApiAuthProvider | null } = {
        current: {
          getIdToken: () => currentToken,
          refreshIdToken: async () => {
            refreshCalls += 1;
            currentToken = "refreshed-id-token";
            return currentToken;
          },
          onUnauthorized: async () => {
            unauthorizedCalls += 1;
          },
        },
      };

      const client = createApiClient(baseUrl, authRef);
      const res = await client.get("/api/calendly/me");
      assert.equal(res.status, 200);
      assert.equal(attemptCount, 2);
      assert.equal(refreshCalls, 1);
      assert.equal(unauthorizedCalls, 0);
    }
  );
});

test("chama onUnauthorized quando renovação do ID Token falha após 401", async () => {
  let unauthorizedCalls = 0;

  await withMockServer(
    (_req, res) => {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ code: "UNAUTHORIZED", error: "Sessão inválida" }));
    },
    async (baseUrl) => {
      const authRef: { current: ApiAuthProvider | null } = {
        current: {
          getIdToken: () => "bad-token",
          refreshIdToken: async () => null,
          onUnauthorized: async () => {
            unauthorizedCalls += 1;
          },
        },
      };

      const client = createApiClient(baseUrl, authRef);
      await assert.rejects(
        () => client.get("/api/calendly/events"),
        (err: unknown) => {
          assert.ok(err instanceof ApiError);
          assert.equal(err.status, 401);
          assert.equal(err.code, "UNAUTHORIZED");
          return true;
        }
      );
      assert.equal(unauthorizedCalls, 1);
    }
  );
});

test("mapeia erros HTTP 403, 429 e falha de rede para ApiError", async () => {
  await withMockServer(
    (req, res) => {
      if (req.url === "/forbidden") {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ code: "FORBIDDEN", error: "Sem permissão" }));
        return;
      }
      res.writeHead(429, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ code: "RATE_LIMIT", error: "Muitas requisições" }));
    },
    async (baseUrl) => {
      const authRef: { current: ApiAuthProvider | null } = {
        current: {
          getIdToken: () => "valid-token",
          refreshIdToken: async () => null,
          onUnauthorized: async () => {},
        },
      };

      const client = createApiClient(baseUrl, authRef);

      await assert.rejects(
        () => client.get("/forbidden"),
        (err: unknown) =>
          err instanceof ApiError &&
          err.status === 403 &&
          err.code === "FORBIDDEN"
      );

      await assert.rejects(
        () => client.get("/ratelimit"),
        (err: unknown) =>
          err instanceof ApiError &&
          err.status === 429 &&
          err.code === "RATE_LIMIT"
      );
    }
  );
});
