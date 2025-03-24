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