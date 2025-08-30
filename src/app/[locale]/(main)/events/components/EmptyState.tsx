"use client";

import React from "react";
import { Calendar, Search } from "lucide-react";

interface EventsEmptyStateProps {
  searchKeyword?: string;
}

const EventsEmptyState: React.FC<EventsEmptyStateProps> = ({
  searchKeyword,
}) => {
  return (
    <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-gray-200">
      <div className="relative mx-auto w-24 h-24 mb-6">
        <div className="absolute inset-0 bg-blue-100 rounded-full flex items-center justify-center">
          {searchKeyword ? (
            <Search className="h-10 w-10 text-blue-400" />
          ) : (
            <Calendar className="h-10 w-10 text-blue-400" />
          )}
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-xs text-gray-500">0</span>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {searchKeyword ? "No events found" : "No events available"}
      </h3>

      {searchKeyword && (
        <p className="text-gray-600 mb-2">
          No results found for{" "}
          <span className="font-medium">"{searchKeyword}"</span>
        </p>
      )}

      <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
        {searchKeyword
          ? "Try adjusting your search terms or check back later for new events."
          : "Check back soon for upcoming medical events, conferences, and workshops."}
      </p>

      {searchKeyword && (
        <div className="mt-6">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View all events
          </button>
        </div>
      )}
    </div>
  );
};

export default EventsEmptyState;
