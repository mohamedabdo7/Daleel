import { apiFetch } from "@/lib/api/client";

// === Types ===
export type Event = {
  id: number;
  title: string;
  desc: string;
  image: string;
  images?: Array<{
    id: number;
    image: string;
  }>;
  buttons?: Array<{
    id: number;
    title: string;
    link: string;
  }>;
};

export interface EventsResponse {
  data: Event[];
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
  meta?: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
  status?: number;
  message?: string;
}

export interface EventsParams {
  page?: number;
  keyword?: string;
  per_page?: number;
}

// === Services ===
export async function getEvents(
  params: EventsParams = {},
  signal?: AbortSignal
): Promise<EventsResponse> {
  const queryParams: Record<
    string,
    string | number | boolean | null | undefined
  > = {};

  if (params.page && params.page > 1) {
    queryParams.page = params.page;
  }

  if (params.keyword && params.keyword.trim()) {
    queryParams.keyword = params.keyword.trim();
  }

  if (params.per_page) {
    queryParams.per_page = params.per_page;
  }

  const res = await apiFetch<EventsResponse>("/user/events", {
    signal,
    query: queryParams,
  });

  return (
    res || {
      data: [],
      current_page: 1,
      last_page: 1,
      total: 0,
      from: 0,
      to: 0,
      meta: {
        current_page: 1,
        from: null,
        last_page: 1,
        links: [],
        path: "/user/events",
        per_page: 10,
        to: null,
        total: 0,
      },
    }
  );
}

export async function getEventBySlug(slug: string): Promise<Event> {
  const response = await apiFetch<{
    data: Event;
    status: number;
    message: string;
  }>(`/user/event_by_slug/${encodeURIComponent(slug)}`);

  return response.data;
}
