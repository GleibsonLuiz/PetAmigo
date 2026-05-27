import { api } from '../api/client';
import { Tutor, CreateTutorInput, UpdateTutorInput } from '../../domain/entities/Tutor';
import { TutorRepository } from '../../domain/repositories/TutorRepository';

export class TutorRepositoryImpl implements TutorRepository {
  async findAll(): Promise<Tutor[]> {
    return api.get<Tutor[]>('/tutors');
  }

  async findById(id: string): Promise<Tutor | null> {
    return api.get<Tutor | null>(`/tutors/${id}`);
  }

  async create(input: CreateTutorInput): Promise<Tutor> {
    return api.post<Tutor>('/tutors', input);
  }

  async update(input: UpdateTutorInput): Promise<Tutor> {
    const { id, ...data } = input;
    return api.patch<Tutor>(`/tutors/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return api.delete(`/tutors/${id}`);
  }
}
