"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProtocolCategoryBySlug } from "@/lib/api/protocols.service";
import { qk } from "@/lib/queryKeys";
import PageHeader from "@/app/components/common/PageHeader";
import { AlertCircle, AlertTriangle, Calendar } from "lucide-react";

export default function ProtocolManualPage() {
  const { slug } = useParams();
  const categorySlug = Array.isArray(slug) ? slug[0] : slug;

  const {
    data: category,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: qk.protocols.categoryBySlug(categorySlug),
    queryFn: ({ signal }) => getProtocolCategoryBySlug(categorySlug, signal),
    staleTime: 5 * 60_000,
    enabled: !!categorySlug,
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

  const dateLabel = category?.created_at
    ? new Date(category.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

  const pageTitle =
    category?.title ||
    (categorySlug === "urgent-care-manual"
      ? "Urgent Care Manual"
      : "PHC Antimicrobial Manual");
  const pageDescription =
    categorySlug === "urgent-care-manual"
      ? "Emergency and Urgent Care Treatment Guidelines"
      : "Primary Health Care Antimicrobial Treatment Guidelines";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        showSearch={false}
      />

      <div className="p-3 sm:p-4 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {isLoading && (
            <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-2xl sm:rounded-3xl border shadow-sm">
              <div className="animate-pulse space-y-3 sm:space-y-4">
                <div className="h-5 sm:h-6 lg:h-8 w-32 sm:w-40 lg:w-48 bg-gray-200 rounded" />
                <div className="h-6 sm:h-8 lg:h-10 w-full max-w-md sm:max-w-lg bg-gray-200 rounded" />
                <div className="h-3 sm:h-4 w-24 sm:w-28 bg-gray-200 rounded" />
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
                  <AlertCircle className="w-5 h-5 text-red-500" />
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
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-medium">
                    Manual not found
                  </h3>
                  <p className="text-xs sm:text-sm mt-1">
                    The requested manual could not be found.
                  </p>
                </div>
              </div>
            </div>
          )}

          {category && (
            <article className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/60 overflow-hidden">
              <header className="p-4 sm:p-6 lg:p-8 border-b border-gray-100">
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#1D4671] mb-2 sm:mb-3 leading-tight break-words">
                  {category.title}
                </h1>
                {dateLabel && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-600 gap-1.5 sm:gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="break-words">{dateLabel}</span>
                  </div>
                )}
              </header>

              <div className="p-4 sm:p-6 lg:p-8">
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

                {isPdf && category.file ? (
                  <div className="border rounded-lg sm:rounded-xl overflow-hidden bg-gray-50">
                    <iframe
                      src={`${category.file}#toolbar=1&navpanes=1&zoom=page-width`}
                      className="w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]"
                      title={category.title}
                    />
                    <object
                      data={category.file}
                      type="application/pdf"
                      className="hidden w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]"
                    >
                      <embed src={category.file} type="application/pdf" />
                    </object>
                    <div className="p-3 sm:p-4 bg-white border-t flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <a
                        href={category.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#1D4671] text-white hover:opacity-90 text-center transition-opacity"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ) : category.file ? (
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
