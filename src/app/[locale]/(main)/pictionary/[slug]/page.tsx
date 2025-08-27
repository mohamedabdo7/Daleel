// app/pictionary/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { fetchPhotoBySlug } from "@/lib/api/pictionary.service";
import { Button } from "@/components/ui/button";
import EmptyState from "../components/EmptyState";

export const revalidate = 0;

export default async function PictionaryDetail(props: {
  params: { slug: string };
}) {
  const slug = props.params.slug;

  let data: Awaited<ReturnType<typeof fetchPhotoBySlug>>["data"] | null = null;
  try {
    const res = await fetchPhotoBySlug(slug);
    data = res.data;
  } catch (e) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="Couldn't load photo"
          description="Please try again."
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="Photo not found"
          description="It may have been removed."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{data.title}</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/pictionary">Back</Link>
          </Button>
          <Button asChild>
            <a
              href={data.file}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              Download
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative w-full aspect-[4/3] bg-muted rounded-xl overflow-hidden">
            <Image
              src={data.file}
              alt={data.title}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized
            />
          </div>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {/* Render description HTML from API */}
          <div dangerouslySetInnerHTML={{ __html: data.desc || "" }} />
          <div className="mt-4 text-sm text-muted-foreground">
            <div>Views: {data.views_count}</div>
            <div>Created: {new Date(data.created_at).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = { title: "Pictionary | Photo" };
