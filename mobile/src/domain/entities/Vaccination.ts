export interface Vaccine {
  id: string;
  name: string;
  targetSpecies: string[];
  periodicityMonths: number;
  description?: string;
}

export interface VaccinationRecord {
  id: string;
  petId: string;
  vaccineId: string;
  vaccine?: Vaccine;
  applicationDate: Date;
  nextDoseDate: Date;
  veterinarian?: string;
  notes?: string;
  createdAt: Date;
}

export interface CreateVaccinationInput {
  petId: string;
  vaccineId: string;
  applicationDate: string;
  veterinarian?: string;
  notes?: string;
}

export interface VaccinationSchedule {
  vaccinationRecord: VaccinationRecord;
  nextDoseDate: Date;
  daysUntilNextDose: number;
  isOverdue: boolean;
}
