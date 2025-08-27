"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { qk } from "@/lib/queryKeys";
import PageHeader from "@/app/components/common/PageHeader";
import AlertCard from "./components/AlertCard";
import AlertsLoading from "./components/AlertsLoading";
import EmptyState from "./components/EmptyState";
import { getAlerts } from "@/lib/api/articles-alerts.service";

export default function AlertsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL state
  const currentPage = parseInt(searchParams.get("page") || "1");
  const searchKeyword = searchParams.get("keyword") || "";

  // Local state for search input
  const [searchInput, setSearchInput] = useState(searchKeyword);

  // Update search input when URL changes
  useEffect(() => {
    setSearchInput(searchKeyword);
  }, [searchKeyword]);

  const updateQuery = useCallback(
    (params: Record<string, string | undefined>) => {
      const sp = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([k, v]) => {
        if (v == null || v === "") {
          sp.delete(k);
        } else {
          sp.set(k, v);
        }
      });
      router.replace(`${pathname}?${sp.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Fetch alerts
  const queryParams = {
    page: currentPage,
    keyword: searchKeyword,
  };

  const {
    data: alertsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: qk.alerts.list(queryParams),
    queryFn: ({ signal }) => getAlerts(queryParams, signal),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });

  // Handle search button click or Enter key press
  const handleSearch = useCallback(
    (value: string) => {
      // Only update URL when search is triggered (button click or Enter)
      updateQuery({ keyword: value, page: undefined });
    },
    [updateQuery]
  );

  // Handle input changes (typing)
  const handleInputChange = useCallback((value: string) => {
    // Only update local input state, don't trigger search
    setSearchInput(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    updateQuery({ keyword: undefined, page: undefined });
  }, [updateQuery]);

  const handlePageChange = useCallback(
    (page: number) => {
      updateQuery({ page: page.toString() });
    },
    [updateQuery]
  );

  // Extract data
  const alerts = alertsResponse?.data || [];
  const pagination = {
    currentPage: alertsResponse?.current_page || currentPage,
    lastPage: alertsResponse?.last_page || 1,
    total: alertsResponse?.total || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <PageHeader
        title="Medical Alerts"
        description="Stay updated with the latest medical research and alerts"
        iconAlt="Alerts Icon"
        showSearch={true}
        searchPlaceholder="Search medical alerts..."
        searchValue={searchInput}
        onSearch={handleSearch}
        onSearchInputChange={handleInputChange}
      />

      <main className="p-3 sm:p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Results Info */}
          {searchKeyword && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600 text-sm sm:text-base">
                {isLoading
                  ? "Searching..."
                  : `Found ${pagination.total} results for "${searchKeyword}"`}
              </p>
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

          {/* Loading State */}
          {isLoading && <AlertsLoading />}

          {/* Error State */}
          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="font-medium">Failed to load alerts</h3>
                  <p className="text-sm mt-1">
                    {(error as any)?.message || "Please try again later"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && alerts.length === 0 && (
            <EmptyState searchKeyword={searchKeyword} />
          )}

          {/* Alerts Grid */}
          {!isLoading && !isError && alerts.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8">
                {alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.lastPage > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 p-4 bg-white rounded-xl border border-gray-200">
                  {/* Page info */}
                  <div className="text-sm text-gray-600">
                    Showing {(pagination.currentPage - 1) * 12 + 1} to{" "}
                    {Math.min(pagination.currentPage * 12, pagination.total)} of{" "}
                    {pagination.total} results
                  </div>

                  {/* Pagination controls */}
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {(() => {
                        const { currentPage, lastPage } = pagination;
                        const maxVisible = 7;
                        let pages = [];

                        if (lastPage <= maxVisible) {
                          // Show all pages if total pages <= maxVisible
                          pages = Array.from(
                            { length: lastPage },
                            (_, i) => i + 1
                          );
                        } else {
                          // Show smart pagination
                          if (currentPage <= 4) {
                            pages = [1, 2, 3, 4, 5, -1, lastPage]; // -1 represents ellipsis
                          } else if (currentPage >= lastPage - 3) {
                            pages = [
                              1,
                              -1,
                              lastPage - 4,
                              lastPage - 3,
                              lastPage - 2,
                              lastPage - 1,
                              lastPage,
                            ];
                          } else {
                            pages = [
                              1,
                              -1,
                              currentPage - 1,
                              currentPage,
                              currentPage + 1,
                              -1,
                              lastPage,
                            ];
                          }
                        }

                        return pages.map((page, index) => {
                          if (page === -1) {
                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className="px-3 py-2 text-sm text-gray-400"
                              >
                                ...
                              </span>
                            );
                          }

                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                page === currentPage
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        });
                      })()}
                    </div>

                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={pagination.currentPage === pagination.lastPage}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
