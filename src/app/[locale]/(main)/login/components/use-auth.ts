// hooks/use-auth.ts
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/lib/api/auth-api";
import { ApiError } from "next/dist/server/api-utils";

export function useLogin() {
  const { login: loginUser, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response, variables) => {
      const { data } = response;
      const { token, ...user } = data;
      loginUser(user, token, variables.remember || false);
    },
    onError: (error: ApiError) => {
      setLoading(false);
      console.error("Login error:", error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onError: (error: ApiError) => {
      console.error("Forgot password error:", error);
    },
  });
}
