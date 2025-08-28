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

// // app/[locale]/layout.tsx
// import { Geist, Geist_Mono } from "next/font/google";
// import "../globals.css";
// import { I18nProviderClient } from "@/locales/client";
// import ReactQueryProvider from "@/lib/providers/react-query-provider"; // 👈 add

// const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Family Medical Guide",
//   description: "A modern Next.js application for innovative tech solutions",
// };

// type Params = { locale: string };

// export default async function RootLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: Promise<Params>;
// }) {
//   const { locale } = await params;
//   const direction = locale === "ar" ? "rtl" : "ltr";

//   return (
//     <html lang={locale} dir={direction}>
//       <head>
//         <link rel="icon" href="/fav.svg" />
//       </head>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <I18nProviderClient locale={locale}>
//           {/* ✅ Client boundary providing QueryClient to all nested pages */}
//           <ReactQueryProvider>{children}</ReactQueryProvider>
//         </I18nProviderClient>
//       </body>
//     </html>
//   );
// }

// export async function generateStaticParams() {
//   return [{ locale: "en" }, { locale: "ar" }];
// }

// import { Geist, Geist_Mono } from "next/font/google";
// import "../globals.css";
// import { I18nProviderClient } from "@/locales/client";

// const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Family Medical Guide",
//   description: "A modern Next.js application for innovative tech solutions",
// };

// type Params = { locale: string };

// export default async function RootLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: Promise<Params>;
// }) {
//   const { locale } = await params;
//   const direction = locale === "ar" ? "rtl" : "ltr";

//   return (
//     <html lang={locale} dir={direction}>
//       <head>
//         <link rel="icon" href="/fav.svg" />
//       </head>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
//       </body>
//     </html>
//   );
// }

// export async function generateStaticParams() {
//   return [{ locale: "en" }, { locale: "ar" }];
// }

// import { Geist, Geist_Mono } from "next/font/google";
// import "../globals.css";
// import { I18nProviderClient } from "@/locales/client";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Family Medical Guide",
//   description: "A modern Next.js application for innovative tech solutions",
// };

// export default async function RootLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: Promise<{ locale: string }>; // Fix: Use Promise for params
// }) {
//   const { locale } = await params;
//   const direction = locale === "ar" ? "rtl" : "ltr";

//   return (
//     <html lang={locale} dir={direction}>
//       <head>
//         <link rel="icon" href="/fav.svg" />
//       </head>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
//       </body>
//     </html>
//   );
// }

// export async function generateStaticParams() {
//   return [{ locale: "en" }, { locale: "ar" }];
// }
