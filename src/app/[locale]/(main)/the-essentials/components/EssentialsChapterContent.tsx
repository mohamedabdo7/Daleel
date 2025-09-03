"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { esGetLessons, esGetLessonDetail } from "@/lib/api/essentials.service";
import { qk } from "@/lib/queryKeys";
import { Loader2, FileText, Calendar, Eye, Heart } from "lucide-react";

interface EssentialsChapterContentProps {
  sectionSlug: string;
  chapterSlug: string;
}

// Separate component for each lesson to avoid Rules of Hooks violation
function EssentialsLessonItem({
  sectionSlug,
  chapterSlug,
  lessonSlug,
  index,
  basicLessonData,
}: {
  sectionSlug: string;
  chapterSlug: string;
  lessonSlug: string;
  index: number;
  basicLessonData?: any;
}) {
  const {
    data: lessonDetail,
    isLoading,
    isError,
  } = useQuery({
    queryKey: qk.essentials.lesson(sectionSlug, chapterSlug, lessonSlug),
    queryFn: ({ signal }) =>
      esGetLessonDetail(sectionSlug, chapterSlug, lessonSlug, signal),
    enabled: Boolean(lessonSlug),
    staleTime: 60_000,
  });

  const isPlaceholderFile = (u?: string) =>
    !!u &&
    (/\/images\/placeholders\/img\.jpg$/i.test(u) ||
      /\/placeholders?\//i.test(u));

  if (isLoading) {
    return (
      <div className="border border-gray-200 rounded-xl p-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-4 w-4/6 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border border-red-200 rounded-xl p-6 bg-red-50">
        <div className="text-red-700">
          <h3 className="font-semibold mb-1">Failed to load lesson</h3>
          <p className="text-sm">
            {basicLessonData?.title || `Lesson ${index + 1}`} could not be
            loaded.
          </p>
        </div>
      </div>
    );
  }

  if (!lessonDetail) {
    return (
      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <div className="text-gray-600 text-center py-4">
          <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No content available for this lesson.</p>
        </div>
      </div>
    );
  }

  const lesson = (lessonDetail as any)?.data || lessonDetail;
  const title =
    lesson?.title || basicLessonData?.title || `Lesson ${index + 1}`;
  const createdAt = lesson?.created_at || lesson?.createdAt;
  const html = lesson?.content || lesson?.body || lesson?.desc || "";
  const fileUrl: string | undefined = lesson?.file;
  const views = lesson?.views_count;
  const likes = lesson?.likes_count;

  const dateLabel = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Lesson Header */}
      <div className="bg-gradient-to-r from-[#1D4671]/5 to-[#03847D]/5 p-6 border-b border-gray-100">
        <h2 className="text-xl lg:text-2xl font-bold text-[#1D4671] mb-2">
          {title}
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {dateLabel && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {dateLabel}
            </span>
          )}
          {typeof views === "number" && (
            <span className="inline-flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {views} views
            </span>
          )}
          {typeof likes === "number" && (
            <span className="inline-flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {likes} likes
            </span>
          )}
        </div>
      </div>

      {/* Lesson Content */}
      <div className="p-6">
        {/* File viewer */}
        {fileUrl && !isPlaceholderFile(fileUrl) && (
          <>
            {(() => {
              const lower = (fileUrl || "").toLowerCase();
              if (lower.endsWith(".pdf") || lower.includes("application/pdf")) {
                return (
                  <div className="mb-6 border rounded-xl overflow-hidden bg-gray-50">
                    <iframe
                      src={`${fileUrl}#toolbar=1&navpanes=1&zoom=page-width`}
                      className="w-full h-[60vh]"
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
              // Image files
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
              // Other files
              return (
                <div className="mb-6">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Open attached file
                  </a>
                </div>
              );
            })()}
          </>
        )}

        {/* HTML Content */}
        {html && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}

export default function EssentialsChapterContent({
  sectionSlug,
  chapterSlug,
}: EssentialsChapterContentProps) {
  // Get all lessons in the chapter
  const {
    data: lessons,
    isLoading: lessonsLoading,
    isError: lessonsError,
  } = useQuery({
    queryKey: qk.essentials.lessons(sectionSlug, chapterSlug),
    queryFn: ({ signal }) => esGetLessons(sectionSlug, chapterSlug, signal),
    staleTime: 120_000,
  });

  if (lessonsLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200/60 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-xl p-6 space-y-3">
                <div className="h-6 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (lessonsError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl p-8">
        <div className="text-center">
          <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to Load Chapter</h2>
          <p>Unable to load lessons for this chapter. Please try again.</p>
        </div>
      </div>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200/60 p-8">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Lessons Found
          </h2>
          <p className="text-gray-600">
            This chapter doesn't contain any lessons yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-white rounded-3xl shadow-xl border border-gray-200/60">
      {/* Chapter Header */}
      <header className="p-6 lg:p-8 border-b border-gray-100 bg-gradient-to-r from-[#1D4671]/5 to-[#03847D]/5">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-6 w-6 text-[#1D4671]" />
          <h1 className="text-2xl lg:text-3xl font-bold text-[#1D4671] leading-tight">
            Chapter:{" "}
            {chapterSlug
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </h1>
        </div>
        <p className="text-gray-600">
          All lessons in this chapter ({lessons?.length || 0}{" "}
          {lessons?.length === 1 ? "lesson" : "lessons"})
        </p>
      </header>

      {/* Chapter Content */}
      <div className="p-6 lg:p-8">
        <div className="space-y-6">
          {lessons?.map((lesson: any, index: number) => (
            <EssentialsLessonItem
              key={lesson.slug || index}
              sectionSlug={sectionSlug}
              chapterSlug={chapterSlug}
              lessonSlug={lesson.slug}
              index={index}
              basicLessonData={lesson}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
