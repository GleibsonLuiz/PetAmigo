import { VaccinationRecord } from '../entities/vaccination-record.entity';
import { Vaccine } from '../entities/vaccine.entity';

export abstract class VaccinationRepositoryPort {
  abstract findByPetId(petId: string): Promise<VaccinationRecord[]>;
  abstract findById(id: string): Promise<VaccinationRecord | null>;
  abstract create(record: Partial<VaccinationRecord>): Promise<VaccinationRecord>;
  abstract delete(id: string): Promise<void>;
  abstract getVaccinesBySpecies(species: string): Promise<Vaccine[]>;
  abstract findVaccineById(id: string): Promise<Vaccine | null>;
}
