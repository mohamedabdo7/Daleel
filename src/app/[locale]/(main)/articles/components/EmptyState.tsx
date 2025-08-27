"use client";

export default function EmptyState({
  title = "Select an article to begin reading",
  description = "Explore our comprehensive collection of medical articles and guides",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-dashed border-gray-300 p-6 sm:p-8 lg:p-10 text-center shadow-sm">
        {/* Icon */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 bg-gray-100 rounded-full">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400"
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
        </div>

        {/* Content */}
        <div className="space-y-2 sm:space-y-3">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 break-words px-2">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto leading-relaxed break-words px-2">
            {description}
          </p>
        </div>

        {/* Optional CTA or hint */}
        <div className="mt-6 sm:mt-8">
          <div className="inline-flex items-center text-xs sm:text-sm text-gray-400 bg-gray-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline">
              Choose from the menu to get started
            </span>
            <span className="sm:hidden">Choose from menu</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// export default function EmptyState({
//   title = "Select an article to begin reading",
//   description = "Explore our comprehensive collection of medical articles and guides",
// }: {
//   title?: string;
//   description?: string;
// }) {
//   return (
//     <div className="max-w-5xl mx-auto p-8">
//       <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-10 text-center shadow-sm">
//         <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
//         <p className="text-gray-500">{description}</p>
//       </div>
//     </div>
//   );
// }
