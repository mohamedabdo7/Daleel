import { apiFetch } from "../api/client";

// === Types ===
export interface Category {
  id: number;
  uuid?: string;
  slug: string;
  title: string;
  desc?: string;
  file?: string; // image url
  articles_count?: number;
  [k: string]: unknown;
}

export interface ArticleListItem {
  id: number;
  slug: string;
  title: string;
}

export interface ArticleDetail {
  id: number;
  slug: string;
  title: string;
  // The API returns HTML; field name may be `content` or similar
  content?: string; // HTML string
  body?: string; // fallback
  [k: string]: unknown;
}

// === API responses ===
interface ListResponse<T> {
  status?: number;
  data: T;
}

// === Services ===
export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
  const res = await apiFetch<{ data: Category[] }>("/user/article_categories", {
    signal,
  });
  return res?.data ?? [];
}

export async function getArticlesByCategorySlug(
  categorySlug: string,
  signal?: AbortSignal
): Promise<ArticleListItem[]> {
  const res = await apiFetch<ListResponse<ArticleListItem[]>>(
    `/user/articles_by_category_slug/${encodeURIComponent(categorySlug)}`,
    { signal }
  );
  return res?.data ?? [];
}

export async function getArticleBySlug(
  articleSlug: string,
  signal?: AbortSignal
): Promise<ArticleDetail | null> {
  const res = await apiFetch<ListResponse<ArticleDetail>>(
    `/user/article_by_slug/${encodeURIComponent(articleSlug)}`,
    { signal }
  );
  return (res && (res as any).data) || null;
}
