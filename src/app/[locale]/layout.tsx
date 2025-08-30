// app/[locale]/layout.tsx
"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import "../globals.css";
import { ToastContainer } from "../components/common/toast";

// Create a client outside of the component to avoid recreating on each render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  return (
    <html lang={params.locale}>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthInitializer>
            {children}
            <ToastContainer />
          </AuthInitializer>
        </QueryClientProvider>
      </body>
    </html>
  );
}
