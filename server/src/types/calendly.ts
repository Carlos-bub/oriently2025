export interface AuthenticatedUser {
  sub: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

export interface CalendlyUser {
  uri: string;
  name: string;
  email?: string;
}

export interface CalendlyEventTypeLocation {
  kind: string;
  location?: string;
  additional_info?: string;
}

export interface CalendlyEventType {
  uri: string;
  name: string;
  slug: string;
  active: boolean;
  duration: number;
  locations?: CalendlyEventTypeLocation[];
}

export interface CalendlyAvailableTime {
  start_time: string;
  status?: string;
  invitees_remaining?: number;
}

export interface CalendlyInvitee {
  uri: string;
  email: string;
  name?: string;
  status: string;
  event?: string;
  cancel_url?: string;
  reschedule_url?: string;
}

export interface CalendlyEventLocation {
  type?: string;
  location?: string;
  join_url?: string;
}

export interface CalendlyScheduledEvent {
  uri: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  cancel_reason?: string;
  location?: CalendlyEventLocation;
  invitees?: CalendlyInvitee[];
}

export interface CreateInviteePayload {
  event_type: string;
  start_time: string;
  invitee: {
    name: string;
    email: string;
    timezone: string;
  };
  location?: {
    kind: string;
    location?: string;
  };
}

export interface BookingSummary {
  inviteeUri: string;
  eventUri: string;
  eventName: string;
  startTime: string;
  endTime?: string;
  locationLabel?: string;
  cancelUrl?: string;
  rescheduleUrl?: string;
  status: string;
}
