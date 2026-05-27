import { create } from 'zustand';
import { Pet } from '../../domain/entities/Pet';

interface PetStoreState {
  selectedPet: Pet | null;
  selectPet: (pet: Pet | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const usePetStore = create<PetStoreState>((set) => ({
  selectedPet: null,
  selectPet: (pet) => set({ selectedPet: pet }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
