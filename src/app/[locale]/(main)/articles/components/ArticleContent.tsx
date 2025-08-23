"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getArticleBySlug } from "@/lib/api/articles.service";
import { qk } from "@/lib/queryKeys";

export default function ArticleContent({
  articleSlug,
}: {
  articleSlug?: string;
}) {
  const enabled = Boolean(articleSlug);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: enabled ? qk.article(articleSlug as string) : ["article", "idle"],
    queryFn: ({ signal }) => getArticleBySlug(articleSlug as string, signal),
    enabled,
    staleTime: 10_000,
  });

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
        Failed to load article. {(error as any)?.message || ""}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl">
        No content found for this article.
      </div>
    );
  }

  const html = (data as any).content || (data as any).body || "";
  const title = (data as any).title || articleSlug;

  return (
    <article className="bg-white rounded-3xl shadow-xl border border-gray-200/60 p-6 lg:p-10">
      <header className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
          {title}
        </h1>
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 rounded-full w-24" />
      </header>

      {html ? (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="text-gray-600">This article has no body content.</p>
      )}
    </article>
  );
}
