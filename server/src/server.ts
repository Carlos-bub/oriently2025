import { loadConfig } from "./config/env";
import { createCalendlyClient } from "./services/calendlyClient";
import { createGoogleTokenVerifier } from "./middleware/auth";
import { createApp } from "./app";

const config = loadConfig();

const calendlyClient = createCalendlyClient({
  baseURL: config.calendlyApiBaseUrl,
  token: config.calendlyApiToken,
  timeoutMs: config.calendlyTimeoutMs,
});

const tokenVerifier = createGoogleTokenVerifier(config.googleClientIds);

const app = createApp({
  config,
  calendlyClient,
  tokenVerifier,
});

app.listen(config.port, () => {
  console.log(`Oriently BFF rodando na porta ${config.port}`);
});
