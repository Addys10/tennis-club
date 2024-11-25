import {TrainingStatus} from '@core/models/training.model';

export interface ITrainingFormData {
  startTime: Date;
  endTime: Date;
  coachId: number;
  courtId: number;
  playerIds: number[];
  price: number;
  notes?: string;
  maxPlayers: number;
  status: TrainingStatus;
}

export interface ITimeSlot {
  startTime: Date | string;
  endTime: Date | string;
  isAvailable: boolean;
}
