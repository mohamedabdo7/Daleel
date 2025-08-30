"use client";

import React from "react";

const EventsLoading: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-gray-200 animate-pulse overflow-hidden"
        >
          {/* Image skeleton */}
          <div className="aspect-[16/10] bg-gray-200" />

          {/* Content skeleton */}
          <div className="p-6">
            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 rounded-lg mb-3 w-4/5"></div>

            {/* Description skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Buttons skeleton */}
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>

            {/* Learn more skeleton */}
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsLoading;
