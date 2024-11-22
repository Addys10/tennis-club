import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../enums/user-role.enum';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsOptional()
  phone?: string;

  // Trenérská rozšíření - volitelná
  @IsArray()
  @IsOptional()
  specialization?: string[];

  @IsArray()
  @IsOptional()
  qualifications?: string[];

  @IsNumber()
  @IsOptional()
  hourlyRate?: number;

  @IsOptional()
  availability?: any;

  @IsNumber()
  @IsOptional()
  maximumStudents?: number;
}
