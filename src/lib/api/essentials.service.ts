import { apiFetch } from "@/lib/api/client";

export interface ESSection {
  slug: string;
  title: string;
  [k: string]: any;
}
export interface ESChapter {
  slug: string;
  title: string;
  [k: string]: any;
}
export interface ESLesson {
  slug: string;
  title: string;
  [k: string]: any;
}
export interface ESLessonDetail {
  id?: number;
  title: string;
  slug: string;
  file?: string;
  content?: string;
  body?: string;
  desc?: string;
  created_at?: string;
  views_count?: number;
  likes_count?: number;
  section_slug?: string;
  chapter_slug?: string;
  [k: string]: any;
}

export interface ESLessonEnvelope {
  data: ESLessonDetail;
  status?: number;
  messages?: string;
  next_lesson?: { id: number; slug: string } | null;
  last_lesson?: { id: number; slug: string } | null;
}

const BASE = "/user/book/the-essentials-4th-edition" as const;

export async function esGetSections(
  signal?: AbortSignal
): Promise<ESSection[]> {
  const res = await apiFetch<{ data: ESSection[] }>(`${BASE}/sections`, {
    signal,
  });
  return res?.data ?? [];
}

export async function esGetChapters(
  sectionSlug: string,
  signal?: AbortSignal
): Promise<ESChapter[]> {
  const res = await apiFetch<{ data: ESChapter[] }>(
    `${BASE}/section/${encodeURIComponent(sectionSlug)}/chapters`,
    { signal }
  );
  return res?.data ?? [];
}

export async function esGetLessons(
  sectionSlug: string,
  chapterSlug: string,
  signal?: AbortSignal
): Promise<ESLesson[]> {
  const res = await apiFetch<{ data: ESLesson[] }>(
    `${BASE}/section/${encodeURIComponent(
      sectionSlug
    )}/chapter/${encodeURIComponent(chapterSlug)}/lessons`,
    { signal }
  );
  return res?.data ?? [];
}

export async function esGetLessonDetail(
  sectionSlug: string,
  chapterSlug: string,
  lessonSlug: string,
  signal?: AbortSignal
): Promise<ESLessonEnvelope | null> {
  const res = await apiFetch<ESLessonEnvelope>(
    `${BASE}/section/${encodeURIComponent(
      sectionSlug
    )}/chapter/${encodeURIComponent(chapterSlug)}/lesson/${encodeURIComponent(
      lessonSlug
    )}`,
    { signal }
  );
  return res || null;
}
