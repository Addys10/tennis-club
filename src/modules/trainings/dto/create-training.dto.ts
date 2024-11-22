import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TrainingStatus } from '../../../enums/training-status.enum';

export class CreateTrainingDto {
  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  @IsNumber()
  coachId: number;

  @IsArray()
  @IsOptional()
  playerIds: number[];

  @IsNumber()
  courtId: number;

  @IsEnum(TrainingStatus)
  @IsOptional()
  status?: TrainingStatus;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsOptional()
  maxPlayers?: number;
}
