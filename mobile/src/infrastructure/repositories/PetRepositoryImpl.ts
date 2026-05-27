import { api } from '../api/client';
import { Pet, CreatePetInput, UpdatePetInput } from '../../domain/entities/Pet';
import { PetRepository } from '../../domain/repositories/PetRepository';

export class PetRepositoryImpl implements PetRepository {
  async findAll(): Promise<Pet[]> {
    return api.get<Pet[]>('/pets');
  }

  async findById(id: string): Promise<Pet | null> {
    return api.get<Pet | null>(`/pets/${id}`);
  }

  async create(input: CreatePetInput): Promise<Pet> {
    return api.post<Pet>('/pets', input);
  }

  async update(input: UpdatePetInput): Promise<Pet> {
    const { id, ...data } = input;
    return api.patch<Pet>(`/pets/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return api.delete(`/pets/${id}`);
  }
}
