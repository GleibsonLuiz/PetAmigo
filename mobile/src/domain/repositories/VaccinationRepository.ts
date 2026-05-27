import { VaccinationRecord, CreateVaccinationInput, Vaccine } from '../entities/Vaccination';

export interface VaccinationRepository {
  findByPetId(petId: string): Promise<VaccinationRecord[]>;
  findById(id: string): Promise<VaccinationRecord | null>;
  create(input: CreateVaccinationInput): Promise<VaccinationRecord>;
  delete(id: string): Promise<void>;
  getAvailableVaccines(species: string): Promise<Vaccine[]>;
}
