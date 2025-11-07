import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isCeo: boolean;
  setCeo: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isCeo: false,
      setCeo: (value: boolean) => set({ isCeo: value }),
      logout: () => set({ isCeo: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
