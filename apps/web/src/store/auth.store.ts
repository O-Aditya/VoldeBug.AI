import { create } from "zustand";

interface AuthState {
  session: {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    expires: string;
  } | null;
  role: string | null;
  onboardingStatus: string | null;
  setSession: (session: AuthState["session"]) => void;
  setRole: (role: string) => void;
  setOnboardingStatus: (status: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  role: null,
  onboardingStatus: null,
  setSession: (session) => set({ session }),
  setRole: (role) => set({ role }),
  setOnboardingStatus: (onboardingStatus) => set({ onboardingStatus }),
  clear: () => set({ session: null, role: null, onboardingStatus: null }),
}));