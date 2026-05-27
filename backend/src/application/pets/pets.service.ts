import { Injectable, NotFoundException } from '@nestjs/common';
import { PetRepositoryPort } from '../../domain/repositories/pet.repository';
import { Pet } from '../../domain/entities/pet.entity';
import { CreatePetDto } from '../../presentation/dtos/create-pet.dto';
import { UpdatePetDto } from '../../presentation/dtos/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(private readonly petRepo: PetRepositoryPort) {}

  async findAll(ownerId: string): Promise<Pet[]> {
    return this.petRepo.findAll(ownerId);
  }

  async findById(id: string): Promise<Pet> {
    const pet = await this.petRepo.findById(id);
    if (!pet) throw new NotFoundException('Pet não encontrado');
    return pet;
  }

  async create(ownerId: string, dto: CreatePetDto): Promise<Pet> {
    return this.petRepo.create({
      ...dto,
      birthDate: new Date(dto.birthDate),
      ownerId,
    });
  }

  async update(id: string, dto: UpdatePetDto): Promise<Pet> {
    await this.findById(id);
    return this.petRepo.update(id, {
      ...dto,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
    });
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.petRepo.delete(id);
  }
}
