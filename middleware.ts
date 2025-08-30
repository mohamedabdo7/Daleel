// middleware.ts - SIMPLE TEST VERSION
import { createI18nMiddleware } from "next-international/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
});

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Add this log to see if middleware is running at all
  console.log("🚨 MIDDLEWARE RUNNING FOR:", pathname);

  // Check specifically for exam routes
  if (pathname.includes("/exam")) {
    console.log("🔥 EXAM ROUTE DETECTED - FORCING REDIRECT TO LOGIN");
    const url = request.nextUrl.clone();
    url.pathname = "/en/login";
    return NextResponse.redirect(url);
  }

  // Let i18n handle the rest
  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};

// // middleware.ts
// import { createI18nMiddleware } from "next-international/middleware";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // Create the i18n middleware
// const I18nMiddleware = createI18nMiddleware({
//   locales: ["en", "ar"],
//   defaultLocale: "en",
// });

// // Routes that require authentication
// const PROTECTED_ROUTES = ["/mcqs"] as const;

// // Routes that should redirect authenticated users away
// const AUTH_ROUTES = ["/login", "/register"] as const;

// function getLocaleFromPathname(pathname: string): string | null {
//   const segments = pathname.split("/");
//   const potentialLocale = segments[1];

//   if (["en", "ar"].includes(potentialLocale)) {
//     return potentialLocale;
//   }

//   return null;
// }

// function getPathnameWithoutLocale(pathname: string): string {
//   const locale = getLocaleFromPathname(pathname);
//   if (locale) {
//     return pathname.replace(`/${locale}`, "") || "/";
//   }
//   return pathname;
// }

// function isProtectedRoute(pathname: string): boolean {
//   const pathWithoutLocale = getPathnameWithoutLocale(pathname);
//   return PROTECTED_ROUTES.some((route) => pathWithoutLocale.startsWith(route));
// }

// function isAuthRoute(pathname: string): boolean {
//   const pathWithoutLocale = getPathnameWithoutLocale(pathname);
//   return AUTH_ROUTES.some((route) => pathWithoutLocale.startsWith(route));
// }

// function getAuthToken(request: NextRequest): string | null {
//   return request.cookies.get("daleel_token")?.value || null;
// }

// export function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;

//   // First, let i18n middleware handle locale routing
//   const i18nResponse = I18nMiddleware(request);

//   // If i18n middleware wants to redirect, let it handle that first
//   if (i18nResponse && i18nResponse.headers.get("location")) {
//     return i18nResponse;
//   }

//   // Now handle authentication after i18n is resolved
//   const locale = getLocaleFromPathname(pathname) || "en";
//   const token = getAuthToken(request);
//   const isAuthenticated = !!token;

//   // Handle protected routes
//   if (isProtectedRoute(pathname)) {
//     if (!isAuthenticated) {
//       const url = request.nextUrl.clone();
//       url.pathname = `/${locale}`;
//       return NextResponse.redirect(url);
//     }
//   }

//   // Handle auth routes (login/register) - redirect authenticated users
//   if (isAuthRoute(pathname)) {
//     if (isAuthenticated) {
//       const url = request.nextUrl.clone();
//       url.pathname = `/${locale}`;
//       return NextResponse.redirect(url);
//     }
//   }

//   // Return the i18n response or continue
//   return i18nResponse || NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
// };

// // // middleware.ts
// // import { createI18nMiddleware } from "next-international/middleware";
// // import { NextRequest } from "next/server";

// // const I18nMiddleware = createI18nMiddleware({
// //   locales: ["en", "ar"],
// //   defaultLocale: "en",
// // });

// // export function middleware(request: NextRequest) {
// //   return I18nMiddleware(request);
// // }

// // export const config = {
// //   matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
// // };
