// store/auth-store.ts
import { create } from "zustand";
import { getAuthToken, setAuthToken, clearAuthCookies } from "@/lib/cookies";
import { User } from "@/app/[locale]/(main)/login/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string, remember?: boolean) => void;
  login: (user: User, token: string, remember?: boolean) => void;
  logout: () => void;
  initialize: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user: User) => {
    set({ user });
  },

  setToken: (token: string, remember = false) => {
    setAuthToken(token, remember);
    set({ token, isAuthenticated: true });
  },

  login: (user: User, token: string, remember = false) => {
    setAuthToken(token, remember);
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    clearAuthCookies();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initialize: () => {
    const token = getAuthToken();
    if (token) {
      set({
        token,
        isAuthenticated: true,
      });
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
