import { IsString, IsOptional, IsEmail, MaxLength } from 'class-validator';

export class CreateTutorDto {
  @IsString()
  @MaxLength(150)
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
