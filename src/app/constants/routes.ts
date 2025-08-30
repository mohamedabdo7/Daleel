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
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
