import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CourtAddressDto {
  @IsString()
  city: string;

  @IsString()
  street: string;

  @IsNumber()
  placeNumber: number;
}

export class CreateCourtDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => CourtAddressDto)
  address: CourtAddressDto;

  @IsString()
  @IsNotEmpty()
  surface: string;
}
