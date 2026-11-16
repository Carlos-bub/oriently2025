import dotenv from "dotenv";

dotenv.config();

const parseCsv = (value: string | undefined): string[] =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export interface ServerConfig {
  nodeEnv: string;
  port: number;
  calendlyApiBaseUrl: string;
  calendlyApiToken: string;
  calendlyTimeoutMs: number;
  allowedEventTypeUris: string[];
  googleClientIds: string[];
  corsAllowedOrigins: string[];
}

export function loadConfig(): ServerConfig {
  const nodeEnv = process.env.NODE_ENV || "development";
  const timeoutRaw = Number(process.env.CALENDLY_TIMEOUT_MS);
  const portRaw = Number(process.env.PORT);
  const allowedEventTypeUris = parseCsv(process.env.ALLOWED_EVENT_TYPE_URIS);

  if (nodeEnv === "production" && allowedEventTypeUris.length === 0) {
    throw new Error(
      "ALLOWED_EVENT_TYPE_URIS é obrigatório quando NODE_ENV=production."
    );
  }

  return {
    nodeEnv,
    port: Number.isFinite(portRaw) && portRaw > 0 ? portRaw : 3333,
    calendlyApiBaseUrl:
      process.env.CALENDLY_API_BASE_URL || "https://api.calendly.com",
    calendlyApiToken: process.env.CALENDLY_API_TOKEN || "",
    calendlyTimeoutMs:
      Number.isFinite(timeoutRaw) && timeoutRaw > 0 ? timeoutRaw : 10000,
    allowedEventTypeUris,
    googleClientIds: parseCsv(process.env.GOOGLE_CLIENT_IDS),
    corsAllowedOrigins: parseCsv(process.env.CORS_ALLOWED_ORIGINS),
  };
}
