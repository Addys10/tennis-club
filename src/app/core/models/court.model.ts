export interface Court {
  id: number;
  name: string;
  surface: string;
  isIndoor: boolean;
  isAvailable: boolean;
  hourlyRate: number;
  description?: string;
  isActive: boolean;
}

export interface CourtAvailability {
  courtId: number;
  date: string;
  availableSlots: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
}
