import {
  BookingResult,
  CalendlyEvent,
  CancelEventResult,
  EventType,
  PastAndMissedEventsResult,
  User,
} from "./types";
import { CreateNativeBookingParams } from "./bookingService";

let demoModeActive = false;

const DEMO_USER: User = {
  uri: "demo://users/orientador-demo",
  name: "Prof. Dr. Marcos Silva (Demo)",
  email: "orientador.demo@oriently.app",
};

const DEMO_EVENT_TYPES: EventType[] = [
  {
    uri: "demo://event_types/tcc-metodologia",
    name: "Orientação de TCC • Metodologia",
    slug: "tcc-metodologia",
    active: true,
    duration: 30,
  },
  {
    uri: "demo://event_types/revisao-capitulo",
    name: "Revisão de Capítulo / Pré-banca",
    slug: "revisao-capitulo",
    active: true,
    duration: 45,
  },
];

function addDaysAtHour(daysOffset: number, hour: number, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function buildInitialDemoEvents(userEmail = "teste@example.com"): CalendlyEvent[] {
  const next1Start = addDaysAtHour(2, 11, 0);
  const next1End = new Date(next1Start.getTime() + 30 * 60000);

  const next2Start = addDaysAtHour(5, 14, 30);
  const next2End = new Date(next2Start.getTime() + 45 * 60000);

  const pastStart = addDaysAtHour(-4, 10, 0);
  const pastEnd = new Date(pastStart.getTime() + 30 * 60000);

  const canceledStart = addDaysAtHour(-1, 16, 0);
  const canceledEnd = new Date(canceledStart.getTime() + 30 * 60000);

  const invitee = {
    uri: "demo://invitees/visitante-demo",
    email: userEmail,
    name: "Visitante Demo",
    status: "active",
  };

  return [
    {
      uri: "demo://scheduled_events/evt-demo-1",
      name: "Orientação de TCC: Metodologia",
      status: "active",
      start_time: next1Start.toISOString(),
      end_time: next1End.toISOString(),
      invitees: [invitee],
      location: {
        type: "google_conference",
        location: "Google Meet (Modo Demo)",
      },
    },
    {
      uri: "demo://scheduled_events/evt-demo-2",
      name: "Revisão de Capítulo 2",
      status: "active",
      start_time: next2Start.toISOString(),
      end_time: next2End.toISOString(),
      invitees: [invitee],
      location: {
        type: "google_conference",
        location: "Google Meet (Modo Demo)",
      },
    },
    {
      uri: "demo://scheduled_events/evt-demo-3",
      name: "Definição do Tema e Objetivos",
      status: "active",
      start_time: pastStart.toISOString(),
      end_time: pastEnd.toISOString(),
      invitees: [invitee],
      location: {
        type: "google_conference",
        location: "Google Meet (Modo Demo)",
      },
    },
    {
      uri: "demo://scheduled_events/evt-demo-4",
      name: "Alinhamento Inicial de Cronograma",
      status: "canceled",
      start_time: canceledStart.toISOString(),
      end_time: canceledEnd.toISOString(),
      cancel_reason: "Reagendado pelo estudante no modo demonstração",
      invitees: [invitee],
      location: {
        type: "google_conference",
        location: "Google Meet (Modo Demo)",
      },
    },
  ];
}

let demoEvents: CalendlyEvent[] = buildInitialDemoEvents();

export function isDemoModeActive(): boolean {
  return demoModeActive;
}

export function setDemoModeActive(active: boolean): void {
  demoModeActive = active;
  if (!active) {
    demoEvents = buildInitialDemoEvents();
  }
}

export function resetDemoStore(userEmail = "teste@example.com"): void {
  demoEvents = buildInitialDemoEvents(userEmail);
}

export function getDemoUserInfo(): User {
  return DEMO_USER;
}

export function getDemoEventTypes(): EventType[] {
  return DEMO_EVENT_TYPES;
}

export function getDemoAvailableTimes(
  _eventTypeUri: string,
  selectedDate: string
): string[] {
  const baseHours = [
    [9, 30],
    [11, 0],
    [14, 0],
    [15, 30],
    [17, 0],
  ];

  const nowMs = Date.now();
  const bookedTimes = new Set(
    demoEvents
      .filter((ev) => ev.status !== "canceled")
      .map((ev) => new Date(ev.start_time).getTime())
  );

  const slots: string[] = [];
  for (const [h, m] of baseHours) {
    const slotDate = new Date(`${selectedDate}T00:00:00`);
    slotDate.setHours(h, m, 0, 0);
    const ms = slotDate.getTime();
    if (ms > nowMs + 15 * 60000 && !bookedTimes.has(ms)) {
      slots.push(slotDate.toISOString());
    }
  }

  return slots;
}

export function getDemoEvents(
  seedInvitees?: (uri: string, invitees: NonNullable<CalendlyEvent["invitees"]>) => void
): PastAndMissedEventsResult {
  const nowMs = Date.now();
  const activeEvents: CalendlyEvent[] = [];
  const pastEvents: CalendlyEvent[] = [];
  const missedEvents: CalendlyEvent[] = [];

  for (const ev of demoEvents) {
    if (seedInvitees && ev.invitees) {
      seedInvitees(ev.uri, ev.invitees);
    }

    if (ev.status === "canceled") {
      missedEvents.push(ev);
    } else if (new Date(ev.start_time).getTime() >= nowMs) {
      activeEvents.push(ev);
    } else {
      pastEvents.push(ev);
    }
  }

  return { activeEvents, pastEvents, missedEvents };
}

export function createDemoBooking(
  params: CreateNativeBookingParams,
  userEmail = "teste@example.com"
): BookingResult {
  const startMs = new Date(params.startTimeUtc).getTime();
  const alreadyTaken = demoEvents.some(
    (ev) =>
      ev.status !== "canceled" && new Date(ev.start_time).getTime() === startMs
  );

  if (alreadyTaken) {
    return {
      success: false,
      code: "SLOT_UNAVAILABLE",
      error: "Este horário já foi reservado no modo demonstração.",
    };
  }

  const eventType =
    DEMO_EVENT_TYPES.find((t) => t.uri === params.eventTypeUri) ||
    DEMO_EVENT_TYPES[0];
  const durationMin = eventType.duration || 30;
  const endTime = new Date(startMs + durationMin * 60000).toISOString();
  const eventUri = `demo://scheduled_events/evt-demo-${Date.now()}`;

  const createdEvent: CalendlyEvent = {
    uri: eventUri,
    name: eventType.name,
    status: "active",
    start_time: params.startTimeUtc,
    end_time: endTime,
    invitees: [
      {
        uri: `demo://invitees/${Date.now()}`,
        email: userEmail,
        name: "Visitante Demo",
        status: "active",
      },
    ],
    location: {
      type: "google_conference",
      location: "Google Meet (Modo Demo)",
    },
  };

  demoEvents = [...demoEvents, createdEvent];

  return {
    success: true,
    booking: {
      inviteeUri: createdEvent.invitees![0].uri,
      eventUri,
      eventName: eventType.name,
      startTime: params.startTimeUtc,
      endTime,
      locationLabel: "Google Meet (Modo Demo)",
      status: "active",
    },
  };
}

export function cancelDemoEvent(eventUri: string): CancelEventResult {
  const target = demoEvents.find((ev) => ev.uri === eventUri);
  if (!target) {
    return {
      success: false,
      error: "Reunião de demonstração não encontrada.",
    };
  }

  demoEvents = demoEvents.map((ev) =>
    ev.uri === eventUri
      ? {
          ...ev,
          status: "canceled",
          cancel_reason: "Cancelado no modo demonstração",
        }
      : ev
  );

  return { success: true };
}
