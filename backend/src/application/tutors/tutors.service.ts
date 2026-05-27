import { Injectable, NotFoundException } from '@nestjs/common';
import { TutorRepositoryPort } from '../../domain/repositories/tutor.repository';
import { Tutor } from '../../domain/entities/tutor.entity';
import { Pet } from '../../domain/entities/pet.entity';
import { CreateTutorDto } from '../../presentation/dtos/create-tutor.dto';
import { UpdateTutorDto } from '../../presentation/dtos/update-tutor.dto';

@Injectable()
export class TutorsService {
  constructor(private readonly tutorRepo: TutorRepositoryPort) {}

  async findAll(): Promise<Tutor[]> {
    return this.tutorRepo.findAll();
  }

  async findById(id: string): Promise<Tutor> {
    const tutor = await this.tutorRepo.findById(id);
    if (!tutor) throw new NotFoundException('Tutor não encontrado');
    return tutor;
  }

  async create(dto: CreateTutorDto): Promise<Tutor> {
    return this.tutorRepo.create(dto);
  }

  async update(id: string, dto: UpdateTutorDto): Promise<Tutor> {
    await this.findById(id);
    return this.tutorRepo.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.tutorRepo.delete(id);
  }

  async getPetsByTutor(tutorId: string): Promise<Pet[]> {
    await this.findById(tutorId);
    return this.tutorRepo.findPetsByTutorId(tutorId);
  }

  async getTutorsByPet(petId: string): Promise<Tutor[]> {
    return this.tutorRepo.findTutorsByPetId(petId);
  }

  async sharePet(petId: string, tutorId: string): Promise<void> {
    await this.findById(tutorId);
    return this.tutorRepo.addPetToTutor(petId, tutorId, 'caretaker');
  }

  async unsharePet(petId: string, tutorId: string): Promise<void> {
    return this.tutorRepo.removePetFromTutor(petId, tutorId);
  }
}
