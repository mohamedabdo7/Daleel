// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
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
      <head>
        <link rel="icon" href="/fav.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { I18nProviderClient } from "@/locales/client";
// import ReactQueryProvider from "@/lib/providers/react-query-provider";
// // import { ReactQueryProvider } from "@/lib/providers/react-query-provider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Daleel",
//   description: "A modern Next.js application for innovative tech solutions",
// };

// export default function RootLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: { locale: string };
// }) {
//   const locale = params?.locale || "en"; // 👈 fallback مهم
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
//           <ReactQueryProvider>{children}</ReactQueryProvider>
//         </I18nProviderClient>
//       </body>
//     </html>
//   );
// }

// export async function generateStaticParams() {
//   return [{ locale: "en" }, { locale: "ar" }];
// }
