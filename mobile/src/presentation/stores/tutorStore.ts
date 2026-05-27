import { create } from 'zustand';
import { Tutor } from '../../domain/entities/Tutor';

interface TutorStoreState {
  activeTutorId: string | null;
  activeTutor: Tutor | null;
  setActiveTutor: (tutor: Tutor) => void;
  clearActiveTutor: () => void;
}

export const useTutorStore = create<TutorStoreState>((set) => ({
  activeTutorId: null,
  activeTutor: null,
  setActiveTutor: (tutor) => set({ activeTutor: tutor, activeTutorId: tutor.id }),
  clearActiveTutor: () => set({ activeTutor: null, activeTutorId: null }),
}));
