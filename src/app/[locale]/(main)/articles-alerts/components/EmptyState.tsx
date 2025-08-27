import React from "react";

interface EmptyStateProps {
  searchKeyword?: string;
}

export default function EmptyState({ searchKeyword }: EmptyStateProps) {
  return (
    <div className="text-center py-12 sm:py-16 lg:py-20">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        {/* Content */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          {searchKeyword ? "No results found" : "No alerts available"}
        </h3>

        <p className="text-gray-600 text-sm sm:text-base mb-6">
          {searchKeyword ? (
            <>
              We couldn&apos;t find any alerts matching{" "}
              <span className="font-medium">"{searchKeyword}"</span>. Try
              adjusting your search terms.
            </>
          ) : (
            "There are no medical alerts available at the moment. Check back later for updates."
          )}
        </p>

        {/* Actions */}
        {searchKeyword && (
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = window.location.pathname)}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Clear Search
            </button>
            <p className="text-xs text-gray-500">
              Or try searching for different terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
