import { apiFetch } from "@/lib/api/client";

export interface ProtocolCategory {
  id: number;
  slug: string;
  title: string;
  desc?: string;
  file?: string;
  [k: string]: unknown;
}

export interface ProtocolListItem {
  id: number;
  slug: string;
  title: string;
}

export interface ProtocolDetail {
  id: number;
  slug: string;
  title: string;
  content?: string;
  body?: string;
  [k: string]: unknown;
}

export interface ProtocolCategoryDetail {
  id: number;
  uuid: string;
  title: string;
  desc?: string;
  slug: string;
  file?: string;
  has_children: boolean;
  protocols_count: number;
  created_at: string;
}

interface ListResponse<T> {
  status?: number;
  data: T;
}

export async function getProtocolCategories(
  signal?: AbortSignal
): Promise<ProtocolCategory[]> {
  const res = await apiFetch<{ data: ProtocolCategory[] }>(
    "/user/protocol_categories",
    { signal }
  );
  return res?.data ?? [];
}

export async function getProtocolsByCategorySlug(
  categorySlug: string,
  signal?: AbortSignal
): Promise<ProtocolListItem[]> {
  const res = await apiFetch<ListResponse<ProtocolListItem[]>>(
    `/user/protocols_by_category_slug/${encodeURIComponent(categorySlug)}`,
    { signal }
  );
  return res?.data ?? [];
}

export async function getProtocolBySlug(
  protocolSlug: string,
  signal?: AbortSignal
): Promise<ProtocolDetail | null> {
  const res = await apiFetch<ListResponse<ProtocolDetail>>(
    `/user/protocol_by_slug/${encodeURIComponent(protocolSlug)}`,
    { signal }
  );
  return (res && (res as any).data) || null;
}

export async function getProtocolCategoryBySlug(
  categorySlug: string,
  signal?: AbortSignal
): Promise<ProtocolCategoryDetail | null> {
  const res = await apiFetch<ListResponse<ProtocolCategoryDetail>>(
    `/user/protocol_category_by_slug/${encodeURIComponent(categorySlug)}`,
    { signal }
  );
  return (res && (res as any).data) || null;
}

// import { apiFetch } from "@/lib/api/client";

// export interface ProtocolCategory {
//   id: number;
//   slug: string;
//   title: string;
//   desc?: string;
//   file?: string;
//   [k: string]: unknown;
// }
// export interface ProtocolListItem {
//   id: number;
//   slug: string;
//   title: string;
// }
// export interface ProtocolDetail {
//   id: number;
//   slug: string;
//   title: string;
//   content?: string;
//   body?: string;
//   [k: string]: unknown;
// }

// interface ListResponse<T> {
//   status?: number;
//   data: T;
// }

// export async function getProtocolCategories(
//   signal?: AbortSignal
// ): Promise<ProtocolCategory[]> {
//   const res = await apiFetch<{ data: ProtocolCategory[] }>(
//     "/user/protocol_categories",
//     { signal }
//   );
//   return res?.data ?? [];
// }

// export async function getProtocolsByCategorySlug(
//   categorySlug: string,
//   signal?: AbortSignal
// ): Promise<ProtocolListItem[]> {
//   const res = await apiFetch<ListResponse<ProtocolListItem[]>>(
//     `/user/protocols_by_category_slug/${encodeURIComponent(categorySlug)}`,
//     { signal }
//   );
//   return res?.data ?? [];
// }

// export async function getProtocolBySlug(
//   protocolSlug: string,
//   signal?: AbortSignal
// ): Promise<ProtocolDetail | null> {
//   const res = await apiFetch<ListResponse<ProtocolDetail>>(
//     `/user/protocol_by_slug/${encodeURIComponent(protocolSlug)}`,
//     { signal }
//   );
//   return (res && (res as any).data) || null;
// }
