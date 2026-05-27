export type GroomingServiceType = 'bath' | 'bath_grooming' | 'hygienic_grooming' | 'full_grooming';

export interface GroomingRecord {
  id: string;
  petId: string;
  serviceType: GroomingServiceType;
  location: string;
  groomingDate: Date;
  nextDate?: Date;
  price?: number;
  notes?: string;
  createdAt: Date;
}

export interface CreateGroomingInput {
  petId: string;
  serviceType: GroomingServiceType;
  location: string;
  groomingDate: string;
  nextDate?: string;
  price?: number;
  notes?: string;
}

export const SERVICE_TYPE_LABELS: Record<GroomingServiceType, string> = {
  bath: 'Banho',
  bath_grooming: 'Banho + Tosa',
  hygienic_grooming: 'Tosa Higiênica',
  full_grooming: 'Tosa Completa',
};

export const SERVICE_TYPE_EMOJI: Record<GroomingServiceType, string> = {
  bath: '🛁',
  bath_grooming: '🛁✂️',
  hygienic_grooming: '✂️',
  full_grooming: '💇',
};
