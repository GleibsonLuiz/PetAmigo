import { Pet, CreatePetInput, UpdatePetInput } from '../entities/Pet';

export interface PetRepository {
  findAll(): Promise<Pet[]>;
  findById(id: string): Promise<Pet | null>;
  create(input: CreatePetInput): Promise<Pet>;
  update(input: UpdatePetInput): Promise<Pet>;
  delete(id: string): Promise<void>;
}
