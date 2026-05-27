import { api } from '../api/client';
import { GroomingRecord, CreateGroomingInput } from '../../domain/entities/Grooming';

export class GroomingRepositoryImpl {
  async findByPetId(petId: string): Promise<GroomingRecord[]> {
    return api.get<GroomingRecord[]>(`/pets/${petId}/grooming`);
  }

  async create(input: CreateGroomingInput): Promise<GroomingRecord> {
    return api.post<GroomingRecord>(`/pets/${input.petId}/grooming`, input);
  }

  async delete(id: string): Promise<void> {
    return api.delete(`/grooming/${id}`);
  }
}
