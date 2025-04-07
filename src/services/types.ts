export interface User {
    uri: string;
    name: string;
    email: string;
  }
  
  export interface EventType {
    uri: string;
    name: string;
    slug: string;
  }
  
  export interface AvailabilitySchedule {
    start_time: string; 
    end_time: string;   
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
  }