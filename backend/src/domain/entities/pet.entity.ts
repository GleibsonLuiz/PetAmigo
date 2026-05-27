export class Pet {
  id!: string;
  name!: string;
  species!: string;
  breed?: string;
  birthDate!: Date;
  photoUrl?: string;
  ownerId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
