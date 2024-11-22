import { User } from './user.model';
import { Court } from './court.model';

export enum TrainingStatus {
  PLANNED = 'planned',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export interface Training {
  id: number;
  startTime: Date;
  endTime: Date;
  coach: User;
  players: User[];
  court: Court;
  status: TrainingStatus;
  price: number;
  notes?: string;
  maxPlayers: number;
}
