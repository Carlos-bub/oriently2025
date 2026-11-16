export interface User {
    uri: string;
    name: string;
    email: string;
  }
  
  export interface EventType {
    uri: string;
    name: string;
    slug: string;
    active?: boolean;
    duration?: number;
  }
  
  export interface AvailabilitySchedule {
    start_time: string; 
    end_time: string;   
  }

  export interface BookingDetails {
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

  export type BookingErrorCode =
    | "SLOT_UNAVAILABLE"
    | "AUTH_ERROR"
    | "RATE_LIMIT"
    | "NETWORK_ERROR"
    | "TIMEOUT"
    | "BOOKING_IN_PROGRESS"
    | "UNCERTAIN_BOOKING_STATE"
    | "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD"
    | "UNKNOWN";

  export interface BookingResult {
    success: boolean;
    deduplicated?: boolean;
    booking?: BookingDetails;
    error?: string;
    code?: BookingErrorCode;
  }

  export interface Invitee {
    uri: string;
    email: string;
    name?: string;
    status: string;
    event?: string;
  }

  export interface CalendlyEvent {
    uri: string;
    name: string;
    status: string;
    start_time: string;
    end_time: string;
    cancel_reason?: string;
    invitees?: Invitee[];
    location?: {
      type?: string;
      location?: string;
      join_url?: string;
    };
  }