import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TrainingStatus } from '../../../enums/training-status.enum';
import { TRAINING_CONSTRAINTS } from '../training.constants';

export class CreateTrainingDto {
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @Type(() => Date)
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
  @IsOptional()
  @ValidateIf((o) => o.price !== undefined)
  price?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(TRAINING_CONSTRAINTS.DEFAULT_MAX_PLAYERS)
  maxPlayers?: number;
}
