// components/flashcards/CategoryCard.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { FlashcardCategory } from "@/lib/api/flashcards.service";
import { ROUTES } from "@/app/constants/routes";

function stripHtml(html?: string | null) {
  if (!html) return "";
  // Very light strip to avoid rendering raw HTML in cards
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

function joinPath(...parts: Array<string | undefined | null>) {
  const cleaned = parts
    .filter(Boolean)
    .map((p) => (p as string).replace(/^\/+|\/+$/g, ""))
    .filter(Boolean);
  return "/" + cleaned.join("/");
}

export default function CategoryCard({
  category,
}: {
  category: FlashcardCategory;
}) {
  const pathname = usePathname();

  // Infer current locale from first segment (e.g., "/en/...", "/ar/...", "/ar-SA/...")
  const firstSeg = pathname?.split("/").filter(Boolean)[0];
  const locale = firstSeg && firstSeg.length <= 5 ? firstSeg : undefined;

  // Build /{locale}/flashcards/{slug}
  const href = joinPath(locale, ROUTES.FLASHCARDS, category.slug);

  return (
    <Link href={href} className="block">
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="line-clamp-1">{category.title}</span>
            <ArrowRight className="w-4 h-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {stripHtml(category.desc)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

// // components/flashcards/CategoryCard.tsx
// "use client";

// import Link from "next/link";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowRight } from "lucide-react";
// import type { FlashcardCategory } from "@/lib/api/flashcards.service";

// function stripHtml(html?: string | null) {
//   if (!html) return "";
//   // Very light strip to avoid rendering raw HTML in cards
//   if (typeof window === "undefined") {
//     return html
//       .replace(/<[^>]*>/g, " ")
//       .replace(/\s+/g, " ")
//       .trim();
//   }
//   const div = document.createElement("div");
//   div.innerHTML = html;
//   return div.textContent || div.innerText || "";
// }

// export default function CategoryCard({
//   category,
// }: {
//   category: FlashcardCategory;
// }) {
//   return (
//     <Link href={`/flashcards/${category.slug}`} className="block">
//       <Card className="h-full hover:shadow-lg transition-shadow">
//         <CardHeader>
//           <CardTitle className="flex items-center justify-between">
//             <span className="line-clamp-1">{category.title}</span>
//             <ArrowRight className="w-4 h-4" />
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-sm text-muted-foreground line-clamp-3">
//             {stripHtml(category.desc)}
//           </p>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// }
