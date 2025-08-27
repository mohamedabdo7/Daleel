// lib/api/pictionary.service.ts
export interface PictionaryItem {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  desc: string; // HTML
  file: string; // image url
  active: boolean;
  views_count: number;
  likes_count: number;
  dislikes_count: number;
  user_liked: boolean;
  user_disliked: boolean;
  created_at: string;
}

export interface Paginated<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
  status: number;
  messages: string;
}

const BASE = "https://backend.daleelfm.com/api";

export async function fetchPhotos(
  page = 1
): Promise<Paginated<PictionaryItem>> {
  const url = `${BASE}/user/photos?page=${encodeURIComponent(page)}`;
  const res = await fetch(url, { cache: "no-store", credentials: "include" });
  if (!res.ok) throw new Error(`Failed to load photos (${res.status})`);
  return res.json();
}

export async function fetchPhotoBySlug(slug: string): Promise<{
  data: PictionaryItem;
  status: number;
  messages: string;
}> {
  const url = `${BASE}/user/photo_by_slug/${encodeURIComponent(slug)}`;
  const res = await fetch(url, { cache: "no-store", credentials: "include" });
  if (!res.ok) throw new Error(`Failed to load photo (${res.status})`);
  return res.json();
}
