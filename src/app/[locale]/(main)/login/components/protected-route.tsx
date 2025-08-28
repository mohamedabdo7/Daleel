// components/auth/protected-route.tsx
"use client";

import * as React from "react";
import { useAuthStore } from "@/store/auth-store";
import { useRouteProtection } from "@/lib/hooks/use-route-protection";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Simple loading component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );
}

// Protected route wrapper component
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const { isLoading, isProtectedRoute } = useRouteProtection();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return fallback || <LoadingSpinner />;
  }

  // If this is a protected route and user is not authenticated,
  // the middleware/hook will handle redirecting
  if (isProtectedRoute && !isAuthenticated) {
    return fallback || <LoadingSpinner />;
  }

  return <>{children}</>;
}

// Higher-order component version (alternative usage)
export function withProtection<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute fallback={fallback}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
