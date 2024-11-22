export interface Court {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  surface?: string;
  indoor?: boolean;
  hourlyRate?: number;
  maintenanceNotes?: string;
}
