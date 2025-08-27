import { apiFetch } from "@/lib/api/client";

export interface HBSection {
  slug: string;
  title: string;
  [k: string]: any;
}
export interface HBChapter {
  slug: string;
  title: string;
  [k: string]: any;
}
export interface HBLesson {
  slug: string;
  title: string;
  [k: string]: any;
}
export interface HBLessonDetail {
  title: string;
  slug: string;
  file?: string;
  content?: string;
  body?: string;
  desc?: string;
  created_at?: string;
  [k: string]: any;
}

interface ListResponse<T> {
  status?: number;
  data: T;
}

const BASE = "/user/book/the-handbook" as const;

export async function hbGetSections(
  signal?: AbortSignal
): Promise<HBSection[]> {
  const res = await apiFetch<ListResponse<HBSection[]>>(`${BASE}/sections`, {
    signal,
  });
  return res?.data ?? [];
}

export async function hbGetChapters(
  sectionSlug: string,
  signal?: AbortSignal
): Promise<HBChapter[]> {
  const res = await apiFetch<ListResponse<HBChapter[]>>(
    `${BASE}/section/${encodeURIComponent(sectionSlug)}/chapters`,
    { signal }
  );
  return res?.data ?? [];
}

export async function hbGetLessons(
  sectionSlug: string,
  chapterSlug: string,
  signal?: AbortSignal
): Promise<HBLesson[]> {
  const res = await apiFetch<ListResponse<HBLesson[]>>(
    `${BASE}/section/${encodeURIComponent(
      sectionSlug
    )}/chapter/${encodeURIComponent(chapterSlug)}/lessons`,
    { signal }
  );
  return res?.data ?? [];
}

export async function hbGetLessonDetail(
  sectionSlug: string,
  chapterSlug: string,
  lessonSlug: string,
  signal?: AbortSignal
): Promise<HBLessonDetail | null> {
  const res = await apiFetch<ListResponse<HBLessonDetail>>(
    `${BASE}/section/${encodeURIComponent(
      sectionSlug
    )}/chapter/${encodeURIComponent(chapterSlug)}/lesson/${encodeURIComponent(
      lessonSlug
    )}`,
    { signal }
  );
  return (res && (res as any).data) || null;
}
