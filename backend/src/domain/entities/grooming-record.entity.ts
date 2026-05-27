export type GroomingServiceType = 'bath' | 'bath_grooming' | 'hygienic_grooming' | 'full_grooming';

export class GroomingRecord {
  id!: string;
  petId!: string;
  serviceType!: GroomingServiceType;
  location!: string;
  groomingDate!: Date;
  nextDate?: Date;
  price?: number;
  notes?: string;
  createdAt!: Date;
}
