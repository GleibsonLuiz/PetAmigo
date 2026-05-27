import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateVaccinationDto {
  @IsUUID()
  vaccineId!: string;

  @IsDateString()
  applicationDate!: string;

  @IsOptional()
  @IsString()
  veterinarian?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
