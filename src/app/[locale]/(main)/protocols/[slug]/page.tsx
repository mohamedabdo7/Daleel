"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProtocolCategoryBySlug } from "@/lib/api/protocols.service";
import { qk } from "@/lib/queryKeys";
import PageHeader from "@/app/components/common/PageHeader";

export default function UrgentCareManualPage() {
  const categorySlug = "urgent-care-manual";

  const {
    data: category,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: qk.protocols.categoryBySlug(categorySlug),
    queryFn: ({ signal }) => getProtocolCategoryBySlug(categorySlug, signal),
    staleTime: 5 * 60_000,
  });

  const isPdf = useMemo(() => {
    if (!category?.file) return false;
    try {
      const lower = category.file.toLowerCase();
      return lower.endsWith(".pdf") || lower.includes("application/pdf");
    } catch {
      return false;
    }
  }, [category?.file]);

  // Date label
  const dateLabel = category?.created_at
    ? new Date(category.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <PageHeader
        title="Urgent Care Manual"
        description="Emergency and Urgent Care Treatment Guidelines"
        showSearch={false}
      />

      <div className="p-3 sm:p-4 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {isLoading && (
            <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-2xl sm:rounded-3xl border shadow-sm">
              <div className="animate-pulse space-y-3 sm:space-y-4">
                {/* Title skeleton */}
                <div className="h-5 sm:h-6 lg:h-8 w-32 sm:w-40 lg:w-48 bg-gray-200 rounded" />
                {/* Subtitle skeleton */}
                <div className="h-6 sm:h-8 lg:h-10 w-full max-w-md sm:max-w-lg bg-gray-200 rounded" />
                {/* Date skeleton */}
                <div className="h-3 sm:h-4 w-24 sm:w-28 bg-gray-200 rounded" />
                {/* Content skeletons */}
                <div className="space-y-2 sm:space-y-3 pt-4">
                  <div className="h-3 sm:h-4 w-full bg-gray-200 rounded" />
                  <div className="h-3 sm:h-4 w-11/12 bg-gray-200 rounded" />
                  <div className="h-3 sm:h-4 w-10/12 bg-gray-200 rounded" />
                  <div className="h-3 sm:h-4 w-9/12 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          )}

          {isError && (
            <div className="p-4 sm:p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-medium">
                    Failed to load manual
                  </h3>
                  {(error as any)?.message && (
                    <p className="text-xs sm:text-sm mt-1 text-red-600">
                      {(error as any).message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {!isLoading && !isError && !category && (
            <div className="p-4 sm:p-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-medium">
                    Manual not found
                  </h3>
                  <p className="text-xs sm:text-sm mt-1">
                    The Urgent Care Manual could not be found.
                  </p>
                </div>
              </div>
            </div>
          )}

          {category && (
            <article className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/60 overflow-hidden">
              {/* Manual header */}
              <header className="p-4 sm:p-6 lg:p-8 border-b border-gray-100">
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#1D4671] mb-2 sm:mb-3 leading-tight break-words">
                  {category.title}
                </h1>
                {dateLabel && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-600 gap-1.5 sm:gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                    >
                      <path d="M7 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm12 7H5v9h14V9z" />
                    </svg>
                    <span className="break-words">{dateLabel}</span>
                  </div>
                )}
              </header>

              {/* Manual content */}
              <div className="p-4 sm:p-6 lg:p-8">
                {/* Description */}
                {category.desc && (
                  <div
                    className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-6
                      prose-headings:text-[#1D4671] prose-headings:font-semibold prose-headings:leading-tight prose-headings:break-words
                      prose-h1:text-xl prose-h1:sm:text-2xl prose-h1:lg:text-3xl prose-h1:mb-4 prose-h1:sm:mb-5 prose-h1:lg:mb-6
                      prose-h2:text-lg prose-h2:sm:text-xl prose-h2:lg:text-2xl prose-h2:mb-3 prose-h2:sm:mb-4 prose-h2:lg:mb-5
                      prose-h3:text-base prose-h3:sm:text-lg prose-h3:lg:text-xl prose-h3:mb-2 prose-h3:sm:mb-3 prose-h3:lg:mb-4
                      prose-h4:text-sm prose-h4:sm:text-base prose-h4:lg:text-lg prose-h4:mb-2 prose-h4:sm:mb-3
                      prose-p:text-gray-700 prose-p:leading-relaxed prose-p:break-words prose-p:mb-3 prose-p:sm:mb-4
                      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:break-all
                      prose-strong:text-[#1D4671] prose-strong:font-semibold"
                    dangerouslySetInnerHTML={{ __html: category.desc }}
                  />
                )}

                {/* PDF Viewer */}
                {isPdf && category.file ? (
                  <div className="border rounded-lg sm:rounded-xl overflow-hidden bg-gray-50">
                    {/* Native PDF viewer in iframe */}
                    <iframe
                      src={`${category.file}#toolbar=1&navpanes=1&zoom=page-width`}
                      className="w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]"
                      title={category.title}
                    />

                    {/* Fallbacks for browsers that disallow iframe PDF */}
                    <object
                      data={category.file}
                      type="application/pdf"
                      className="hidden w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]"
                    >
                      <embed src={category.file} type="application/pdf" />
                    </object>

                    {/* Action buttons */}
                    <div className="p-3 sm:p-4 bg-white border-t flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <a
                        href={category.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#1D4671] text-white hover:opacity-90 text-center transition-opacity"
                      >
                        Open in new tab
                      </a>
                      <a
                        href={category.file}
                        download
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-center transition-colors"
                      >
                        Download PDF
                      </a>
                    </div>
                  </div>
                ) : category.file ? (
                  // Non-PDF file (e.g. image)
                  <div className="mt-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={category.file}
                      alt={category.title}
                      className="w-full rounded-lg sm:rounded-xl border max-w-full h-auto"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8 sm:py-12">
                    <p className="text-gray-600 text-sm sm:text-base text-center">
                      No file content available for this manual.
                    </p>
                  </div>
                )}
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

// "use client";

// import React, { useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "next/navigation";
// import { getProtocolCategoryBySlug } from "@/lib/api/protocols.service";
// import { qk } from "@/lib/queryKeys";
// import PageHeader from "@/app/components/common/PageHeader";

// // Define the page titles for different slugs
// const PAGE_TITLES = {
//   "phc-antimicrobial-manual": {
//     title: "PHC Antimicrobial Manual",
//     description: "Primary Health Care Antimicrobial Treatment Guidelines",
//   },
//   "urgent-care-manual": {
//     title: "Urgent Care Manual",
//     description: "Emergency and Urgent Care Treatment Guidelines",
//   },
// } as const;

// export default function ProtocolManualPage() {
//   const params = useParams();
//   const categorySlug = params?.slug as string;

//   const {
//     data: category,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: qk.protocols.categoryBySlug(categorySlug),
//     queryFn: ({ signal }) => getProtocolCategoryBySlug(categorySlug, signal),
//     enabled: !!categorySlug,
//     staleTime: 5 * 60_000,
//   });

//   const isPdf = useMemo(() => {
//     if (!category?.file) return false;
//     try {
//       const lower = category.file.toLowerCase();
//       return lower.endsWith(".pdf") || lower.includes("application/pdf");
//     } catch {
//       return false;
//     }
//   }, [category?.file]);

//   // Get page metadata based on slug, fallback to API data
//   const pageInfo = useMemo(() => {
//     const defaultInfo = PAGE_TITLES[categorySlug as keyof typeof PAGE_TITLES];
//     return {
//       title: category?.title || defaultInfo?.title || "Manual",
//       description:
//         defaultInfo?.description || "Treatment Guidelines and Protocols",
//     };
//   }, [category?.title, categorySlug]);

//   // Date label
//   const dateLabel = category?.created_at
//     ? new Date(category.created_at).toLocaleDateString(undefined, {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       })
//     : undefined;

//   if (!categorySlug) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="p-8">
//           <div className="max-w-5xl mx-auto">
//             <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
//               <h3 className="font-medium">Invalid Route</h3>
//               <p className="text-sm mt-1">
//                 No manual slug provided in the URL.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <PageHeader
//         title={pageInfo.title}
//         description={pageInfo.description}
//         showSearch={false}
//       />

//       <div className="p-3 sm:p-4 lg:p-8">
//         <div className="max-w-5xl mx-auto">
//           {isLoading && (
//             <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-2xl sm:rounded-3xl border shadow-sm">
//               <div className="animate-pulse space-y-3 sm:space-y-4">
//                 {/* Title skeleton */}
//                 <div className="h-5 sm:h-6 lg:h-8 w-32 sm:w-40 lg:w-48 bg-gray-200 rounded" />
//                 {/* Subtitle skeleton */}
//                 <div className="h-6 sm:h-8 lg:h-10 w-full max-w-md sm:max-w-lg bg-gray-200 rounded" />
//                 {/* Date skeleton */}
//                 <div className="h-3 sm:h-4 w-24 sm:w-28 bg-gray-200 rounded" />
//                 {/* Content skeletons */}
//                 <div className="space-y-2 sm:space-y-3 pt-4">
//                   <div className="h-3 sm:h-4 w-full bg-gray-200 rounded" />
//                   <div className="h-3 sm:h-4 w-11/12 bg-gray-200 rounded" />
//                   <div className="h-3 sm:h-4 w-10/12 bg-gray-200 rounded" />
//                   <div className="h-3 sm:h-4 w-9/12 bg-gray-200 rounded" />
//                 </div>
//               </div>
//             </div>
//           )}

//           {isError && (
//             <div className="p-4 sm:p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
//               <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                 <div className="flex-shrink-0">
//                   <svg
//                     className="w-5 h-5 text-red-500"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-sm sm:text-base font-medium">
//                     Failed to load manual
//                   </h3>
//                   {(error as any)?.message && (
//                     <p className="text-xs sm:text-sm mt-1 text-red-600">
//                       {(error as any).message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {!isLoading && !isError && !category && (
//             <div className="p-4 sm:p-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl">
//               <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                 <div className="flex-shrink-0">
//                   <svg
//                     className="w-5 h-5 text-yellow-600"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-sm sm:text-base font-medium">
//                     Manual not found
//                   </h3>
//                   <p className="text-xs sm:text-sm mt-1">
//                     The requested manual could not be found.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {category && (
//             <article className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/60 overflow-hidden">
//               {/* Manual header */}
//               <header className="p-4 sm:p-6 lg:p-8 border-b border-gray-100">
//                 <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#1D4671] mb-2 sm:mb-3 leading-tight break-words">
//                   {category.title}
//                 </h1>
//                 {dateLabel && (
//                   <div className="flex items-center text-xs sm:text-sm text-gray-600 gap-1.5 sm:gap-2">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                       className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
//                     >
//                       <path d="M7 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm12 7H5v9h14V9z" />
//                     </svg>
//                     <span className="break-words">{dateLabel}</span>
//                   </div>
//                 )}
//               </header>

//               {/* Manual content */}
//               <div className="p-4 sm:p-6 lg:p-8">
//                 {/* Description */}
//                 {category.desc && (
//                   <div
//                     className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-6
//                       prose-headings:text-[#1D4671] prose-headings:font-semibold prose-headings:leading-tight prose-headings:break-words
//                       prose-h1:text-xl prose-h1:sm:text-2xl prose-h1:lg:text-3xl prose-h1:mb-4 prose-h1:sm:mb-5 prose-h1:lg:mb-6
//                       prose-h2:text-lg prose-h2:sm:text-xl prose-h2:lg:text-2xl prose-h2:mb-3 prose-h2:sm:mb-4 prose-h2:lg:mb-5
//                       prose-h3:text-base prose-h3:sm:text-lg prose-h3:lg:text-xl prose-h3:mb-2 prose-h3:sm:mb-3 prose-h3:lg:mb-4
//                       prose-h4:text-sm prose-h4:sm:text-base prose-h4:lg:text-lg prose-h4:mb-2 prose-h4:sm:mb-3
//                       prose-p:text-gray-700 prose-p:leading-relaxed prose-p:break-words prose-p:mb-3 prose-p:sm:mb-4
//                       prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:break-all
//                       prose-strong:text-[#1D4671] prose-strong:font-semibold"
//                     dangerouslySetInnerHTML={{ __html: category.desc }}
//                   />
//                 )}

//                 {/* PDF Viewer */}
//                 {isPdf && category.file ? (
//                   <div className="border rounded-lg sm:rounded-xl overflow-hidden bg-gray-50">
//                     {/* Native PDF viewer in iframe */}
//                     <iframe
//                       src={`${category.file}#toolbar=1&navpanes=1&zoom=page-width`}
//                       className="w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]"
//                       title={category.title}
//                     />

//                     {/* Fallbacks for browsers that disallow iframe PDF */}
//                     <object
//                       data={category.file}
//                       type="application/pdf"
//                       className="hidden w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]"
//                     >
//                       <embed src={category.file} type="application/pdf" />
//                     </object>

//                     {/* Action buttons */}
//                     <div className="p-3 sm:p-4 bg-white border-t flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
//                       <a
//                         href={category.file}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#1D4671] text-white hover:opacity-90 text-center transition-opacity"
//                       >
//                         Open in new tab
//                       </a>
//                       <a
//                         href={category.file}
//                         download
//                         className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-center transition-colors"
//                       >
//                         Download PDF
//                       </a>
//                     </div>
//                   </div>
//                 ) : category.file ? (
//                   // Non-PDF file (e.g. image)
//                   <div className="mt-4">
//                     {/* eslint-disable-next-line @next/next/no-img-element */}
//                     <img
//                       src={category.file}
//                       alt={category.title}
//                       className="w-full rounded-lg sm:rounded-xl border max-w-full h-auto"
//                     />
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center py-8 sm:py-12">
//                     <p className="text-gray-600 text-sm sm:text-base text-center">
//                       No file content available for this manual.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </article>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getProtocolCategoryBySlug } from "@/lib/api/protocols.service";
// import { qk } from "@/lib/queryKeys";
// import PageHeader from "@/app/components/common/PageHeader";

// export default function PHCAntimicrobialManualPage() {
//   const categorySlug = "phc-antimicrobial-manual";

//   const {
//     data: category,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: qk.protocols.categoryBySlug(categorySlug),
//     queryFn: ({ signal }) => getProtocolCategoryBySlug(categorySlug, signal),
//     staleTime: 5 * 60_000,
//   });

//   const isPdf = useMemo(() => {
//     if (!category?.file) return false;
//     try {
//       const lower = category.file.toLowerCase();
//       return lower.endsWith(".pdf") || lower.includes("application/pdf");
//     } catch {
//       return false;
//     }
//   }, [category?.file]);

//   // Date label
//   const dateLabel = category?.created_at
//     ? new Date(category.created_at).toLocaleDateString(undefined, {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       })
//     : undefined;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <PageHeader
//         title="PHC Antimicrobial Manual"
//         description="Primary Health Care Antimicrobial Treatment Guidelines"
//         showSearch={false}
//       />

//       <div className="p-3 sm:p-4 lg:p-8">
//         <div className="max-w-5xl mx-auto">
//           {isLoading && (
//             <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-2xl sm:rounded-3xl border shadow-sm">
//               <div className="animate-pulse space-y-3 sm:space-y-4">
//                 {/* Title skeleton */}
//                 <div className="h-5 sm:h-6 lg:h-8 w-32 sm:w-40 lg:w-48 bg-gray-200 rounded" />
//                 {/* Subtitle skeleton */}
//                 <div className="h-6 sm:h-8 lg:h-10 w-full max-w-md sm:max-w-lg bg-gray-200 rounded" />
//                 {/* Date skeleton */}
//                 <div className="h-3 sm:h-4 w-24 sm:w-28 bg-gray-200 rounded" />
//                 {/* Content skeletons */}
//                 <div className="space-y-2 sm:space-y-3 pt-4">
//                   <div className="h-3 sm:h-4 w-full bg-gray-200 rounded" />
//                   <div className="h-3 sm:h-4 w-11/12 bg-gray-200 rounded" />
//                   <div className="h-3 sm:h-4 w-10/12 bg-gray-200 rounded" />
//                   <div className="h-3 sm:h-4 w-9/12 bg-gray-200 rounded" />
//                 </div>
//               </div>
//             </div>
//           )}

//           {isError && (
//             <div className="p-4 sm:p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
//               <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                 <div className="flex-shrink-0">
//                   <svg
//                     className="w-5 h-5 text-red-500"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-sm sm:text-base font-medium">
//                     Failed to load manual
//                   </h3>
//                   {(error as any)?.message && (
//                     <p className="text-xs sm:text-sm mt-1 text-red-600">
//                       {(error as any).message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {!isLoading && !isError && !category && (
//             <div className="p-4 sm:p-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl">
//               <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                 <div className="flex-shrink-0">
//                   <svg
//                     className="w-5 h-5 text-yellow-600"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//                 <div>
//                   <h3 className="text-sm sm:text-base font-medium">
//                     Manual not found
//                   </h3>
//                   <p className="text-xs sm:text-sm mt-1">
//                     The PHC Antimicrobial Manual could not be found.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {category && (
//             <article className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/60 overflow-hidden">
//               {/* Manual header */}
//               <header className="p-4 sm:p-6 lg:p-8 border-b border-gray-100">
//                 <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#1D4671] mb-2 sm:mb-3 leading-tight break-words">
//                   {category.title}
//                 </h1>
//                 {dateLabel && (
//                   <div className="flex items-center text-xs sm:text-sm text-gray-600 gap-1.5 sm:gap-2">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 24 24"
//                       fill="currentColor"
//                       className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
//                     >
//                       <path d="M7 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm12 7H5v9h14V9z" />
//                     </svg>
//                     <span className="break-words">{dateLabel}</span>
//                   </div>
//                 )}
//               </header>

//               {/* Manual content */}
//               <div className="p-4 sm:p-6 lg:p-8">
//                 {/* Description */}
//                 {category.desc && (
//                   <div
//                     className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-6
//                       prose-headings:text-[#1D4671] prose-headings:font-semibold prose-headings:leading-tight prose-headings:break-words
//                       prose-h1:text-xl prose-h1:sm:text-2xl prose-h1:lg:text-3xl prose-h1:mb-4 prose-h1:sm:mb-5 prose-h1:lg:mb-6
//                       prose-h2:text-lg prose-h2:sm:text-xl prose-h2:lg:text-2xl prose-h2:mb-3 prose-h2:sm:mb-4 prose-h2:lg:mb-5
//                       prose-h3:text-base prose-h3:sm:text-lg prose-h3:lg:text-xl prose-h3:mb-2 prose-h3:sm:mb-3 prose-h3:lg:mb-4
//                       prose-h4:text-sm prose-h4:sm:text-base prose-h4:lg:text-lg prose-h4:mb-2 prose-h4:sm:mb-3
//                       prose-p:text-gray-700 prose-p:leading-relaxed prose-p:break-words prose-p:mb-3 prose-p:sm:mb-4
//                       prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:break-all
//                       prose-strong:text-[#1D4671] prose-strong:font-semibold"
//                     dangerouslySetInnerHTML={{ __html: category.desc }}
//                   />
//                 )}

//                 {/* PDF Viewer */}
//                 {isPdf && category.file ? (
//                   <div className="border rounded-lg sm:rounded-xl overflow-hidden bg-gray-50">
//                     {/* Native PDF viewer in iframe */}
//                     <iframe
//                       src={`${category.file}#toolbar=1&navpanes=1&zoom=page-width`}
//                       className="w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]"
//                       title={category.title}
//                     />

//                     {/* Fallbacks for browsers that disallow iframe PDF */}
//                     <object
//                       data={category.file}
//                       type="application/pdf"
//                       className="hidden w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]"
//                     >
//                       <embed src={category.file} type="application/pdf" />
//                     </object>

//                     {/* Action buttons */}
//                     <div className="p-3 sm:p-4 bg-white border-t flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
//                       <a
//                         href={category.file}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#1D4671] text-white hover:opacity-90 text-center transition-opacity"
//                       >
//                         Open in new tab
//                       </a>
//                       <a
//                         href={category.file}
//                         download
//                         className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-center transition-colors"
//                       >
//                         Download PDF
//                       </a>
//                     </div>
//                   </div>
//                 ) : category.file ? (
//                   // Non-PDF file (e.g. image)
//                   <div className="mt-4">
//                     {/* eslint-disable-next-line @next/next/no-img-element */}
//                     <img
//                       src={category.file}
//                       alt={category.title}
//                       className="w-full rounded-lg sm:rounded-xl border max-w-full h-auto"
//                     />
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center py-8 sm:py-12">
//                     <p className="text-gray-600 text-sm sm:text-base text-center">
//                       No file content available for this manual.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </article>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
