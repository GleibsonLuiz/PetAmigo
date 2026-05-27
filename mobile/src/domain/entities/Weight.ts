export interface WeightRecord {
  id: string;
  petId: string;
  weightKg: number;
  recordedAt: Date;
  notes?: string;
  createdAt: Date;
}

export interface CreateWeightInput {
  petId: string;
  weightKg: number;
  recordedAt: string;
  notes?: string;
}
