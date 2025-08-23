// Centralized API client using native fetch
// Base URL for Daleel FM backend API
const API_BASE = "https://backend.daleelfm.com/api" as const;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiError extends Error {
  status?: number;
  payload?: unknown;
}

export type ApiInit = RequestInit & {
  query?: Record<string, string | number | boolean | null | undefined>;
};

/**
 * apiFetch — thin wrapper around fetch with:
 *  - base URL handling
 *  - query params support
 *  - JSON parsing and unified errors
 */
export async function apiFetch<T>(
  path: string,
  init: ApiInit = {}
): Promise<T> {
  const url = new URL(
    path.startsWith("http")
      ? path
      : API_BASE + (path.startsWith("/") ? path : `/${path}`)
  );

  // Attach query params if provided
  if (init.query) {
    for (const [k, v] of Object.entries(init.query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.headers || {}),
    },
    // For highly dynamic resources; tune per-endpoint via caller if needed
    cache: "no-store",
  });

  if (!res.ok) {
    let payload: any = undefined;
    try {
      payload = await res.json();
    } catch {
      // ignore
    }
    const err: ApiError = Object.assign(
      new Error(payload?.message || `API ${res.status} ${res.statusText}`),
      {
        status: res.status,
        payload,
      }
    );
    throw err;
  }

  // Some endpoints may return empty responses
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export const api = {
  fetch: apiFetch,
  baseUrl: API_BASE,
};
