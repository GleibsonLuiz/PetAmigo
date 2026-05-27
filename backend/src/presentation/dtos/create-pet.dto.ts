import { IsString, IsOptional, IsIn, IsDateString, MaxLength } from 'class-validator';

export class CreatePetDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsIn(['dog', 'cat', 'bird', 'rabbit', 'other'])
  species!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  breed?: string;

  @IsDateString()
  birthDate!: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
