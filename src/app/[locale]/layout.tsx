import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { I18nProviderClient } from "@/locales/client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Daleel",
  description: "A modern Next.js application for innovative tech solutions",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Fix: Use Promise for params
}) {
  const { locale } = await params;
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction}>
      <head>
        <link rel="icon" href="/fav.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}
