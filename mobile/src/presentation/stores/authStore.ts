import { create } from 'zustand';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'tutor' | 'admin';
  tutorId: string | null;
}

interface AuthStoreState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
  logout: () => set({ token: null, user: null, isAuthenticated: false }),
}));
