// app/lectures/[slug]/lecture-client.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { useMemo } from "react";
import { useParams } from "next/navigation"; // <-- add
import { getLectureBySlug, Lecture } from "@/lib/api/lectures.service";

function getYouTubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch {}
  return null;
}

function isVimeoId(s: string) {
  return /^[0-9]{6,12}$/.test(s);
}

function buildEmbed(lecture: Lecture) {
  const file = lecture.file?.trim() || "";
  const yt = getYouTubeId(file);
  if (yt)
    return {
      provider: "youtube" as const,
      src: `https://www.youtube-nocookie.com/embed/${yt}?rel=0&modestbranding=1`,
    };
  if (isVimeoId(file))
    return {
      provider: "vimeo" as const,
      src: `https://player.vimeo.com/video/${file}?title=0&byline=0&portrait=0`,
    };
  return { provider: "unknown" as const, src: "" };
}

export default function LectureClient({ slug }: { slug?: string }) {
  // Fallback: read slug from the dynamic route if prop is missing
  const params = useParams();
  const rawSlug = (slug ?? (params?.slug as string) ?? "").toString();
  const decodedSlug = decodeURIComponent(rawSlug); // important for slugs containing & or spaces

  const { data, isLoading, isError, error } = useQuery({
    queryKey: qk.lectures.itemBySlug(decodedSlug),
    queryFn: () => getLectureBySlug(decodedSlug),
    enabled: !!decodedSlug, // don't fetch until we actually have a slug
  });

  const embed = useMemo(() => (data ? buildEmbed(data) : null), [data]);

  if (!decodedSlug) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 text-xl font-semibold">Invalid URL</h1>
        <p className="text-gray-600">Missing lecture slug.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-4 h-6 w-64 animate-pulse rounded bg-gray-200" />
        <div className="aspect-video w-full animate-pulse rounded-xl bg-gray-200" />
        <div className="mt-6 grid gap-3">
          <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-3/5 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 text-xl font-semibold">Lecture not found</h1>
        <p className="text-gray-600">
          {isError ? (error as Error)?.message : "Please try again later."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
        {data.title}
      </h1>
      {data.desc && <p className="mt-1 text-gray-600">{data.desc}</p>}

      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
        {embed?.provider !== "unknown" ? (
          <div className="relative aspect-video">
            <iframe
              src={embed!.src}
              title={data.title}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-gray-100">
            <p className="text-sm text-gray-500">
              This video format isn’t supported for inline playback.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <span>Views: {data.views_count ?? 0}</span>
        <span>Published: {new Date(data.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
