// store/auth-store.ts
import { create } from "zustand";
import {
  getAuthToken,
  setAuthToken,
  clearAuthCookies,
  setUserData,
  getUserData,
} from "@/lib/cookies";
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
    setUserData(user); // Persist user data
    set({ user });
  },

  setToken: (token: string, remember = false) => {
    setAuthToken(token, remember);
    set({ token, isAuthenticated: true });
  },

  login: (user: User, token: string, remember = false) => {
    setAuthToken(token, remember);
    setUserData(user); // Persist user data
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
    const userData = getUserData();

    if (token && userData) {
      set({
        user: userData,
        token,
        isAuthenticated: true,
      });
      console.log("🟢 [STORE] Auth state restored from cookies", {
        user: userData,
        token,
      });
    } else {
      console.log("🟡 [STORE] No valid auth data found during initialization");
      // Clear any partial data
      if (!token || !userData) {
        clearAuthCookies();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      }
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));

// // store/auth-store.ts
// import { create } from "zustand";
// import { getAuthToken, setAuthToken, clearAuthCookies } from "@/lib/cookies";
// import { User } from "@/app/[locale]/(main)/login/types/auth";

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;

//   // Actions
//   setUser: (user: User) => void;
//   setToken: (token: string, remember?: boolean) => void;
//   login: (user: User, token: string, remember?: boolean) => void;
//   logout: () => void;
//   initialize: () => void;
//   setLoading: (loading: boolean) => void;
// }

// export const useAuthStore = create<AuthState>((set, get) => ({
//   user: null,
//   token: null,
//   isAuthenticated: false,
//   isLoading: false,

//   setUser: (user: User) => {
//     set({ user });
//   },

//   setToken: (token: string, remember = false) => {
//     setAuthToken(token, remember);
//     set({ token, isAuthenticated: true });
//   },

//   login: (user: User, token: string, remember = false) => {
//     setAuthToken(token, remember);
//     set({
//       user,
//       token,
//       isAuthenticated: true,
//       isLoading: false,
//     });

//     // Verify the state was set correctly
//     const currentState = get();
//     console.log("🟢 [STORE] No token found during initialization", token);
//   },

//   logout: () => {
//     clearAuthCookies();
//     set({
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       isLoading: false,
//     });
//   },

//   initialize: () => {
//     const token = getAuthToken();
//     if (token) {
//       set({
//         token,
//         isAuthenticated: true,
//       });
//     } else {
//       // console.log("🟢 [STORE] No token found during initialization");
//     }
//   },

//   setLoading: (loading: boolean) => {
//     set({ isLoading: loading });
//   },
// }));

// // store/auth-store.ts
// import { create } from "zustand";
// import { getAuthToken, setAuthToken, clearAuthCookies } from "@/lib/cookies";
// import { User } from "@/app/[locale]/(main)/login/types/auth";

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;

//   // Actions
//   setUser: (user: User) => void;
//   setToken: (token: string, remember?: boolean) => void;
//   login: (user: User, token: string, remember?: boolean) => void;
//   logout: () => void;
//   initialize: () => void;
//   setLoading: (loading: boolean) => void;
// }

// export const useAuthStore = create<AuthState>((set, get) => ({
//   user: null,
//   token: null,
//   isAuthenticated: false,
//   isLoading: false,

//   setUser: (user: User) => {
//     console.log("🟢 [STORE] Setting user:", user);
//     set({ user });
//   },

//   setToken: (token: string, remember = false) => {
//     setAuthToken(token, remember);
//     set({ token, isAuthenticated: true });
//   },

//   login: (user: User, token: string, remember = false) => {
//     setAuthToken(token, remember);
//     set({
//       user,
//       token,
//       isAuthenticated: true,
//       isLoading: false,
//     });
//   },

//   logout: () => {
//     clearAuthCookies();
//     set({
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       isLoading: false,
//     });
//   },

//   initialize: () => {
//     const token = getAuthToken();
//     if (token) {
//       set({
//         token,
//         isAuthenticated: true,
//       });
//     }
//   },

//   setLoading: (loading: boolean) => {
//     set({ isLoading: loading });
//   },
// }));
