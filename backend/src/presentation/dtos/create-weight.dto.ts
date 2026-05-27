import { IsNumber, IsOptional, IsDateString, IsString, Min } from 'class-validator';

export class CreateWeightDto {
  @IsNumber()
  @Min(0.01)
  weightKg!: number;

  @IsDateString()
  recordedAt!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
