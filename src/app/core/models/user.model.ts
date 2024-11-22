export enum UserRole {
  ADMIN = 'admin',
  COACH = 'coach',
  PLAYER = 'player',
  PARENT = 'parent',
  MEMBER = 'member'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
  // Trenérská rozšíření
  specialization?: string[];
  qualifications?: string[];
  hourlyRate?: number;
  availability?: any;
  maximumStudents?: number;
  isActive: boolean;
}
