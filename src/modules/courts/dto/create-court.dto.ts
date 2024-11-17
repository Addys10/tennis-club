import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateCourtDto {
  @IsString()
  name: string;

  @IsString()
  surface: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
