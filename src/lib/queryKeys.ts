export const qk = {
  articles: {
    categories: ["articles", "categories"] as const,
    sections: (categorySlug: string) =>
      ["articles", "sections", categorySlug] as const,
    item: (articleSlug: string) => ["articles", "item", articleSlug] as const,
  },
  protocols: {
    categories: ["protocols", "categories"] as const,
    sections: (categorySlug: string) =>
      ["protocols", "sections", categorySlug] as const,
    item: (protocolSlug: string) =>
      ["protocols", "item", protocolSlug] as const,

    categoryBySlug: (slug: string) =>
      ["protocols", "category-by-slug", slug] as const,
  },
  powerpoints: {
    categories: ["powerpoints", "categories"] as const,
    sections: (categorySlug: string) =>
      ["powerpoints", "sections", categorySlug] as const,
    item: (slug: string) => ["powerpoints", "item", slug] as const,
  },
  handbook: {
    sections: ["handbook", "sections"] as const,
    chapters: (sectionSlug: string) =>
      ["handbook", "chapters", sectionSlug] as const,
    lessons: (sectionSlug: string, chapterSlug: string) =>
      ["handbook", "lessons", sectionSlug, chapterSlug] as const,
    lesson: (sectionSlug: string, chapterSlug: string, lessonSlug: string) =>
      ["handbook", "lesson", sectionSlug, chapterSlug, lessonSlug] as const,
  },
  essentials: {
    sections: ["essentials", "sections"] as const,
    chapters: (sectionSlug: string) =>
      ["essentials", "chapters", sectionSlug] as const,
    lessons: (sectionSlug: string, chapterSlug: string) =>
      ["essentials", "lessons", sectionSlug, chapterSlug] as const,
    lesson: (sectionSlug: string, chapterSlug: string, lessonSlug: string) =>
      ["essentials", "lesson", sectionSlug, chapterSlug, lessonSlug] as const,
  },

  alerts: {
    list: (params?: { page?: number; keyword?: string }) =>
      ["alerts", "list", params] as const,
    item: (id: number) => ["alerts", "item", id] as const,
    itemBySlug: (slug: string) => ["alerts", "item-by-slug", slug] as const,
  },

  policy: {
    privacy: ["policy", "privacy"] as const,
    terms: ["policy", "terms"] as const,
    all: ["policy", "all"] as const,
  },

  about: {
    data: ["about", "data"] as const,
    team: ["about", "team"] as const,
    committees: ["about", "committees"] as const,
    volunteers: ["about", "volunteers"] as const,
  },

  lectures: {
    list: (params?: { page?: number; keyword?: string }) =>
      ["lectures", "list", params] as const,
    item: (id: number) => ["lectures", "item", id] as const,
    itemBySlug: (slug: string) => ["lectures", "item-by-slug", slug] as const,
  },

  flashcards: {
    categories: ["flashcards", "categories"] as const,
    items: (categorySlug: string, page: number = 1) =>
      ["flashcards", "items", categorySlug, { page }] as const,
  },
} as const;
