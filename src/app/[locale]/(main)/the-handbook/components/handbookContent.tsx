"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { hbGetLessonDetail } from "@/lib/api/handbook.service";
import { qk } from "@/lib/queryKeys";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function HandbookContent({
  sectionSlug,
  chapterSlug,
  lessonSlug,
}: {
  sectionSlug?: string;
  chapterSlug?: string;
  lessonSlug?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const enabled = Boolean(sectionSlug && chapterSlug && lessonSlug);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: enabled
      ? qk.handbook.lesson(sectionSlug!, chapterSlug!, lessonSlug!)
      : ["handbook", "idle"],
    queryFn: ({ signal }) =>
      hbGetLessonDetail(sectionSlug!, chapterSlug!, lessonSlug!, signal),
    enabled,
    staleTime: 60_000,
  });

  // Normalize envelope {data, next_lesson, last_lesson}
  const payload = (data as any)?.data || data;
  const nextLesson = (data as any)?.next_lesson as
    | { id: number; slug: string }
    | undefined;
  const prevLesson = (data as any)?.last_lesson as
    | { id: number; slug: string }
    | undefined;

  const title = payload?.title || lessonSlug;
  const createdAt = payload?.created_at || payload?.createdAt;
  const html = payload?.content || payload?.body || payload?.desc || "";
  const fileUrl: string | undefined = payload?.file;

  // Treat backend placeholder images as "no file"
  const isPlaceholderFile = (u?: string) =>
    !!u &&
    (/\/images\/placeholders\/img\.jpg$/i.test(u) ||
      /\/placeholders?\//i.test(u));
  const views = payload?.views_count;
  const likes = payload?.likes_count;

  const isPdf = useMemo(() => {
    if (!fileUrl) return false;
    try {
      const lower = fileUrl.toLowerCase();
      return lower.endsWith(".pdf") || lower.includes("application/pdf");
    } catch {
      return false;
    }
  }, [fileUrl]);

  const dateLabel = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

  const updateQuery = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v == null || v === "") sp.delete(k);
      else sp.set(k, v);
    });
    router.replace(`${pathname}?${sp.toString()}`);
  };

  const goToLesson = (slug?: string) => {
    if (!slug) return;
    updateQuery({ sec: sectionSlug, ch: chapterSlug, ls: slug });
  };

  if (!enabled) return null;

  if (isLoading) {
    return (
      <div className="p-8 bg-white rounded-2xl border shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="h-10 w-2/3 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-11/12 bg-gray-200 rounded" />
          <div className="h-4 w-10/12 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
        Failed to load lesson. {(error as any)?.message || ""}
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl">
        No content found for this lesson.
      </div>
    );
  }

  return (
    <article className="bg-white rounded-3xl shadow-xl border border-gray-200/60">
      <header className="p-6 lg:p-8 border-b border-gray-100">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#1D4671] mb-2 leading-tight">
          {title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {dateLabel && (
            <span className="inline-flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M7 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm12 7H5v9h14V9z" />
              </svg>
              {dateLabel}
            </span>
          )}
          {typeof views === "number" && (
            <span className="inline-flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12zm11 4a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
              {views} views
            </span>
          )}
          {typeof likes === "number" && (
            <span className="inline-flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.53C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {likes} likes
            </span>
          )}
        </div>
      </header>

      <div className="p-6 lg:p-8">
        {/* File viewer / HTML content */}
        {fileUrl && !isPlaceholderFile(fileUrl)
          ? (() => {
              const lower = (fileUrl || "").toLowerCase();
              if (lower.endsWith(".pdf") || lower.includes("application/pdf")) {
                return (
                  <div className="mt-2 border rounded-xl overflow-hidden bg-gray-50">
                    <iframe
                      src={`${fileUrl}#toolbar=1&navpanes=1&zoom=page-width`}
                      className="w-full h-[78vh]"
                      title={title}
                    />
                    <div className="p-3 bg-white border-t flex items-center gap-3">
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 text-sm font-medium rounded-lg bg-[#1D4671] text-white hover:opacity-90"
                      >
                        Open in new tab
                      </a>
                      <a
                        href={fileUrl}
                        download
                        className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Download PDF
                      </a>
                    </div>
                  </div>
                );
              }
              // show image or generic link
              if (/(jpg|jpeg|png|gif|webp)$/i.test(lower)) {
                return (
                  <div className="mb-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fileUrl}
                      alt={title}
                      className="w-full rounded-xl border"
                    />
                  </div>
                );
              }
              return (
                <div className="mb-6">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Open attached file
                  </a>
                </div>
              );
            })()
          : null}

        {html && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>

      {(prevLesson || nextLesson) && (
        <div className="flex items-center justify-between gap-4 p-4 lg:p-6 border-t bg-gray-50 rounded-b-3xl">
          <button
            disabled={!prevLesson}
            onClick={() => goToLesson(prevLesson?.slug)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium ${
              prevLesson
                ? "bg-white hover:bg-gray-100"
                : "opacity-50 cursor-not-allowed bg-white"
            }`}
          >
            ← Previous
          </button>
          <button
            disabled={!nextLesson}
            onClick={() => goToLesson(nextLesson?.slug)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium ${
              nextLesson
                ? "bg-[#1D4671] text-white hover:opacity-90"
                : "opacity-50 cursor-not-allowed bg-white"
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </article>
  );
}

// "use client";

// import React, { useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { hbGetLessonDetail } from "@/lib/api/handbook.service";
// import { qk } from "@/lib/queryKeys";

// export default function HandbookContent({
//   sectionSlug,
//   chapterSlug,
//   lessonSlug,
// }: {
//   sectionSlug?: string;
//   chapterSlug?: string;
//   lessonSlug?: string;
// }) {
//   const enabled = Boolean(sectionSlug && chapterSlug && lessonSlug);
//   const { data, isLoading, isError, error } = useQuery({
//     queryKey: enabled
//       ? qk.handbook.lesson(sectionSlug!, chapterSlug!, lessonSlug!)
//       : ["handbook", "idle"],
//     queryFn: ({ signal }) =>
//       hbGetLessonDetail(sectionSlug!, chapterSlug!, lessonSlug!, signal),
//     enabled,
//     staleTime: 60_000,
//   });

//   const title = (data as any)?.title || lessonSlug;
//   const createdAt = (data as any)?.created_at || (data as any)?.createdAt;
//   const html =
//     (data as any)?.content || (data as any)?.body || (data as any)?.desc || "";
//   const fileUrl: string | undefined = (data as any)?.file;

//   const isPdf = useMemo(() => {
//     if (!fileUrl) return false;
//     try {
//       const lower = fileUrl.toLowerCase();
//       return lower.endsWith(".pdf") || lower.includes("application/pdf");
//     } catch {
//       return false;
//     }
//   }, [fileUrl]);

//   if (!enabled) return null;

//   if (isLoading) {
//     return (
//       <div className="p-8 bg-white rounded-2xl border shadow-sm">
//         <div className="animate-pulse space-y-4">
//           <div className="h-6 w-40 bg-gray-200 rounded" />
//           <div className="h-10 w-2/3 bg-gray-200 rounded" />
//           <div className="h-4 w-full bg-gray-200 rounded" />
//           <div className="h-4 w-11/12 bg-gray-200 rounded" />
//           <div className="h-4 w-10/12 bg-gray-200 rounded" />
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
//         Failed to load lesson. {(error as any)?.message || ""}
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="p-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl">
//         No content found for this lesson.
//       </div>
//     );
//   }

//   const dateLabel = createdAt
//     ? new Date(createdAt).toLocaleDateString(undefined, {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       })
//     : undefined;

//   return (
//     <article className="bg-white rounded-3xl shadow-xl border border-gray-200/60 p-6 lg:p-8">
//       <header className="mb-4">
//         <h1 className="text-2xl lg:text-3xl font-bold text-[#1D4671] mb-2 leading-tight">
//           {title}
//         </h1>
//         {dateLabel && (
//           <div className="flex items-center text-sm text-gray-600 gap-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//               className="w-4 h-4"
//             >
//               <path d="M7 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm12 7H5v9h14V9z" />
//             </svg>
//             <span>{dateLabel}</span>
//           </div>
//         )}
//       </header>

//       {isPdf && fileUrl ? (
//         <div className="mt-4 border rounded-xl overflow-hidden bg-gray-50">
//           <iframe
//             src={`${fileUrl}#toolbar=1&navpanes=1&zoom=page-width`}
//             className="w-full h-[78vh]"
//             title={title}
//           />
//           <object
//             data={fileUrl}
//             type="application/pdf"
//             className="hidden w-full h-[78vh]"
//           >
//             <embed src={fileUrl} type="application/pdf" />
//           </object>
//           <div className="p-3 bg-white border-t flex items-center gap-3">
//             <a
//               href={fileUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="px-3 py-2 text-sm font-medium rounded-lg bg-[#1D4671] text-white hover:opacity-90"
//             >
//               Open in new tab
//             </a>
//             <a
//               href={fileUrl}
//               download
//               className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
//             >
//               Download PDF
//             </a>
//           </div>
//         </div>
//       ) : fileUrl ? (
//         <div className="mt-4">
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img src={fileUrl} alt={title} className="w-full rounded-xl border" />
//         </div>
//       ) : html ? (
//         <div
//           className="prose max-w-none"
//           dangerouslySetInnerHTML={{ __html: html }}
//         />
//       ) : (
//         <p className="text-gray-600">No file or HTML content provided.</p>
//       )}
//     </article>
//   );
// }
