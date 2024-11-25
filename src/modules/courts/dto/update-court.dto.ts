export class CreateCourtDto {
  name: string;
  surface: string;
  isIndoor: boolean;
  isAvailable: boolean;
  hourlyRate: number;
  description?: string;
}

export class UpdateCourtDto {
  name?: string;
  surface?: string;
  isIndoor?: boolean;
  isAvailable?: boolean;
  hourlyRate?: number;
  description?: string;
}
