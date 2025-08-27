import { apiFetch } from "@/lib/api/client";

// === Types ===
export type Lecture = {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  desc: string;
  file: string;
  active: boolean;
  video_views_count: number;
  views_count: number;
  likes_count: number;
  dislikes_count: number;
  user_liked: boolean;
  user_disliked: boolean;
  comments: unknown[];
  created_at: string;
  updated_at: string;
  thumbnail?: string;
  image?: string;
};

export interface LecturesResponse {
  data: Lecture[];
  current_page?: number;
  last_page?: number;
  page?: number;
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

export interface LecturesParams {
  page?: number;
  keyword?: string;
  per_page?: number;
}

// === Services ===
export async function getLectures(
  params: LecturesParams = {},
  signal?: AbortSignal
): Promise<LecturesResponse> {
  const searchParams = new URLSearchParams();

  if (params.page && params.page > 1) {
    searchParams.set("page", params.page.toString());
  }

  if (params.keyword && params.keyword.trim()) {
    searchParams.set("keyword", params.keyword.trim());
  }

  if (params.page) {
    searchParams.set("page", params.page.toString());
  }

  const url = `https://backend.daleelfm.com/api/user/lectures${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  const res = await apiFetch<LecturesResponse>(url, { signal });

  return (
    res || {
      data: [],
      current_page: 1,
      last_page: 1,
      page: 10,
      total: 0,
      from: 0,
      to: 0,
    }
  );
}

export async function getLectureBySlug(slug: string): Promise<Lecture> {
  const res = await fetch(
    `https://backend.daleelfm.com/api/user/lecture_by_slug/${encodeURIComponent(
      slug
    )}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to load lecture");
  const json = await res.json();
  return json?.data as Lecture;
}
