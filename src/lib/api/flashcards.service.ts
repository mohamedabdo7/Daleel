// lib/api/flashcards.service.ts
// Flashcards API helpers
// NOTE: Parent (categories) endpoint MUST be fetched WITHOUT query params as requested.
// - Categories: https://backend.daleelfm.com/api/user/flashcards_categories
// - Items by category slug (supports pagination):
//   https://backend.daleelfm.com/api/user/flashcards_by_category_slug/:slug?page=N

export type ApiListMeta = {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
};

export type ApiListResponse<T> = {
  data: T[];
  links?: unknown;
  meta: ApiListMeta;
  status?: number;
  message?: string;
};

export type FlashcardCategory = {
  id: number;
  uuid: string;
  title: string;
  desc: string | null;
  slug: string;
  file: string | null;
  has_children: boolean;
  created_at: string;
};

export type FlashcardItem = {
  id: number;
  uuid: string;
  title: string;
  desc: string;
  slug: string;
  file: string | null; // image URL
  active: boolean;
  created_at: string;
};

const BACKEND_BASE = "https://backend.daleelfm.com" as const;

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init?.headers || {}),
    },
    // We'll usually be RSC; disable caching for correctness when paginating
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

// --- Categories (NO pagination params allowed) ---
export async function fetchFlashcardsCategories(): Promise<
  ApiListResponse<FlashcardCategory>
> {
  const url = `${BACKEND_BASE}/api/user/flashcards_categories`;
  return getJson(url);
}

// --- Items by category slug (supports pagination via ?page=) ---
export async function fetchFlashcardsByCategorySlug(
  slug: string,
  page: number = 1
): Promise<ApiListResponse<FlashcardItem>> {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const url = `${BACKEND_BASE}/api/user/flashcards_by_category_slug/${encodeURIComponent(
    slug
  )}?page=${safePage}`;
  return getJson(url);
}
