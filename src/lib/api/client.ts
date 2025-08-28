import { getAuthToken } from "@/lib/cookies";

export const API_BASE = "https://backend.daleelfm.com/api" as const;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiError extends Error {
  status?: number;
  payload?: unknown;
}

export type ApiInit = RequestInit & {
  query?: Record<string, string | number | boolean | null | undefined>;
};

export async function apiFetch<T>(
  path: string,
  init: ApiInit = {}
): Promise<T> {
  const url = new URL(
    path.startsWith("http")
      ? path
      : API_BASE + (path.startsWith("/") ? path : `/${path}`)
  );

  if (init.query) {
    for (const [k, v] of Object.entries(init.query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }

  const token = typeof window !== "undefined" ? getAuthToken() : null;

  const headers: HeadersInit = {
    Accept: "application/json",
    ...(init.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    let payload: any | undefined;
    try {
      payload = await res.json();
    } catch {}
    const err: ApiError = Object.assign(
      new Error(payload?.message || `API ${res.status} ${res.statusText}`),
      { status: res.status, payload }
    );
    throw err;
  }

  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export const api = { fetch: apiFetch, baseUrl: API_BASE };

// export const API_BASE = "https://backend.daleelfm.com/api" as const;

// export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// export interface ApiError extends Error {
//   status?: number;
//   payload?: unknown;
// }

// export type ApiInit = RequestInit & {
//   query?: Record<string, string | number | boolean | null | undefined>;
// };

// export async function apiFetch<T>(
//   path: string,
//   init: ApiInit = {}
// ): Promise<T> {
//   const url = new URL(
//     path.startsWith("http")
//       ? path
//       : API_BASE + (path.startsWith("/") ? path : `/${path}`)
//   );

//   if (init.query) {
//     for (const [k, v] of Object.entries(init.query)) {
//       if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
//     }
//   }

//   const res = await fetch(url.toString(), {
//     ...init,
//     headers: { Accept: "application/json", ...(init.headers || {}) },
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     let payload: any | undefined;
//     try {
//       payload = await res.json();
//     } catch {}
//     const err: ApiError = Object.assign(
//       new Error(payload?.message || `API ${res.status} ${res.statusText}`),
//       {
//         status: res.status,
//         payload,
//       }
//     );
//     throw err;
//   }

//   if (res.status === 204) return undefined as unknown as T;
//   return (await res.json()) as T;
// }

// export const api = { fetch: apiFetch, baseUrl: API_BASE };
