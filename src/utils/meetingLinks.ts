import { CalendlyEvent } from "../services/types";

const CALENDLY_HOSTNAME_SUFFIX = "calendly.com";

function parseHttpsUrl(rawUrl?: string | null): URL | null {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isCalendlyHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  return (
    lower === CALENDLY_HOSTNAME_SUFFIX ||
    lower.endsWith(`.${CALENDLY_HOSTNAME_SUFFIX}`)
  );
}

/**
 * Retorna a URL real da videoconferência apenas quando `location.join_url`
 * for HTTPS válido e não apontar para domínios do Calendly (ex.: URI do evento).
 */
export function getValidVideoJoinUrl(
  event?: Pick<CalendlyEvent, "location"> | null
): string | null {
  const parsed = parseHttpsUrl(event?.location?.join_url);
  if (!parsed) return null;
  if (isCalendlyHostname(parsed.hostname)) return null;
  return parsed.toString();
}

/**
 * Retorna um rótulo legível para o local/modalidade do encontro.
 */
export function getMeetingLocationLabel(
  event?: Pick<CalendlyEvent, "location"> | null
): string | null {
  if (!event?.location) return null;
  if (event.location.location) return event.location.location;
  if (event.location.type === "google_conference") return "Google Meet";
  if (event.location.type === "zoom") return "Zoom";
  if (event.location.type === "microsoft_teams_conference") {
    return "Microsoft Teams";
  }
  if (getValidVideoJoinUrl(event)) return "Videoconferência";
  return null;
}

/**
 * Valida URLs de cancelamento ou reagendamento hospedadas no Calendly.
 */
export function getValidCalendlyActionUrl(rawUrl?: string | null): string | null {
  const parsed = parseHttpsUrl(rawUrl);
  if (!parsed) return null;
  if (!isCalendlyHostname(parsed.hostname)) return null;
  return parsed.toString();
}
