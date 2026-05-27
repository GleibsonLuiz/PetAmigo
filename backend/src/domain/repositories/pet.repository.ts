import { Pet } from '../entities/pet.entity';

export abstract class PetRepositoryPort {
  abstract findAll(ownerId: string): Promise<Pet[]>;
  abstract findById(id: string): Promise<Pet | null>;
  abstract create(pet: Partial<Pet>): Promise<Pet>;
  abstract update(id: string, data: Partial<Pet>): Promise<Pet>;
  abstract delete(id: string): Promise<void>;
}
