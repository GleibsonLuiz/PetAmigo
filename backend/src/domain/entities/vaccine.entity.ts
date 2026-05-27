export class Vaccine {
  id!: string;
  name!: string;
  targetSpecies!: string[];
  periodicityMonths!: number;
  description?: string;
  createdAt!: Date;
}
