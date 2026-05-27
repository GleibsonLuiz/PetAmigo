import { api } from '../api/client';
import {
  VaccinationRecord,
  CreateVaccinationInput,
  Vaccine,
} from '../../domain/entities/Vaccination';
import { VaccinationRepository } from '../../domain/repositories/VaccinationRepository';

export class VaccinationRepositoryImpl implements VaccinationRepository {
  async findByPetId(petId: string): Promise<VaccinationRecord[]> {
    return api.get<VaccinationRecord[]>(`/pets/${petId}/vaccinations`);
  }

  async findById(id: string): Promise<VaccinationRecord | null> {
    return api.get<VaccinationRecord | null>(`/vaccinations/${id}`);
  }

  async create(input: CreateVaccinationInput): Promise<VaccinationRecord> {
    return api.post<VaccinationRecord>(`/pets/${input.petId}/vaccinations`, input);
  }

  async delete(id: string): Promise<void> {
    return api.delete(`/vaccinations/${id}`);
  }

  async getAvailableVaccines(species: string): Promise<Vaccine[]> {
    return api.get<Vaccine[]>(`/vaccines?species=${species}`);
  }
}
