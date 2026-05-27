import { Vaccine } from './vaccine.entity';

export class VaccinationRecord {
  id!: string;
  petId!: string;
  vaccineId!: string;
  vaccine?: Vaccine;
  applicationDate!: Date;
  nextDoseDate!: Date;
  veterinarian?: string;
  notes?: string;
  createdAt!: Date;
}
