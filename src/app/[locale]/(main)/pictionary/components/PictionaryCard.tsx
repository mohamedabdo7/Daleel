// app/pictionary/components/PictionaryCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";

import type { PictionaryItem } from "@/lib/api/pictionary.service";

// Simple safe-ish HTML strip for card preview text
function stripHtml(html?: string | null) {
  if (!html) return "";
  if (typeof window === "undefined") {
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// Join path parts safely
function joinPath(...parts: Array<string | undefined | null>) {
  const cleaned = parts
    .filter(Boolean)
    .map((p) => (p as string).replace(/^\/+|\/+$/g, ""))
    .filter(Boolean);
  return "/" + cleaned.join("/");
}

// Try to read the locale from params or from the first path segment
function useDetectedLocale(explicit?: string) {
  const params = useParams();
  const pathname = usePathname();

  if (explicit) return explicit;

  // If your root layout is app/[lang]/..., Next's useParams will expose { lang: 'en' | 'ar' | ... }
  const fromParams = params?.lang;
  const langFromParams = Array.isArray(fromParams)
    ? fromParams[0]
    : (fromParams as string | undefined);

  if (langFromParams) return langFromParams;

  // Fallback: parse first segment from the current path
  // Example: /en/pictionary/slug -> "en"
  if (pathname) {
    const seg = pathname.split("/").filter(Boolean)[0];
    if (seg && seg.length <= 5) return seg; // tolerate "en", "ar", "en-US", etc.
  }

  return "en"; // sensible default
}

export default function PictionaryCard({
  item,
  locale,
}: {
  item: PictionaryItem;
  locale?: string;
}) {
  const detectedLocale = useDetectedLocale(locale);
  const href = joinPath(detectedLocale, "pictionary", item.slug);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <CardTitle className="line-clamp-1">{item.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="relative w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden">
          {item.file ? (
            <Image
              src={item.file}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              unoptimized
            />
          ) : null}
        </div>
        <p
          className="text-sm text-muted-foreground line-clamp-3"
          title={stripHtml(item.desc)}
        >
          {stripHtml(item.desc)}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild size="sm" className="flex-1">
          <Link href={href}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </Link>
        </Button>

        <Button asChild size="sm" variant="outline" className="flex-1">
          <a
            href={item.file}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
