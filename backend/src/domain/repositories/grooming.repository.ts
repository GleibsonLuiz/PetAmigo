import { GroomingRecord } from '../entities/grooming-record.entity';

export abstract class GroomingRepositoryPort {
  abstract findByPetId(petId: string): Promise<GroomingRecord[]>;
  abstract findById(id: string): Promise<GroomingRecord | null>;
  abstract create(record: Partial<GroomingRecord>): Promise<GroomingRecord>;
  abstract update(id: string, data: Partial<GroomingRecord>): Promise<GroomingRecord>;
  abstract delete(id: string): Promise<void>;
  abstract findUpcoming(tutorPetIds: string[]): Promise<GroomingRecord[]>;
}
