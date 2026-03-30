import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types/auth";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setSession: (payload: { accessToken: string; user: User | null }) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setSession: ({ accessToken, user }) => set({ accessToken, user }),
      setUser: (user) => set({ user }),
      logout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "ski-pass-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
