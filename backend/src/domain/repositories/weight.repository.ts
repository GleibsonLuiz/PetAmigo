import { WeightRecord } from '../entities/weight-record.entity';

export abstract class WeightRepositoryPort {
  abstract findByPetId(petId: string): Promise<WeightRecord[]>;
  abstract create(record: Partial<WeightRecord>): Promise<WeightRecord>;
  abstract delete(id: string): Promise<void>;
}
