"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Calendar } from "lucide-react";

// UI Components
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// Custom Components
import { qk } from "@/lib/queryKeys";
import PageHeader from "@/app/components/common/PageHeader";
import EventsLoading from "./components/EventsLoading";
import { getEvents, Event } from "@/lib/api/events.service";
import EventCard from "./components/EventCard";
import Pagination from "@/app/components/common/Pagination";
import EventsEmptyState from "./components/EmptyState";

const PER_PAGE = 9;

// Shape matches your Laravel paginator response
type LaravelListResponse<T> = {
  data: T[];
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
  links?: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  status?: number;
  message?: string;
};

export default function EventsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL state
  const currentPage = Math.max(
    parseInt(searchParams.get("page") || "1", 10) || 1,
    1
  );
  const keyword = (searchParams.get("keyword") || "").trim();

  // Local search input mirror
  const [searchInput, setSearchInput] = useState(keyword);
  useEffect(() => setSearchInput(keyword), [keyword]);

  // Build query params for API + query key
  const queryParams = useMemo(
    () => ({
      page: currentPage,
      keyword: keyword || undefined,
      per_page: PER_PAGE,
    }),
    [currentPage, keyword]
  );

  // React Query
  const { data, isLoading, isError, error } = useQuery<
    LaravelListResponse<Event>,
    Error
  >({
    queryKey: qk.events?.list(queryParams) || ["events", "list", queryParams],
    queryFn: ({ signal }) =>
      getEvents(queryParams, signal) as Promise<LaravelListResponse<Event>>,
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });

  // Safe access w/ types
  const items = data?.data ?? [];

  // Prefer meta from API; otherwise derive
  const meta = data?.meta;
  const total = meta?.total ?? items.length;
  const perPage = meta?.per_page ?? PER_PAGE;
  const lastPage = meta?.last_page ?? Math.max(1, Math.ceil(total / perPage));
  const pageNow = meta?.current_page ?? currentPage;

  // URL update helper
  const updateQuery = useCallback(
    (params: Record<string, string | undefined>) => {
      const sp = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([k, v]) => {
        if (!v) sp.delete(k);
        else sp.set(k, v);
      });
      router.replace(`${pathname}?${sp.toString()}`);
      if (params.page) window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [pathname, router, searchParams]
  );

  // Event handlers
  const handleSearch = useCallback(
    (value: string) =>
      updateQuery({ keyword: value || undefined, page: undefined }),
    [updateQuery]
  );

  const handleSearchInputChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    updateQuery({ keyword: undefined, page: undefined });
  }, [updateQuery]);

  const handlePageChange = useCallback(
    (page: number) => updateQuery({ page: String(page) }),
    [updateQuery]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/30">
      {/* Header */}
      <PageHeader
        title="Medical Events"
        description="Discover upcoming medical conferences, workshops, and professional events"
        iconAlt="Events Icon"
        showSearch={true}
        searchPlaceholder="Search events..."
        searchValue={searchInput}
        onSearch={handleSearch}
        onSearchInputChange={handleSearchInputChange}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Results Info */}
        {keyword && (
          <div className="mb-6 flex items-center justify-between">
            <Badge
              variant="secondary"
              className="text-sm bg-blue-50 text-blue-700 border-blue-200"
            >
              <Calendar className="w-3 h-3 mr-1" />
              {isLoading ? (
                "Searching..."
              ) : (
                <>
                  {total} event{total !== 1 ? "s" : ""} for "{keyword}"
                </>
              )}
            </Badge>
            <button
              onClick={handleClearSearch}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear search
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Loading State */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EventsLoading />
            </motion.div>
          )}

          {/* Error State */}
          {isError && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-center"
            >
              <Alert className="max-w-md border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700">
                  <div className="font-medium">Failed to load events</div>
                  <div className="text-sm opacity-90">
                    {(error as any)?.message || "Please try again later"}
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && items.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <EventsEmptyState searchKeyword={keyword} />
            </motion.div>
          )}

          {/* Content Grid */}
          {!isLoading && !isError && items.length > 0 && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Events Grid */}
              <motion.div
                className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {items.map((event, index) => (
                  <motion.div
                    key={event.id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {lastPage > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={pageNow}
                    totalPages={lastPage}
                    totalItems={total}
                    itemsPerPage={perPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
