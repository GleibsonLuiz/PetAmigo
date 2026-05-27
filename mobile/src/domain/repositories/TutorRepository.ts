import { Tutor, CreateTutorInput, UpdateTutorInput } from '../entities/Tutor';

export interface TutorRepository {
  findAll(): Promise<Tutor[]>;
  findById(id: string): Promise<Tutor | null>;
  create(input: CreateTutorInput): Promise<Tutor>;
  update(input: UpdateTutorInput): Promise<Tutor>;
  delete(id: string): Promise<void>;
}
