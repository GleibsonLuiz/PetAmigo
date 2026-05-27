import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from '../../presentation/controllers/pets.controller';
import { PetRepositoryPort } from '../../domain/repositories/pet.repository';
import { PetRepositoryPg } from '../../infrastructure/repositories/pet.repository.pg';

@Module({
  controllers: [PetsController],
  providers: [
    PetsService,
    { provide: PetRepositoryPort, useClass: PetRepositoryPg },
  ],
  exports: [PetsService],
})
export class PetsModule {}
