import express, { Express } from "express";
import cors from "cors";
import { ServerConfig } from "./config/env";
import { CalendlyClient } from "./services/calendlyClient";
import {
  createAuthMiddleware,
  GoogleTokenVerifier,
} from "./middleware/auth";
import { createRateLimiter } from "./middleware/rateLimit";
import { createCalendlyRouter } from "./routes/calendlyRoutes";

export interface AppDependencies {
  config: ServerConfig;
  calendlyClient: CalendlyClient;
  tokenVerifier: GoogleTokenVerifier;
  rateLimitMaxRequests?: number;
  rateLimitWindowMs?: number;
}

export function createApp({
  config,
  calendlyClient,
  tokenVerifier,
  rateLimitMaxRequests = 60,
  rateLimitWindowMs = 60_000,
}: AppDependencies): Express {
  const app = express();

  const allowedOrigins = new Set(config.corsAllowedOrigins);

  app.use(
    cors({
      origin(origin, callback) {
        // Clientes mobile nativos não enviam header Origin; clientes web são validados pela allowlist
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error("Origem não permitida pelo CORS."));
      },
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Idempotency-Key"],
    })
  );

  app.use(express.json({ limit: "64kb" }));

  app.get("/health", (_req, res) => {
    res.json({
      ok: true,
      service: "oriently-bff",
    });
  });

  const authMiddleware = createAuthMiddleware(tokenVerifier);
  const rateLimiter = createRateLimiter({
    windowMs: rateLimitWindowMs,
    maxRequests: rateLimitMaxRequests,
  });

  app.use(
    "/api/calendly",
    authMiddleware,
    rateLimiter,
    createCalendlyRouter({
      calendly: calendlyClient,
      allowedEventTypeUris: config.allowedEventTypeUris,
    })
  );

  return app;
}
