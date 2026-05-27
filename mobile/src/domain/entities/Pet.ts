export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  birthDate: Date;
  photoUrl?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';

export interface CreatePetInput {
  name: string;
  species: PetSpecies;
  breed?: string;
  birthDate: string;
  photoUrl?: string;
}

export interface UpdatePetInput extends Partial<CreatePetInput> {
  id: string;
}
