// hooks/use-route-protection.ts
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

const PROTECTED_ROUTES = ["/mcqs"] as const;

const AUTH_ROUTES = ["/login", "/register"] as const;

function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/");
  return segments[1] || "en";
}

function getPathnameWithoutLocale(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  return pathname.replace(`/${locale}`, "") || "/";
}

function isProtectedRoute(pathname: string): boolean {
  const pathWithoutLocale = getPathnameWithoutLocale(pathname);
  return PROTECTED_ROUTES.some((route) => pathWithoutLocale.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  const pathWithoutLocale = getPathnameWithoutLocale(pathname);
  return AUTH_ROUTES.some((route) => pathWithoutLocale.startsWith(route));
}

export function useRouteProtection() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while still loading auth state
    if (isLoading) return;

    const locale = getLocaleFromPathname(pathname);

    // Handle protected routes
    if (isProtectedRoute(pathname) && !isAuthenticated) {
      router.replace(`/${locale}`);
      return;
    }

    // Handle auth routes for authenticated users
    if (isAuthRoute(pathname) && isAuthenticated) {
      router.replace(`/${locale}`);
      return;
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  return {
    isLoading: isLoading,
    isProtectedRoute: isProtectedRoute(pathname),
    isAuthRoute: isAuthRoute(pathname),
  };
}
