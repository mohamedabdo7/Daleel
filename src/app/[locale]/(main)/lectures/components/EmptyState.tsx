"use client";

import React from "react";

interface EmptyStateProps {
  searchKeyword?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchKeyword }) => {
  return (
    <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-gray-200">
      <svg
        className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">
        No lectures found
      </h3>
      {searchKeyword && (
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          No results for "{searchKeyword}"
        </p>
      )}
      <p className="mt-2 text-xs sm:text-sm text-gray-500">
        Try adjusting your search or check back later.
      </p>
    </div>
  );
};

export default EmptyState;
