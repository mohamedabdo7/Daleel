// src/routes.ts

export const ROUTES = {
  HOME: "/",
  THE_ESSENTIALS: "/the-essentials",
  THE_HANDBOOK: "/the-handbook",
  NEW_ARTICLES: "/new-articles",
  ARTICLES: "/articles",
  ARTICLES_ALERTS: "/articles-alerts",
  POWER_POINTS: "/power-points",
  PROTOCOLS: "/protocols",
  LECTURES: "/lectures",
  FLASHCARDS: "/flashcards",

  // More dropdown routes
  MCQS: "/mcqs",
  FAME_25: "/fame-25",
  PRIVACY_POLICY: "/privacy-policy",
  PICTIONARY: "/pictionary",
  POLICIES: "/policies",
  EVENTS: "/events",
  URGENT_CARE_MANUAL: "/protocols/urgent-care-manual",
  PHC_ANTIMICROBIAL_MANUAL: "/protocols/phc-antimicrobial-manual",
  ABOUT_US: "/about-us",
  VOLUNTEERS_AUTHORS: "/volunteers",

  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",

  // Exam routes
  EXAMS: "/exam",
  EXAM_ADD: "/exam/add",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

// Helper function to get localized route
export function getLocalizedRoute(
  route: AppRoute,
  locale: string = "en"
): string {
  return `/${locale}${route}`;
}

// Helper function to check if route is protected
export function isProtectedRoute(pathname: string): boolean {
  const PROTECTED_ROUTES = [ROUTES.MCQS, ROUTES.EXAMS];

  // Remove locale from pathname for checking
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";

  return PROTECTED_ROUTES.some((route) => pathWithoutLocale.startsWith(route));
}

// Helper function to check if route is auth route
export function isAuthRoute(pathname: string): boolean {
  const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER];

  // Remove locale from pathname for checking
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";

  return AUTH_ROUTES.some((route) => pathWithoutLocale.startsWith(route));
}

// // src/routes.ts

// export const ROUTES = {
//   HOME: "/",
//   THE_ESSENTIALS: "/the-essentials",
//   THE_HANDBOOK: "/the-handbook",
//   NEW_ARTICLES: "/new-articles",
//   ARTICLES: "/articles",
//   ARTICLES_ALERTS: "/articles-alerts",
//   POWER_POINTS: "/power-points",
//   PROTOCOLS: "/protocols",
//   LECTURES: "/lectures",
//   FLASHCARDS: "/flashcards",

//   // More dropdown routes
//   MCQS: "/mcqs",
//   FAME_25: "/fame-25",
//   PRIVACY_POLICY: "/privacy-policy",
//   PICTIONARY: "/pictionary",
//   POLICIES: "/policies",
//   EVENTS: "/events",
//   URGENT_CARE_MANUAL: "/protocols/urgent-care-manual",
//   PHC_ANTIMICROBIAL_MANUAL: "/protocols/phc-antimicrobial-manual",
//   ABOUT_US: "/about-us",
//   VOLUNTEERS_AUTHORS: "/volunteers",
// } as const;

// export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
