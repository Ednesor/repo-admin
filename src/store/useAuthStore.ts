import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'Admin' | 'Empleado';

interface AuthState {
  role: Role;
  setRole: (role: Role) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: 'Admin',
      setRole: (role) => set({ role }),
    }),
    {
      name: 'auth-storage',
    }
  )
);