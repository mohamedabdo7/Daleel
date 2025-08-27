// components/flashcards/FlashcardItemCard.tsx
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FlashcardItem } from "@/lib/api/flashcards.service";
import { PictureInPicture2 } from "lucide-react";

export default function FlashcardItemCard({ item }: { item: FlashcardItem }) {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <CardTitle className="line-clamp-1">{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden">
          {item.file ? (
            // External image host, allow unoptimized if domain isn't configured
            <Image
              src={item.file}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover"
              unoptimized
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <PictureInPicture2 className="w-8 h-8" />
            </div>
          )}
        </div>
        <p
          className="text-sm text-muted-foreground line-clamp-3"
          title={item.desc.replace(/<[^>]*>/g, " ")}
        >
          {item.desc.replace(/<[^>]*>/g, " ").trim()}
        </p>
      </CardContent>
    </Card>
  );
}
