import dotenv from "dotenv";

dotenv.config();

const parseCsv = (value: string | undefined): string[] =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export interface ServerConfig {
  port: number;
  calendlyApiBaseUrl: string;
  calendlyApiToken: string;
  calendlyTimeoutMs: number;
  allowedEventTypeUris: string[];
  googleClientIds: string[];
  corsAllowedOrigins: string[];
}

export function loadConfig(): ServerConfig {
  const timeoutRaw = Number(process.env.CALENDLY_TIMEOUT_MS);
  const portRaw = Number(process.env.PORT);

  return {
    port: Number.isFinite(portRaw) && portRaw > 0 ? portRaw : 3333,
    calendlyApiBaseUrl:
      process.env.CALENDLY_API_BASE_URL || "https://api.calendly.com",
    calendlyApiToken: process.env.CALENDLY_API_TOKEN || "",
    calendlyTimeoutMs:
      Number.isFinite(timeoutRaw) && timeoutRaw > 0 ? timeoutRaw : 10000,
    allowedEventTypeUris: parseCsv(process.env.ALLOWED_EVENT_TYPE_URIS),
    googleClientIds: parseCsv(process.env.GOOGLE_CLIENT_IDS),
    corsAllowedOrigins: parseCsv(process.env.CORS_ALLOWED_ORIGINS),
  };
}
