"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation"; // to detect current lang from the URL
import { ROUTES } from "@/app/constants/routes";

type Lecture = {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  desc: string;
  file: string; // Vimeo ID, YouTube URL, or something else
  views_count: number;
  created_at: string;
  thumbnail?: string;
  image?: string;
  [k: string]: unknown;
};

function getYouTubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch {}
  return null;
}

function looksLikeVimeoId(s: string) {
  return /^[0-9]{6,12}$/.test(s);
}

const thumbCache = new Map<string, string>();

export default function LectureCard({ lecture }: { lecture: Lecture }) {
  const [thumb, setThumb] = useState<string | null>(null);

  // detect lang from dynamic route (e.g. /en/... or /ar/...)
  const params = useParams();
  const lang = (params?.lang as string) ?? "en"; // fallback if no lang provided

  // 1) explicit thumbnail/image if provided by API
  const explicitThumb = useMemo(() => {
    if (lecture.thumbnail) return lecture.thumbnail;
    if (lecture.image) return lecture.image;
    return null;
  }, [lecture.thumbnail, lecture.image]);

  // 2) derive provider + thumbnail
  useEffect(() => {
    if (explicitThumb) {
      setThumb(explicitThumb);
      return;
    }

    // YouTube thumbnail if it's a YT URL
    const ytId = getYouTubeId(lecture.file || "");
    if (ytId) {
      setThumb(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
      return;
    }

    // Vimeo: fetch oEmbed to get thumbnail_url
    if (looksLikeVimeoId(lecture.file)) {
      const key = `vimeo:${lecture.file}`;
      if (thumbCache.has(key)) {
        setThumb(thumbCache.get(key)!);
        return;
      }
      const url = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(
        `https://vimeo.com/${lecture.file}`
      )}`;

      let aborted = false;
      fetch(url)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (aborted || !data?.thumbnail_url) return;
          thumbCache.set(key, data.thumbnail_url);
          setThumb(data.thumbnail_url);
        })
        .catch(() => {});
      return () => {
        aborted = true;
      };
    }

    // Fallback: no thumb available
    setThumb(null);
  }, [explicitThumb, lecture.file]);

  // use central ROUTES + lang prefix (encode slug because it may contain &)
  const href = `/${lang}${ROUTES.LECTURES}/${encodeURIComponent(
    lecture.slug ?? lecture.id
  )}`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={lecture.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <svg
              className="h-12 w-12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5l-6-3.273v9.546l6-3.273z"
              />
              <rect
                x="3"
                y="4"
                width="18"
                height="16"
                rx="3"
                ry="3"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}

        {/* overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        {/* play badge */}
        <div className="absolute left-3 bottom-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur transition group-hover:bg-white">
            <svg
              className="h-6 w-6 text-primary-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* text */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="line-clamp-1 text-base font-semibold drop-shadow-sm">
            {lecture.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm opacity-90">{lecture.desc}</p>
        </div>
      </div>

      {/* meta */}
      <div className="flex items-center justify-between px-4 py-3 text-xs text-gray-600">
        <span>Views: {lecture.views_count ?? 0}</span>
        <span>{new Date(lecture.created_at).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
