"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProtocolBySlug } from "@/lib/api/protocols.service";
import { qk } from "@/lib/queryKeys";

export default function ProtocolContent({
  protocolSlug,
}: {
  protocolSlug?: string;
}) {
  const enabled = Boolean(protocolSlug);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: enabled
      ? qk.protocols.item(protocolSlug as string)
      : ["protocols", "idle"],
    queryFn: ({ signal }) => getProtocolBySlug(protocolSlug as string, signal),
    enabled,
    staleTime: 60_000,
  });

  const title = (data as any)?.title || protocolSlug;
  const createdAt = (data as any)?.created_at || (data as any)?.createdAt;
  const html =
    (data as any)?.content || (data as any)?.body || (data as any)?.desc || "";
  const fileUrl: string | undefined = (data as any)?.file;

  const isPdf = useMemo(() => {
    if (!fileUrl) return false;
    try {
      const lower = fileUrl.toLowerCase();
      return lower.endsWith(".pdf") || lower.includes("application/pdf");
    } catch {
      return false;
    }
  }, [fileUrl]);

  if (!enabled) return null;

  if (isLoading) {
    return (
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
    );
  }

  if (isError) {
    return (
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
              Failed to load protocol
            </h3>
            {(error as any)?.message && (
              <p className="text-xs sm:text-sm mt-1 text-red-600">
                {(error as any).message}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
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
              No content available
            </h3>
            <p className="text-xs sm:text-sm mt-1">
              No content found for this protocol.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Date label (client-only, to avoid SSR mismatch)
  const dateLabel = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

  return (
    <article className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/60 overflow-hidden">
      {/* Protocol header */}
      <header className="p-4 sm:p-6 lg:p-8 border-b border-gray-100">
        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#1D4671] mb-2 sm:mb-3 leading-tight break-words">
          {title}
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

      {/* Protocol content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* PDF Viewer */}
        {isPdf && fileUrl ? (
          <div className="border rounded-lg sm:rounded-xl overflow-hidden bg-gray-50">
            {/* Native PDF viewer in iframe */}
            <iframe
              src={`${fileUrl}#toolbar=1&navpanes=1&zoom=page-width`}
              className="w-full h-[60vh] sm:h-[70vh] lg:h-[78vh]"
              title={title}
            />

            {/* Fallbacks for browsers that disallow iframe PDF */}
            <object
              data={fileUrl}
              type="application/pdf"
              className="hidden w-full h-[60vh] sm:h-[70vh] lg:h-[78vh]"
            >
              <embed src={fileUrl} type="application/pdf" />
            </object>

            {/* Action buttons */}
            <div className="p-3 sm:p-4 bg-white border-t flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#1D4671] text-white hover:opacity-90 text-center transition-opacity"
              >
                Open in new tab
              </a>
              <a
                href={fileUrl}
                download
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-center transition-colors"
              >
                Download PDF
              </a>
            </div>
          </div>
        ) : fileUrl ? (
          // Non-PDF file (e.g. image)
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fileUrl}
              alt={title}
              className="w-full rounded-lg sm:rounded-xl border max-w-full h-auto"
            />
          </div>
        ) : html ? (
          // HTML content with responsive typography
          <div
            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
              prose-headings:text-[#1D4671] prose-headings:font-semibold prose-headings:leading-tight prose-headings:break-words
              prose-h1:text-xl prose-h1:sm:text-2xl prose-h1:lg:text-3xl prose-h1:mb-4 prose-h1:sm:mb-5 prose-h1:lg:mb-6
              prose-h2:text-lg prose-h2:sm:text-xl prose-h2:lg:text-2xl prose-h2:mb-3 prose-h2:sm:mb-4 prose-h2:lg:mb-5
              prose-h3:text-base prose-h3:sm:text-lg prose-h3:lg:text-xl prose-h3:mb-2 prose-h3:sm:mb-3 prose-h3:lg:mb-4
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:break-words prose-p:mb-3 prose-p:sm:mb-4
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:break-all
              prose-strong:text-[#1D4671] prose-strong:font-semibold
              prose-ul:my-3 prose-ul:sm:my-4 prose-li:my-1 prose-li:sm:my-1.5
              prose-ol:my-3 prose-ol:sm:my-4
              prose-blockquote:border-l-[#1D4671] prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-r-lg prose-blockquote:my-4 prose-blockquote:sm:my-5
              prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:break-all
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-3 prose-pre:sm:p-4 prose-pre:overflow-x-auto prose-pre:text-xs prose-pre:sm:text-sm
              prose-table:text-sm prose-table:sm:text-base
              prose-img:rounded-lg prose-img:shadow-sm prose-img:max-w-full prose-img:h-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <p className="text-gray-600 text-sm sm:text-base text-center">
              No file or HTML content provided.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
