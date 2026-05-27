import { Injectable, NotFoundException } from '@nestjs/common';
import { GroomingRepositoryPort } from '../../domain/repositories/grooming.repository';
import { GroomingRecord } from '../../domain/entities/grooming-record.entity';
import { CreateGroomingDto } from '../../presentation/dtos/create-grooming.dto';

@Injectable()
export class GroomingService {
  constructor(private readonly groomingRepo: GroomingRepositoryPort) {}

  async findByPetId(petId: string): Promise<GroomingRecord[]> {
    return this.groomingRepo.findByPetId(petId);
  }

  async create(petId: string, dto: CreateGroomingDto): Promise<GroomingRecord> {
    return this.groomingRepo.create({
      petId,
      serviceType: dto.serviceType as GroomingRecord['serviceType'],
      location: dto.location,
      groomingDate: new Date(dto.groomingDate),
      nextDate: dto.nextDate ? new Date(dto.nextDate) : undefined,
      price: dto.price,
      notes: dto.notes,
    });
  }

  async delete(id: string): Promise<void> {
    const record = await this.groomingRepo.findById(id);
    if (!record) throw new NotFoundException('Registro de banho não encontrado');
    return this.groomingRepo.delete(id);
  }

  async findUpcoming(petIds: string[]): Promise<GroomingRecord[]> {
    return this.groomingRepo.findUpcoming(petIds);
  }
}
