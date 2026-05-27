import { Injectable, NotFoundException } from '@nestjs/common';
import { WeightRepositoryPort } from '../../domain/repositories/weight.repository';
import { WeightRecord } from '../../domain/entities/weight-record.entity';
import { CreateWeightDto } from '../../presentation/dtos/create-weight.dto';

@Injectable()
export class WeightService {
  constructor(private readonly weightRepo: WeightRepositoryPort) {}

  async findByPetId(petId: string): Promise<WeightRecord[]> {
    return this.weightRepo.findByPetId(petId);
  }

  async create(petId: string, dto: CreateWeightDto): Promise<WeightRecord> {
    return this.weightRepo.create({
      petId,
      weightKg: dto.weightKg,
      recordedAt: new Date(dto.recordedAt),
      notes: dto.notes,
    });
  }

  async delete(id: string): Promise<void> {
    return this.weightRepo.delete(id);
  }
}
