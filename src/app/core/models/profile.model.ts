export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  specializations?: string[];
  hourlyRate?: number;
  isActive: boolean;
  created: Date;
  lastLogin?: Date;
}
