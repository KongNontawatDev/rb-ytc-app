import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../../profile/types';

type AuthState = {
  user: User | null;
  setAuth: (user: User) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: (user) => set({user}),
      clearAuth: () => set({ user: null }),
    }),
    {
      name: 'auth-storage', // Storage key in localStorage
      storage: createJSONStorage(() => localStorage),
      // Optionally, you can specify which parts of the state to persist
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

// Example usage:
// const { user, token, setAuth, clearAuth } = useAuthStore();