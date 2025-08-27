import { apiFetch } from "@/lib/api/client";

export interface PowerPointCategory {
  id: number;
  slug: string;
  title: string;
  desc?: string;
  file?: string;
  [k: string]: unknown;
}
export interface PowerPointListItem {
  id: number;
  slug: string;
  title: string;
}
export interface PowerPointDetail {
  id: number;
  slug: string;
  title: string;
  content?: string;
  body?: string;
  file?: string;
  created_at?: string;
  [k: string]: unknown;
}

interface ListResponse<T> {
  status?: number;
  data: T;
}

export async function getPowerPointCategories(
  signal?: AbortSignal
): Promise<PowerPointCategory[]> {
  const res = await apiFetch<{ data: PowerPointCategory[] }>(
    "/user/power_point_categories",
    { signal }
  );
  return res?.data ?? [];
}

export async function getPowerPointsByCategorySlug(
  categorySlug: string,
  signal?: AbortSignal
): Promise<PowerPointListItem[]> {
  const res = await apiFetch<ListResponse<PowerPointListItem[]>>(
    `/user/power_points_by_category_slug/${encodeURIComponent(categorySlug)}`,
    { signal }
  );
  return res?.data ?? [];
}

export async function getPowerPointBySlug(
  powerSlug: string,
  signal?: AbortSignal
): Promise<PowerPointDetail | null> {
  const res = await apiFetch<ListResponse<PowerPointDetail>>(
    `/user/power_point_by_slug/${encodeURIComponent(powerSlug)}`,
    { signal }
  );
  return (res && (res as any).data) || null;
}
