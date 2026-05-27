import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { PetsModule } from './application/pets/pets.module';
import { VaccinationsModule } from './application/vaccinations/vaccinations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    PetsModule,
    VaccinationsModule,
  ],
})
export class AppModule {}
