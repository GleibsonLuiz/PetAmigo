import { Module } from '@nestjs/common';
import { VaccinationsService } from './vaccinations.service';
import { VaccinationsController } from '../../presentation/controllers/vaccinations.controller';
import { VaccinationRepositoryPort } from '../../domain/repositories/vaccination.repository';
import { VaccinationRepositoryPg } from '../../infrastructure/repositories/vaccination.repository.pg';

@Module({
  controllers: [VaccinationsController],
  providers: [
    VaccinationsService,
    { provide: VaccinationRepositoryPort, useClass: VaccinationRepositoryPg },
  ],
  exports: [VaccinationsService],
})
export class VaccinationsModule {}
