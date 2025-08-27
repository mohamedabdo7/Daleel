import React from "react";

export default function AlertsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="aspect-[4/3] bg-gray-200" />

          {/* Content skeleton */}
          <div className="p-4">
            {/* Title skeleton */}
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />

            {/* Description skeleton */}
            <div className="h-3 bg-gray-200 rounded mb-1" />
            <div className="h-3 bg-gray-200 rounded w-5/6 mb-3" />

            {/* Meta info skeleton */}
            <div className="flex justify-between items-center mb-4">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="flex gap-3">
                <div className="h-3 bg-gray-200 rounded w-8" />
                <div className="h-3 bg-gray-200 rounded w-8" />
              </div>
            </div>

            {/* Buttons skeleton */}
            <div className="flex gap-2">
              <div className="flex-1 h-9 bg-gray-200 rounded-lg" />
              <div className="flex-1 h-9 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
