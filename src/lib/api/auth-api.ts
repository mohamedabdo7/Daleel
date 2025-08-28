// lib/auth-api.ts

import {
  ForgotPasswordData,
  LoginCredentials,
  LoginResponse,
} from "@/app/[locale]/(main)/login/types/auth";
import { api } from "./client";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return api.fetch<LoginResponse>("/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
  },

  forgotPassword: async (data: ForgotPasswordData) => {
    return api.fetch("/user/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  // You can add more auth endpoints here
  // refreshToken: async () => { ... },
  // resetPassword: async () => { ... },
};
