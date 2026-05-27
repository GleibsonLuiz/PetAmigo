import { Module } from '@nestjs/common';
import { GroomingService } from './grooming.service';
import { GroomingController } from '../../presentation/controllers/grooming.controller';
import { GroomingRepositoryPort } from '../../domain/repositories/grooming.repository';
import { GroomingRepositoryPg } from '../../infrastructure/repositories/grooming.repository.pg';

@Module({
  controllers: [GroomingController],
  providers: [
    GroomingService,
    { provide: GroomingRepositoryPort, useClass: GroomingRepositoryPg },
  ],
  exports: [GroomingService],
})
export class GroomingModule {}
