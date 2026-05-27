import { Tutor } from '../entities/tutor.entity';
import { Pet } from '../entities/pet.entity';

export abstract class TutorRepositoryPort {
  abstract findAll(): Promise<Tutor[]>;
  abstract findByUserId(userId: string): Promise<Tutor[]>;
  abstract findById(id: string): Promise<Tutor | null>;
  abstract create(tutor: Partial<Tutor>): Promise<Tutor>;
  abstract createForUser(userId: string, data: Partial<Tutor>): Promise<Tutor>;
  abstract update(id: string, data: Partial<Tutor>): Promise<Tutor>;
  abstract delete(id: string): Promise<void>;
  abstract findPetsByTutorId(tutorId: string): Promise<Pet[]>;
  abstract findTutorsByPetId(petId: string): Promise<Tutor[]>;
  abstract addPetToTutor(petId: string, tutorId: string, role: string): Promise<void>;
  abstract removePetFromTutor(petId: string, tutorId: string): Promise<void>;
}
