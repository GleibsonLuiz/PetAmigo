import { IsString, IsOptional, IsIn, IsDateString, MaxLength } from 'class-validator';

export class UpdatePetDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsIn(['dog', 'cat', 'bird', 'rabbit', 'other'])
  species?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  breed?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
