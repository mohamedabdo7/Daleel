export const qk = {
  categories: ["categories"] as const,
  sections: (categorySlug: string) => ["sections", categorySlug] as const,
  article: (articleSlug: string) => ["article", articleSlug] as const,
};
