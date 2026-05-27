import { Module } from '@nestjs/common';
import { WeightService } from './weight.service';
import { WeightController } from '../../presentation/controllers/weight.controller';
import { WeightRepositoryPort } from '../../domain/repositories/weight.repository';
import { WeightRepositoryPg } from '../../infrastructure/repositories/weight.repository.pg';

@Module({
  controllers: [WeightController],
  providers: [
    WeightService,
    { provide: WeightRepositoryPort, useClass: WeightRepositoryPg },
  ],
  exports: [WeightService],
})
export class WeightModule {}
