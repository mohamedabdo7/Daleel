"use client";

import React from "react";

const LecturesLoading: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 animate-pulse overflow-hidden"
        >
          <div className="aspect-video bg-gray-100" />
          <div className="p-4 sm:p-5">
            <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LecturesLoading;
