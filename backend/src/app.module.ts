import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { PetsModule } from './application/pets/pets.module';
import { VaccinationsModule } from './application/vaccinations/vaccinations.module';
import { TutorsModule } from './application/tutors/tutors.module';
import { GroomingModule } from './application/grooming/grooming.module';
import { AuthModule } from './application/auth/auth.module';
import { WeightModule } from './application/weight/weight.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    PetsModule,
    VaccinationsModule,
    TutorsModule,
    GroomingModule,
    WeightModule,
  ],
})
export class AppModule {}
