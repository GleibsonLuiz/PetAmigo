import { IsString, IsOptional, IsIn, IsDateString, IsNumber, Min, MaxLength } from 'class-validator';

export class CreateGroomingDto {
  @IsIn(['bath', 'bath_grooming', 'hygienic_grooming', 'full_grooming'])
  serviceType!: string;

  @IsString()
  @MaxLength(200)
  location!: string;

  @IsDateString()
  groomingDate!: string;

  @IsOptional()
  @IsDateString()
  nextDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
