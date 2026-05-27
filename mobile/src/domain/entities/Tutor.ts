export interface Tutor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTutorInput {
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UpdateTutorInput extends Partial<CreateTutorInput> {
  id: string;
}
