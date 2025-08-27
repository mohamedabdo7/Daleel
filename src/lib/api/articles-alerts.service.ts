import { apiFetch } from "@/lib/api/client";

// === Types ===
export interface Alert {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  desc: string; // HTML description
  file: string; // image/thumbnail URL
  active: boolean;
  views_count: number;
  likes_count: number;
  dislikes_count: number;
  user_liked: boolean;
  user_disliked: boolean;
  comments: any[]; // comment objects
  created_at: string;
  [k: string]: unknown;
}

export interface AlertsResponse {
  data: Alert[];
  // Pagination fields (if they exist in your API response)
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  from?: number;
  to?: number;
  links?: {
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
}

export interface AlertsParams {
  page?: number;
  keyword?: string;
  per_page?: number;
}

// === Services ===
export async function getAlerts(
  params: AlertsParams = {},
  signal?: AbortSignal
): Promise<AlertsResponse> {
  const searchParams = new URLSearchParams();

  if (params.page && params.page > 1) {
    searchParams.set("page", params.page.toString());
  }

  if (params.keyword && params.keyword.trim()) {
    searchParams.set("keyword", params.keyword.trim());
  }

  if (params.per_page) {
    searchParams.set("per_page", params.per_page.toString());
  }

  const url = `/user/alerts${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  const res = await apiFetch<AlertsResponse>(url, { signal });

  return (
    res || {
      data: [],
      current_page: 1,
      last_page: 1,
      per_page: 4,
      total: 0,
      from: 0,
      to: 0,
    }
  );
}

export async function getAlertById(
  id: number,
  signal?: AbortSignal
): Promise<Alert | null> {
  try {
    const res = await apiFetch<{ data: Alert }>(`/user/alerts/${id}`, {
      signal,
    });
    return res?.data || null;
  } catch (error) {
    console.error("Error fetching alert:", error);
    return null;
  }
}

export async function getAlertBySlug(
  slug: string,
  signal?: AbortSignal
): Promise<Alert | null> {
  try {
    const res = await apiFetch<{ data: Alert }>(
      `/user/alert_by_slug/${encodeURIComponent(slug)}`,
      { signal }
    );
    return res?.data ?? null;
  } catch (error) {
    console.error("Error fetching alert by slug:", error);
    return null;
  }
}
