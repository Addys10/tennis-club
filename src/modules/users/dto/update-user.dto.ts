import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '../../../enums/user-role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsArray()
  specialization?: string[];

  @IsOptional()
  @IsArray()
  qualifications?: string[];

  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @IsOptional()
  availability?: any;

  @IsOptional()
  @IsNumber()
  maximumStudents?: number;

  @IsOptional()
  isActive?: boolean;
}
