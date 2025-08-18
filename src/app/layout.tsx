import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daleel",
  description: "A modern Next.js application for innovative tech solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
